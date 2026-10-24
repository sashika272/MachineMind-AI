import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, List, Tuple
from sklearn.ensemble import IsolationForest, RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, f1_score
from app.core.config import settings

FEATURE_NAMES = ["temperature", "vibration", "pressure", "rpm", "power_kw", "acoustic_db"]

FAULT_LABELS = {
    0: "Normal Operation",
    1: "Drive-End Bearing Race Spalling",
    2: "Dynamic Shaft Misalignment & Unbalance",
    3: "Thermal Dissipation Failure / Cooling Loss",
    4: "Hydraulic Cavitation & Pressure Surge"
}

class IndustrialMLEngine:
    def __init__(self):
        self.model_dir = settings.MODEL_DIR
        os.makedirs(self.model_dir, exist_ok=True)
        
        self.scaler_path = os.path.join(self.model_dir, "scaler.joblib")
        self.iso_forest_path = os.path.join(self.model_dir, "isolation_forest.joblib")
        self.classifier_path = os.path.join(self.model_dir, "fault_classifier.joblib")
        self.metrics_path = os.path.join(self.model_dir, "metrics.joblib")
        
        self.scaler: Optional[StandardScaler] = None
        self.iso_forest: Optional[IsolationForest] = None
        self.classifier: Optional[RandomForestClassifier] = None
        self.metrics: Dict[str, Any] = {}
        
        self.load_or_train_models()

    def generate_synthetic_industrial_data(self, n_samples_per_class: int = 500) -> Tuple[np.ndarray, np.ndarray]:
        """Generates a reproducible, physics-consistent synthetic industrial sensor dataset."""
        rng = np.random.RandomState(42)
        X_list, y_list = [], []

        # Class 0: Normal Operation
        temp_0 = rng.normal(62.0, 3.5, n_samples_per_class)
        vib_0 = rng.normal(1.8, 0.4, n_samples_per_class)
        press_0 = rng.normal(18.2, 0.6, n_samples_per_class)
        rpm_0 = rng.normal(2980.0, 10.0, n_samples_per_class)
        pow_0 = rng.normal(415.0, 6.0, n_samples_per_class)
        db_0 = rng.normal(78.0, 2.0, n_samples_per_class)
        X_0 = np.column_stack([temp_0, vib_0, press_0, rpm_0, pow_0, db_0])
        X_list.append(X_0)
        y_list.append(np.zeros(n_samples_per_class, dtype=int))

        # Class 1: Bearing Race Spalling (High vibration, elevated temp, high acoustic emission)
        temp_1 = rng.normal(88.0, 5.0, n_samples_per_class)
        vib_1 = rng.normal(8.2, 1.2, n_samples_per_class)
        press_1 = rng.normal(18.3, 0.7, n_samples_per_class)
        rpm_1 = rng.normal(2970.0, 15.0, n_samples_per_class)
        pow_1 = rng.normal(425.0, 8.0, n_samples_per_class)
        db_1 = rng.normal(92.5, 3.0, n_samples_per_class)
        X_1 = np.column_stack([temp_1, vib_1, press_1, rpm_1, pow_1, db_1])
        X_list.append(X_1)
        y_list.append(np.ones(n_samples_per_class, dtype=int) * 1)

        # Class 2: Shaft Misalignment (High 1X/2X vibration, moderate temp rise, normal acoustics)
        temp_2 = rng.normal(72.0, 4.0, n_samples_per_class)
        vib_2 = rng.normal(6.5, 0.9, n_samples_per_class)
        press_2 = rng.normal(18.1, 0.5, n_samples_per_class)
        rpm_2 = rng.normal(2960.0, 12.0, n_samples_per_class)
        pow_2 = rng.normal(430.0, 7.0, n_samples_per_class)
        db_2 = rng.normal(82.0, 2.5, n_samples_per_class)
        X_2 = np.column_stack([temp_2, vib_2, press_2, rpm_2, pow_2, db_2])
        X_list.append(X_2)
        y_list.append(np.ones(n_samples_per_class, dtype=int) * 2)

        # Class 3: Thermal Runaway / Cooling Loss (Extreme temperature, modest vibration rise, higher slip RPM drop)
        temp_3 = rng.normal(104.0, 6.0, n_samples_per_class)
        vib_3 = rng.normal(3.2, 0.6, n_samples_per_class)
        press_3 = rng.normal(18.4, 0.8, n_samples_per_class)
        rpm_3 = rng.normal(2930.0, 18.0, n_samples_per_class)
        pow_3 = rng.normal(445.0, 10.0, n_samples_per_class)
        db_3 = rng.normal(84.0, 2.5, n_samples_per_class)
        X_3 = np.column_stack([temp_3, vib_3, press_3, rpm_3, pow_3, db_3])
        X_list.append(X_3)
        y_list.append(np.ones(n_samples_per_class, dtype=int) * 3)

        # Class 4: Hydraulic Pressure Surge (High pressure fluctuations, elevated power, normal temp)
        temp_4 = rng.normal(66.0, 3.5, n_samples_per_class)
        vib_4 = rng.normal(4.1, 0.8, n_samples_per_class)
        press_4 = rng.normal(38.0, 5.0, n_samples_per_class)
        rpm_4 = rng.normal(2975.0, 14.0, n_samples_per_class)
        pow_4 = rng.normal(460.0, 12.0, n_samples_per_class)
        db_4 = rng.normal(86.0, 3.0, n_samples_per_class)
        X_4 = np.column_stack([temp_4, vib_4, press_4, rpm_4, pow_4, db_4])
        X_list.append(X_4)
        y_list.append(np.ones(n_samples_per_class, dtype=int) * 4)

        X = np.vstack(X_list)
        y = np.concatenate(y_list)
        return X, y

    def load_or_train_models(self):
        """Loads cached models or trains and persists new models."""
        if (os.path.exists(self.scaler_path) and 
            os.path.exists(self.iso_forest_path) and 
            os.path.exists(self.classifier_path) and 
            os.path.exists(self.metrics_path)):
            try:
                self.scaler = joblib.load(self.scaler_path)
                self.iso_forest = joblib.load(self.iso_forest_path)
                self.classifier = joblib.load(self.classifier_path)
                self.metrics = joblib.load(self.metrics_path)
                return
            except Exception:
                pass # Re-train if load fails
        
        self.train_and_save_models()

    def train_and_save_models(self):
        """Executes actual training, validation, and serialization."""
        X, y = self.generate_synthetic_industrial_data(n_samples_per_class=600)
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42, stratify=y)
        
        # Fit Scaler
        self.scaler = StandardScaler()
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)

        # Train Isolation Forest on normal data
        normal_mask = (y_train == 0)
        self.iso_forest = IsolationForest(n_estimators=100, contamination=0.08, random_state=42)
        self.iso_forest.fit(X_train_scaled[normal_mask])

        # Train Multi-Class Random Forest Classifier
        self.classifier = RandomForestClassifier(n_estimators=120, max_depth=10, random_state=42)
        self.classifier.fit(X_train_scaled, y_train)

        # Evaluate on Test Set
        y_pred = self.classifier.predict(X_test_scaled)
        acc = float(accuracy_score(y_test, y_pred))
        f1 = float(f1_score(y_test, y_pred, average="weighted"))
        
        self.metrics = {
            "accuracy": round(acc, 4),
            "f1_score": round(f1, 4),
            "feature_importance": dict(zip(FEATURE_NAMES, [round(float(v), 4) for v in self.classifier.feature_importances_])),
            "n_training_samples": len(X_train),
            "n_test_samples": len(X_test),
            "trained_at": pd.Timestamp.now().isoformat(),
            "limitations": [
                "Trained on physics-grounded synthetic industrial induction motor dataset (450kW frame IEC 400L).",
                "Assumes continuous steady-state duty cycle. Transient startup conditions may produce false anomalies.",
                "Calibrated for ISO 10816-3 Class II/III machinery."
            ]
        }

        # Persist to disk
        joblib.dump(self.scaler, self.scaler_path)
        joblib.dump(self.iso_forest, self.iso_forest_path)
        joblib.dump(self.classifier, self.classifier_path)
        joblib.dump(self.metrics, self.metrics_path)

    def predict(self, telemetry: Dict[str, Any]) -> Dict[str, Any]:
        """Runs executable inference on incoming telemetry point."""
        if not self.scaler or not self.iso_forest or not self.classifier:
            self.load_or_train_models()

        # Vector construction
        raw_vector = np.array([[
            telemetry.get("temperature", 65.0),
            telemetry.get("vibration", 1.8),
            telemetry.get("pressure", 18.0),
            telemetry.get("rpm", 2980.0),
            telemetry.get("powerKw", telemetry.get("power_kw", 415.0)),
            telemetry.get("acousticDb", telemetry.get("acoustic_db", 78.0))
        ]])

        scaled_vector = self.scaler.transform(raw_vector)

        # 1. Unsupervised Anomaly Detection (Isolation Forest)
        # raw decision_function: negative is anomalous
        iso_score_raw = self.iso_forest.decision_function(scaled_vector)[0]
        is_anomaly = bool(self.iso_forest.predict(scaled_vector)[0] == -1)
        normalized_anomaly_score = round(float(np.clip((0.5 - iso_score_raw) * 100, 0, 100)), 1)

        # 2. Supervised Multi-Class Fault Classification
        probs = self.classifier.predict_proba(scaled_vector)[0]
        predicted_class = int(np.argmax(probs))
        confidence = round(float(probs[predicted_class] * 100), 1)

        # 3. Sensor Deviation & Attribution Analysis
        baseline_means = self.scaler.mean_
        baseline_stds = self.scaler.scale_
        z_scores = (raw_vector[0] - baseline_means) / baseline_stds

        affected_sensors = []
        for name, z_val in zip(FEATURE_NAMES, z_scores):
            if abs(z_val) > 2.0:
                affected_sensors.append({
                    "sensor": name,
                    "zScore": round(float(z_val), 2),
                    "severity": "critical" if abs(z_val) > 3.5 else "warning",
                    "impact": f"{abs(z_val):.1f} std deviations from healthy baseline"
                })

        severity = "normal"
        if is_anomaly or predicted_class != 0:
            if max(abs(z) for z in z_scores) > 3.5:
                severity = "critical"
            elif max(abs(z) for z in z_scores) > 2.0:
                severity = "high"
            else:
                severity = "medium"

        return {
            "isAnomaly": is_anomaly or (predicted_class != 0),
            "anomalyScore": normalized_anomaly_score,
            "faultCategory": FAULT_LABELS.get(predicted_class, "Unknown"),
            "faultClassId": predicted_class,
            "confidence": confidence,
            "severity": severity,
            "classProbabilities": {FAULT_LABELS[i]: round(float(p * 100), 1) for i, p in enumerate(probs)},
            "affectedSensors": affected_sensors,
            "modelMetadata": {
                "accuracy": self.metrics.get("accuracy"),
                "f1Score": self.metrics.get("f1_score"),
                "limitations": self.metrics.get("limitations")
            }
        }

ml_engine = IndustrialMLEngine()

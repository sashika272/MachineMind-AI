from app.core.database import SessionLocal
from app.models.user import User
from app.models.machine import Machine
from app.models.maintenance import MaintenanceRecord
from app.models.simulation import SimulationSession, SimulationResult
from app.models.audit import AuditLog

db = SessionLocal()
print("=" * 60)
print("DATABASE PERSISTENCE VERIFICATION")
print("=" * 60)
print(f"Users in Database:             {db.query(User).count()}")
print(f"Machines in Fleet:             {db.query(Machine).count()}")
print(f"Maintenance Records Persisted: {db.query(MaintenanceRecord).count()}")
print(f"Simulation Sessions Persisted: {db.query(SimulationSession).count()}")
print(f"Simulation Results Persisted:  {db.query(SimulationResult).count()}")
print(f"Audit Logs Persisted:          {db.query(AuditLog).count()}")

latest_work_order = db.query(MaintenanceRecord).order_by(MaintenanceRecord.created_at.desc()).first()
if latest_work_order:
    print(f"\nLatest Committed Work Order:   {latest_work_order.id}")
    print(f"  Title:      {latest_work_order.title}")
    print(f"  Technician: {latest_work_order.technician}")
    print(f"  Cost:       ${latest_work_order.cost_usd}")
    print(f"  Duration:   {latest_work_order.duration_hours}h")

db.close()
print("=" * 60)

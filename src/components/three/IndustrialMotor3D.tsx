import React, { useState, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import { MotorModel } from './MotorModel';
import { useMachine } from '../../context/MachineContext';
import { useNavigation } from '../../context/NavigationContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Layers, 
  Flame, 
  Grid, 
  MapPin, 
  RotateCcw, 
  Maximize2, 
  Info, 
  AlertCircle, 
  CheckCircle2, 
  Wrench, 
  ArrowRight,
  Eye,
  Sliders
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const IndustrialMotor3D: React.FC<{ 
  compact?: boolean;
  hideInspectorOverlay?: boolean;
}> = ({ compact = false, hideInspectorOverlay = false }) => {
  const { selectedMachine, selectedComponent, setSelectedComponent, liveTelemetry } = useMachine();
  const { navigate } = useNavigation();
  const { isDark } = useTheme();

  // 3D Canvas View Controls
  const [exploded, setExploded] = useState<boolean>(false);
  const [thermalMode, setThermalMode] = useState<boolean>(false);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);

  // OrbitControls reference to programmatically change camera view
  const controlsRef = useRef<any>(null);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const setCameraPreset = (x: number, y: number, z: number) => {
    if (controlsRef.current) {
      controlsRef.current.object.position.set(x, y, z);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border ${
      isDark
        ? 'border-graphite-800 bg-gradient-to-b from-[#111827] via-[#0c121d] to-[#070b12]'
        : 'border-slate-300 bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]'
    } flex flex-col ${
      compact ? 'h-[440px]' : 'h-[620px] lg:h-[720px]'
    }`}>
      {/* 3D Canvas Top Control Overlay */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Model Spec Badge */}
        <div className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl backdrop-blur-md border shadow-xl pointer-events-auto ${
          isDark
            ? 'bg-graphite-900/90 border-graphite-700/80'
            : 'bg-white/95 border-slate-300 shadow-md'
        }`}>
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-electric animate-pulse" />
          <div className="text-xs font-mono">
            <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedMachine.code}</span>
            <span className={`ml-2 hidden sm:inline ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>{selectedMachine.modelSpecs.frameSize} · {selectedMachine.modelSpecs.ratedKw}kW</span>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded font-mono border ${
            isDark
              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
              : 'bg-cyan-50 text-cyan-800 border-cyan-300 font-semibold'
          }`}>
            {liveTelemetry.rpm} RPM
          </span>
        </div>

        {/* View Mode Buttons */}
        <div className={`flex items-center gap-1.5 p-1 rounded-xl backdrop-blur-md border shadow-xl pointer-events-auto ${
          isDark
            ? 'bg-graphite-900/90 border-graphite-700/80'
            : 'bg-white/95 border-slate-300 shadow-md'
        }`}>
          <button
            onClick={() => setExploded(!exploded)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
              exploded
                ? isDark
                  ? 'bg-cyan-500/20 text-cyan-electric border border-cyan-500/40 font-bold'
                  : 'bg-cyan-100 text-cyan-800 border border-cyan-400 font-bold shadow-sm'
                : isDark
                ? 'text-graphite-400 hover:text-white hover:bg-graphite-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
            }`}
            title="Toggle exploded assembly view"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Exploded</span>
          </button>

          <button
            onClick={() => setThermalMode(!thermalMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
              thermalMode
                ? isDark
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-crimson-glow font-bold'
                  : 'bg-rose-100 text-rose-800 border border-rose-400 font-bold shadow-sm'
                : isDark
                ? 'text-graphite-400 hover:text-white hover:bg-graphite-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
            }`}
            title="Toggle thermal heatmap simulation"
          >
            <Flame className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Heatmap</span>
          </button>

          <button
            onClick={() => setWireframe(!wireframe)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
              wireframe
                ? isDark
                  ? 'bg-cyan-500/20 text-cyan-electric border border-cyan-500/40 font-bold'
                  : 'bg-cyan-100 text-cyan-800 border border-cyan-400 font-bold shadow-sm'
                : isDark
                ? 'text-graphite-400 hover:text-white hover:bg-graphite-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
            }`}
            title="Toggle wireframe topology"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Wireframe</span>
          </button>

          <button
            onClick={() => setShowHotspots(!showHotspots)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
              showHotspots
                ? isDark
                  ? 'bg-cyan-500/20 text-cyan-electric border border-cyan-500/40 font-bold'
                  : 'bg-cyan-100 text-cyan-800 border border-cyan-400 font-bold shadow-sm'
                : isDark
                ? 'text-graphite-400 hover:text-white hover:bg-graphite-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
            }`}
            title="Toggle 3D label pins"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Pins</span>
          </button>

          <button
            onClick={resetCamera}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark
                ? 'text-graphite-400 hover:text-white hover:bg-graphite-800'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Reset Camera Orientation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <div className="flex-1 w-full h-full cursor-grab active:cursor-grabbing">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={compact ? [4.6, 3.2, 5.4] : [5, 3.5, 6]} fov={compact ? 42 : 45} />
          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.06}
            minDistance={3}
            maxDistance={14}
            maxPolarAngle={Math.PI / 2 + 0.1}
          />

          {/* Industrial Multi-Point Lighting Rig */}
          <ambientLight intensity={isDark ? 0.95 : 1.0} />
          
          {/* Main Key Light */}
          <directionalLight
            position={[8, 14, 10]}
            intensity={isDark ? 1.6 : 1.3}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          
          {/* Secondary Fill Light */}
          <directionalLight 
            position={[-8, 6, -6]} 
            intensity={isDark ? 0.9 : 0.7} 
            color={isDark ? "#38bdf8" : "#94a3b8"} 
          />
          
          {/* Rim / Silhouette Backlights (Crucial for Dark Mode Edge Specularity) */}
          <directionalLight
            position={[-6, -4, 8]}
            intensity={isDark ? 1.1 : 0.4}
            color={isDark ? "#67e8f9" : "#ffffff"}
          />
          <directionalLight
            position={[0, -6, -8]}
            intensity={isDark ? 0.9 : 0.4}
            color={isDark ? "#38bdf8" : "#cbd5e1"}
          />

          {/* Top Focus Spotlight */}
          <spotLight
            position={[0, 12, 0]}
            intensity={isDark ? 1.1 : 0.8}
            angle={0.65}
            penumbra={0.8}
            color={isDark ? "#00e5ff" : "#0284c7"}
          />

          {/* Natural Environmental Fill */}
          <hemisphereLight
            args={[
              isDark ? "#38bdf8" : "#ffffff",
              isDark ? "#0f172a" : "#cbd5e1",
              isDark ? 0.8 : 0.7
            ]}
          />

          {/* Floor Contact Shadows */}
          <ContactShadows
            position={[0, -1.8, 0]}
            opacity={isDark ? 0.6 : 0.35}
            scale={12}
            blur={2.2}
            far={4}
            color="#000000"
          />

          {/* Procedural Industrial Motor 3D Model */}
          <Suspense fallback={null}>
            <MotorModel
              exploded={exploded}
              thermalMode={thermalMode}
              wireframe={wireframe}
              showHotspots={showHotspots}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Camera Presets Bar */}
      <div className={`absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-1.5 p-1 rounded-xl backdrop-blur-md border text-xs font-mono shadow-lg ${
        isDark
          ? 'bg-graphite-900/90 border-graphite-700/80 text-graphite-400'
          : 'bg-white/95 border-slate-300 text-slate-700'
      }`}>
        <span className={`px-2 text-[10px] uppercase font-bold ${isDark ? 'text-graphite-500' : 'text-slate-400'}`}>View:</span>
        <button
          onClick={() => setCameraPreset(5, 3.5, 6)}
          className={`px-2.5 py-1 rounded-md transition-colors ${
            isDark ? 'hover:bg-graphite-800 hover:text-white' : 'hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          Isometric
        </button>
        <button
          onClick={() => setCameraPreset(6, 0.5, 0)}
          className={`px-2.5 py-1 rounded-md transition-colors font-bold ${
            isDark ? 'hover:bg-graphite-800 text-rose-400 hover:text-rose-300' : 'hover:bg-rose-50 text-rose-700 hover:text-rose-800'
          }`}
        >
          DE Bearing
        </button>
        <button
          onClick={() => setCameraPreset(0, 1, 7)}
          className={`px-2.5 py-1 rounded-md transition-colors ${
            isDark ? 'hover:bg-graphite-800 hover:text-white' : 'hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          Stator
        </button>
        <button
          onClick={() => setCameraPreset(-6, 0.5, 0)}
          className={`px-2.5 py-1 rounded-md transition-colors font-bold ${
            isDark ? 'hover:bg-graphite-800 text-cyan-400 hover:text-cyan-300' : 'hover:bg-cyan-50 text-cyan-700 hover:text-cyan-800'
          }`}
        >
          Fan Cowl
        </button>
        <button
          onClick={() => setCameraPreset(0, 8, 0.5)}
          className={`px-2.5 py-1 rounded-md transition-colors ${
            isDark ? 'hover:bg-graphite-800 hover:text-white' : 'hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          Top Box
        </button>
      </div>

      {/* Selected Component Inspection Flyout (Bottom Right) */}
      {!hideInspectorOverlay && selectedComponent && (
        <div className={`absolute bottom-4 right-4 z-10 w-full backdrop-blur-xl border rounded-2xl shadow-2xl animate-in slide-in-from-bottom duration-200 ${
          compact ? 'max-w-[270px] sm:max-w-[290px] p-3' : 'max-w-sm p-4'
        } ${
          isDark
            ? 'bg-graphite-900/95 border-cyan-500/40 text-white'
            : 'bg-white/98 border-cyan-600/50 text-slate-900 shadow-2xl'
        }`}>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${
                  isDark ? 'text-cyan-400' : 'text-cyan-700'
                }`}>
                  Inspected Subsystem
                </span>
                <Badge
                  variant={
                    selectedComponent.status === 'critical'
                      ? 'rose'
                      : selectedComponent.status === 'warning'
                      ? 'amber'
                      : 'emerald'
                  }
                  size="sm"
                  pulse={selectedComponent.status === 'critical'}
                >
                  {selectedComponent.status.toUpperCase()}
                </Badge>
              </div>
              <h4 className={`text-xs sm:text-sm font-semibold mt-1 truncate ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {selectedComponent.name}
              </h4>
            </div>
            <button
              onClick={() => setSelectedComponent(null)}
              className={`p-1 text-sm leading-none shrink-0 ${
                isDark ? 'text-graphite-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'
              }`}
              title="Close inspection card"
            >
              ×
            </button>
          </div>

          <p className={`mt-1.5 text-xs leading-relaxed line-clamp-2 ${
            isDark ? 'text-graphite-300' : 'text-slate-600'
          }`}>
            {selectedComponent.description}
          </p>

          <div className={`mt-2.5 grid grid-cols-3 gap-1.5 p-2 rounded-xl text-center font-mono border ${
            isDark
              ? 'bg-graphite-950/60 border-graphite-800'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <div className={`text-[9px] uppercase ${isDark ? 'text-graphite-500' : 'text-slate-500'}`}>Health</div>
              <div className={`text-xs font-bold ${
                selectedComponent.healthScore < 50
                  ? isDark ? 'text-rose-400' : 'text-rose-700'
                  : selectedComponent.healthScore < 80
                  ? isDark ? 'text-amber-400' : 'text-amber-700'
                  : isDark ? 'text-emerald-400' : 'text-emerald-700'
              }`}>
                {selectedComponent.healthScore}%
              </div>
            </div>
            <div>
              <div className={`text-[9px] uppercase ${isDark ? 'text-graphite-500' : 'text-slate-500'}`}>Temp</div>
              <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {selectedComponent.temperature}°C
              </div>
            </div>
            <div>
              <div className={`text-[9px] uppercase ${isDark ? 'text-graphite-500' : 'text-slate-500'}`}>Vibration</div>
              <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {selectedComponent.vibration} <span className={`text-[8px] ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>mm/s</span>
              </div>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between gap-2 pt-0.5">
            <Button
              variant="outline"
              size="sm"
              className="text-[11px] py-1 px-2 flex-1 h-7"
              onClick={() => navigate('root-cause')}
            >
              Root Cause
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="text-[11px] py-1 px-2 flex-1 h-7"
              onClick={() => navigate('repair-strategies')}
            >
              Repair Plan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

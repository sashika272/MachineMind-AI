import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useMachine } from '../../context/MachineContext';
import { useTheme } from '../../context/ThemeContext';
import { MachineComponent } from '../../types';

interface MotorModelProps {
  exploded: boolean;
  thermalMode: boolean;
  wireframe: boolean;
  showHotspots: boolean;
}

export const MotorModel: React.FC<MotorModelProps> = ({
  exploded,
  thermalMode,
  wireframe,
  showHotspots
}) => {
  const { selectedMachine, selectedComponent, setSelectedComponent, liveTelemetry } = useMachine();
  const { isDark } = useTheme();

  // References for rotating elements
  const shaftRef = useRef<THREE.Group>(null);
  const fanRef = useRef<THREE.Group>(null);

  // Animation frame: rotate shaft and fan in accordance with live RPM
  useFrame((_, delta) => {
    const rotSpeed = ((liveTelemetry.rpm || 3000) / 60) * Math.PI * 2 * delta * 0.15;
    if (shaftRef.current) {
      shaftRef.current.rotation.x += rotSpeed;
    }
    if (fanRef.current) {
      fanRef.current.rotation.x += rotSpeed;
    }
  });

  // Authentic industrial metallic color palette calibrated for contrast in both modes
  const palette = useMemo(() => ({
    housing: isDark ? '#2e3d54' : '#33445c',
    housingFins: isDark ? '#253347' : '#29374c',
    statorCore: '#b45309',
    copperWindings: '#d97706',
    shaft: isDark ? '#cbd5e1' : '#94a3b8',
    rotorCore: '#475569',
    endShield: isDark ? '#2b394f' : '#2c3a50',
    bearingHub: isDark ? '#364863' : '#394c68',
    terminalBox: isDark ? '#33445e' : '#384b66',
    terminalLid: isDark ? '#435674' : '#475b7a',
    fanHub: isDark ? '#334155' : '#475569',
    fanBlades: isDark ? '#0284c7' : '#0369a1',
    fanCowl: isDark ? '#28364b' : '#2d3d54',
    mountingFeet: isDark ? '#222e40' : '#273447'
  }), [isDark]);

  // Material helpers based on component health & thermal mode
  const getComponentColor = (compType: string, baseColor: string) => {
    const comp = selectedMachine.components.find((c) => c.type === compType);
    if (!comp) return baseColor;

    if (thermalMode) {
      // Color map based on temperature
      if (comp.temperature > 85) return '#ef4444'; // Hot red
      if (comp.temperature > 70) return '#f59e0b'; // Warm amber
      if (comp.temperature > 50) return '#00e5ff'; // Mild cyan
      return '#3b82f6'; // Cool blue
    }

    if (comp.status === 'critical') return '#ef4444';
    if (comp.status === 'warning') return '#f59e0b';
    return baseColor;
  };

  const isSelected = (compType: string) => {
    return selectedComponent?.type === compType;
  };

  // Exploded view offsets
  const explodeOffset = exploded ? 1 : 0;

  // Stator Cooling Fins count
  const finCount = 16;
  const fins = useMemo(() => {
    return Array.from({ length: finCount }, (_, i) => {
      const angle = (i / finCount) * Math.PI * 2;
      return {
        angle,
        x: 0,
        y: Math.sin(angle) * 1.35,
        z: Math.cos(angle) * 1.35,
        rotX: angle
      };
    });
  }, []);

  const handleComponentClick = (e: any, compType: string) => {
    e.stopPropagation();
    const found = selectedMachine.components.find((c) => c.type === compType);
    if (found) {
      setSelectedComponent(found);
    }
  };

  return (
    <group position={[0, 0, 0]}>
      {/* ============================================================== */}
      {/* 1. CENTRAL STATOR HOUSING & COOLING FINS                      */}
      {/* ============================================================== */}
      <group 
        position={[0, 0, 0]}
        onClick={(e) => handleComponentClick(e, 'housing')}
      >
        {/* Main Cylindrical Shell */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.3, 1.3, 2.8, 32]} />
          <meshStandardMaterial
            color={isSelected('housing') ? '#00e5ff' : getComponentColor('housing', palette.housing)}
            metalness={0.65}
            roughness={0.32}
            wireframe={wireframe}
            emissive={isSelected('housing') ? '#00e5ff' : '#000000'}
            emissiveIntensity={isSelected('housing') ? 0.35 : 0}
          />
        </mesh>

        {/* Stator Cooling Fins (Radial fins along the cylinder) */}
        {fins.map((fin, i) => (
          <mesh 
            key={i} 
            position={[fin.x, fin.y, fin.z]} 
            rotation={[fin.rotX, 0, 0]} 
            castShadow
          >
            <boxGeometry args={[2.7, 0.18, 0.05]} />
            <meshStandardMaterial
              color={isSelected('housing') ? '#00e5ff' : getComponentColor('housing', palette.housingFins)}
              metalness={0.7}
              roughness={0.35}
              wireframe={wireframe}
            />
          </mesh>
        ))}

        {/* Hotspot: Housing */}
        {showHotspots && (
          <Html position={[0, 0, 1.45]} center distanceFactor={12}>
            <div 
              onClick={(e) => handleComponentClick(e, 'housing')}
              className={`px-2.5 py-1 rounded-md text-[10px] font-mono shadow-xl cursor-pointer whitespace-nowrap transition-all backdrop-blur-md border ${
                isDark
                  ? 'bg-graphite-900/95 border-cyan-500/50 text-cyan-300 hover:border-cyan-electric hover:text-white'
                  : 'bg-white/95 border-cyan-600 text-cyan-900 hover:bg-cyan-50 hover:border-cyan-700 font-semibold shadow-md'
              }`}
            >
              Housing · 68.2°C
            </div>
          </Html>
        )}
      </group>

      {/* ============================================================== */}
      {/* 2. STATOR CORE & 6.6kV WINDINGS (INTERNAL)                     */}
      {/* ============================================================== */}
      <group 
        position={[0, 0, 0]}
        onClick={(e) => handleComponentClick(e, 'stator')}
      >
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1.1, 1.1, 2.4, 24]} />
          <meshStandardMaterial
            color={isSelected('stator') ? '#00e5ff' : getComponentColor('stator', palette.statorCore)}
            metalness={0.5}
            roughness={0.5}
            wireframe={wireframe}
            transparent={exploded}
            opacity={exploded ? 0.85 : 0.4}
          />
        </mesh>
        {/* Copper Winding End-Turns */}
        <mesh position={[1.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.9, 0.12, 16, 32]} />
          <meshStandardMaterial color={palette.copperWindings} metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[-1.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.9, 0.12, 16, 32]} />
          <meshStandardMaterial color={palette.copperWindings} metalness={0.85} roughness={0.25} />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* 3. ROTATING SHAFT & ROTOR CORE                                 */}
      {/* ============================================================== */}
      <group 
        ref={shaftRef} 
        position={[0, 0, 0]}
        onClick={(e) => handleComponentClick(e, 'rotor_shaft')}
      >
        {/* Central Steel Driveshaft (Runs along X-axis) */}
        <mesh position={[0.4, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.32, 0.32, 5.2, 32]} />
          <meshStandardMaterial
            color={isSelected('rotor_shaft') ? '#00e5ff' : palette.shaft}
            metalness={0.95}
            roughness={0.12}
            wireframe={wireframe}
          />
        </mesh>

        {/* Rotor Core Lamination Stack */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.82, 0.82, 2.2, 32]} />
          <meshStandardMaterial
            color={palette.rotorCore}
            metalness={0.8}
            roughness={0.35}
            wireframe={wireframe}
          />
        </mesh>

        {/* Shaft Keyway */}
        <mesh position={[2.4, 0.33, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.8, 0.08, 0.1]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* 4. DRIVE-END (DE) BEARING & END-SHIELD (FAULT HOTSPOT)         */}
      {/* ============================================================== */}
      <group 
        position={[1.5 + explodeOffset * 1.5, 0, 0]}
        onClick={(e) => handleComponentClick(e, 'bearing_de')}
      >
        {/* End-Shield Cast Flange */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[1.35, 1.35, 0.3, 32]} />
          <meshStandardMaterial
            color={getComponentColor('bearing_de', palette.endShield)}
            metalness={0.8}
            roughness={0.28}
            wireframe={wireframe}
          />
        </mesh>

        {/* Outer Bearing Housing Hub */}
        <mesh position={[0.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.75, 0.75, 0.35, 32]} />
          <meshStandardMaterial
            color={getComponentColor('bearing_de', palette.bearingHub)}
            metalness={0.85}
            roughness={0.22}
          />
        </mesh>

        {/* Ball Bearing Race Rings & Balls */}
        <mesh position={[0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.55, 0.12, 16, 32]} />
          <meshStandardMaterial
            color={isSelected('bearing_de') ? '#00e5ff' : '#ef4444'}
            metalness={0.95}
            roughness={0.1}
            emissive="#ef4444"
            emissiveIntensity={0.65}
          />
        </mesh>

        {/* Ball bearings (8 elements arranged radially) */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <mesh 
              key={i} 
              position={[0.3, Math.sin(angle) * 0.55, Math.cos(angle) * 0.55]}
            >
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial 
                color="#f8fafc" 
                metalness={0.98} 
                roughness={0.05} 
              />
            </mesh>
          );
        })}

        {/* Interactive Hotspot: DE Bearing */}
        {showHotspots && (
          <Html position={[0.35, 1.15, 0.35]} center distanceFactor={10}>
            <div 
              onClick={(e) => handleComponentClick(e, 'bearing_de')}
              className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono shadow-xl cursor-pointer whitespace-nowrap animate-pulse hover:scale-105 transition-transform backdrop-blur-md border ${
                isDark
                  ? 'bg-rose-950/90 border-rose-500/70 text-rose-300 shadow-crimson-glow'
                  : 'bg-rose-50/95 border-rose-500 text-rose-800 font-semibold shadow-md'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>DE Bearing: 92.6°C [FAULT]</span>
            </div>
          </Html>
        )}
      </group>

      {/* ============================================================== */}
      {/* 5. NON-DRIVE END (NDE) BEARING                                 */}
      {/* ============================================================== */}
      <group 
        position={[-1.5 - explodeOffset * 1.0, 0, 0]}
        onClick={(e) => handleComponentClick(e, 'bearing_nde')}
      >
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[1.35, 1.35, 0.3, 32]} />
          <meshStandardMaterial
            color={getComponentColor('bearing_nde', palette.endShield)}
            metalness={0.8}
            roughness={0.28}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[-0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.5, 0.1, 16, 32]} />
          <meshStandardMaterial
            color={isSelected('bearing_nde') ? '#00e5ff' : '#00e5ff'}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* 6. COOLING FAN & AERODYNAMIC BLADES (ROTATING)                */}
      {/* ============================================================== */}
      <group 
        ref={fanRef}
        position={[-1.9 - explodeOffset * 1.8, 0, 0]}
        onClick={(e) => handleComponentClick(e, 'cooling_fan')}
      >
        {/* Fan Hub */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.35, 24]} />
          <meshStandardMaterial color={palette.fanHub} metalness={0.7} roughness={0.3} />
        </mesh>

        {/* 8 Curved Fan Blades */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <group key={i} rotation={[angle, 0, 0]}>
              <mesh position={[0, 0.72, 0]} rotation={[0.4, 0, 0]} castShadow>
                <boxGeometry args={[0.25, 0.65, 0.04]} />
                <meshStandardMaterial
                  color={isSelected('cooling_fan') ? '#00e5ff' : palette.fanBlades}
                  metalness={0.65}
                  roughness={0.28}
                  wireframe={wireframe}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* ============================================================== */}
      {/* 7. FAN COWL / SHROUD (VENTILATED COVER)                       */}
      {/* ============================================================== */}
      <group 
        position={[-2.1 - explodeOffset * 2.2, 0, 0]}
        onClick={(e) => handleComponentClick(e, 'cooling_fan')}
      >
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[1.38, 1.38, 0.7, 32, 1, true]} />
          <meshStandardMaterial
            color={palette.fanCowl}
            metalness={0.75}
            roughness={0.35}
            side={THREE.DoubleSide}
            wireframe={wireframe}
          />
        </mesh>
        {/* Rear Wire Mesh Grill */}
        <mesh position={[-0.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <circleGeometry args={[1.35, 32]} />
          <meshStandardMaterial
            color="#475569"
            wireframe={true}
            transparent={true}
            opacity={0.65}
          />
        </mesh>

        {/* Hotspot: Cooling Impeller */}
        {showHotspots && (
          <Html position={[-0.2, 1.1, 0.3]} center distanceFactor={10}>
            <div 
              onClick={(e) => handleComponentClick(e, 'cooling_fan')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono shadow-lg cursor-pointer whitespace-nowrap transition-all backdrop-blur-md border ${
                isDark
                  ? 'bg-graphite-900/95 border-cyan-500/50 text-cyan-300 hover:border-cyan-400 hover:text-white'
                  : 'bg-white/95 border-cyan-600 text-cyan-900 hover:bg-cyan-50 font-semibold shadow-md'
              }`}
            >
              Cooling Impeller · 38.0°C
            </div>
          </Html>
        )}
      </group>

      {/* ============================================================== */}
      {/* 8. HIGH-VOLTAGE TERMINAL BOX (TOP MOUNTED)                     */}
      {/* ============================================================== */}
      <group 
        position={[0, 1.45 + explodeOffset * 1.2, 0]}
        onClick={(e) => handleComponentClick(e, 'terminal_box')}
      >
        {/* Terminal Box Body */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[1.2, 0.7, 0.9]} />
          <meshStandardMaterial
            color={isSelected('terminal_box') ? '#00e5ff' : palette.terminalBox}
            metalness={0.7}
            roughness={0.32}
            wireframe={wireframe}
          />
        </mesh>

        {/* Lid Flange with Screws */}
        <mesh position={[0, 0.72, 0]}>
          <boxGeometry args={[1.26, 0.08, 0.96]} />
          <meshStandardMaterial color={palette.terminalLid} metalness={0.8} roughness={0.25} />
        </mesh>

        {/* 3 Industrial Cable Glands */}
        {[-0.3, 0, 0.3].map((posZ, idx) => (
          <mesh key={idx} position={[0.62, 0.35, posZ]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
            <meshStandardMaterial color="#eab308" metalness={0.92} roughness={0.15} />
          </mesh>
        ))}

        {/* Hotspot: Terminal Box */}
        {showHotspots && (
          <Html position={[0, 0.9, 0]} center distanceFactor={10}>
            <div 
              onClick={(e) => handleComponentClick(e, 'terminal_box')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono shadow-lg cursor-pointer whitespace-nowrap transition-all backdrop-blur-md border ${
                isDark
                  ? 'bg-graphite-900/95 border-amber-500/50 text-amber-300 hover:border-amber-400 hover:text-white'
                  : 'bg-white/95 border-amber-600 text-amber-900 hover:bg-amber-50 font-semibold shadow-md'
              }`}
            >
              6.6kV Terminal Box · 44.5°C
            </div>
          </Html>
        )}
      </group>

      {/* ============================================================== */}
      {/* 9. HEAVY INDUSTRIAL CAST MOUNTING FEET                         */}
      {/* ============================================================== */}
      <group position={[0, -1.35, 0]}>
        {/* Left Foot */}
        <mesh position={[0.7, -0.2, 0.9]} castShadow>
          <boxGeometry args={[1.0, 0.35, 0.4]} />
          <meshStandardMaterial color={palette.mountingFeet} metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[-0.7, -0.2, 0.9]} castShadow>
          <boxGeometry args={[1.0, 0.35, 0.4]} />
          <meshStandardMaterial color={palette.mountingFeet} metalness={0.85} roughness={0.3} />
        </mesh>

        {/* Right Foot */}
        <mesh position={[0.7, -0.2, -0.9]} castShadow>
          <boxGeometry args={[1.0, 0.35, 0.4]} />
          <meshStandardMaterial color={palette.mountingFeet} metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[-0.7, -0.2, -0.9]} castShadow>
          <boxGeometry args={[1.0, 0.35, 0.4]} />
          <meshStandardMaterial color={palette.mountingFeet} metalness={0.85} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
};

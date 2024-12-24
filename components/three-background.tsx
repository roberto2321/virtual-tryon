"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"
import * as THREE from "three"

function StarField() {
  const ref = useRef<THREE.Points>(null!)

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(2000 * 3) // Reduced from 5000
    const colors = new Float32Array(2000 * 3)

    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200

      // Much more subtle colors - mostly white/blue
      const color = new THREE.Color()
      color.setHSL(0.6 + Math.random() * 0.1, 0.2, 0.8) // Subtle blue-white
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    return [positions, colors]
  }, [])

  useFrame((state) => {
    if (ref.current) {
      // Much slower rotation
      ref.current.rotation.x = state.clock.elapsedTime * 0.01
      ref.current.rotation.y = state.clock.elapsedTime * 0.005
    }
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.5} // Much smaller points
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.3} // More transparent
      />
      <bufferAttribute attach="geometry-attributes-color" args={[colors, 3]} />
    </Points>
  )
}

function SubtleOrbs() {
  const orbsRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (orbsRef.current) {
      orbsRef.current.children.forEach((orb, i) => {
        // Much slower and more subtle movement
        orb.position.y = Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.5
        orb.rotation.x = state.clock.elapsedTime * 0.1
        orb.rotation.z = state.clock.elapsedTime * 0.05
      })
    }
  })

  return (
    <group ref={orbsRef}>
      {Array.from(
        { length: 4 },
        (
          _,
          i, // Reduced from 8 to 4
        ) => (
          <mesh key={i} position={[Math.cos((i / 4) * Math.PI * 2) * 25, 0, Math.sin((i / 4) * Math.PI * 2) * 25]}>
            <sphereGeometry args={[0.2, 8, 8]} /> {/* Much smaller spheres */}
            <meshBasicMaterial
              color={new THREE.Color().setHSL(0.7 + i * 0.1, 0.3, 0.4)}
              transparent
              opacity={0.1} // Very transparent
            />
          </mesh>
        ),
      )}
    </group>
  )
}

export default function ThreeBackground() {
  return (
    <Canvas
      camera={{ position: [0, 0, 50], fov: 60 }}
      style={{
        background: "linear-gradient(180deg, #000000 0%, #0a0015 30%, #000000 70%, #000000 100%)",
        opacity: 0.7, // Make entire canvas more transparent
      }}
    >
      <StarField />
      <SubtleOrbs />
    </Canvas>
  )
}

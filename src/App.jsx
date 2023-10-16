import { useState, useRef, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGLTF, Environment, OrbitControls, PresentationControls } from '@react-three/drei'
import { EffectComposer, DepthOfField, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { useControls } from 'leva'


import './App.css'



function Watermelon({ z }) {
  const model = useRef()
  const { viewport, camera } = useThree()
  const { width, height } = viewport.getCurrentViewport(camera, [0, 0, z])
  const { nodes, materials } = useGLTF('/watermelon-transformed.glb')

  const [data] = useState({
    x: THREE.MathUtils.randFloatSpread(2),
    y: THREE.MathUtils.randFloatSpread(height),
    rX: Math.random() * Math.PI,
    rY: Math.random() * Math.PI,
    rZ: Math.random() * Math.PI,
  })

  useFrame((state) => {
    model.current.rotation.set(data.rX += 0.005, data.rY += 0.002, data.rZ += 0.007)
    model.current.position.set(data.x * width, (data.y += 0.01), z)
    if (data.y > height) {
      data.y = -height
    }
  })

  return (
    <group ref={model} dispose={null}>
      <mesh geometry={nodes.base.geometry} material={materials.PaletteMaterial001} rotation={[-Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes['base-glass'].geometry} material={materials.Bottom_textured_1} rotation={[-Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes['center-glass'].geometry} material={materials.watermelon_inside_textured_1} rotation={[-Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes['front-shine'].geometry} material={materials.PaletteMaterial002} rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  )
}


export default function App({ count = 30, depth = 80 }) {
  // const color = useControls({ value: '#fa426b' })

  return (
    <>
      <Canvas gl={{ alpha: false }} camera={{ near: 0.01, far: 180, fov: 10 }}>
        <color attach="background" args={['#fa426b']} />

        <Suspense>
          <PresentationControls global={true} snap={true} azimuth={[-0.02, 0.02]} polar={[-.05, -0.03]}>
            {Array.from({ length: count }, (_, i) => (
              <Watermelon key={i} z={-(i / count) * depth - 20} />
            ))}
          </PresentationControls>
          <EffectComposer>
            <DepthOfField target={[0, 0, depth / 2]} focalLength={0.5} bokehScale={8} />

          </EffectComposer>
        </Suspense>
      </Canvas>
    </>

  )
}



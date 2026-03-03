import { Canvas } from '@react-three/fiber'
import Model from './Model'

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ fov: 45, near: 0.1, far: 200, position: [3, 2, 6] }}>
        <Model />
      </Canvas>
    </div>
  )
}
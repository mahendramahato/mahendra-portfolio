import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { useGLTF, OrbitControls, Environment, Center } from '@react-three/drei'
import { createPortal, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import LoadingScreen from './Loading'
import Home from './Home'

export default function Model() {
  const { scene } = useGLTF('./pc.glb')
  const renderTarget = useRef(new THREE.WebGLRenderTarget(1280, 800))
  const controlsRef = useRef()
  const screenMeshRef = useRef(null)
  const [zoomTriggered, setZoomTriggered] = useState(false)
  const [screenEntered, setScreenEntered] = useState(false)
  const [showHome, setShowHome] = useState(false)
  const [showMain, setShowMain] = useState(false)
  const readyRef = useRef(false)

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') { setShowHome(false); setShowMain(false) }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.isMesh && obj.name === 'Plane001_Material019_0') {
        obj.material = new THREE.MeshBasicMaterial({ map: renderTarget.current.texture })
        screenMeshRef.current = obj
      }
    })
  }, [scene])

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enableRotate={false}
        enablePan={false}
        enableZoom={false}
      />
      <ZoomOnClick
        controlsRef={controlsRef}
        screenMeshRef={screenMeshRef}
        onZoom={() => setZoomTriggered(true)}
        onEnterScreen={() => setScreenEntered(true)}
        screenEntered={screenEntered}
        locked={showHome || showMain}
        readyRef={readyRef}
        onComplete={() => setShowHome(true)}
      />
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} />
      <Environment preset="city" />

      <Center>
        <primitive object={scene} scale={4} />
      </Center>

      <RenderTextureHelper
        target={renderTarget.current}
        zoomTriggered={zoomTriggered}
        screenEntered={screenEntered}
        onReady={() => { readyRef.current = true }}
      />

      {showHome && !showMain && (
        <ScreenHome
          screenMeshRef={screenMeshRef}
          onOpenIframe={() => { setShowHome(false); setShowMain(true) }}
        />
      )}
      {showMain && <ScreenIframe screenMeshRef={screenMeshRef} />}
    </>
  )
}

function ScreenHome({ screenMeshRef, onOpenIframe }) {
  const { camera, size, gl } = useThree()
  const containerRef = useRef(null)

  useEffect(() => {
    const container = document.createElement('div')
    container.style.cssText = 'position:fixed;overflow:hidden;pointer-events:auto;z-index:9998;border-radius:38px 38px 0 0;'
    document.body.appendChild(container)
    const root = createRoot(container)
    root.render(<Home onOpenIframe={onOpenIframe} />)
    containerRef.current = container
    return () => { root.unmount(); document.body.removeChild(container) }
  }, [onOpenIframe])

  useFrame(() => {
    const mesh = screenMeshRef.current
    const container = containerRef.current
    if (!mesh || !container) return
    const box = new THREE.Box3().setFromObject(mesh)
    const corners = [
      new THREE.Vector3(box.min.x, box.min.y, box.min.z),
      new THREE.Vector3(box.max.x, box.min.y, box.min.z),
      new THREE.Vector3(box.max.x, box.max.y, box.max.z),
      new THREE.Vector3(box.min.x, box.max.y, box.max.z),
    ]
    const projected = corners.map(v => {
      const p = v.clone().project(camera)
      return { x: (p.x + 1) / 2 * size.width, y: (-p.y + 1) / 2 * size.height }
    })
    const xs = projected.map(p => p.x), ys = projected.map(p => p.y)
    const minX = Math.min(...xs), maxX = Math.max(...xs)
    const minY = Math.min(...ys), maxY = Math.max(...ys)
    const rect = gl.domElement.getBoundingClientRect()
    container.style.left   = (rect.left + minX) + 'px'
    container.style.top    = (rect.top  + minY) + 'px'
    container.style.width  = (maxX - minX) + 'px'
    container.style.height = (maxY - minY) + 'px'
  })

  return null
}

function ScreenIframe({ screenMeshRef }) {
  const { camera, size, gl } = useThree()
  const containerRef = useRef(null)

  useEffect(() => {
    const container = document.createElement('div')
    container.style.cssText = 'position:fixed;overflow:hidden;pointer-events:auto;z-index:9999;border-radius:38px 38px 0 0;'
    document.body.appendChild(container)

    const iframe = document.createElement('iframe')
    iframe.src = 'http://localhost:3000'
    iframe.title = 'portfolio'
    iframe.style.cssText = 'width:100%;height:100%;border:none;'
    container.appendChild(iframe)

    containerRef.current = container
    return () => document.body.removeChild(container)
  }, [gl])

  useFrame(() => {
    const mesh = screenMeshRef.current
    const container = containerRef.current
    if (!mesh || !container) return

    const box = new THREE.Box3().setFromObject(mesh)
    const corners = [
      new THREE.Vector3(box.min.x, box.min.y, box.min.z),
      new THREE.Vector3(box.max.x, box.min.y, box.min.z),
      new THREE.Vector3(box.max.x, box.max.y, box.max.z),
      new THREE.Vector3(box.min.x, box.max.y, box.max.z),
    ]

    const projected = corners.map(v => {
      const p = v.clone().project(camera)
      return { x: (p.x + 1) / 2 * size.width, y: (-p.y + 1) / 2 * size.height }
    })

    const xs = projected.map(p => p.x)
    const ys = projected.map(p => p.y)
    const minX = Math.min(...xs), maxX = Math.max(...xs)
    const minY = Math.min(...ys), maxY = Math.max(...ys)
    const w = maxX - minX
    const h = maxY - minY

    const rect = gl.domElement.getBoundingClientRect()
    container.style.left   = (rect.left + minX) + 'px'
    container.style.top    = (rect.top  + minY) + 'px'
    container.style.width  = w + 'px'
    container.style.height = h + 'px'
  })

  return null
}

function RenderTextureHelper({ target, zoomTriggered, screenEntered, onReady }) {
  const { gl } = useThree()
  const scene = useRef(new THREE.Scene())
  const camera = useRef(new THREE.PerspectiveCamera(50, 1280 / 800, 0.1, 100))

  useEffect(() => {
    camera.current.position.set(0, 0, 3.2)
  }, [])

  useFrame(() => {
    gl.setRenderTarget(target)
    gl.render(scene.current, camera.current)
    gl.setRenderTarget(null)
  })

  return createPortal(<><ambientLight intensity={2} /><LoadingScreen zoomTriggered={zoomTriggered} screenEntered={screenEntered} onReady={onReady} /></>, scene.current)
}

function ZoomOnClick({ controlsRef, screenMeshRef, onZoom, onEnterScreen, screenEntered, locked, readyRef, onComplete }) {
  const { camera, gl } = useThree()
  const isZoomed = useRef(false)
  const lockedRef = useRef(false)
  useEffect(() => { lockedRef.current = locked }, [locked])
  const defaultCamPos = useRef(null)
  const defaultTarget = useRef(new THREE.Vector3(0, 0, 0))
  const targetCamPos = useRef(new THREE.Vector3())
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0))
  const screenEnteredRef = useRef(false)

  useEffect(() => { screenEnteredRef.current = screenEntered }, [screenEntered])

  useEffect(() => {
    defaultCamPos.current = camera.position.clone()
    targetCamPos.current.copy(camera.position)
  }, [camera])

  useEffect(() => {
    const handleClick = () => {
      if (!defaultCamPos.current || lockedRef.current) return

      if (isZoomed.current) {
        if (!screenEnteredRef.current) {
          onEnterScreen()
          return
        }
        if (readyRef.current) {
          onComplete()
          return
        }
        targetCamPos.current.copy(defaultCamPos.current)
        targetLookAt.current.copy(defaultTarget.current)
        isZoomed.current = false
      } else {
        if (!screenMeshRef.current) return
        const screenPos = new THREE.Vector3()
        screenMeshRef.current.getWorldPosition(screenPos)
        targetCamPos.current.set(screenPos.x, screenPos.y - 0.05, screenPos.z + 1.5)
        targetLookAt.current.copy(screenPos)
        isZoomed.current = true
        onZoom()
      }
    }

    gl.domElement.addEventListener('click', handleClick)
    return () => gl.domElement.removeEventListener('click', handleClick)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl])

  useFrame(() => {
    const speed = isZoomed.current ? 0.02 : 0.01
    camera.position.lerp(targetCamPos.current, speed)
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt.current, speed)
      controlsRef.current.update()
    }
  })

  return null
}

useGLTF.preload('./pc.glb')

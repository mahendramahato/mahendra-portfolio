import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import WelcomeScreen from './Welcome'
import TerminalScreen from './Screen'

const FONT       = '/PressStart2P.woff2.ttf'
const LOAD_SECS  = 5
const SEGMENTS   = 24
const SEG_COLORS = ['#ff4466','#ff7744','#ffcc00','#88ff44','#44ffcc','#44aaff','#aa44ff','#ff44cc']


// ── Root ─────────────────────────────────────────────────────
export default function LoadingScreen({ zoomTriggered, screenEntered, onReady }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (screenEntered && phase === 1) setPhase(2)
  }, [screenEntered, phase])

  return (
    <>
      {phase === 0 && <LoadingPhase onDone={() => setPhase(1)} zoomTriggered={zoomTriggered} />}
      {phase === 1 && <WelcomeScreen />}
      {phase === 2 && <TerminalScreen onReady={onReady} />}
    </>
  )
}

// ── Loading animation ─────────────────────────────────────────
function LoadingPhase({ onDone, zoomTriggered }) {
  const [filled, setFilled]   = useState(0)
  const filledRef = useRef(0)
  const calledRef = useRef(false)

  useEffect(() => {
    if (filled >= SEGMENTS && zoomTriggered && !calledRef.current) {
      calledRef.current = true
      setTimeout(onDone, 400)
    }
  }, [filled, zoomTriggered, onDone])

  useFrame((_, delta) => {
    // Smooth progress fill
    if (filledRef.current < SEGMENTS) {
      const next = Math.min(SEGMENTS, filledRef.current + (SEGMENTS / LOAD_SECS) * delta)
      if (Math.floor(next) > Math.floor(filledRef.current)) setFilled(Math.floor(next))
      filledRef.current = next
    }

  })

  const loadDone  = filled >= SEGMENTS
  const BAR_W = 3.4, BAR_H = 0.22, BAR_Y = 0.52
  const BORDER = 0.025, GAP = 0.02
  const segW = (BAR_W - BORDER * 2 - GAP * (SEGMENTS - 1)) / SEGMENTS
  const segH = BAR_H - BORDER * 2
  const firstSegX = -BAR_W / 2 + BORDER + segW / 2

  return (
    <>
      {/* Background */}
      <mesh>
        <planeGeometry args={[6, 4]} />
        <meshBasicMaterial color="#0d0d2b" />
      </mesh>

      {/* Title */}
      <Text position={[0, 0.82, 0.01]} fontSize={0.18} color="#ffee00"
        anchorX="center" anchorY="middle" letterSpacing={0.12} font={FONT}>
        {!loadDone ? 'LOADING' : !zoomTriggered ? 'CLICK TO ZOOM' : ''}
      </Text>

      {/* Rainbow progress bar border */}
      <mesh position={[0, BAR_Y + BAR_H / 2 - BORDER / 2, 0.01]}>
        <planeGeometry args={[BAR_W, BORDER]} /><meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, BAR_Y - BAR_H / 2 + BORDER / 2, 0.01]}>
        <planeGeometry args={[BAR_W, BORDER]} /><meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-BAR_W / 2 + BORDER / 2, BAR_Y, 0.01]}>
        <planeGeometry args={[BORDER, BAR_H]} /><meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[BAR_W / 2 - BORDER / 2, BAR_Y, 0.01]}>
        <planeGeometry args={[BORDER, BAR_H]} /><meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Rainbow segments */}
      {Array.from({ length: SEGMENTS }).map((_, i) => (
        <mesh key={i} position={[firstSegX + i * (segW + GAP), BAR_Y, 0.02]}>
          <planeGeometry args={[segW, segH]} />
          <meshBasicMaterial color={i < filled ? SEG_COLORS[i % SEG_COLORS.length] : '#1a1a3a'} />
        </mesh>
      ))}

    </>
  )
}

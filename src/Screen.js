import { useState, useEffect, useRef } from 'react'
import { Text } from '@react-three/drei'

const FONT  = '/PressStart2P.woff2.ttf'
const GREEN = '#33ff33'
const DIM   = '#1a8c1a'

// Safe area: x ±2.0, y 0.30 → 1.10
const LINE_TOP = 0.88
const LINE_GAP = 0.075

const CONTENT = [
  { text: '> WELCOME, TRAVELER',  color: DIM,   size: 0.058 },
  { text: '> IDENTITY: MAHENDRA', color: DIM,   size: 0.058 },
  { text: '',                      color: '',    size: 0     },
  { text: 'HELLO, I AM MAHENDRA', color: GREEN, size: 0.075 },
  { text: '',                      color: '',    size: 0     },
  { text: '> CONTENTS LOADING...',  color: DIM,   size: 0.055 },
]

export default function TerminalScreen({ onReady }) {
  const [count, setCount]   = useState(0)
  const [cursor, setCursor] = useState(true)
  const readyCalled = useRef(false)

  useEffect(() => {
    const reveal = setInterval(() => setCount(c => {
      if (c >= CONTENT.length) { clearInterval(reveal); return c }
      return c + 1
    }), 420)
    const blink = setInterval(() => setCursor(v => !v), 530)
    return () => { clearInterval(reveal); clearInterval(blink) }
  }, [])

  useEffect(() => {
    if (count >= CONTENT.length && onReady && !readyCalled.current) {
      readyCalled.current = true
      onReady()
    }
  }, [count, onReady])

  return (
    <>
      {/* Dark CRT background */}
      <mesh>
        <planeGeometry args={[6, 4]} />
        <meshBasicMaterial color="#4c514a" />
      </mesh>

      {/* Header */}
      <Text position={[0, 1.10, 0.02]} fontSize={0.062} color={GREEN}
        anchorX="center" anchorY="middle" letterSpacing={0.05} font={FONT}>
        ROBCO INDUSTRIES TERMLINK PROTOCOL
      </Text>

      {/* Content lines — typed out one by one */}
      {CONTENT.slice(0, count).map((line, i) =>
        line.text ? (
          <Text key={i}
            position={[-1.80, LINE_TOP - i * LINE_GAP, 0.02]}
            fontSize={line.size} color={line.color}
            anchorX="left" anchorY="middle" letterSpacing={0.04} font={FONT}>
            {line.text}
          </Text>
        ) : null
      )}

      {/* Blinking cursor while typing */}
      {count > 0 && count < CONTENT.length && (
        <Text
          position={[-1.80, LINE_TOP - count * LINE_GAP, 0.02]}
          fontSize={0.065} color={cursor ? GREEN : '#4c514a'}
          anchorX="left" anchorY="middle" font={FONT}>
          _
        </Text>
      )}

      {/* Click to enter button after typing done */}
      {count >= CONTENT.length && (
        <Text
          position={[0, LINE_TOP - CONTENT.length * LINE_GAP - 0.10, 0.02]}
          fontSize={0.068} color={cursor ? GREEN : '#4c514a'}
          anchorX="center" anchorY="middle" letterSpacing={0.06} font={FONT}>
          [ CLICK TO ENTER ]
        </Text>
      )}


    </>
  )
}

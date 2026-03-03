import { Text } from '@react-three/drei'

const FONT = '/PressStart2P.woff2.ttf'

const DECO_COLORS = ['#ff4466', '#ff7744', '#ffcc00', '#44ff88', '#44aaff', '#aa44ff']

export default function WelcomeScreen() {
  return (
    <>
      {/* Background */}
      <mesh>
        <planeGeometry args={[6, 4]} />
        <meshBasicMaterial color="#0d0d2b" />
      </mesh>

      {/* WELCOME */}
      <Text position={[0, 0.78, 0.02]} fontSize={0.26} color="#ffee00"
        anchorX="center" anchorY="middle" letterSpacing={0.1} font={FONT}>
        WELCOME
      </Text>

      {/* Divider line */}
      <mesh position={[0, 0.60, 0.01]}>
        <planeGeometry args={[3.0, 0.025]} />
        <meshBasicMaterial color="#444466" />
      </mesh>

      {/* Subtitle */}
      <Text position={[0, 0.48, 0.02]} fontSize={0.10} color="#ccccff"
        anchorX="center" anchorY="middle" letterSpacing={0.06} font={FONT}>
        TO MY PORTFOLIO
      </Text>

      {/* Color stripe */}
      {DECO_COLORS.map((color, i) => (
        <mesh key={i} position={[-1.25 + i * 0.5, 0.34, 0.01]}>
          <planeGeometry args={[0.42, 0.07]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}

      {/* Bottom hint */}
      <Text position={[0, 0.22, 0.02]} fontSize={0.065} color="#8888bb"
        anchorX="center" anchorY="middle" letterSpacing={0.05} font={FONT}>
        CLICK TO EXPLORE
      </Text>
    </>
  )
}

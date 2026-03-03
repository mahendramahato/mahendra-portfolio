import { useState, useEffect } from 'react'

const ICONS = [
  { id: 'fallout',   label: 'Fallout.app', bg: 'linear-gradient(145deg,#f59e0b,#d97706)', symbol: '☢',  symbolColor: '#1a1a1a' },
  { id: 'projects',  label: 'Projects',    bg: 'linear-gradient(145deg,#3b82f6,#1d4ed8)', symbol: '📁', symbolColor: '#fff'    },
  { id: 'github',    label: 'GitHub',      bg: 'linear-gradient(145deg,#374151,#111827)', symbol: '🐙', symbolColor: '#fff'    },
  { id: 'resume',    label: 'Resume.pdf',  bg: 'linear-gradient(145deg,#ef4444,#b91c1c)', symbol: '📄', symbolColor: '#fff'    },
]

const DOCK = ['🌐', '📁', '💬', '🎵', '⚙️']

export default function Home({ onOpenIframe }) {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }, 10000)
    return () => clearInterval(t)
  }, [])

  return (
    <div
      onClick={() => setSelected(null)}
      style={{
        width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(160deg,#0f172a 0%,#1e1b4b 40%,#0f172a 100%)',
        fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif',
        userSelect: 'none',
      }}>

      {/* Subtle wallpaper glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 400, height: 300, borderRadius: '50%',
        background: 'radial-gradient(ellipse,rgba(99,102,241,0.18) 0%,transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Menu bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 26,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(24px)',
        display: 'flex', alignItems: 'center', padding: '0 14px', gap: 18,
        fontSize: 12, color: 'rgba(255,255,255,0.9)', zIndex: 10,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <span style={{ fontSize: 14 }}>🍎</span>
        <span style={{ fontWeight: 700 }}>Mahendra</span>
        {['File','Edit','View','Go','Window','Help'].map(m => (
          <span key={m} style={{ opacity: 0.7, cursor: 'default' }}>{m}</span>
        ))}
        <span style={{ marginLeft: 'auto', fontVariantNumeric: 'tabular-nums' }}>{time}</span>
        <span style={{ opacity: 0.7 }}>🔋 WiFi ☁</span>
      </div>

      {/* Desktop icons — top-right column */}
      <div style={{
        position: 'absolute', top: 44, right: 16,
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        {ICONS.map(icon => (
          <div
            key={icon.id}
            onClick={e => { e.stopPropagation(); setSelected(icon.id) }}
            onDoubleClick={e => { e.stopPropagation(); if (icon.id === 'fallout') onOpenIframe() }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'default', width: 72 }}>

            <div style={{
              width: 54, height: 54, borderRadius: 13, background: icon.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: icon.id === 'fallout' ? 30 : 26, color: icon.symbolColor,
              boxShadow: selected === icon.id
                ? '0 0 0 3px rgba(99,102,241,0.8), 0 4px 16px rgba(0,0,0,0.5)'
                : '0 4px 12px rgba(0,0,0,0.5)',
              outline: selected === icon.id ? '2px solid rgba(99,102,241,0.6)' : 'none',
              transition: 'box-shadow 0.1s',
              fontFamily: 'inherit',
            }}>
              {icon.symbol}
            </div>

            <span style={{
              fontSize: 10, color: 'white', textAlign: 'center',
              textShadow: '0 1px 4px rgba(0,0,0,0.9)',
              background: selected === icon.id ? 'rgba(99,102,241,0.7)' : 'transparent',
              padding: '1px 4px', borderRadius: 3,
              maxWidth: 70, overflow: 'hidden', whiteSpace: 'nowrap',
            }}>
              {icon.label}
            </span>
          </div>
        ))}
      </div>

      {/* Hint text */}
      <div style={{
        position: 'absolute', bottom: 68, left: 0, right: 0,
        textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.3)',
      }}>
        Double-click Fallout.app to enter
      </div>

      {/* Dock */}
      <div style={{
        position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.18)', borderRadius: 16,
        padding: '6px 10px', display: 'flex', gap: 6, alignItems: 'flex-end',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}>
        {DOCK.map((icon, i) => (
          <div key={i} style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, cursor: 'default',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          }}>{icon}</div>
        ))}
      </div>
    </div>
  )
}

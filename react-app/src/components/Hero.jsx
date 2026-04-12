import { useRef, useEffect } from 'react'
import styles from './Hero.module.css'

export default function Hero() {
  const canvasRef = useRef(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    // Matter.js physics will be initialized here
    // For now, just draw the background
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    const W = cv.width = cv.offsetWidth
    const H = cv.height = cv.offsetHeight
    ctx.fillStyle = '#1a0821'
    ctx.fillRect(0, 0, W, H)
  }, [])

  return (
    <section id="s1" className={styles.hero}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.content}>
        <div className={styles.tags}>
          <span className={styles.tag}>
            Ages 7+ <span className={styles.tagSep}>&middot;</span>
            2+ Players <span className={styles.tagSep}>&middot;</span>
            30 min Avg Playtime
          </span>
        </div>
        <h1 className={styles.title}>
          EscapeGravity
          <sup className={styles.tm}>from <b>DeepKids</b></sup>
        </h1>
        <p className={styles.subtitle}>
          Boardgame &middot; Physical Challenges &middot; Science
        </p>
        <button className={styles.preOrder}>
          Pre-Order
        </button>
      </div>
    </section>
  )
}

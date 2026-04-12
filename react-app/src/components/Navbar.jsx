import styles from './Navbar.module.css'

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <a href="#s1" className={styles.logo}>EscapeGravity</a>
      <button
        type="button"
        className={styles.cta}
        onClick={() => window.doPreOrder?.()}
      >
        Pre-Order
      </button>
    </nav>
  )
}

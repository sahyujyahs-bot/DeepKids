import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <div className={styles.brandName}>EscapeGravity</div>
          <div className={styles.brandTag}>
            A boardgame that is all about Gravity. Science, strategy,
            and physical fun for the whole family.
          </div>
          <div className={styles.by}>
            A <strong>DeepKids</strong> creation &mdash; games that turn
            learning into play.
          </div>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul className={styles.links}>
            <li><a href="#s1">Home</a></li>
            <li><a href="#s2">The Game</a></li>
            <li><a href="#s4-science">Science</a></li>
            <li><a href="#s6">Features</a></li>
            <li><a href="#s7">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4>Follow Us</h4>
          <div className={styles.socials}>
            <a href="#" aria-label="X / Twitter">X</a>
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="YouTube">YT</a>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        &copy; 2026 DeepKids. All rights reserved.
        &nbsp;&middot;&nbsp;
        <a href="https://deepkids.in" style={{ color: '#9cbc14', textDecoration: 'none' }}>
          deepkids.in
        </a>
      </div>
    </footer>
  )
}

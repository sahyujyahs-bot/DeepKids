import styles from './SectionPlaceholder.module.css'

export default function SectionPlaceholder({ id, title }) {
  return (
    <section id={id} className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.sub}>Section migrating to React...</p>
    </section>
  )
}

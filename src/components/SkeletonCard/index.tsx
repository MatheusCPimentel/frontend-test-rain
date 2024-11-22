import styles from "./styles.module.css";

export function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.imagePlaceholder} />
      <div className={styles.textPlaceholder} />
      <div className={styles.detailsPlaceholder}>
        <div className={styles.line} />
        <div className={styles.line} />
        <div className={styles.line} />
      </div>
    </div>
  );
}

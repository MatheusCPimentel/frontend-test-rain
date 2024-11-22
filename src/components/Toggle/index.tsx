import styles from "./styles.module.css";

interface ToggleProps {
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
  label: string;
}

export function Toggle({ isChecked, setIsChecked, label }: ToggleProps) {
  return (
    <div className={styles.toggleWrapper}>
      <label className={styles.toggle}>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
        />

        <span className={styles.slider} />
      </label>

      <span className={styles.label}>{label}</span>
    </div>
  );
}

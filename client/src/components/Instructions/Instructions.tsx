import styles from './Instructions.module.css';

type Props = {
  children: React.ReactNode;
}

export const Instructions = ({ children }: Props) => {
  return (
    <div className={styles.instructions}>
      {children}
    </div>
  )
}
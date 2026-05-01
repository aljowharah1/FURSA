import clsx from 'clsx';
import styles from './Loader.module.css';

type LoaderSize = 'sm' | 'md' | 'lg';

interface LoaderProps {
  size?: LoaderSize;
  fullPage?: boolean;
}

export default function Loader({ size = 'md', fullPage = false }: LoaderProps) {
  const spinner = <div className={clsx(styles.spinner, styles[size])} />;

  if (fullPage) {
    return <div className={styles.fullPage}>{spinner}</div>;
  }

  return spinner;
}

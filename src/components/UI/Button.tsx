import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ onClick, children, disabled = false, type = 'button' }) => {
  return (
    <button className={styles.button} onClick={onClick} disabled={disabled} type={type}>
      {children}
    </button>
  );
};

export default Button;
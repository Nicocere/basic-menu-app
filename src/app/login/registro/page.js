'use client';
import { useState } from 'react';
import { supabase } from '@/config/supabaseClient';  // Importa tu cliente de supabase
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';  // Importa los iconos de ojo
import styles from './signup.module.css';  // Importa el archivo CSS de módulos

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { user, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) throw error;

      Swal.fire('¡Registro exitoso!', 'Por favor, revisa tu correo para confirmar.', 'success');
      console.log('Usuario registrado:', user);
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordsMatch = password === confirmPassword;

  return (
    <div className={styles.divContainer}>
      <form className={styles.form} onSubmit={handleSignup}>
        <input
          className={styles.input}
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className={styles.passwordContainer}>
          <input
            className={styles.input}
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <div className={styles.passwordContainer}>
          <input
            className={styles.input}
            type={showPassword ? "text" : "password"}
            placeholder="Confirmar Contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button className={styles.button} type="submit" disabled={isLoading || !passwordsMatch}>
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
}
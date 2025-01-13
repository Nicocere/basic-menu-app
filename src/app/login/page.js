'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/config/supabaseClient';  // Importa tu cliente de supabase
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';  // Importa los iconos de ojo
import styles from './login.module.css';  // Importa el archivo CSS de módulos
import { useAuth } from '@/context/AuthUserContext';  // Importa el contexto de autenticación

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Intentamos iniciar sesión con el email y la contraseña proporcionados
      const { user, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;

      Swal.fire('¡Bienvenido!', 'Has iniciado sesión correctamente.', 'success');
      console.log('Usuario autenticado:', user);

      // Redirigir al usuario si el email es "spazio.digitalsolutions@gmail.com"
      if (user.email === 'spazio.digitalsolutions@gmail.com') {
        router.push('/admin');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.divContainer}>

{!user ? (
      <div className={styles.login}>
        <h1 className={styles.title}>No has iniciado sesión</h1>
        </div> ) : (
        <div className={styles.login}>
        <h1 className={styles.title}>¡Bienvenido de nuevo!</h1>
        </div>
        )}

      <form className={styles.form} onSubmit={handleLogin}>
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
        <button className={styles.button} type="submit" disabled={isLoading}>
          {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  );
}
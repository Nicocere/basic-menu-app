import React, { useContext, useEffect, useState } from 'react'
import { Fab, useMediaQuery } from '@mui/material';
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import style from './CartWidget.module.css';
import { FiShoppingCart } from "react-icons/fi";
import { PiShoppingCartSimpleFill } from "react-icons/pi";
import { useCartContext } from '@/context/CartContext';
import { useSpring, animated } from 'react-spring';
import { useThemeContext } from '@/context/ThemeSwitchContext';



const CartWidget = () => {
  const { cart } = useCartContext();
  const [animate, setAnimate] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:650px)');
  const { isDarkMode } = useThemeContext();
  const fadeProps = useSpring({
    from: { opacity: 0, transform: 'scale(0.8)' },
    to: { opacity: 1, transform: 'scale(1)' },
    // reset: true,
    reverse: animate,
    onRest: () => setAnimate(false),
    config: { duration: 150,  } // Ajusta la duración según prefieras
  });
  
  
  useEffect(() => {
    // Si cart.length cambia, activa la animación
    setAnimate(true);

    // Desactiva la animación después de 400 milisegundos (ajusta según tus preferencias)
    const timeout = setTimeout(() => {
      setAnimate(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, [cart]);

  return (
    <Fab
      size="large"
      className={`boton-abrircarrito ${animate ? 'expandir' : ''}`}
      aria-label="add"
      sx={{
        position: 'fixed',
        top: isSmallScreen ? '22px' : '25px',
        right: isSmallScreen ? '15px':'40px',
        color: isDarkMode ? '#2f1a0f' : '#fcf5f0', 
        backgroundColor: 'transparent',
        boxShadow: 'none',
        fontWeight:'600',
        transition: 'all .53s ease-in-out',
        '&:hover': {
          backgroundColor: 'transparent',

        }
      }}
    >
            <animated.div style={fadeProps}>

      {cart && cart.length !== 0 ? (
        <PiShoppingCartSimpleFill fontSize={isSmallScreen ? '30px': 'xx-large'} />
      ) : (
        <FiShoppingCart fontSize={isSmallScreen ? '30px': 'xx-large'} />
        )}
      </animated.div>
      <p className={style.contadorCarrito}> {cart && cart.length > 0 ? cart.length : null} </p>
    </Fab>
  );
};

export default CartWidget;
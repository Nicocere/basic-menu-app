import React, { useContext, useEffect, useState } from 'react';
import { Fab, Tooltip, Badge, Zoom, useMediaQuery } from '@mui/material';
import style from './CartWidget.module.css';
import { FiShoppingCart } from "react-icons/fi";
import { PiShoppingCartSimpleFill } from "react-icons/pi";
import { useCartContext } from '@/context/CartContext';
import { useSpring, animated } from 'react-spring';
import { useThemeContext } from '@/context/ThemeSwitchContext';

const CartWidget = () => {
  const { cart } = useCartContext();
  const [animate, setAnimate] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:650px)');
  const { isDarkMode } = useThemeContext();

  const total = cart?.reduce((sum, item) => sum + item.precio, 0) || 0;

  const fadeProps = useSpring({
    from: { opacity: 0, transform: 'scale(0.8)' },
    to: { opacity: 1, transform: 'scale(1)' },
    reverse: animate,
    onRest: () => setAnimate(false),
    config: { mass: 1, tension: 200, friction: 20 }
  });

  const bounceProps = useSpring({
    to: { transform: animate ? 'scale(1.1)' : 'scale(1)' },
    config: { tension: 300, friction: 10 }
  });

  useEffect(() => {
    if (cart?.length) {
      setAnimate(true);
      navigator.vibrate && navigator.vibrate(50);
      const timeout = setTimeout(() => setAnimate(false), 800);
      return () => clearTimeout(timeout);
    }
  }, [cart?.length]);

  const handleCartClick = () => {
    setShowPreview(true);
  };

  const cartSummary = `${cart?.length || 0} items - Total: $${total}`;

  return (
    <Tooltip 
      title={cartSummary}
      placement="left"
      TransitionComponent={Zoom}
    >
      <div className={style.cartWidgetContainer}>
        <Fab
          size="large"
          className={`${style.cartButton} ${animate ? style.pulse : ''}`}
          aria-label="Ver carrito de compras"
          onClick={handleCartClick}
          sx={{
            position: 'fixed',
            top: isSmallScreen ? '22px' : '25px',
            right: isSmallScreen ? '15px' : '40px',
            color: isDarkMode ? '#2f1a0f' : '#fcf5f0',
            backgroundColor: isDarkMode ? 'rgba(47, 26, 15, 0.1)' : 'rgba(252, 245, 240, 0.1)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            fontWeight: '600',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 8px rgba(0,0,0,0.15)',
            },
            '&:active': {
              transform: 'translateY(0)',
            }
          }}
        >
          <animated.div style={{ ...fadeProps, ...bounceProps }}>
            <Badge 
              badgeContent={cart?.length || 0}
              color="error"
              className={style.badge}
            >
              {cart && cart.length !== 0 ? (
                <PiShoppingCartSimpleFill className={style.cartIcon} fontSize={isSmallScreen ? '30px': 'xx-large'} />
              ) : (
                <FiShoppingCart className={style.cartIcon} fontSize={isSmallScreen ? '30px': 'xx-large'} />
              )}
            </Badge>
          </animated.div>
          {cart && cart.length > 0 && (
            <div className={style.cartInfo}>
              <span className={style.cartTotal}>${total}</span>
            </div>
          )}
        </Fab>
        
        {showPreview && cart?.length > 0 && (
          <div className={style.cartPreview}>
            <h4>Tu Pedido</h4>
            {cart.map((item, index) => (
              <div key={index} className={style.previewItem}>
                <span>{item.nombre}</span>
                <span>${item.precio}</span>
              </div>
            ))}
            <div className={style.previewTotal}>
              <strong>Total: ${total}</strong>
            </div>
          </div>
        )}
      </div>
    </Tooltip>
  );
};

export default CartWidget;
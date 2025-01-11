"use client";

import React, { useEffect, useState } from 'react';
import style from './navBar.module.css';
import { auth, baseDeDatos } from '../../config/firebaseConfig'
import { doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';
import { onAuthStateChanged } from 'firebase/auth';
import { Typography, Avatar, useMediaQuery, SwipeableDrawer, Paper, IconButton, } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {motion} from 'framer-motion';



const NavBar = () => {

  const [userData, setUserData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(isMobile);
  //ABRIR SUBMENU DE USUARIOS
  const [openProfileDrawer, setOpenProfileDrawer] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);

  const isMobileScreen = useMediaQuery('(max-width:650px)');


  const handleToggleProfileDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpenProfileDrawer(open);
  };

  useEffect(() => {
    // Esta verificación asegura que este código se ejecuta sólo en el cliente
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setIsSmallScreen(window.innerWidth <= 650);
      };
      window.addEventListener('resize', handleResize);
      // Llamar a handleResize inmediatamente para obtener el tamaño correcto al inicio
      handleResize();
      // Limpiar el evento al desmontar el componente
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  useEffect(() => {
    // Establecer el observador en el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        const fetchData = async () => {
          if (auth.currentUser) {
            const uid = auth.currentUser.uid;
            let userDocRef, userDoc;

            userDocRef = doc(baseDeDatos, "users", uid);
            userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              setUserData(userDoc.data());
            } else {
              userDocRef = doc(baseDeDatos, "equipo-empativa", uid);
              userDoc = await getDoc(userDocRef);

              if (userDoc.exists()) {
                setUserData(userDoc.data());
              } else {
                userDocRef = doc(baseDeDatos, "equipo-empativa", uid);
                userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                  setUserData(userDoc.data());
                } else {
                  console.error("No se encontró el usuario en Firestore");
                }
              }
            }
          }
        };

        fetchData();
      } else {
        setCurrentUser(null);
      }
    });

    // Limpiar el observador cuando el componente se desmonte
    return () => unsubscribe();

  }, []);

  return (
    <nav className={style.navContainer} >
      <Link href={'/'} className={style.Logo}>
        <section className={style.title_Logo}>
          <Image src={'/imagenes/logo/logotipo.png'} priority alt="Logo Empativa" width={60} height={60} style={{ margin: '0 10px' }} />
          <div className={style.divTextLogo}>
            <h2 className={style.ESMI}>ESMI</h2>
          </div>
        </section>
        {/* <section className={style.slogan}> */}
        <h6 className={style.subtitle}>Empativa Salud Mental Integral</h6>
        {/* </section> */}


        {/* <h3 className={style.elementorHeadingTitle2}>Salud Mental Integral</h3> */}
      </Link>


      {!isSmallScreen ? (
          <motion.section 
          className={style.btn_Nav_actions}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {[
            { href: '/que-ofrecemos', text: '¿Qué ofrecemos?' },
            { href: '/profesionales', text: 'Profesionales' },
            { href: '/recursos', text: 'Recursos' },
            { href: '/contact', text: 'Contáctanos' }
          ].map((item, index) => (
            <motion.div 
              key={index}
              className={style.divNavBar}
              whileHover={{ y: -2 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={item.href}>{item.text}</Link>
            </motion.div>
          ))}
          
          <motion.div 
            className={style.divNavBar}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <aside className={currentUser && userData ? style.asideUser : style.asideLink}>
              {currentUser && userData ? (
                <motion.div
                  onClick={handleToggleProfileDrawer(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Avatar 
                    sx={{ 
                      background: '#986c62',
                      color: '#f5f6f2',
                      width: '35px',
                      height: '35px',
                      fontSize: '1rem',
                      fontWeight: '600'
                    }}
                  >
                    {userData.username.charAt(0).toUpperCase()}
                  </Avatar>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/login" className={style.linkInitSesion}>Iniciar Sesión</Link>
                </motion.div>
              )}
            </aside>
          </motion.div>
        </motion.section>
        )
        :
        (<IconButton onClick={handleToggleProfileDrawer(true)} className={style.MenuIcon} size="string" edge="start" color="#986c62" aria-label="menu" sx={{ mr: 1 }}>
          <MenuIcon size="large" className={style.svgIcon} />
        </IconButton>
        )
      }


<SwipeableDrawer
  anchor="right"
  open={openProfileDrawer}
  onClick={handleToggleProfileDrawer(false)}
  onClose={handleToggleProfileDrawer(false)}
  onOpen={handleToggleProfileDrawer(true)}
  disableBackdropTransition={true}
  disableDiscovery={true}
  PaperProps={{
    style: { 
      background: 'transparent',
      boxShadow: 'none',
      transform: 'translate3d(0,0,0)',
      WebkitTransform: 'translate3d(0,0,0)',
      willChange: 'transform'
    },
  }}
>
  {openProfileDrawer && (
    <motion.div 
      className={style.sliderNavContainer}
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ 
        type: "tween",
        duration: 0.3,
        ease: "easeOut"
      }}
      style={{
        willChange: 'transform',
        WebkitTransform: 'translate3d(0,0,0)'
      }}
    >


      {isSmallScreen && (
        <motion.section 
          className={style.sectionNavItems}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          style={{
            willChange: 'transform',
            WebkitTransform: 'translate3d(0,0,0)'
          }}
        >
          {[
            { href: '/que-ofrecemos', text: '¿Qué ofrecemos?' },
            { href: '/profesionales', text: 'Profesionales' },
            { href: '/recursos', text: 'Recursos' },
            { href: '/contact', text: 'Contáctanos' }
          ].map((item, index) => (
            <motion.div 
              key={index}
              className={style.divNavBar}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ 
                type: "tween",
                duration: 0.2,
                delay: index * 0.05
              }}
              style={{
                willChange: 'transform',
                WebkitTransform: 'translate3d(0,0,0)'
              }}
            >
              <Link href={item.href}>{item.text}</Link>
            </motion.div>
          ))}
        </motion.section>
      )}
    </motion.div>
  )}
</SwipeableDrawer>
    </nav>
  );
}

export default NavBar;
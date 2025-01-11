"use client";

import React, { createContext, useState } from 'react';
import { HiMenuAlt1, HiMenuAlt2, HiMenuAlt3, HiMenuAlt4 } from 'react-icons/hi';

export const ContenidoEcommerceContext = createContext();

export const ContenidoEcommerceProvider = ({ children }) => {

    const [contenido, setContenido] = useState({
        // Información de la marca
        imagenMarca: '',
        coloresMarca: {
            primario: '#000000',
            secundario: '#ffffff',
            terciario: '#cccccc'
        },
        tipoLetra: 'Arial, sans-serif',
        configuracionesAvanzadas: {
            cssPersonalizado: ''
        },
        // Secciones de la página
        encabezado: {
            titulo: '',
            subtitulo: '',
            logo: { img: '', alt: '', link: '', mostrar: true, posicion: 'right' },
            nombreMarca: '',
            mostrarIconos: true, // Nueva propiedad para mostrar/ocultar iconos
            mostrarTexto: true, // Nueva propiedad para mostrar/ocultar texto
            mostrarImagen: true // Nueva propiedad para mostrar/ocultar imagen
        },
        navbar: {
            links: [
                { name: 'Inicio', path: '/' },
                { name: 'Productos', path: '/productos/listar' },
                { name: 'Contacto', path: '/contacto' },
                { name: 'Login', path: '/login' }
            ],
            icono: { posicion: 'left' },
            menuIcon: 'HiMenuAlt1',
            backgroundColor: '#333',
            
            textColorLateralNavbar: 'white',
            textColorCentralNavbar: 'white',
            textColor: 'white',
            iconColor: 'white'
        },
        imagenesCarrousel: [],
        productos: [],
        categorias: [],
        paginaInicio: {
            backgroundColor: '#ffffff',
            mensajeBienvenida: '',
            mensajeInstitucional: '',
            mensajeInformativo: '',
            productoEjemplo: {
                nombre: '',
                descripcion: '',
                precio: '',
                imagen: ''
            },
        },
        contacto: [],
        footer: [],
        imagenesParallax: [],
        textosParallax: [{
            texto: '',
            subtexto: '',
            fontFamily: 'Arial, sans-serif',
            colorTexto: '#000000',
            colorSubtexto: '#000000',
            backdropFilter: 'blur(10px)',
        }],
        parallax:{
            posicionTextoParallax:'center',

        },

        tituloPagina: '',
        texto1: '',
        subtexto1: '',
        fontFamily: 'Arial, sans-serif',
        colorTexto: '#000000',
        colorTitulo: '#000000',
        colorSubtitulo: '#000000',
        colorSubtexto: '#000000',
        imagen: ''
    });

    const [simulatorSize, setSimulatorSize] = useState('mobile');
    const [isNavBarVisible, setIsNavBarVisible] = useState(true);
    const [selectedIcon, setSelectedIcon] = useState('HiMenuAlt1');
    const [backgroundColor, setBackgroundColor] = useState(contenido?.navbar.backgroundColor || '#333');
    const [textColor, setTextColor] = useState(contenido?.navbar.textColor || 'white');
    const [iconColor, setIconColor] = useState(contenido?.navbar.iconColor || 'white');
    const [selectedComponent, setSelectedComponent] = useState('EditorContenido');

    // const [selectedSize, setSelectedSize] = useState('mobile');

    const handleComponentChange = (component) => {
        setSelectedComponent(component);
    };


    const toggleNavBar = () => {
        setIsNavBarVisible(!isNavBarVisible);
    };

    const icons = {
        HiMenuAlt1: <HiMenuAlt1 style={{ color: iconColor }} />,
        HiMenuAlt2: <HiMenuAlt2 style={{ color: iconColor }} />,
        HiMenuAlt3: <HiMenuAlt3 style={{ color: iconColor }} />,
        HiMenuAlt4: <HiMenuAlt4 style={{ color: iconColor }} />
    };

    const addParallaxImage = (image) => {
        setContenido(prevState => ({
            ...prevState,
            imagenesParallax: [...prevState.imagenesParallax, image]
        }));
    };

    const removeParallaxImage = (index) => {
        setContenido(prevState => ({
            ...prevState,
            imagenesParallax: prevState.imagenesParallax.filter((_, i) => i !== index)
        }));
    };

    const editParallaxImage = (index, newImage) => {
        setContenido(prevState => ({
            ...prevState,
            imagenesParallax: prevState.imagenesParallax.map((img, i) => i === index ? newImage : img)
        }));
    };

    const addParallaxText = (text) => {
        setContenido(prevState => ({
            ...prevState,
            textosParallax: [...prevState.textosParallax, text]
        }));
    };

    const removeParallaxText = (index) => {
        setContenido(prevState => ({
            ...prevState,
            textosParallax: prevState.textosParallax.filter((_, i) => i !== index)
        }));
    };

    const editParallaxText = (index, newText) => {
        setContenido(prevState => ({
            ...prevState,
            textosParallax: prevState.textosParallax.map((txt, i) => i === index ? newText : txt)
        }));
    };

    return (
        <ContenidoEcommerceContext.Provider value={{
            contenido,
            setContenido,
            setSimulatorSize,
            simulatorSize,
            isNavBarVisible,
            setIsNavBarVisible,
            toggleNavBar,
            icons,
            selectedIcon,
            setSelectedIcon,
            backgroundColor,
            setBackgroundColor,
            textColor,
            setTextColor,
            iconColor,
            setIconColor,
            selectedComponent,
            setSelectedComponent,
            handleComponentChange,
            addParallaxImage,
            removeParallaxImage,
            editParallaxImage,
            addParallaxText,
            removeParallaxText,
            editParallaxText,
        }}>
            {children}
        </ContenidoEcommerceContext.Provider>
    );
};
"use client";
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { auth, baseDeDatos } from '../config/FireBaseConfig';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import styles from './contextStyle.module.css'

const AuthUserContext = createContext();

export const AuthUserProvider = ({ children }) => {

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
        parallax: {
            posicionTextoParallax: 'center',

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

    const [ecommerceAdmin, setEcommerceAdmin] = useState(false);
    const [userID, setUserID] = useState(null);
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const router = useRouter();

    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setUser(auth.currentUser);

            const user = auth.currentUser;

            console.log('user login auth user:', user.uid);

            const response = await fetch('/api/get-spazio', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'uid': user.uid // Enviar el UID en el encabezado
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }
            const data = await response.json();
            console.log('Datos obtenidos:', data);

            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido de nuevo!',
                text: 'Has ingresado exitosamente a tu Spazio.',
                customClass: {
                    popup: styles.swalPopup,
                    confirmButton: styles.swalConfirmButton,
                },
                iconColor: '#c6bbb9'
            });

            setContenido(data.contenido)


            if (data.userData && data.userData.brandName) {
                router.push(`/${data.userData.tipoSpazio}/${data.userData.brandName}/src/app/`);
            }
            // Obtener datos de /api/crear-spazio
            // const responseCrear = await fetch('/api/crear-spazio', {
            //     method: 'GET',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            // });

            // if (!responseCrear.ok) {
            //     throw new Error('Error al obtener los datos de crear-spazio');
            // }

            // const dataCrear = await responseCrear.json();
            // console.log('dataCrear:', dataCrear);

            // // Obtener datos de /api/finalizar-spazio
            // // const responseFinalizar = await fetch('/api/finalizar-spazio', {
            // //     method: 'GET',
            // //     headers: {
            // //         'Content-Type': 'application/json',
            // //     },r
            // // });

            // const response = await fetch('/api/save-spazio', {
            //     method: 'GET',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'uid': user.uid // Enviar el UID en el encabezado
            //     }
            // })

            // if (!response.ok) {
            //     throw new Error('Error al obtener los datos de finalizar-spazio');
            // }

            // const dataFinalizar = await response.json();
            // console.log('dataFinalizar:', dataFinalizar);

            // // Combinar los datos obtenidos y guardarlos en el contexto
            // const combinedData = {
            //     ...dataCrear.userData,
            //     ...dataFinalizar
            // };

            // console.log('combinedData:', combinedData);
            // setContenido(prevState => ({
            //     ...prevState,
            //     ...combinedData
            // }));



            // router.push(`/${combinedData.tipoSpazio}/${combinedData.brandName}/`);
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUserID(null);
            setEcommerceAdmin(false);
            setUser(null);
            router.push('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {

            if (currentUser) {
                setUser(currentUser);
                const fetchData = async () => {
                    if (auth.currentUser) {
                        const uid = auth.currentUser.uid;
                        setUserID(uid);
                        let userDocRef, userDoc;

                        userDocRef = doc(baseDeDatos, "users", uid);
                        userDoc = await getDoc(userDocRef);
                        if (userDoc.exists()) {

                            console.log("DATA DEL USER", userDoc.data());
                            setUserData(userDoc.data());
                        }
                    }
                };

                fetchData();
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);


console.log("USER DATAA::::::::::::::::::", userData)


    return (
        <AuthUserContext.Provider value={{
            user,
            userID,
            userData,
            login,
            logout,
            contenido,
            setContenido,
            ecommerceAdmin, 
            setEcommerceAdmin,
            setUser,
            setUserID,
        }}>
            {children}
        </AuthUserContext.Provider>
    );
};

export const useAuthEcommerce = () => useContext(AuthUserContext);
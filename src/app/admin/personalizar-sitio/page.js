"use client"

import React, { useContext, useRef, useState } from 'react';
import { ContenidoEcommerceContext } from '../../../context/ContenidoEcommerceContext';
import styles from './personalizarSitio.module.css';
import { HiMenuAlt1, HiMenuAlt2, HiMenuAlt3, HiMenuAlt4 } from 'react-icons/hi';
import { Skeleton, SwipeableDrawer } from '@mui/material';

const VistaPreviaCSS = () => {
    const contenidoContext = useContext(ContenidoEcommerceContext);

    const { contenido, simulatorSize, iconColor, handleComponentChange } = contenidoContext || {};
    const [editableSection, setEditableSection] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const containerRef = useRef(null);

    const handleMenuToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleMouseEnter = (section) => {
        setEditableSection(section);
    };

    const handleMouseLeave = () => {
        setEditableSection(null);
    };

    const icons = {
        HiMenuAlt1: <HiMenuAlt1 color={contenido?.navbar?.iconColor} />,
        HiMenuAlt2: <HiMenuAlt2 color={contenido?.navbar?.iconColor} />,
        HiMenuAlt3: <HiMenuAlt3 color={contenido?.navbar?.iconColor} />,
        HiMenuAlt4: <HiMenuAlt4 color={contenido?.navbar?.iconColor} />
    };

    const headerStyle = {
        justifyContent: contenido?.encabezado?.posicion,
        background: contenido?.encabezado?.backgroundColor,
        color: contenido?.encabezado?.textColor
    };
    const logoStyle = {
        order: contenido?.encabezado?.logo?.posicion === 'left' ? 1 : contenido?.encabezado?.logo?.posicion === 'center' ? 2 : 3
    };

    const iconStyle = {
        order: contenido?.navbar?.icono?.posicion === 'left' ? 1 : contenido?.navbar?.icono?.posicion === 'center' ? 2 : 3
    };

    return (
        <div className={styles.previewContainer} ref={containerRef} style={{
            fontFamily: contenido?.fontFamily,
            backgroundColor: contenido?.paginaInicio?.backgroundColor,
            color: contenido?.colorTexto

        }}>
                  {/* Encabezado */}
                  <header
                style={{ ...headerStyle, border: editableSection === 'header' ? '2px dashed blue' : 'none' }}
                className={styles.header}
                onMouseEnter={() => handleMouseEnter('header')}
                onMouseLeave={handleMouseLeave}
            >
                {editableSection === 'header' && <button className={styles.editText} onClick={() => handleComponentChange('EditorContenido')}>EDITAR</button>}

                {simulatorSize === 'mobile' && contenido?.encabezado?.mostrarIconos && (
                    <button className={styles.menuButton} color={iconColor} onClick={handleMenuToggle} style={iconStyle}>
                        {icons[contenido?.navbar?.menuIcon]}
                    </button>
                )}

                {contenido?.encabezado?.mostrarTexto && (
                    <h1 className={styles.nombreMarca}>{contenido?.encabezado?.nombreMarca || 'Nombre de la marca'}</h1>
                )}

                {contenido?.encabezado?.mostrarImagen && (
                    contenido?.encabezado?.logo?.img === '' ?
                        <Skeleton sx={{ backgroundColor: 'grey' }} variant="rectangular" width={100} height={50} />
                        :
                        <img src={contenido?.encabezado?.logo?.img} width={simulatorSize === 'mobile' ? 100 : simulatorSize === 'desktop' ? 160 : 80} height={ simulatorSize === 'mobile' ? 50 : simulatorSize === 'desktop' ? 100 : 80} alt="Logo" className={`${styles.logo}`} style={logoStyle} />
                )}

                <SwipeableDrawer
                    anchor="left"
                    open={drawerOpen}
                    onClose={handleMenuToggle}
                    onMouseEnter={() => handleMouseEnter('navbar-mobile')}
                    onOpen={handleMenuToggle}
                    container={containerRef.current}
                    PaperProps={{
                        sx: {
                            border: editableSection === 'navbar-mobile' ? '2px dashed blue' : 'none', backgroundColor: contenido?.navbar?.backgroundColor, textAlign: 'left'
                        }
                    }}
                >
                    {editableSection === 'navbar-mobile' && <button className={styles.editText} onClick={() => handleComponentChange('NavbarAdmin')}>EDITAR</button>}

                    <div className={styles.drawerContent}>
                        <button className={styles.menuButton} onClick={handleMenuToggle} style={{ color: contenido?.navbar?.iconColor }}>
                            {icons[contenido?.navbar?.menuIcon]}
                        </button>
                        {contenido?.navbar?.links?.map((link, index) => (
                            <a key={index} href={link.path} className={styles.drawerLink} style={{ color: contenido?.navbar?.textColor }}>
                                {link.name}
                            </a>
                        ))}
                    </div>
                </SwipeableDrawer>
            </header>

            
            {/* Navbar */}
            {simulatorSize !== 'mobile' && (
                <nav style={{ border: editableSection === 'navbar' ? '2px dashed blue' : 'none', background: contenido?.navbar?.backgroundColor }}
                    className={styles.navbarDesktop}
                    onMouseEnter={() => handleMouseEnter('navbar')}
                    onMouseLeave={handleMouseLeave}
                >
                    {editableSection === 'navbar' && <button className={styles.editText} onClick={() => handleComponentChange('NavbarAdmin')}>EDITAR</button>}

                    {contenido?.navbar?.links?.map((link, index) => (
                        <div key={index}>
                            <a href={link.path} style={{ color: contenido?.navbar?.textColor }}>{link.name}</a>
                        </div>
                    ))}

                </nav>
            )}

            {/* Parallax */}
            <section
                className={styles.parallaxSection}
                onMouseEnter={() => handleMouseEnter('parallax')}
                onMouseLeave={handleMouseLeave}
                style={{ border: editableSection === 'parallax' ? '2px dashed blue' : 'none', backgroundColor: contenido?.paginaInicio?.backgroundColor }}
            >
                {editableSection === 'parallax' && <button className={styles.editText} onClick={() => handleComponentChange('CarouselEditor')}>EDITAR</button>}
                {/* <ParallaxComponent /> */}
            </section>


            {/* Mensaje de bienvenida */}
            <section
                className={styles.welcomeMessage}
                onMouseEnter={() => handleMouseEnter('welcomeMessage')}
                onMouseLeave={handleMouseLeave}
                style={{ border: editableSection === 'welcomeMessage' ? '2px dashed blue' : 'none', backgroundColor: contenido?.paginaInicio?.backgroundColor,}}
            >
                {editableSection === 'welcomeMessage' &&<button className={styles.editText} onClick={() => handleComponentChange('EditorContenido')}>EDITAR</button>}
                {contenido?.tituloPagina === '' && <span>Titulo que deseas poner en el inicio de tu pagina </span>}
                <h2>{contenido?.tituloPagina}</h2>
                {contenido?.paginaInicio?.mensajeBienvenida === '' && <span>Aca podrías agregar un mensaje de bienvenida a tus clientes, contando un poco de informacion</span>}
                <p>{contenido?.paginaInicio?.mensajeBienvenida}</p>
            </section>

            {/* Carrousel */}
            <section
                className={styles.carousel}
                onMouseEnter={() => handleMouseEnter('carousel')}
                onMouseLeave={handleMouseLeave}
                style={{border: editableSection === 'carousel' ? '2px dashed blue' : 'none', backgroundColor: contenido?.paginaInicio?.backgroundColor,}}
            >
                {editableSection === 'carousel' && <button className={styles.editText} onClick={() => handleComponentChange('CarouselEditor')}>EDITAR</button>}
                {/* <h3>Carousel</h3> */}
                {contenido?.imagenesCarrousel?.length === 0 && <span>Imagenes que deseas mostrar en tu carrousel</span>}
                <div className={styles.carouselImages}>
                 
                </div>
            </section>

            {/* Productos */}
            <section
                className={styles.products}
                onMouseEnter={() => handleMouseEnter('products')}
                onMouseLeave={handleMouseLeave}
                style={{border: editableSection === 'products' ? '2px dashed blue' : 'none',  backgroundColor: contenido?.paginaInicio?.backgroundColor,}}
            >
                {editableSection === 'products' && <button className={styles.editText} onClick={() => handleComponentChange('ProductoForm')}>EDITAR</button>}
                <h3>Productos</h3>
                <div className={styles.productList}>
                    {contenido?.productos?.length === 0 || (contenido?.productos?.[0]?.nombre === '' && contenido?.productos?.[0]?.imagen === '' && contenido?.productos?.[0]?.descripcion === '' && contenido?.productos?.[0]?.precio === 0) ? (
                        [1, 2, 3, 4].map((_, index) => (
                            <div key={index} className={styles.product}>
                                <Skeleton sx={{ backgroundColor: 'grey' }} variant="rectangular" width={120} height={110} />
                                <h4>Nombre del Producto</h4>
                                <p>Descripción del producto</p>
                                <p>Precio: ${5000 + index * 1000}</p>
                            </div>
                        ))
                    ) : (
                        contenido?.productos?.map((producto, index) => (
                            <div key={index} className={styles.product}>
                                <img src={producto.imagen} alt={`Producto ${index}`} width={210} height={118} />
                                <h4>{producto.nombre}</h4>
                                <p>{producto.descripcion}</p>
                                <p>Precio: ${producto.precio}</p>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Articulos */}
            <section className={styles.newValues}
                onMouseEnter={() => handleMouseEnter('newValues')}
                onMouseLeave={handleMouseLeave}
                style={{ border: editableSection === 'newValues' ? '2px dashed blue' : 'none', backgroundColor: contenido?.paginaInicio?.backgroundColor }}>
                {editableSection === 'newValues' && <button className={styles.editText} onClick={() => handleComponentChange('EditorContenido')}>EDITAR</button>}
                {contenido?.paginaInicio?.mensajeInformativo === '' && (
                    <div>
                        <h5>Mensaje Informativo</h5>
                        <p>Aca podrías agregar un mensaje informativo sobre tu empresa, promociones, descuentos y demas</p>
                    </div>
                )}
                <p>{contenido?.paginaInicio?.mensajeInformativo}</p>
            </section>

            {/* Categorías */}
            <section 
                className={styles.categories} 
                onMouseEnter={() => handleMouseEnter('categories')} 
                onMouseLeave={handleMouseLeave} 
                style={{ border: editableSection === 'categories' ? '2px dashed blue' : 'none', backgroundColor: contenido?.paginaInicio?.backgroundColor }}
            >
                {editableSection === 'categories' && <button className={styles.editText} onClick={() => handleComponentChange('CategoryForm')}>EDITAR</button>}
                <h3>Categorías</h3>
                <div className={styles.categoryList}>
                    {/* <Swiper spaceBetween={5} slidesPerView={2} loop={true}
                        autoplay={{
                            delay: 2000,
                            disableOnInteraction: false,
                        }}
                        modules={[Autoplay]}>
                        {contenido?.categorias?.length === 0 || (contenido?.categorias?.[0]?.nombre === '' && contenido?.categorias?.[0]?.imagen === '' && contenido?.categorias?.[0]?.descripcion === '' && contenido?.categorias?.[0]?.ruta === '') ? (
                            [1, 2, 3, 4].map((_, index) => (
                                <SwiperSlide key={index} className={styles.category}>
                                    <Skeleton sx={{ backgroundColor: 'grey' }} variant="rectangular" width={125} height={110} />
                                    <h4>Categoría {index}</h4>
                                </SwiperSlide>
                            ))
                        ) : (
                            contenido?.categorias?.map((categoria, index) => (
                                <SwiperSlide key={index} className={styles.category}>
                                    <img src={categoria.imagen} alt={categoria.nombre} />
                                    <h4>{categoria.nombre}</h4>
                                    <p>{categoria.descripcion}</p>
                                </SwiperSlide>
                            ))
                        )}
                    </Swiper> */}
                </div>
            </section>

        {/* Mensaje institucional */}
        <section
                className={styles.institutionalMessage}
                onMouseEnter={() => handleMouseEnter('institutionalMessage')}
                onMouseLeave={handleMouseLeave}
                style={{ border: editableSection === 'institutionalMessage' ? '2px dashed blue' : 'none', backgroundColor: contenido?.paginaInicio?.backgroundColor }}
            >
                {editableSection === 'institutionalMessage' && <button className={styles.editText} onClick={() => handleComponentChange('EditorContenido')}>EDITAR</button>}
                {contenido?.paginaInicio?.mensajeInstitucional === '' && (
                    <div>
                        <h5>Mensaje institucional</h5>
                        <p>Aca podrías agregar un mensaje institucional de tu empresa</p>
                    </div>
                )}
                <h3>{contenido?.paginaInicio?.mensajeInstitucional}</h3>
            </section>


            {/* Ejemplo de producto */}
            <section
                className={styles.productExample}
                onMouseEnter={() => handleMouseEnter('productExample')}
                onMouseLeave={handleMouseLeave}
                style={{backgroundColor: contenido?.paginaInicio?.backgroundColor,}}
            >
                {editableSection === 'productExample' && <button className={styles.editText} onClick={() => handleComponentChange('ProductoForm')}>EDITAR</button>}
                <h3>Ejemplo de Producto</h3>
                {contenido?.paginaInicio?.productoEjemplo && (contenido?.paginaInicio?.productoEjemplo?.nombre === '' && contenido?.paginaInicio?.productoEjemplo?.imagen === '' && contenido?.paginaInicio?.productoEjemplo?.descripcion === '' && contenido?.paginaInicio?.productoEjemplo?.precio === '') ? (
                    <div className={styles.product}>
                        <Skeleton variant="rectangular" width={210} height={118} />
                        <h4>Nombre del Producto</h4>
                        <p>Descripción del producto</p>
                        <p>Precio: $0</p>
                    </div>
                ) : (
                    <div className={styles.product}>
                        <img src={contenido?.paginaInicio?.productoEjemplo?.imagen} alt={contenido?.paginaInicio?.productoEjemplo?.nombre} />
                        <h4>{contenido?.paginaInicio?.productoEjemplo?.nombre}</h4>
                        <p>{contenido?.paginaInicio?.productoEjemplo?.descripcion}</p>
                        <p>{contenido?.paginaInicio?.productoEjemplo?.precio}</p>
                    </div>
                )}
            </section>

            {/* Información de contacto */}
            <section
                className={styles.contactInfo}
                onMouseEnter={() => handleMouseEnter('contactInfo')}
                onMouseLeave={handleMouseLeave}
                style={{ border: editableSection === 'contactInfo' ? '2px dashed blue' : 'none', backgroundColor: contenido?.paginaInicio?.backgroundColor }}
            >
                {editableSection === 'contactInfo' && <button className={styles.editText} onClick={() => handleComponentChange('EditorContenido')}>EDITAR</button>}
                <h3>Contacto</h3>
                <p>{contenido?.paginaInicio?.contacto}</p>
            </section>

            {/* Nuevos valores */}
            {/* <section className={styles.newValues}>
                <p>{contenido?.texto1}</p>
                <p>{contenido?.texto2}</p>
                <p>{contenido?.texto3}</p>
                <p>{contenido?.subtexto1}</p>
                <p>{contenido?.subtexto2}</p>
                <p>{contenido?.subtexto3}</p>
                <Skeleton sx={{ backgroundColor: 'grey' }} width={200} height={150} src={contenido?.imagen} alt="Imagen adicional" />
            </section> */}

            {/* Footer */}
            <footer
                className={styles.footer}
                onMouseEnter={() => handleMouseEnter('footer')}
                onMouseLeave={handleMouseLeave}
            >
                {editableSection === 'footer' && <span className={styles.editText}>EDITAR</span>}
                <p>{contenido?.paginaInicio?.footer}</p>
                {/* <Footer /> */}
            </footer>
        </div>
    );
};

export default VistaPreviaCSS;
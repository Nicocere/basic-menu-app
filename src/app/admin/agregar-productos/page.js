'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/config/supabaseClient';
import styles from './agregarProductos.module.css';
import { FaPizzaSlice, FaHamburger, FaBeer, FaCoffee, FaCookie, FaIceCream } from 'react-icons/fa';
import { GiNoodles, GiFrenchFries, GiWineGlass } from 'react-icons/gi';
import Swal from 'sweetalert2';

const CATEGORIAS = {
  comidas: {
    nombre: "Comidas",
    subcategorias: ["pizzas", "empanadas", "menu_cena"],
    iconos: [<FaPizzaSlice key="1" />, <GiNoodles key="2" />, <GiFrenchFries key="3" />]
  },
  bebidas: {
    nombre: "Bebidas",
    subcategorias: ["con_alcohol", "sin_alcohol"],
    iconos: [<FaBeer key="1" />, <GiWineGlass key="2" />, <FaCoffee key="3" />]
  },
  desayunos_y_meriendas: {
    nombre: "Desayunos y Meriendas",
    subcategorias: ["salado", "dulce"],
    iconos: [<FaHamburger key="1" />, <FaCookie key="2" />, <FaCoffee key="3" />]
  },
  postres: {
    nombre: "Postres",
    subcategorias: ["helados", "tortas", "otros"],
    iconos: [<FaIceCream key="1" />, <FaCookie key="2" />, <FaCoffee key="3" />]
  }
};

export default function ProductForm({ producto, isEditing }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    subcategoria: '',
    icono: '',
    img: '',
    createdAt: null
  });
  
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    if (producto) {
      setFormData({
        ...producto,
        precio: producto.precio.toString(),
        createdAt: producto.createdAt || null
      });
    }
  }, [producto]);

  useEffect(() => {
    const fetchProductos = async () => {
      const { data, error } = await supabase
        .from('productos')
        .select('*');

      if (error) {
        console.error('Error fetching productos:', error);
      } else {
        setProductos(data);
      }
    };

    fetchProductos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.img;
      
      if (imageFile) {
        const fileName = formData.nombre
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove accents
          .replace(/\s+/g, '_') // Replace spaces with underscores
          .replace(/[^\w\-]+/g, ''); // Remove all non-word characters
        const { data, error } = await supabase.storage
          .from('productos')
          .upload(`public/${fileName}`, imageFile);
  
        if (error) {
          throw error;
        }

        const { data: publicURLData, error: publicURLError } = supabase.storage
          .from('productos')
          .getPublicUrl(`public/${fileName}`);

        if (publicURLError) {
          throw publicURLError;
        }

        console.log('publicURLData:', publicURLData);
        console.log('publicURLData.publicUrl:', publicURLData.publicUrl);

        imageUrl = publicURLData.publicUrl;
      }
  
      const productoData = {
        ...formData,
        precio: Number(formData.precio),
        createdAt: new Date(),
        icono: selectedIcon,
        img: imageUrl
      };
  
      if (isEditing) {
        const { error } = await supabase
          .from('productos')
          .update(productoData)
          .eq('id', producto.id);
  
        if (error) {
          throw error;
        }
      } else {
        const { error } = await supabase
          .from('productos')
          .insert([productoData]);
  
        if (error) {
          throw error;
        }
      }
      Swal.fire(isEditing ? 'Producto actualizado!' : 'Producto agregado!');
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Hubo un error', '', 'error');
    }
  };

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="categoria">Categoría</label>
        <select
          id="categoria"
          className={styles.select}
          value={formData.categoria}
          onChange={(e) => {
            setFormData({
              ...formData,
              categoria: e.target.value,
              subcategoria: ''
            });
            setSelectedIcon(null);
          }}
        >
          <option value="">Seleccione una categoría</option>
          {Object.keys(CATEGORIAS).map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORIAS[cat].nombre}
            </option>
          ))}
        </select>

        {formData.categoria && (
          <>
            <label htmlFor="subcategoria">Subcategoría</label>
            <select
              id="subcategoria"
              className={styles.select}
              value={formData.subcategoria}
              onChange={(e) => setFormData({ ...formData, subcategoria: e.target.value })}
            >
              <option value="">Seleccione una subcategoría</option>
              {CATEGORIAS[formData.categoria].subcategorias.map((sub) => (
                <option key={sub} value={sub}>
                  {sub.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </>
        )}

        {formData.categoria && (
          <div className={styles.iconContainer}>
            {CATEGORIAS[formData.categoria].iconos.map((icono, index) => (
              <button
                key={index}
                type="button"
                className={`${styles.iconButton} ${selectedIcon === index ? styles.selected : ''}`}
                onClick={() => setSelectedIcon(index)}
              >
                {icono}
              </button>
            ))}
          </div>
        )}

        <input
          className={styles.input}
          type="text"
          placeholder="Nombre del producto"
          value={formData.nombre}
          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
        />

        <textarea
          className={styles.textarea}
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
        />

        <input
          className={styles.input}
          type="number"
          placeholder="Precio"
          value={formData.precio}
          onChange={(e) => setFormData({...formData, precio: e.target.value})}
        />

        <input
          className={styles.fileInput}
          type="file"
          title="Seleccione una imagen"
          onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
        />

        <button className={styles.button} type="submit">
          {isEditing ? 'Actualizar Producto' : 'Agregar Producto'}
        </button>
      </form>

      <div className={styles.productList}>
        <h2>Lista de Productos</h2>
        <ul>
          {productos.map((producto) => (
            <li key={producto.id}>
              <h3>{producto.nombre}</h3>
              <p>{producto.descripcion}</p>
              <p>Precio: ${producto.precio}</p>
              <img src={producto.img} alt={producto.nombre} width="100" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
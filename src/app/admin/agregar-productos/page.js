'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/config/supabaseClient';
import styles from './agregarProductos.module.css';
import { FaTrash, FaEdit } from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function ProductForm() {
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
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const formRef = useRef(null);

  const filteredProducts = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (productos) {
      setFormData({
        ...productos,
        precio: productos.precio,
        createdAt: productos.createdAt || null
      });
    }
  }, [productos]);

  useEffect(() => {
    const fetchCategorias = async () => {
      const { data: categoriasData, error: categoriasError } = await supabase
        .from('categorias')
        .select('*');

      if (categoriasError) {
        console.error('Error fetching categorias:', categoriasError);
      } else {
        setCategorias(categoriasData);
      }
    };

    const fetchSubcategorias = async () => {
      const { data: subcategoriasData, error: subcategoriasError } = await supabase
        .from('subcategorias')
        .select('*');

      if (subcategoriasError) {
        console.error('Error fetching subcategorias:', subcategoriasError);
      } else {
        setSubcategorias(subcategoriasData);
      }
    };

    fetchCategorias();
    fetchSubcategorias();
  }, []);

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
  }, [filteredProducts]);

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
        const { error } = await supabase.storage
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

      if (editingProduct) {
        const { error } = await supabase
          .from('productos')
          .update(productoData)
          .eq('id', editingProduct.id);

        if (error) {
          throw error;
        }
        setEditingProduct(null);
      } else {
        const { error } = await supabase
          .from('productos')
          .insert([productoData]);

        if (error) {
          throw error;
        }
      }
      Swal.fire(editingProduct ? 'Producto actualizado!' : 'Producto agregado!');
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Hubo un error', '', 'error');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', productId);

      if (error) {
        throw error;
      }

      setProductos(productos.filter(producto => producto.id !== productId));
      Swal.fire('Producto eliminado', 'El producto ha sido eliminado exitosamente.', 'success');
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Hubo un error', '', 'error');
    }
  };

  const handleEditProduct = (producto) => {
    setFormData({
      ...producto,
      precio: producto.precio.toString(),
      createdAt: producto.createdAt || null
    });
    setEditingProduct(producto);
    formRef.current.scrollIntoView({ behavior: 'smooth' });
  };



  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit} ref={formRef}>
        <h2>{editingProduct ? 'Editar Producto' : 'Agregar Producto'}</h2>
        <p className={styles.infoText}>
          Complete el formulario a continuación para {editingProduct ? 'editar' : 'agregar'} un producto. Asegúrese de proporcionar toda la información necesaria.
        </p>
        
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
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
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
              {subcategorias
                .filter(sub => sub.categoria_id === formData.categoria)
                .map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.nombre}
                  </option>
                ))}
            </select>
          </>
        )}

        <label htmlFor="nombre">Nombre del producto</label>
        <input
          id="nombre"
          className={styles.input}
          type="text"
          placeholder="Nombre del producto"
          value={formData.nombre}
          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
        />

        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          className={styles.textarea}
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
        />

        <label htmlFor="precio">Precio</label>
        <input
          id="precio"
          className={styles.input}
          type="number"
          placeholder="Precio"
          value={formData.precio}
          onChange={(e) => setFormData({...formData, precio: e.target.value})}
        />

        <label htmlFor="img">Imagen del producto</label>
        <input
          id="img"
          className={styles.fileInput}
          type="file"
          title="Seleccione una imagen"
          onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
        />

        <button className={styles.button} type="submit">
          {editingProduct ? 'Actualizar Producto' : 'Agregar Producto'}
        </button>
      </form>

      <div className={styles.productList}>
        <h2>Lista de Productos</h2>
        <p className={styles.infoText}>
          A continuación se muestra la lista de productos disponibles. Puede editar o eliminar productos según sea necesario.
        </p>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul>
          {filteredProducts.map((producto) => (
            <li key={producto.id} className={styles.productItem}>
              <div className={styles.productDetails}>
                <h3>{producto.nombre}</h3>
                <p>{producto.descripcion}</p>
                <p>Precio: ${producto.precio}</p>
                <img src={producto.img} alt={producto.nombre} width="100" />
              </div>
              <div className={styles.actionButtons}>
                <button
                  className={styles.editButton}
                  onClick={() => handleEditProduct(producto)}
                >
                  <FaEdit />
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteProduct(producto.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
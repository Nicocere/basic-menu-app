'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/config/supabaseClient';
import styles from './crearEditarCategorias.module.css';

const CrearEditarCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [subcategoria, setSubcategoria] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      const { data, error } = await supabase
        .from('categorias')
        .select('*');

      if (error) {
        console.error('Error fetching categorias:', error);
      } else {
        setCategorias(data);
      }
    };

    fetchCategorias();
  }, []);

  const handleAddCategoria = async () => {
    if (categoria.trim() === '') return;

    console.log("categoria", categoria);
    const { data, error } = await supabase
      .from('categorias')
      .insert([{ nombre: categoria }]);

    console.log("data", data);
    if (error) {
      console.error('Error adding categoria:', error);
    } else {
      setCategorias([...categorias, data]);
      setCategoria('');
    }
  };

  const handleAddSubcategoria = async () => {
    if (subcategoria.trim() === '' || !selectedCategoria) return;

    const { data, error } = await supabase
      .from('subcategorias')
      .insert([{ nombre: subcategoria, categoria_id: selectedCategoria.id }]);

    if (error) {
      console.error('Error adding subcategoria:', error);
    } else {
      setSubcategorias([...subcategorias, data]);
      setSubcategoria('');
    }
  };

  const handleSelectCategoria = async (categoria) => {
    setSelectedCategoria(categoria);

    const { data, error } = await supabase
      .from('subcategorias')
      .select('*')
      .eq('categoria_id', categoria.id);

    if (error) {
      console.error('Error fetching subcategorias:', error);
    } else {
      setSubcategorias(data);
    }
  };


  

  return (
    <div className={styles.container}>
      <h1>Crear/Editar Categorías y Subcategorías</h1>

      <div className={styles.section}>
        <h2>Categorías</h2>
        <input
          type="text"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          placeholder="Nueva Categoría"
          className={styles.input}
        />
        <button onClick={handleAddCategoria} className={styles.button}>Agregar Categoría</button>
        <div className={styles.divList}>

          <h3>Categorías Existentes</h3>
          <ul className={styles.list}>
            {
              categorias.length > 0 ? categorias.map((cat) => (
                <li key={cat?.id} onClick={() => handleSelectCategoria(cat)} className={styles.listItem}>
                  {cat?.nombre}
                </li>
              )) : <li className={styles.listItem}>No hay categorías aún</li>
            }
          </ul>
        </div>
      </div>

      {selectedCategoria && (
        <div className={styles.section}>
          <h2>Subcategorías de {selectedCategoria.nombre}</h2>
          <input
            type="text"
            value={subcategoria}
            onChange={(e) => setSubcategoria(e.target.value)}
            placeholder="Nueva Subcategoría"
            className={styles.input}
          />
          <button onClick={handleAddSubcategoria} className={styles.button}>Agregar Subcategoría</button>
          <div className={styles.divList}>
            <h3>Subcategorías Existentes</h3>
            <ul className={styles.list}>
              {
                subcategoria.length > 0 ? subcategorias.map((subcat) => (
                  <li key={subcat.id} className={styles.listItem}>
                    {subcat.nombre}
                  </li>
                )) : <li className={styles.listItem}>No hay subcategorías aún</li>

              }
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrearEditarCategorias;
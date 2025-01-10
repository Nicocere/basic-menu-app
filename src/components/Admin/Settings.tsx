import React from 'react';
import styles from './Settings.module.css';

const Settings: React.FC = () => {
    return (
        <div className={styles.settings}>
            <h2>Configuraciones</h2>
            <p>Aquí puedes configurar los ajustes del sitio.</p>
        </div>
    );
};

export default Settings;
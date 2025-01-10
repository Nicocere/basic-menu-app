import React, { useState } from 'react';
import styles from '../../styles/components/Client/Contact.module.css';
import Input from '../UI/Input';
import Button from '../UI/Button';

const Contact = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí se puede agregar la lógica para enviar el formulario
        setSubmitted(true);
    };

    return (
        <div className={styles.contactContainer}>
            <h2>Contacto</h2>
            {submitted ? (
                <p>Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <Input
                        type="text"
                        placeholder="Tu nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                        type="email"
                        placeholder="Tu correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <textarea
                        placeholder="Tu mensaje"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className={styles.textarea}
                    />
                    <Button type="submit">Enviar</Button>
                </form>
            )}
        </div>
    );
};

export default Contact;
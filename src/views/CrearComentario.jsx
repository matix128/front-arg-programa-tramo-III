import React, { useState } from 'react';
import axios from 'axios';

const CrearComentario = ({ postId, onComentarioCreado }) => {
    const [nuevoComentario, setNuevoComentario] = useState('');

    const handleComentarioChange = (event) => {
        setNuevoComentario(event.target.value);
    };

    const enviarComentario = async () => {
        try {
            const respuesta = await axios.post('http://localhost:3000/comentario', {
                contenido: nuevoComentario,
                postId: postId,
            });

            console.log('Comentario creado:', respuesta.data);

            setNuevoComentario('');

            // Llamar a la función proporcionada por el componente padre para actualizar la lista de comentarios
            onComentarioCreado();
        } catch (error) {
            console.error('Error al crear comentario:', error);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Escribe tu comentario..."
                value={nuevoComentario}
                onChange={handleComentarioChange}
            />
            <button onClick={enviarComentario}>Crear Comentario</button>
        </div>
    );
};

export default CrearComentario;
import { useState, useEffect } from 'react';
import { Card, Button, FloatingLabel, Form } from 'react-bootstrap';
import { useParams } from "react-router-dom";
import axios from 'axios';

import { useAuthContext } from '../context/AuthContext';

import {
    traerDatosDePosteoPorID,
    traerComentariosDePosteoPorID,
} from './../utils/llamados.js';


const Ver = () => {

    
    const { id } = useParams();

   
    const [titulo, setTitulo] = useState('');
    const [imageURL, setimageURL] = useState('');
 
    const [descripcion, setDescripcion] = useState('');
    
    const [comentarios, setComentarios] = useState([]);
    const [miComentario, setMiComentario] = useState('');
    const [comentarioEditando, setComentarioEditando] = useState(null);
    const [loading, setLoading] = useState(false);

    const { token,usuario} = useAuthContext();

    const traerDatos = async () => {
        
        const respuesta = await traerDatosDePosteoPorID(id);
        
        if (respuesta) {
            setTitulo(respuesta.titulo);
            setDescripcion(respuesta.descripcion);
            setimageURL(respuesta.imageURL);
           

            await traerComentarios();
        } else {
            console.log('No se encontró una publicación con el id ' + id);
        }
    }

    const traerComentarios = async () => {
        const respuesta = await traerComentariosDePosteoPorID(id);

        if (respuesta) {
            setComentarios(respuesta);
        } else {
            console.log('No se pudo obtener los comentarios de la publicación');
        }
    }

    const enviarComentario = async () => {
        const url = 'http://localhost:3000/comentarios';

        const datos = {
            descripcion: miComentario,
            idPosteo: id,
        }
        
       
        const headers = {
            token: token
        }

        try {
            const respuesta = await axios.post(url, datos, { headers: headers });

            if (respuesta.status === 200) {
                setMiComentario('');

                await traerComentarios();
            } else {
                console.log({ error: 'Ocurrió un error inesperado' });
            }
        } catch (error) {
            console.log({ error: 'Ocurrió un error inesperado' });
        }
    }

    const editarComentario = async (comentarioId, nuevoDescripcion) => {
        try {
            console.log('Intentando editar comentario:', comentarioId, nuevoDescripcion);
            setLoading(true);
    
            const url = `http://localhost:3000/comentarios/${comentarioId}`;
    
            const datos = {
                descripcion: nuevoDescripcion,
            };
    
            const headers = {
                'Content-Type': 'application/json',
                token: token,
            };
    
            const respuesta = await axios.put(url, datos, { headers: headers });
    
            if (respuesta.status === 200) {
                setComentarioEditando(null);
                await traerComentarios();
            } else {
                console.log({ error: 'Ocurrió un error inesperado' });
            }
        } catch (error) {
            console.error('Error al editar comentario:', error);
        } finally {
            setLoading(false);
        }
    };




    const cancelarEdicionComentario = () => {
        setComentarioEditando(null);
    }

    const eliminarComentario = async (comentarioId) => {
  
        try {
            setLoading(true);

            const url = `http://localhost:3000/comentarios/${comentarioId}`;

            const headers = {
                token: token
            }

            const respuesta = await axios.delete(url, { headers: headers });

            if (respuesta.status === 200) {
                await traerComentarios();
            } else {
                console.log({ error: 'Ocurrió un error inesperado' });
            }
        } catch (error) {
            console.error('Error al eliminar comentario:', error);
        } finally {
            setLoading(false);
        }
    }
 
    useEffect(() => {
        traerDatos();
    }, []);

    return (
        <Card.Body>
            <Card>
                <Card.Body>
                    <Card.Title>{ <h1 >{ titulo }</h1> }</Card.Title>
                    <Card.Text>
                        { descripcion }
                        <br />
                        <img src={imageURL} alt="Imagen de Usuario" width="100%" /> 
                    </Card.Text>
                   
                </Card.Body>
            </Card>

            <br />

            <Card>
                <Card.Body>
                    <Card.Title>Comentarios</Card.Title>
                    <Card.Body>

                    {
                        
                comentarios.map((comentario, key) => (
                    <div key={key}>
                        <Card>
                            <Card.Body>
                                <Card.Title>{comentario.autor.usuario }</Card.Title>
                                {
                                    comentarioEditando === comentario._id ? (
                                        <div>
                                            {/* Formulario para editar comentario */}
                                            <Form.Control
                                            value={comentarioEditando ? comentarioEditando.descripcion : ''}
                                            onChange={(e) => setComentarioEditando({ ...comentarioEditando, descripcion: e.target.value })}
                                            />
                                            <Button variant="success" onClick={() => editarComentario(comentario._id, comentarioEditando.descripcion)}>
                                                Guardar
                                            </Button>
                                            <Button variant="danger" onClick={cancelarEdicionComentario}>
                                                Cancelar
                                            </Button>
                                        </div>
                                    ) : (
                                        <div>
                                            <Card.Text>
                                                {comentario.descripcion}
                                                </Card.Text>
                                                {console.log(comentario.autor._id)}
                                                

                                                {

                                                   //const nuevo= enviarComentario.datos.idPosteo;
                                                   
                                                   usuario.id && (usuario.id   === comentario.autor._id) && (
                                            <>
                                               <Button variant="primary" onClick={() => editarComentario(comentario)}>
                                                Editar Comentario
                                            </Button>
                                            <Button variant="danger" onClick={() => eliminarComentario(comentario._id)}>
                                                Eliminar Comentario
                                            </Button>
                                            </>
                                        )
                                    }


                                        </div>
                                    )
                                }
                            </Card.Body>
                        </Card>
                        <br />
                    </div>
                ))
            }

                        <br />

                        <Card>
                            <Card.Body>
                                <Card.Title>Agregar Comentario</Card.Title>
                                <br />
                                <FloatingLabel controlId="comentario" label="Comentario">
                                    <Form.Control
                                        onInput={(e) => setMiComentario(e.target.value)}
                                        value={miComentario}
                                        as="textarea"
                                      
                                        style={{ height: '100px' }}
                                    />
                                </FloatingLabel>
                                <br />
                                
                                <Button variant="primary" onClick={enviarComentario}>
                                    Agregar
                                </Button>
                            </Card.Body>
                        </Card>

                    </Card.Body>
                </Card.Body>
            </Card>
        </Card.Body>
    );
}




export default Ver;

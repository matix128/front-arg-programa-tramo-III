import { useState } from 'react';

import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const FormularioRegistrarUsuario = () => {
    const [usuario, setUsuario] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [email, setemail] = useState('');
    const [UURL, setUURL] = useState('');
    const [deshabilitarBoton, setDeshabilitarBoton] = useState(false);
    const [errores, setErrores] = useState({});

    const navigate = useNavigate();

    const cambiarUsuario = (e) => {
        setUsuario(e.target.value);
    }

    const cambiarContrasenia = (e) => {
        setContrasenia(e.target.value);
    }

    const cambiaremail = (e) => {
        setemail(e.target.value);
    }

    const cambiarUURL = (e) => {
        setUURL(e.target.value);
    }

    const verificarDatos = async () => {
        let misErrores = {}

        if (usuario.length === 0) {
            misErrores.usuario = 'Debe introducir un usuario.';
        }

        if (contrasenia.length === 0) {
            misErrores.contrasenia = 'Debe introducir una contraseña.';
        }

        if (email.length === 0) {
            misErrores.email = '@ ingrese email.';
        }
        
        if (UURL.length === 0) {
            misErrores.UURL = 'Debe introducir una URL para su avatar.';
        }

        setErrores(misErrores);

        if (Object.entries(misErrores).length === 0) {
            setDeshabilitarBoton(true);

            await mandarDatos();
        }
    }

    const mandarDatos = async () => {
        const url = 'http://localhost:3000/usuario';

        const datos = {
            usuario: usuario,
            contrasenia: contrasenia,
            email: email,
            UURL: UURL,
        }

        try {
            const respuesta = await axios.post(url, datos);

            if (respuesta.status === 200) {
                return navigate('/');
            } else {
                setErrores({ error: 'Ocurrió un error inesperado' });
            }
        } catch (error) {
            setErrores({ error: 'Ocurrió un error inesperado' });
        }

        setDeshabilitarBoton(false);
    }

    return (
        <Form>
            <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                    Usuario
                </Form.Label>
                <Col sm="10">
                    <Form.Control type="text" onInput={cambiarUsuario} />
                    {
                        errores.usuario && (
                            <span style={{ color: 'red' }}>
                                {errores.usuario}
                            </span>
                        )
                    }
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                    Contraseña
                </Form.Label>
                <Col sm="10">
                    <Form.Control type="password" onInput={cambiarContrasenia} />
                    {
                        errores.contrasenia && (
                            <span style={{ color: 'red' }}>
                                {errores.contrasenia}
                            </span>
                        )
                    }
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                Email
                </Form.Label>
                <Col sm="10">
                    <Form.Control type="email" onInput={cambiaremail} />
                    {
                        errores.email && (
                            <span style={{ color: 'red' }}>
                                {errores.email}
                            </span>
                        )
                    }
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                avatarURL
                </Form.Label>
                <Col sm="10">
                    <Form.Control type="text" onInput={cambiarUURL} />
                    {
                        errores.UURL && (
                            <span style={{ color: 'red' }}>
                                {errores.UURL}
                            </span>
                        )
                    }
                </Col>
            </Form.Group>

            {
                errores.error && (
                    <Alert variant="warning">
                        {errores.error}
                    </Alert>
                )
            }

            <Button variant="primary" onClick={verificarDatos} disabled={deshabilitarBoton}>
                Registrar usuario
            </Button>
        </Form>
    );
}

export default FormularioRegistrarUsuario;

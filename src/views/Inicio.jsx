import { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
//import axios from 'axios';

import { useAuthContext } from '../context/AuthContext.jsx';

import TablaDeDatos from './../components/TablaDeDatos.jsx';

const Inicio = () => {
  const [lista, setLista] = useState([]);

  const { usuario } = useAuthContext();

  const cargarLista = async () => {
    const url = 'http://localhost:3000/publicaciones';
    
    //const respuesta = await axios.get(url);
    let respuesta = await fetch(url);

    if (respuesta.status === 200) {
      respuesta = await respuesta.json();

      setLista(respuesta);
    }
  }

  useEffect(() => {
    cargarLista();
  }, []);

  return (
    <Card.Body>
     {usuario ? (
  <>
    <p>Bienvenido {usuario.usuario}</p>{console.log(usuario.id)}
    {
      
      <img src={usuario.UURL} alt="Imagen de Usuario" width="200" />
    }
  </>
) : (
  <p>No se inició sesión</p>
)}
      <TablaDeDatos lista={lista} usuario={usuario} />
    </Card.Body>
  )
}

export default Inicio

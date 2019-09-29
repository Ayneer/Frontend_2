import React from 'react';
import './App.css';
import Menu from './Menu/Menu';
import Navbar from './Navbar/Navbar';
import Contenido from './Contenido/Contenido';
import Footer from './Footer/Footer';
import Cargando from './Cargando/CargandoPagina';

let usuario = {};

class App extends React.Component {

  constructor() {

    super();

    this.state = {
      estado: "",
      mostrar: false
    }

    this.cambiarEstado = this.cambiarEstado.bind(this);
    this.cerrarSesion = this.cerrarSesion.bind(this);

  }
  //Metodo para verificar si esta autenticado
  componentDidMount() {
    if (this.props.usuario.correo) {
      console.log(this.props.usuario);
      usuario = this.props.usuario;
      this.setState({ mostrar: true });
    }
  }


  cambiarEstado() {
    if (this.state.estado === "") {
      this.setState({
        estado: "active"
      });
    } else {
      this.setState({
        estado: ""
      });
    }
  }

  //Metodo para cerrar sesion de usuario 
  cerrarSesion() {
    if(this.props.admin){
      fetch(this.props.url + '/cerrarSesion', {//Solicitud para cerrar sesion
        credentials: 'include'
      })
        .then(function (response) {//Analiza respuesta de servidor
          return response.json();
        }).then(res => {
          //this.props.sesionActiva(false);
          window.location.reload();
        })
      
    }
    const socket = this.props.crearSocket2(this.props.url);
    socket.emit('salir', usuario.correo);//Emitir correo para solicitar salir de sesion
    socket.on('recibido', (dato) => {//El correo el usuario es recibido
      fetch(this.props.url + '/cerrarSesion', {//Solicitud para cerrar sesion
        credentials: 'include'
      })
        .then(function (response) {//Analiza respuesta de servidor
          return response.json();
        })
        .then(res => {
          if (res.estado) {
            console.log(res);
            this.props.sesionActiva(false);
            window.location.reload();
          }
        });
    });
  }

  render() {
    console.log("soy render app");
    if (this.state.mostrar) {
      return (
        <div className="App">
          <div id="app">
            {this.props.admin === true ? 
              null
              : 
              <Menu estado={this.state.estado} />
              }
            <div id="principal">
              <Navbar metodo={this.cambiarEstado} cerrarSesion={this.cerrarSesion} admin={this.props.admin} />
              <Contenido actualizarUsuario={this.props.actualizarUsuario} cerrarSesion={this.cerrarSesion} consumo={this.props.consumo} usuario={this.props.usuario} url={this.props.url} admin={this.props.admin} />
            </div>

          </div>
        </div>
      );
    } else {
      return (
        <Cargando />
      );

    }

  }

}

export default App;

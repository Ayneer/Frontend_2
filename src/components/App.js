import React from 'react';
import './App.css';
import Menu from './Menu/Menu';
import Navbar from './Navbar/Navbar';
import Contenido from './Contenido/Contenido';
import Footer from './Footer/Footer';

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
  componentDidMount() {//Se realiza verificacion con servidor
    console.log(this.props.usuario);
    if(this.props.usuario.correo){
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
    const socket = this.props.crearSocket2();
    socket.emit('salir', usuario.correo);//Emitir correo para solicitar salir de sesion
    socket.on('recibido', (dato) => {//El correo el usuario es recibido
      fetch(this.props.url+'/cerrarSesion', {//Solicitud para cerrar sesion
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
    if (this.state.mostrar) {
      console.log("soy render app");
      console.log("App: "+usuario);
      return (

        
          <div className="App">

            <div id="app">

              <Menu estado={this.state.estado} />

              <div id="principal">

                <Navbar metodo={this.cambiarEstado} cerrarSesion={this.cerrarSesion} />

                <Contenido actualizarUsuario={this.props.actualizarUsuario} cerrarSesion={this.cerrarSesion} consumo={this.props.consumo} usuario={usuario} url={this.props.url} />

              </div>

            </div>
          </div>

        
      );
    } else {
      return (

        <div>Cargando.app ..</div>
      );

    }

  }

}

export default App;

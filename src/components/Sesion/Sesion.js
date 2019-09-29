import React from 'react';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';

import App from '../App';
import IniciarSesion from '../IniciarSesion/IniciarSesion';
import Ayuda from '../Contenido/Ayuda/Ayuda';
import Cargando from '../Cargando/CargandoPagina';

import socketIOClient from "socket.io-client";
import Push from 'push.js';

let socket = null;//Conexion con socket servidor

const crearSocket2 = function (url) {//borrar y probar
    console.log("Cree socket");
    socket = socketIOClient(url);
    socket.on('connect', function () { });
    return socket;
}

class Sesion extends React.Component {

    constructor() {
        super();

        this.state = {
            ok: false,
            consumo: 0,
            usuario: {},
            sesionActiva: false,
            admin: null
        }
        this.usuario = this.usuario.bind(this);
        this.activarSocket = this.activarSocket.bind(this);
        this.sesionActiva = this.sesionActiva.bind(this);
    }

    activarSocket(socket) {
        console.log("Socket activado");
        socket.on('consumoReal', (consumo) => {
            console.log(consumo);
            this.setState({ consumo: consumo });
        });
        socket.on('limiteKwh', (notificacion) => {
            console.log("Alerta: has superado el 50% de tu limite" + notificacion);
            Push.create(notificacion.mensaje, {
                body: "Limite: " + notificacion.limite + "/nConsumo: " + notificacion.consumo + "/nCosto: " + notificacion.costo,
                timeout: 5000,
                onClick: function () {
                    console.log(this);
                }
            });
        });
    }

    sesionActiva(estado) {
        this.setState({ sesionActiva: estado });
    }

    usuario(usuario, admin) {
        this.setState({
            usuario,
            sesionActiva: true,
            admin
        });
        console.log("usuario de sesion cargado...")
    }

    async componentDidMount() {
        console.log('componentDidMount sesion');
        const respuesta = await fetch(this.props.url + '/estoyAutenticado', {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json'
            }
        });
        const res = await respuesta.json();
        if (!res.estado) {//Si la sesion esta inactiva 
            console.log("sesion inactiva")
            this.props.history.push('/iniciarSesion');
            this.setState({admin: false});
        } else {
            if (res.admin) {
                this.setState({ usuario: res.usuario, sesionActiva: true, admin: true });
            } else {
                const socket = crearSocket2(this.props.url);
                socket.emit('actualizarSocket', res.usuario.correo);//Emitir correo por socket
                socket.on('Actualizado', (dato) => {//Si se acepta el correo puedo iniciar sesion
                    if (dato) {
                        this.activarSocket(socket);
                        console.log(res);
                        //this.props.history.push('/App');
                        this.setState({ usuario: res.usuario, sesionActiva: true, admin: false });
                    }
                });
            }

        }
    }

    render() {
        console.log('Render sesion - ok: ' + this.state.ok);
        return (
            <div id="">
                <div>
                    {this.state.admin === null ? 
                        <Cargando />
                        : 
                        this.state.sesionActiva ?
                        <Switch>
                            <Route path="/App" render={() => <App actualizarUsuario={this.usuario} consumo={this.state.consumo} sesionActiva={this.sesionActiva} history={this.props.history} crearSocket2={crearSocket2} usuario={this.state.usuario} url={this.props.url} admin = {this.state.admin} />} />
                            <Route path="/" render={() => <Redirect to="/App" />} />
                        </Switch>
                        :
                        <Switch>
                            <Route exact path="/iniciarSesion" render={() => <IniciarSesion usuario={this.usuario} activarSocket={this.activarSocket} history={this.props.history} crearSocket2={crearSocket2} url={this.props.url} />} />
                            <Route exact path="/Ayda" render={() => <Ayuda />}/>
                            <Route path="/" render={() => <Redirect to="/iniciarSesion" />} />
                        </Switch>
                        }
                </div>
            </div>
        );
    }
}

export default withRouter(Sesion);
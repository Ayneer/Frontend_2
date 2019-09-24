import React from 'react';
import "./ajustes.css";
import Cargando from '../../Cargando/CargandoPagina';

class Ajustes extends React.Component {

    state = {
        cambiarContrasena: false,
        disableInput: true,
        mostrarAjustes: false,
        usuario: null,
        contrasena: "",
        contrasenaNueva: "",
        contrasenaNueva2: "",
        correo: "",
        telefono: 0,
        classMensaje: "",
        nuevoMensaje: false,
        mensaje: ""
    }

    changeInput = (evento) => {
        const name = evento.target.name;
        this.setState({
            [name]: evento.target.value
        });
    }

    guardar = () => {
        const { usuario, contrasena, contrasenaNueva, contrasenaNueva2, cambiarContrasena, correo, telefono } = this.state;

        let contador = 0;

        if (telefono === "") {
            telefono = 0;
        }

        if (correo === "" || !this.validarCorreo(correo)) {
            console.log("Digite un correo valido");
            this.lanzarMensaje("Digite un correo valido", "alert alert-danger");
            contador++;
        } else {
            if (cambiarContrasena) {
                if (contrasena === "" || contrasenaNueva === "" || contrasenaNueva2 === "") {
                    console.log("Digite todos los campos requeridos");
                    this.lanzarMensaje("Digite todos los campos requeridos", "alert alert-danger");
                    contador++;
                } else {
                    if (contrasenaNueva !== contrasenaNueva2) {
                        console.log("Contraseñas no coinciden");
                        this.lanzarMensaje("Contraseñas no coinciden" , "alert alert-danger");
                        contador++;
                    } else {
                        if (contrasenaNueva === usuario.correo) {
                            console.log("Contraseña no puede ser igual al correo");
                            this.lanzarMensaje("Contraseña no puede ser igual al correo", "alert alert-danger");
                            contador++;
                        }
                    }
                }
            }

        }

        if (contador === 0) {
            fetch(this.props.url + '/cliente/' + usuario.correo, {
                method: 'PUT',
                credentials: 'include',
                body: JSON.stringify({ sesionP: false, cambiarContrasena, contrasena, contrasenaNueva, correo, telefono }),
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json'
                }
            }).then(function (response) {
                return response.json();//Analiza respuesta de servidor
            }).then(res => {
                if (res.estado) {
                    console.log("Actuaizacion con exito");
                    if (usuario.correo !== correo) {
                        this.props.cerrarSesion();
                    } else {
                        usuario.telefono = +telefono;
                        this.props.actualizarUsuario(usuario);
                        this.cancelar();
                        this.lanzarMensaje("Actualizacion realizada con exito!", "alert alert-success");
                        console.log(res);
                    }
                } else {
                    console.log(res);
                }
            });
        }
    }

    actualizarData(event) {
        event.preventDefault();
    }

    editar = () => {
        this.setState({
            disableInput: false
        });
    }

    cancelar = () => {
        this.setState({
            disableInput: true,
            cambiarContrasena: false,
            contrasena: "",
            contrasenaNueva: "",
            contrasenaNueva2: "",
            correo: this.props.usuario.correo,
            telefono: this.props.usuario.telefono,
            classMensaje: "",
            nuevoMensaje: false,
            mensaje: ""
        });
    }

    cambiarContrasena = () => {
        this.setState({
            cambiarContrasena: true
        });
    }

    contrasenaIgual = () => {
        this.setState({
            cambiarContrasena: false,
            contrasena: "",
            contrasenaNueva: "",
            contrasenaNueva2: ""
        });
    }

    componentDidMount() {
        if (this.props.usuario) {
            let usuario;
            if (!this.props.usuario.telefono) {
                usuario = {
                    ...this.props.usuario,
                    telefono: 0
                }
            } else {
                usuario = this.props.usuario;
            }
            this.setState({
                mostrarAjustes: true,
                usuario,
                correo: usuario.correo,
                telefono: usuario.telefono
            });
        }
    }

    cerrarMensaje = () => {
        this.setState({
            classMensaje: "",
            nuevoMensaje: false,
            mensaje: ""
        });
    }

    lanzarMensaje(mensaje, classMensaje){
        this.setState({
            classMensaje,
            nuevoMensaje: true,
            mensaje
        });
    }

    validarCorreo(correo) {
        var re = /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(correo);
    }

    render() {

        const { cambiarContrasena, disableInput, mostrarAjustes, usuario, contrasena, contrasenaNueva, contrasenaNueva2, correo, telefono, nuevoMensaje, mensaje, classMensaje } = this.state;
        if (mostrarAjustes) {
            return (
                <div className="ajustes container">
                    <form onSubmit={this.actualizarData}>
                        <div className="card">
                            {nuevoMensaje ?
                                <div className={classMensaje} id="alert" role="alert">
                                    {mensaje}
                                    <button type="button" className="close" onClick={this.cerrarMensaje}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                : null}
                            <h6 className="titulo-ajustes">Ajustes</h6>
                            <div className="card-body">
                                <div className="form-group">
                                    <label htmlFor="inputNombre"> Nombre </label>
                                    <input type="text" value={usuario.nombre + " " + usuario.apellidos} className="form-control" id="inputNombre" placeholder="" readOnly />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputCC"> Identificacion </label>
                                    <input type="text" value={usuario.cedula} className="form-control" id="inputCC" placeholder="" readOnly />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputTelefono"> Telefono </label>
                                    <input type="number" name="telefono" value={telefono} className="form-control" id="inputTelefono" onChange={this.changeInput} placeholder="Telefono" disabled={disableInput} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputCorreo"> Correo </label>
                                    <input type="email" name="correo" value={correo} className="form-control" id="inputCorreo" onChange={this.changeInput} placeholder="correo@correo.com" disabled={disableInput} />
                                </div>
                                {cambiarContrasena ?
                                    <div>
                                        <div className="form-group">
                                            <label htmlFor="inputContrasena"> Contrasena </label>
                                            <input type="password" className="form-control" id="inputContrasena" name="contrasena" value={contrasena} onChange={this.changeInput} placeholder="" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="inputContrasenaN"> Nueva contrasena </label>
                                            <input type="password" className="form-control" id="inputContrasenaN" name="contrasenaNueva" value={contrasenaNueva} onChange={this.changeInput} placeholder="" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="inputContrasenaN2"> Repetir nueva contrasena </label>
                                            <input type="password" className="form-control" id="inputContrasenaN2" name="contrasenaNueva2" value={contrasenaNueva2} onChange={this.changeInput} placeholder="" />
                                        </div>
                                    </div>
                                    :
                                    null}
                                {disableInput ?
                                    <button onClick={this.editar} className="btn btn-primary">Editar</button>
                                    :
                                    <div>
                                        <button onClick={this.guardar} className="btn btn-primary">Guardar</button>
                                        <button onClick={this.cancelar} className="btn btn-danger">Cancelar</button>
                                    </div>
                                }
                                {cambiarContrasena ?
                                    <button onClick={this.contrasenaIgual} className="btn btn-danger" disabled={disableInput}>Dejar contrasena igual</button>
                                    :
                                    <button onClick={this.cambiarContrasena} className="btn btn-primary" disabled={disableInput}>Cambiar contrasena</button>
                                }
                            </div>
                        </div>
                    </form>
                </div>
            )
        } else {
            return (
                <Cargando />
            )
        }

    }
}

export default Ajustes;
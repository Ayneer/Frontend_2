import React from 'react';
import "./ajustes.css";
import Cargando from '../../Cargando/CargandoPagina';

let confirmarCambios = false;

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
        mensaje: "",
        habilitarModal: false
    }

    changeInput = (evento) => {
        const name = evento.target.name;
        this.setState({
            [name]: evento.target.value
        });
    }

    asegurarCambios = () => {
        confirmarCambios = true;
        this.guardar();
    }

    guardar = () => {
        const { usuario, contrasena, contrasenaNueva, contrasenaNueva2, cambiarContrasena, correo, telefono } = this.state;

        let contador = 0;

        if (correo === "" || !this.validarCorreo(correo)) {
            console.log("Digite un correo valido");
            this.lanzarMensaje("Digite un correo valido", "alert alert-danger alerta-ajustes");
            contador++;
        } else {
            if (cambiarContrasena) {
                if (contrasena === "" || contrasenaNueva === "" || contrasenaNueva2 === "") {
                    console.log("Digite todos los campos requeridos");
                    this.lanzarMensaje("Digite todos los campos requeridos", "alert alert-danger alerta-ajustes");
                    contador++;
                } else {
                    if (contrasenaNueva !== contrasenaNueva2) {
                        console.log("Contraseñas no coinciden");
                        this.lanzarMensaje("Contraseñas no coinciden", "alert alert-danger alerta-ajustes");
                        contador++;
                    } else {
                        if (contrasenaNueva === usuario.correo) {
                            console.log("Contraseña no puede ser igual al correo");
                            this.lanzarMensaje("Contraseña no puede ser igual al correo", "alert alert-danger alerta-ajustes");
                            contador++;
                        }
                    }
                }
            }

        }

        if (contador === 0) {
            this.setState({
                habilitarModal: true
            })
        }

        if (contador === 0 && confirmarCambios) {
            console.log("guardar")
            fetch(this.props.url + '/cliente/' + usuario.correo, {
                method: 'PUT',
                credentials: 'include',
                body: JSON.stringify({ sesionP: false, cambiarContrasena, contrasena, contrasenaNueva, correo, telefono }),
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json'
                }
            }).then(function (response) {
                return response.json();
            }).then(res => {
                if (res.estado) {
                    console.log("Actuaizacion con exito");
                    if (usuario.correo !== correo) {
                        this.props.cerrarSesion();
                    } else {
                        usuario.telefono = +telefono;
                        this.props.actualizarUsuario(usuario);
                        this.cancelar();
                        this.lanzarMensaje("Actualizacion realizada con exito!", "alert alert-success alerta-ajustes");
                        console.log(res);
                    }
                } else {
                    console.log(res);
                    this.lanzarMensaje(res.mensaje, "alert alert-danger alerta-ajustes");
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
        confirmarCambios = false;
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

    lanzarMensaje(mensaje, classMensaje) {
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
                        <div className="card card-ajustes">
                            {nuevoMensaje ?
                                <div className={classMensaje} id="alert" role="alert">
                                    {mensaje}
                                    <button type="button" className="close" onClick={this.cerrarMensaje}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                : null}
                            <div className="card-body">
                                <h6 className="titulo-ajustes">Editar Perfil</h6>
                                <div className="row">
                                    <div className="col-lg-6 col-sm-12 col-md-6">
                                        <div className="form-group">
                                            <label id="label-input" htmlFor="inputNombre"> NOMBRE </label>
                                            <input type="text" value={usuario.nombre + " " + usuario.apellidos} className="form-control" id="inputNombre" placeholder="" readOnly />
                                        </div>
                                        <div className="form-group">
                                            <label id="label-input" htmlFor="inputCC"> IDENTIFICACIÓN </label>
                                            <input type="text" value={usuario.cedula} className="form-control" id="inputCC" placeholder="" readOnly />
                                        </div>
                                        <div className="form-group">
                                            <label id="label-input" htmlFor="inputTelefono"> TELEFONO </label>
                                            <input type="number" name="telefono" value={telefono} className="form-control" id="inputTelefono" onChange={this.changeInput} placeholder="Telefono" disabled={disableInput} />
                                        </div>
                                        <div className="form-group">
                                            <label id="label-input" htmlFor="inputCorreo"> CORREO </label>
                                            <input type="email" name="correo" value={correo} className="form-control" id="inputCorreo" onChange={this.changeInput} placeholder="correo@correo.com" disabled={disableInput} />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-sm-12 col-md-6">
                                        {cambiarContrasena ?
                                            <div>
                                                <div className="form-group">
                                                    <label id="label-input" htmlFor="inputContrasena"> CONTRASEÑA ACTUAL </label>
                                                    <input type="password" className="form-control" id="inputContrasena" name="contrasena" value={contrasena} onChange={this.changeInput} placeholder="" />
                                                </div>
                                                <div className="form-group">
                                                    <label id="label-input" htmlFor="inputContrasenaN"> NUEVA CONTRASEÑA </label>
                                                    <input type="password" className="form-control" id="inputContrasenaN" name="contrasenaNueva" value={contrasenaNueva} onChange={this.changeInput} placeholder="" />
                                                </div>
                                                <div className="form-group">
                                                    <label id="label-input" htmlFor="inputContrasenaN2"> REPETIR NUEVA CONTRASEÑA </label>
                                                    <input type="password" className="form-control" id="inputContrasenaN2" name="contrasenaNueva2" value={contrasenaNueva2} onChange={this.changeInput} placeholder="" />
                                                </div>
                                            </div>
                                            :
                                            null}
                                    </div>
                                </div>
                                <div id="btn-editar-perfil">
                                    {disableInput ?
                                        <div className="form-group">
                                            <button onClick={this.editar} className="btn btn-primary">Editar</button>
                                        </div>
                                        :
                                        <div className="form-group">
                                            <button onClick={this.guardar} data-toggle="modal" data-target="#modalAsegurar" className="btn btn-primary btn-guardar-ajustes">Guardar</button>
                                            <button onClick={this.cancelar} className="btn btn-danger btn-cancelar-ajustes">Cancelar</button>
                                            <button onClick={this.cambiarContrasena} className="btn btn-primary" disabled={disableInput}>Cambiar contrasena</button>
                                        </div>

                                    }
                                    {cambiarContrasena ?
                                        <button onClick={this.contrasenaIgual} className="btn btn-danger" disabled={disableInput}>Dejar contrasena igual</button>
                                        :
                                        null
                                    }
                                </div>

                            </div>
                        </div>
                    </form>

                    {/* Ventana Modal inicio*/}

                    <div className="modal fade" id="modalAsegurar" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" arial-modal="false">

                        {/* <div className="modal fade show" id="modalAsegurar" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" style={{display: 'block'}} arial-modal="true" aria-hidden="false"> */}

                     
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">

                                <div className="modal-header">
                                    <h5 className="modal-title">Modal title</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>

                                <div className="modal-body">
                                    <p>Esta accion realizará una modificacion en su perfi, ¿Esta seguro de continuar?</p>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                                    <button type="button" data-dismiss="modal" className="btn btn-primary" onClick={this.asegurarCambios}>Aceptar</button>
                                </div>

                            </div>
                        </div>
                    </div>


                    {/* Ventana Modal fin */}
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
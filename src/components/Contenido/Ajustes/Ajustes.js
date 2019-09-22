import React from 'react';
import "./ajustes.css";

class Ajustes extends React.Component {

    state = {
        cambiarContrasena: false,
        disableInput: true,
        mostrarAjustes: false,
        usuario: null,
        contrasena: "",
        contrasenaNueva: "",
        contrasenaNueva2: "",
        correo: ""
    }

    changeInput = (evento) => {
        const name = evento.target.name;
        let { usuario, contrasena, contrasenaNueva, contrasenaNueva2, correo } = this.state;
        if (name === "correo") {
            correo = evento.target.value;
        } else {
            if (name === "telefono") {
                usuario.telefono = +evento.target.value;
            } else {
                if (name === "contrasena") {
                    contrasena = evento.target.value;
                } else {
                    if (name === "contrasenaNueva") {
                        contrasenaNueva = evento.target.value;
                    } else {
                        if (name === "contrasenaNueva2") {
                            contrasenaNueva2 = evento.target.value;
                        }
                    }
                }
            }
        }

        this.setState({
            usuario, contrasena, contrasenaNueva, contrasenaNueva2, correo
        });
    }

    guardar = () => {
        const { usuario, contrasena, contrasenaNueva, contrasenaNueva2, cambiarContrasena, correo } = this.state;
        let contador = 0;
        if (usuario.telefono === "") {
            usuario.telefono = 0;
        }

        console.log(this.state.usuario);
        console.log(this.state.contrasena);
        console.log(this.state.contrasenaNueva);
        console.log(this.state.contrasenaNueva2);

        if (correo === "") {
            console.log("Digite un correo valido");
            contador++;
            

        } else {
            if (cambiarContrasena) {
                if (contrasena === "" || contrasenaNueva === "" || contrasenaNueva2 === "") {
                    console.log("Digite todos los campos requeridos");
                    contador++;
                } else {
                    if (contrasenaNueva !== contrasenaNueva2) {
                        console.log("Contraseñas no coinciden");
                        contador++;
                    } else {
                        if (contrasenaNueva === usuario.correo) {
                            console.log("Contraseña no puede ser igual al correo");
                            contador++;
                        }
                    }
                }
            }
        
        }
        
        
        if(contador===0){
            fetch(this.props.url+'/cliente/' + usuario.correo, {//Solicitud cambio de contrase
                method: 'PUT',
                credentials: 'include',
                body: JSON.stringify({ sesionP: false, cambiarContrasena, contrasena, contrasenaNueva, correo, telefono: usuario.telefono }),
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json'
                }
            }).then(function (response) {
                return response.json();//Analiza respuesta de servidor
            }).then(res => {
                if (res.estado) {
                    console.log("Actuaizacion con exito");
                    if(usuario.correo !== correo){
                        this.props.cerrarSesion();
                    }
                    
                    // usuario.correo = correo;
                    // this.props.actualizarUsuario(usuario);
                    this.cancelar();
                    console.log(res);
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
            correo: ""

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
                correo: usuario.correo
            });
        }
    }

    render() {

        const { cambiarContrasena, disableInput, mostrarAjustes, usuario, contrasena, contrasenaNueva, contrasenaNueva2, correo } = this.state;
        if (mostrarAjustes) {
            return (
                <div className="container">
                    <form onSubmit={this.actualizarData}>
                        <div className="card">
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
                                    <input type="number" name="telefono" value={usuario.telefono} className="form-control" id="inputTelefono" onChange={this.changeInput} placeholder="Telefono" disabled={disableInput} />
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
                <div>Cargando Ajustes...</div>
            )
        }

    }
}

export default Ajustes;
import React, { Component } from 'react';
import './principal.css';

let listUserFilter = [];

class Principal extends Component {


    state = {
        correo: "",
        nombre: "",
        apellidos: "",
        id_medidor: "",
        cedula: "",
        id: "",
        showUser: false,
        listUser: [],
        newMessage: false,
        newMessageListUser: false,
        classNewMessage: "",
        message: "",
        btnEditUser: false
    }


    async componentDidMount() {
        const response = await fetch(this.props.url + "/clientes", {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json'
            }
        });
        const json = await response.json();

        listUserFilter = json.clientes;
        console.log(listUserFilter)

        if (json.estado) {
            this.setState({ listUser: json.clientes, showUser: true });
        } else {
            this.setState({ ok: false });
        }
    }


    filterUser = (event) => {

        const value = event.target.value;

        var filter = listUserFilter.filter((str) => {
            if(str.correo && str.nombre && str.apellidos && str.id_medidor && str.cedula){
                return str.nombre.toLowerCase().includes(value.toLowerCase()) ||
                str.correo.toLowerCase().includes(value.toLowerCase()) || 
                str.apellidos.toLowerCase().includes(value.toLowerCase()) || 
                str.id_medidor+"".includes(value+"") ||
                str.cedula.includes(value);
            }else{
                return null;
            }
        });

        this.setState({
            listUser: filter
        });
    }

    formUser = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value
        });
    }

    validateEmail(correo) {
        var re = /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(correo);
    }

    throwMessage(message, classNewMessage) {
        this.setState({
            classNewMessage: classNewMessage,
            newMessage: true,
            message: message
        });
    }

    closeNewMessage = () => {
        this.setState({
            classNewMessage: "",
            newMessage: false,
            newMessageListUser: false,
            message: ""
        });
    }

    newUser = async () => {
        const { correo, nombre, apellidos, id_medidor, cedula } = this.state;
        if (correo === "" || nombre === "" || id_medidor === "" || apellidos === "" || cedula === "") {
            this.throwMessage("Campos incompletos", "alert alert-danger");
        } else {
            if (this.validateEmail(correo)) {
                const response = await fetch(this.props.url + "/cliente", {
                    method: 'POST',
                    body: JSON.stringify({ correo, nombre, apellidos, id_medidor, cedula }),
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Accept': 'application/json'
                    }
                });
                const json = await response.json();
                if (json.estado) {
                    this.throwMessage(json.mensaje, "alert alert-success");
                    this.componentDidMount();
                    this.clearCard();
                } else {
                    this.throwMessage(json.mensaje, "alert alert-danger");
                }
            } else {
                this.throwMessage("Debe ingresar un correo valido", "alert alert-danger");
            }

        }
    }

    deleteUser = async (event) => {
        const correoCliente = event.target.value;
        const response = await fetch(this.props.url + "/cliente/" + correoCliente, {
            method: 'DELETE',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json'
            }
        });
        const json = await response.json();
        if (json.estado) {
            this.setState({
                newMessageListUser: true,
                classNewMessage: "alert alert-success",
                message: json.mensaje
            });
            this.componentDidMount();
        } else {
            this.setState({
                newMessageListUser: true,
                classNewMessage: "alert alert-danger",
                message: json.mensaje
            });
        }

    }

    fn_RecuperarContraseña = async (evento) => {
        const sCorreoCliente = evento.target.value;

        const respustaServidor = await fetch(this.props.url + "/cliente/" + sCorreoCliente, {
            method: 'PUT',
            body: JSON.stringify({ mod: "modA1", contraseña: sCorreoCliente }),
            credentials: "include",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json'
            }
        });
        const resouestaSJson = await respustaServidor.json();
        if(resouestaSJson.estado){
            this.throwMessage("Contraseña reestablecida con exito.", "alert alert-success");
        }else{
            this.throwMessage(resouestaSJson.mensaje, "alert alert-danger");
        }
    }

    findUser(correo) {
        let cliente = JSON;
        for (var i = 0; i < this.state.listUser.length; i++) {
            if (this.state.listUser[i].correo === correo) {
                cliente = this.state.listUser[i];
                break;
            }
        }
        return cliente;
    }

    editUser = async (event) => {
        const usuario = this.findUser(event.target.value);
        if (usuario.nombre !== undefined) {
            this.setState({
                correo: usuario.correo,
                nombre: usuario.nombre,
                apellidos: usuario.apellidos,
                id_medidor: usuario.id_medidor,
                cedula: usuario.cedula,
                btnEditUser: true
            });
        }
    }



    updateUSer = async () => {
        const { id_medidor, correo } = this.state;
        if (id_medidor === "") {
            this.throwMessage("Llene todos los campos", "alert alert-danger");
        } else {

            const response = await fetch(this.props.url + "/cliente/" + correo, {
                method: 'PUT',
                body: JSON.stringify({ id_medidor, mod: "modA2" }),
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json'
                }
            });
            const json = await response.json();
            if (json.estado) {
                this.throwMessage(json.mensaje, "alert alert-success");
                this.componentDidMount();
                this.clearCard();
            } else {
                this.throwMessage(json.mensaje, "alert alert-danger");
            }

        }
    }


    clearCard = () => {
        this.setState({
            nombre: "",
            apellidos: "",
            correo: "",
            cedula: "",
            id_medidor: "",
            id: "",
            btnEditUser: false
        });
    }


    render() {
        console.log("Render principal")
        const { correo, nombre, apellidos, cedula, id_medidor, showUser, listUser, newMessage, message, btnEditUser, newMessageListUser, classNewMessage } = this.state;
        let ThereUser = false;
        if (showUser) {
            if (listUser.length > 0) {
                ThereUser = true;
            }
            return (
                <div className="user container">
                    <div className="row rowOne">
                        <div className="col-lg-3 newUser">
                            <div className="titleNewUser">
                                <h6>
                                    Formulario de cliente
                                    </h6>
                            </div>
                            {/* Card para crear/editar a un cliente */}
                            <div className="card mx-auto cardComponent">
                                {newMessage ?
                                    <div className={classNewMessage} id="alert" role="alert">
                                        {message}
                                        <button type="button" className="close" onClick={this.closeNewMessage}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    : null}
                                <div className="card-header" style={{textAlign: 'left', fontSize: '12px'}}>
                                    <div className="form-group">
                                        <label forhtml="nombre">Nombre(s) del cliente</label>
                                        <input className="form-control form-control-sm inputUser" id="nombre" type="text" name="nombre" placeholder="Nombre(s) del cliente" value={nombre} onChange={this.formUser} disabled={btnEditUser} required></input>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label forhtml="apellidos">Apellido(s) del cliente</label>
                                        <input id="apellidos" className="form-control form-control-sm inputUser" type="text" name="apellidos" placeholder="Apellido(s) del cliente" value={apellidos} onChange={this.formUser} disabled={btnEditUser} required></input>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label forhtml="correo">Correo del cliente</label>
                                        <input id="correo" className="form-control form-control-sm inputUser" type="text" name="correo" placeholder="cliente@servicio.dominio" value={correo} onChange={this.formUser} disabled={btnEditUser} required />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label forhtml="cedula">Cedula del cliente</label>
                                        <input id="cedula" className="form-control form-control-sm inputUser" type="Number" name="cedula" value={+cedula} onChange={this.formUser} disabled={btnEditUser} required />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label forhtml="id_medidor">ID del medidor a usar</label>
                                        <input  name="id_medidor" className="form-control form-control-sm inputUser" type="Number" name="id_medidor" value={+id_medidor} onChange={this.formUser} required />
                                    </div>

                                    <div className="btn-group-md">
                                        {btnEditUser ?
                                            <button type="submit" className="btn btn-primary btn-sm mr-3 btn-newUser inputUser" onClick={this.updateUSer}>
                                                Actualizar
                                                </button>
                                            :
                                            <button type="submit" className="btn btn-primary btn-sm mr-3 btn-newUser inputUser" onClick={this.newUser}>
                                                Crear
                                                </button>
                                        }
                                        <button type="submit" className="btn btn-danger btn-sm btn-newUser inputUser" onClick={this.clearCard}>
                                            Cancelar
                                            </button>
                                    </div>

                                </div>
                            </div>
                            {/* New user card end */}

                        </div>
                        <div className="col-lg-9 listUser">

                            {newMessageListUser ?
                                <div className={classNewMessage} role="alert">
                                    {message}
                                    <button type="button" className="close" onClick={this.closeNewMessage}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                : null}

                            <div className="filterUser">
                                <input className="form-control" type="text" placeholder="Search a user by name or email" aria-label="Search" onChange={this.filterUser} />
                            </div>

                            {ThereUser ?
                                <div className="table-responsive-lg">
                                    <table className="table table-striped " style={{fontSize: '13px'}}>
                                        <thead className="thead-dark">
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Nombre</th>
                                                <th scope="col">Correo</th>
                                                <th scope="col">CC</th>
                                                <th scope="col">ID del medidor</th>
                                                <th scope="col">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {listUser.map((user, index) =>
                                                <tr key={index}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td>{user.nombre + " " + user.apellidos}</td>
                                                    <td>{user.correo}</td>
                                                    <td>{user.cedula}</td>
                                                    <td>{user.id_medidor}</td>
                                                    <td>
                                                        <div className="btn-group btn-group-sm" role="group">

                                                            <button className="btn btn-secondary btn-sm" value={user.correo} onClick={this.editUser}>Editar</button>
                                                            <button className="btn btn-secondary btn-sm" value={user.correo} onClick={this.fn_RecuperarContraseña}>Recuperar</button>
                                                            <button className="btn btn-danger btn-sm" value={user.correo} onClick={this.deleteUser}>Eliminar</button>

                                                            
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}

                                        </tbody>
                                    </table>
                                </div>
                                :
                                <div>There is not any user...</div>
                            }
                        </div>
                    </div>
                </div>
            );

        } else {
            return (<div>Loading user...</div>)
        }

    }
}

export default Principal;

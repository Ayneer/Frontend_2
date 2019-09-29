import React from 'react';
import "./limite.css";

let opc1 = "Unidad de consumo (kwh)";
let opc2 = "Pesos colombianos ($)";
class Limite extends React.Component {

    constructor() {
        super();

        this.state = {
            mostrarLimite: false,
            usuario: null,
            limite: 0,
            arrayOpciones: { opc1: "Unidad de consumo (kwh)", opc2: "Pesos colombianos ($)" },
            editarLimite: false,
            disableInput: true,
            opcionLimite: 0,
            nuevoLimite : false
        }

        this.input = this.input.bind(this);
        this.editar = this.editar.bind(this);
        this.cancelar = this.cancelar.bind(this);
        this.guardar = this.guardar.bind(this);
        this.opcionLimite = this.opcionLimite.bind(this);
    }

    input(event) {
        const limite = event.target.value;
        this.setState({
            limite: limite
        })
    }

    editar() {
        this.setState({
            editarLimite: true,
            disableInput: false
        })
    }

    cancelar() {
        this.setState({
            editarLimite: false,
            disableInput: true
        })
    }

    opcionLimite(evente) {
        console.log("opcion Limiteeeeee");
        console.log(evente.target.value);
        if (evente.target.value === "Pesos colombianos ($)") {
            console.log("Guardado en: 1 ");
            this.setState({
                opcionLimite: 1
            });
        } else {
            console.log("Guardado en: 2 ");
            this.setState({
                opcionLimite: 0
            });
        }
    }

  async  guardar() {
        const {limite, opcionLimite, usuario} = this.state;
        console.log(limite);
        if (limite !== 0) {
            if(this.state.nuevoLimite){
                const respuesta = await fetch(this.props.url+'/alerta/', {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify({ correoCliente: usuario.correo, limite, tipoLimite: opcionLimite}),
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Accept': 'application/json'
                    }
                });
                const res = await respuesta.json();
                if(res.estado){
                    this.cancelar();
                }else{
                    // Mensaje de error
                }
            }else{
                fetch(this.props.url+'/alerta/' + usuario.correo, {
                    method: 'PUT',
                    credentials: 'include',
                    body: JSON.stringify({  limite, tipoLimite: opcionLimite }),
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Accept': 'application/json'
                    }
                }).then(function (response) {
                    return response.json();//Analiza respuesta de servidor
                }).then(res => {
                    if (res.estado) {
                        this.cancelar();
                        console.log("limite actualizado con exito");
                    } else {
                        console.log("Error al actualizar limite");
                    }
                });

            }
            
        }
    }

    async componentDidMount() {

        if (this.props.usuario !== null) {
            console.log('soy didmo');
            const respuesta = await fetch(this.props.url+'/alerta/'+ this.props.usuario.correo,  {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json'
                }
            });
            const res = await respuesta.json();
            if (res.estado) {
               
                    if (res.alerta.tipoLimite === 1) {
                        console.log("Pesos colombianos ($)");
                        opc1 = "Pesos colombianos ($)";
                        opc2 = "Unidad de consumo (kwh)";
                    } else {
                        console.log("Unidad de consumo (kwh)");
                        opc1 = "Unidad de consumo (kwh)";
                        opc2 = "Pesos colombianos ($)";
                    }
                    this.setState({
                        mostrarLimite: true,
                        usuario: this.props.usuario,
                        limite: res.alerta.limite,
                        opcionLimite: res.alerta.tipoLimite,
                        arrayOpciones: { opc1, opc2 },
                        nuevoLimite : false
                    });
                
            }else{
                this.setState({
                    mostrarLimite: true,
                    usuario: this.props.usuario,
                    limite: 0,
                    opcionLimite: 0,
                    arrayOpciones: { opc1, opc2 },
                    nuevoLimite: true
                });
            }
        }
    }

    render() {
        console.log(this.props.url);
        if (this.state.mostrarLimite) {
            const { limite, editarLimite, disableInput, arrayOpciones } = this.state;
            let mensaje = null;
            if (limite === 0) {
                mensaje = "No has definido algun limite.";
            } 
            return (
                <div id="contenido">
                    <div className="row">
                        <div id="cuadrado" className="col-5">
                            <h6>Nuevo limite</h6>
                            <div id="form">
                                <select id="opciones" disabled={disableInput} onChange={this.opcionLimite}>
                                    <option>{arrayOpciones.opc1}</option>
                                    <option>{arrayOpciones.opc2}</option>
                                </select>
                                <input className="form-control" id="campo" onChange={this.input} value={limite} placeholder="Ingrese nuevo valor" disabled={disableInput} />
                                {editarLimite ?
                                    <div>
                                        <button onClick={this.guardar} className="btn btn-primary btn-sm">Guardar</button>
                                        <button onClick={this.cancelar} className="btn btn-danger btn-sm">Cancelar</button>
                                    </div>
                                    :
                                    <button id="ok" onClick={this.editar} className="btn btn-primary">Editar</button>
                                }
                            </div>
                        </div>
                        <div id="cuadrado1" className="col-5 offset-md-1">
                            <h6>Limite actual</h6>
                            <h6>{mensaje}</h6>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (<div> Cargando ...</div>)
        }

    }
}

export default Limite;
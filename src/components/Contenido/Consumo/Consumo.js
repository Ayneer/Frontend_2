import React from 'react';
import "./consumo.css";
import socketIOClient from "socket.io-client";
let usuario = {};

class Consumo extends React.Component {

    constructor(){

        super();
        this.state={consumo:5};

    }
    //Metodo para verificar si el usuario esta atenticado
    componentWillMount() {
        console.log("soy comoponent will");
        fetch('http://192.168.1.54:3500/estoyAutenticado', {//Consulta al sevidor para verificar la atenticidad
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json'
            }
        }).then(function (response) {//Analiza respuesta de servidor
            return response.json();
        }).then(res => {
            if (!res.estado) {//Si no esta autenticado
                this.props.history.push('/');// Se redirecciona a inicio de sesion
            } else {//Si esta autenticado
                console.log("estoy atenticado");
                usuario = res.usuario;//Captura datos de usuario
                this.consultarConsumo(usuario.correo);
            }
        }).catch(error => console.error('Error:', error));
    }
    //Metodo para realizar consulta de consumo
    consultarConsumo(correo) {
        console.log(usuario.correo);
        fetch('http://192.168.1.54:3500/consumo/' +correo, {//Solicitr consumo real
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json'
            }
        }).then(function (response) {//Analiza respuesta
            return response.json();
        }).then(res => {
            if(!res.estado){
                
                //Mensaje de que no existe consumo
            }else{
                
                this.capturarConsumos();
                //Actualizar estado del consumo real 
            }
        }).catch(error => console.error('Error:', error));

    }

    capturarConsumos(){
        const socket = socketIOClient('http://192.168.1.54:3500');
        socket.on('connect', function () { });
        socket.on('consumoReal', (consumo)=>{
            this.setState({consumo:consumo.consumoMes})
        });
    }

    render() {
        return (
            <div id="contenido">
                <div className="row">
                    <div id="cuadro1" className="col-11">
                        <h6>Mi consumo actual</h6>
                        <h1 id="valor">{this.state.consumo}</h1>
                    </div>
                </div>
                <div className="row">
                    <div id="medio" className="col-12">

                    </div>
                </div>
                <div className="row">
                    <div id="cuadro3" className="col-5">
                        <h6>Costo</h6>
                    </div>
                    <div id="cuadro4" className="col-5 offset-md-1">
                        <h6>Limite</h6>
                    </div>
                </div>
            </div>
        )
    }
}

export default Consumo;
import React from 'react';
import './reporte.css';

//let usuario = {};

class Reporte extends React.Component {
    // capturarRespuestaServidor(respuestaS) {
    //     console.log(usuario);
    //     if (!respuestaS.estado) {
    //         this.props.history.push('/');// Se redirecciona a inicio de sesion
    //     } else {
    //         usuario = respuestaS.usuario;
    //         console.log(usuario);
    //     }
    // }

    // componentWillMount() {
    //     fetch('http://192.168.1.54:3500/estoyAutenticado', {
    //         credentials: 'include',
    //         headers: {
    //             'Content-Type': 'application/json; charset=UTF-8',
    //             'Accept': 'application/json'
    //         }
    //     }).then(function (response) {
    //         return response.json();
    //     }).then(res => this.capturarRespuestaServidor(res)).catch(error => console.error('Error:', error));
    // }

    render() {


        return (
            <div id="conten">
                <div className="row">
                    <div id="cuadrado" className="col-6 offset-md-3">
                        <h6>Generar reporte</h6>
                        <div id="form">
                            <select id="opciones">
                                <option>mes1</option>
                                <option>mes1</option>
                                <option>mes1</option>
                                <option>mes1</option>
                                <option>mes1</option>
                                <option>mes1</option>
                            </select>
                            <input className="form-control" id="campo" placeholder="Ingrese nuevo valor"></input>
                            <button id="generar" className="btn btn-primary">Generar</button>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default Reporte;
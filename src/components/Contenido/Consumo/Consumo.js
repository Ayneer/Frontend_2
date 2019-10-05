import React from 'react';
import "./consumo.css";
import Chart from 'chart.js';

let usuario;
let consumo = 0;
class Consumo extends React.Component {

    constructor() {

        super();
        this.state = {
            consumo: 0,
            mostrarConsumo: false
        };

    }

    //Metodo para realizar consulta de consumo
    consultarConsumo(correo) {
        console.log(usuario.correo);
        fetch(this.props.url + '/consumo/' + correo, {//Solicitr consumo real
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json'
            }
        }).then(function (response) {//Analiza respuesta
            return response.json();
        }).then(res => {
            if (!res.estado) {
                //Mensaje de que no existe consumo
            } else {
                consumo = res.consumoMes.consumoMes;
                return consumo;
            }
        }).catch(error => console.error('Error:', error));

    }


    crearGrafica = () => {
        // var ctx = document.getElementById('graficaLimite');
        // new Chart(ctx, {
        //     type: 'doughnut',
        //     data: {
        //         datasets: [
        //             {
        //                 data:[30],
        //                 backgroundColor:[
        //                     'rgba(255,69,96,1)'
        //                 ],
        //                 borderWidth: 0,
        //                 hoverBackgroundColor: [
        //                     'rgb(255,69,96)'
        //                 ],
        //                 hoverBorderWidth: 0
        //             }
        //         ]
        //     },
        //     options: {
        //         rotation: -1.0 * Math.PI,
        //         circumference: Math.PI,
        //     }
        // });
        var deliveredData = {
            labels: [
                "Value"
            ],
            datasets: [
                {
                    data: [100, 0],
                    backgroundColor: [
                        "#3ec556",
                        "rgba(0,0,0,0)"
                    ],
                    hoverBackgroundColor: [
                        "#3ec556",
                        "rgba(0,0,0,0)"
                    ],
                    borderWidth: [
                        0, 0
                    ]
                }]
        };

        var deliveredOpt = {
            cutoutPercentage: 88,
            animation: {
                animationRotate: true,
                duration: 2000
            },
            legend: {
                display: false
            },
            tooltips: {
                enabled: false
            }
        };
        var ctx = document.getElementById('graficaLimite');
        new Chart(ctx, {
            type: 'doughnut',
            data: deliveredData,
            options: deliveredOpt
        });
    }


    componentDidMount() {
        console.log(this.props.usuario);
        if (this.props.usuario.correo) {
            if (this.props.consumo === 0) {
                fetch(this.props.url + '/consumo/' + this.props.usuario.correo, {//Solicitr consumo real
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Accept': 'application/json'
                    }
                }).then(function (response) {//Analiza respuesta
                    return response.json();
                }).then(res => {
                    if (res.estado) {

                        console.log("Encontre Consumo");
                        this.setState({

                            mostrarConsumo: true,
                            consumo: res.consumoMes.consumoMes
                        });
                        this.crearGrafica();
                    } else {
                        if (!res.error) {//no has consumido nada
                            this.setState({
                                mostrarConsumo: true
                            });
                        }
                    }
                }).catch(error => console.error('Error:', error));
            } else {
                this.setState({
                    mostrarConsumo: true,
                    consumo: this.props.consumo
                });
            }
        }

    }

    render() {
        consumo = this.props.consumo;
        let mostrar = true;//Mostrar consumo de la consulta directa
        if (this.state.consumo === 0 || this.state.consumo <= consumo) {
            mostrar = false;//Mostrar consumo de Sesion
        }

        if (this.state.mostrarConsumo) {
            console.log("Render Consumo: " + this.props.usuario);
            return (
                <div id="contenido">
                    <div className="row">
                        <div id="cuadro1" className="col-11">
                            <h6 id="cuadros-consumo">Mi consumo actual</h6>
                            {mostrar ?
                                <h1 id="valor">{this.state.consumo}</h1> :
                                <h1 id="valor">{consumo}</h1>
                            }
                        </div>
                    </div>
                    <div className="row">
                        <div id="medio" className="col-12">

                        </div>
                    </div>
                    <div className="row">
                        <div id="cuadro3" className="col-5">
                            <h6 id="cuadros-consumo">Costo</h6>
                        </div>
                        <div id="cuadro4" className="col-5 offset-md-1">



                            <div class="modal-div-canvas js-chart">
                                <div class="chart-canvas">
                                    <canvas id="graficaLimite" width="3px" height="1"></canvas>
                                    <div class="chart-background"></div>
                                    <span class="chart-unique-value">
                                        <span class="js-count">85%</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (<div>Cargando...</div>)
        }


    }
}

export default Consumo;
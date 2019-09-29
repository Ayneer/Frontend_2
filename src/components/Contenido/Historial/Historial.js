import React from 'react';
import Chart from 'chart.js';
import './historial.css';
let usuario = {};
let obj = [];
class Historial extends React.Component {

    constructor() {
        super();

        this.state = {
            mostrarH: false,
            mostrarTabla: true,
            mostrarGrafica: false
        }

        this.consultarHistorial = this.consultarHistorial.bind(this);
        this.atras = this.atras.bind(this);
    }

    obtenerHistoriales(historial, mes) {

        //Objeto a devolver
        let data = {
            consumoMadrugada: [],
            consumoManana: [],
            consumoTarde: [],
            consumoNoche: [],
            labels: []
        }

        let arrayConsumoManana = [];
        let arrayConsumoMadrugada = [];
        let arrayconsumoTarde = [];
        let arrayconsumoNoche = [];

        let labels = [];

        //Llenar arrays
        for (var i = 0; i < 31; i++) {
            arrayConsumoManana.push(0);
            arrayConsumoMadrugada.push(0);
            arrayconsumoTarde.push(0);
            arrayconsumoNoche.push(0);
        }
        for (var t = 1; t <= 31; t++) {
            labels.push(t);
        }

        data.labels = labels;

        for (i = 0; i < historial.length; i++) {
            var fecha = historial[i].fecha;
            const arrayFecha = fecha.split("/");
            let diaConsumido = +arrayFecha[1];
            console.log(mes);
            if (arrayFecha[0] === mes) {

                console.log(mes);

                if (historial[i].consumoTarde !== undefined) {
                    console.log("tiene consumoTarde");
                    for (var h = 0; h < labels.length; h++) {
                        if (labels[h] === diaConsumido) {
                            arrayconsumoTarde[h] = historial[i].consumoTarde;
                        }
                    }
                    data.consumoTarde = arrayconsumoTarde;
                } else {
                    console.log("No tiene consumoTarde");
                    data.consumoTarde = arrayconsumoTarde;
                }

                if (historial[i].consumoMañana !== undefined) {
                    console.log("tiene consumoMañana");
                    for (h = 0; h < labels.length; h++) {
                        if (labels[h] === diaConsumido) {
                            arrayConsumoManana[h] = historial[i].consumoMañana;
                        }
                    }
                    data.consumoManana = arrayConsumoManana;
                } else {
                    console.log("No tiene consumoMañana");
                    data.consumoManana = arrayConsumoManana;
                }

                if (historial[i].consumoMadrugada !== undefined) {
                    console.log("tiene consumoMadrugada");
                    for (h = 0; h < labels.length; h++) {
                        if (labels[h] === diaConsumido) {
                            arrayConsumoMadrugada[h] = historial[i].consumoMadrugada;
                        }
                    }
                    data.consumoMadrugada = arrayConsumoMadrugada;
                } else {
                    console.log("No tiene consumoMadrugada");
                    data.consumoMadrugada = arrayConsumoMadrugada;
                }

                if (historial[i].consumoNoche !== undefined) {
                    console.log("tiene consumoNoche");
                    for (h = 0; h < labels.length; h++) {
                        if (labels[h] === diaConsumido) {
                            arrayconsumoNoche[h] = historial[i].consumoNoche;
                        }
                    }
                    data.consumoNoche = arrayconsumoNoche;
                } else {
                    console.log("No tiene consumoNoche");
                    data.consumoNoche = arrayconsumoNoche;
                }

            }
        }
        console.log(data);
        return data;
    }

    graficar(data) {
        var ctx = document.getElementById('myChart');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Madrugada',
                    data: data.consumoMadrugada,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }, {
                    label: 'Mañana',
                    data: data.consumoManana,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1

                }, {
                    label: 'Tarde',
                    data: data.consumoTarde,
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1

                }, {
                    label: 'Noche',
                    data: data.consumoNoche,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1

                }]
            },
            options: {
                scales: {
                    yAxes: [{

                        stacked: true,
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    xAxes: [{

                        stacked: true,
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    consultarHistorial(e) {
        e.preventDefault();
        const mes = e.target.value;

        fetch(this.props.url + '/historial/' + usuario.correo, {//Solicitar historial
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json'
            }
        }).then(function (response) {//Analiza respuesta
            return response.json();
        }).then(res => {
            console.log(res.historial);
            this.setState({
                mostrarTabla: false,
                mostrarGrafica: true
            });
            this.graficar(this.obtenerHistoriales(res.historial, mes));

        }).catch(error => console.error('Error:', error));

    }

    atras() {
        this.setState({
            mostrarTabla: true,
            mostrarGrafica: false
        })
    }

    nombreMes(mes) {

        let nombreMes = "";
        switch (mes) {
            case 1:
                nombreMes = "Enero";
                break;
            case 2:
                nombreMes = "Febrero";
                break;
            case 3:
                nombreMes = "Marzo";
                break;
            case 4:
                nombreMes = "Abril";
                break;
            case 5:
                nombreMes = "Mayo";
                break;
            case 6:
                nombreMes = "Junio";
                break;
            case 7:
                nombreMes = "Julio";
                break;
            case 8:
                nombreMes = "Agosto";
                break;
            case 9:
                nombreMes = "Septiembre";
                break;
            case 10:
                nombreMes = "Octubre";
                break;
            case 11:
                nombreMes = "Noviembre";
                break;
            case 12:
                nombreMes = "Diciembre";
                break;
            default:
                nombreMes = "Error";
                break;
        }
        return nombreMes;
    }

    construirTabla(correo) {
        console.log("antes de llenar");
        console.log(obj);
        obj = [];
        let objMes = [];
        let data = {}

        fetch(this.props.url + '/historial/' + correo, {//Solicitar historial
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json'
            }
        }).then(function (response) {//Analiza respuesta
            return response.json();
        }).then(res => {
            console.log(res.historial);
            let mes = 0;
            for (let index = 0; index < res.historial.length; index++) {
                console.log(index);
                const element = res.historial[index];
                const arrayFecha = element.fecha.split("/");
                if (mes.toString() !== arrayFecha[0]) {
                    objMes.push(arrayFecha[0]);
                    console.log("añado mes: " + arrayFecha[0]);
                    mes = arrayFecha[0];
                }
            }
            obj = [];
            console.log("pasando el primer for");
            console.log(obj);
            for (let index = 0; index < objMes.length; index++) {
                console.log(index);
                let consumoTotal = 0;
                let costoU = 0;
                for (let index2 = 0; index2 < res.historial.length; index2++) {
                    const element = res.historial[index2];
                    const arrayFecha = element.fecha.split("/");
                    if (objMes[index] === arrayFecha[0]) {
                        costoU = element.costoUnitarioKwh;
                        consumoTotal = consumoTotal + element.totalConsumoDia;
                    }
                }
                data.mes = objMes[index];
                data.consumoTotal = consumoTotal;
                data.consumoCosto = consumoTotal * costoU;
                console.log("guardando... " + data.mes + " " + data.consumoCosto + " " + data.consumoTotal);
                obj.push(data);
                data = {};
                console.log(data);
            }

            let mostrarT = false;

            if (obj.length > 0) {
                mostrarT = true;
            }

            this.setState({
                mostrarTabla: mostrarT,
                mostrarH: true
            });

        }).catch(error => console.error('Error:', error));
    }

    componentDidMount() {
        console.log("componentDidMount Historial");
        if (this.props.usuario !== null) {
            usuario = this.props.usuario;
            this.construirTabla(usuario.correo);
        }
    }

    render() {
        console.log("Soy render hist");
        if (this.state.mostrarH) {
            return (
                <div className="Historial">
                    {(this.state.mostrarTabla && obj.length > 0) ?
                        <div className="tabla">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Mes</th>
                                        <th scope="col">Kwh</th>
                                        <th scope="col">$</th>
                                        <th scope="col">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {obj.map((mes, id) =>
                                        <tr key={id}>
                                            <td>{this.nombreMes(+mes.mes)}</td>
                                            <td>{mes.consumoTotal}</td>
                                            <td>{mes.consumoCosto}</td>
                                            <td>
                                                <button value={mes.mes} onClick={this.consultarHistorial}> hola </button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        :
                        !this.state.mostrarTabla && this.state.mostrarGrafica ?
                            null
                            : 
                            <div>
                                <p> Aun no tienes historiales! </p>
                            </div>

                    }
                    {this.state.mostrarGrafica ?
                        <div className="grafica">
                            <canvas id="myChart"></canvas>
                            <button onClick={this.atras} >Atras </button>
                        </div>
                        :
                        null
                    }
                </div>

            )
        } else {
            return (<div>Cargando historial...</div>)
        }

    }
}

export default Historial;

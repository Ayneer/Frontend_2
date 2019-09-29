import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Consumo from './Consumo/Consumo';
import Historial from './Historial/Historial';
import Limite from './Limite/Limite';
import Reporte from './Reporte/Reporte';
import Ajustes from './Ajustes/Ajustes';
import Principal from './VistaAdministrador/principal';

import './contenido.css';

class Pagina extends React.Component {

    constructor() {
        super();
        this.state = {
            activarContenidos: false,
            usuario: null,
            rutasCliente: true
        }
    }

    componentDidMount() {
        if (this.props.usuario !== null) {
            let aux = this.state.rutasCliente;
            if (this.props.usuario.admin) {
                aux = false;
            }

            this.setState({
                activarContenidos: true,
                rutasCliente: aux
            })
        }
    }

    render() {
        console.log(this.props.url);

        

        if (this.state.activarContenidos) {
            return (




                <div className="contenido">
                    

                        {!this.props.usuario.admin ?
                            <Switch>
                                <Route path="App/consumo" render={() => <Principal url={this.props.url} />} />
                                {/* <Route exact path="/App" render={() => <Consumo usuario={this.props.usuario} consumo={this.props.consumo} url={this.props.url} />} /> */}
                                <Route exact path="/" render={() => <Consumo usuario={this.props.usuario} consumo={this.props.consumo} url={this.props.url} />} />
                                {/* <Route exact path="/App/consumo" render={() => <Consumo usuario={this.props.usuario} consumo={this.props.consumo} url={this.props.url} />} /> */}
                                <Route exact path="/App/historial" render={() => <Historial usuario={this.props.usuario} url={this.props.url} />} />
                                <Route exact path="/App/limite" render={() => <Limite usuario={this.props.usuario} url={this.props.url} />} />
                                <Route exact path="/App/ajustes" render={() => <Ajustes actualizarUsuario={this.props.actualizarUsuario} cerrarSesion={this.props.cerrarSesion} usuario={this.props.usuario} url={this.props.url} />} />
                                <Route exact path="/App/generarReporte" component={Reporte} />
                                <Route path="/" render={() => <Redirect to="/App/consumo" />} />
                            </Switch>
                            :
                            <Switch>
                                <Route path="App/principal" render={() => <Principal url={this.props.url} />} />
                            </Switch>
                        }



                    
                </div>
            )
        } else {
            return (<div>Cargando...</div>)
        }


    }
}

export default Pagina;
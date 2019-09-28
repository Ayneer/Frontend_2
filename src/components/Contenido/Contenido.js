import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Consumo from './Consumo/Consumo';
import Historial from './Historial/Historial';
import Limite from './Limite/Limite';
import Reporte from './Reporte/Reporte';
import Ajustes from './Ajustes/Ajustes';

import './contenido.css';

class Pagina extends React.Component {

    constructor() {
        super();
        this.state = {
            activarContenidos: false,
            usuario: null
        }
    }

    componentDidMount(){
        if(this.props.usuario!==null){
            this.setState({
                activarContenidos: true,
                usuario: this.props.usuario
            })
        } 
    }

    render() {
        console.log(this.props.url);
        if (this.state.activarContenidos) {
            return (
                <div className="contenido">
                    <Switch>
                        <Route exact path="/App" render={() => <Consumo usuario={this.state.usuario} consumo={this.props.consumo} url={this.props.url} />} />
                        <Route exact path="/" render={() => <Consumo usuario={this.state.usuario} consumo={this.props.consumo} url={this.props.url} />} />

                        <Route exact path="/App/consumo" render={() => <Consumo usuario={this.state.usuario} consumo={this.props.consumo} url={this.props.url} />} />

                        <Route exact path="/App/historial" render={() => <Historial usuario={this.state.usuario} url={this.props.url} />} />

                        <Route exact path="/App/limite" render={() => <Limite usuario={this.state.usuario} url={this.props.url} />} />
                        
                        <Route exact path="/App/ajustes" render={() => <Ajustes actualizarUsuario={this.props.actualizarUsuario} cerrarSesion={this.props.cerrarSesion} usuario={this.state.usuario} url={this.props.url}/> } />
                        <Route exact path="/App/generarReporte" component={Reporte} />
                        

                    </Switch>
                </div>
            )
        } else {
            return(<div>Cargando...</div>)
        }
        

    }
}

export default Pagina;
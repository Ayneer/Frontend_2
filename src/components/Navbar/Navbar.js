import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
/*import { Switch, Route } from 'react-router-dom';*/

class Navbar extends React.Component {

    render() {
        if (this.props.soyYo === 'inicioSesion') {
            return (
                <div>
                    <nav id="barra" className="navbar navbar-expand-lg navbar-light bg-light">
                        <div id="contenedorSesion" className="container-fluid">
                            <h5 id="titulo">EnergiaApp</h5>
                            <Link to="/Ayuda">
                                <button id="ayuda" type="button" className="btn btn-info" >
                                    <i className="fas fa-align-left"></i>
                                </button>
                            </Link>
                        </div>
                    </nav>
                </div>
            )
        } else {
            return (

                <nav id="barraPrin" className="navbar navbar-expand-lg navbar-light bg-light">
                    <div id="contenedorPrincipal" className="container-fluid">
                        {this.props.admin ? 
                            null 
                            : 
                            <button type="button" id="sidebarCollapse" className="btn btn-info" onClick={this.props.metodo} >
                            <i className="fas fa-align-left"></i>
                        </button>
                            }
                        <button id="cerrar" type="button" className="btn btn-info" onClick={this.props.cerrarSesion} >
                            <i className="fas fa-align-left"></i>
                        </button>

                    </div>
                </nav>

            )
        }
    }
}

export default Navbar;
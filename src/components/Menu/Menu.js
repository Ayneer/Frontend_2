import React from 'react';
import { Link } from 'react-router-dom';
import './menu.css';

class Menu extends React.Component {

    render() {
            return (
                <nav id="sidebar" className={this.props.estado}>

                    <div className="sidebar-header">
                        <h3>Energía App</h3>
                    </div>
                    <ul className="list-unstyled components">

                        {/* Subtitulo del menú */}
                        <p>¡Gestiona tu energía!</p>

                        {/* Items del menú */}
                        <li className="impar">
                            <button id="consumo" className="item" >
                                <Link to='/App/consumo'>Mi consumo</Link>
                            </button>
                        </li>
                        <li className="par">
                            <button id="consumo" className="item" >
                                <Link to='/App/historial'>Mi historial</Link>
                            </button>
                        </li>
                        <li className="impar">
                            <button id="limite" className="item">
                                <Link to='/App/limite'>Limite</Link>
                            </button>
                        </li>
                        <li className="impar">
                            <button id="ajustes" className="item">
                                <Link to='/App/ajustes'>Ajustes</Link>
                            </button>
                        </li>
                    </ul>
                    <div id="copyright">
                        <p>Copyright &copy; 2019.<br></br> Ayneer Gonzalez & Karen Benedetti. Todos los derechos reservados.</p>
                    </div>
                </nav>
            )
        
    }
}

export default Menu;
import React from 'react';
import './cargando.css';

function CargandoPagina() {
    return (
        <div className="container">
            <div className="lds-ring">
                <div ></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}

export default CargandoPagina

import React from 'react';

let usuario = {};

class Ayuda extends React.Component {
    
    capturarRespuestaServidor(respuestaS) {
        console.log(usuario);
        if (!respuestaS.estado) {
            this.props.history.push('/');// Se redirecciona a inicio de sesion
        } else {
            usuario = respuestaS.usuario;
            console.log(usuario);
        }
    }

    componentWillMount() {
        fetch('http://192.168.1.54:3500/estoyAutenticado', {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json'
            }
        }).then(function (response) {
            return response.json();
        }).then(res => this.capturarRespuestaServidor(res)).catch(error => console.error('Error:', error));
    }

    render() {

        
        return (
            <div> Ayuda </div>
        )
    }
}

export default Ayuda;
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function VentanaAsegurar({ estado, ocultarVentana, metodoAceptar, titulo, mensaje }) {

    return (
        <Modal show={estado} onHide={ocultarVentana} >

            <Modal.Header closeButton>
                <Modal.Title>{titulo}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {mensaje}
            </Modal.Body>

            <Modal.Footer>

                <Button onClick={ocultarVentana} variant="secondary">
                    Cancelar
                </Button>

                <Button variant="primary" onClick={metodoAceptar}>
                    Si, guardar cambios
                </Button>

            </Modal.Footer>
        </Modal>
    )
}

export default VentanaAsegurar;

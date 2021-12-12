import React,{useState} from 'react'
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal'
import './modal.css'

function ErrorModal(props) {
  
    const handleClose = () => props.setShow(false);
    const handleShow = () => props.setShow(true);

    const ref= React.createRef();
  
    return (
      <>

        <Modal show={props.show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title className=".bg-info">{props.titre}</Modal.Title>
          </Modal.Header>
          <Modal.Body ref={ref} >
                {props.error}
                <p> {props.error2} </p>
          </Modal.Body>
          <Modal.Footer>
            <Button  variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  
export default ErrorModal;
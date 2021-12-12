import React, { Component,useState } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import InfoStage from './InfoStage';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import './InfoStage.css'



function ModalPage(props) {


  // const [show, setShow] = useState(false);

  return (
    <div>

      <Modal
        show={props.show}
        size="lg"
        onHide={() => props.setShow(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
          Information de stage
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <InfoStage id={props.id}/>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ModalPage;
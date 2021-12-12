import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import FormInfo from "../../form/FormInfo";
import { API_URI } from "../../../config";
import { useAuthContext } from "../../../providers/index";
function FormPfe() {
  const [lgShow, setLgShow] = useState(false);

  return (
    <div>
      <Button onClick={() => setLgShow(true)} variant="success">
        Nouvelle Soumission
      </Button>
      <Modal
        size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Demande de stage
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormInfo />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default FormPfe;

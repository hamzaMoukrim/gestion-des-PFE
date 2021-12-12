import React, { useState, useEffect } from "react";
import ErrorModal from "../../modals/ErrorModal";
import { Form, Button, Table } from "react-bootstrap";
import Select from "react-select";
import Input from "../../form/Input";
import DatePicker from "react-datepicker";
import { DataGrid } from "@material-ui/data-grid";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URI } from "../../../config";

export default function ModifierChefDept() {
  let filiereId = useParams().id;

  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [error2, setError2] = useState("");

  const [selectedEnseignant, setSelectedEnseigant] = useState();
  const [password, setPassword] = useState("");
  const [selectedFiliere, setSelectedFiliere] = useState();
  const [filieres, setFilieres] = useState();
  const [enseignant, setEnseignant] = useState();

  useEffect(() => {
    axios
      .get(API_URI + "/api/enseignant/enseignants/" + filiereId)
      .then(function (response) {
        let t = [];

        response.data.enseignants.map((x) => {
          t.push({ value: x._id, label: x.nom + " " + x.prenom });
        });

        setEnseignant(t);

        // setrows(r)
      })
      .catch(function (error) {});
  }, []);

  const handleChange = (selectedEnseignant) => {
    setSelectedEnseigant(selectedEnseignant);
  };

  // style
  const submitButtonStyle = {
    margin: "20px",
    position: "relative",
    width: "200px",
    height: "50px",
  };

  const formStyle = {
    marginTop: "10px",
    marginBottom: "10px",
    paddingTop: "10px",
  };

  const handleRetour = () => {};

  const AddNewChefDept = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URI + "/api/enseignant/updateChefdept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          enseignantId: selectedEnseignant.value,
          filiereId: filiereId,
        }),
      });
      const responseData = await response.json();

      setError(responseData.message);
      setShow(true);
    } catch (error) {
      setError(error);
      setShow(true);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal
        show={show}
        setShow={setShow}
        error={error}
        titre=""
        error2={error2}
      />
      <div>
        <Form style={formStyle}>
          <div className="row" style={{ textAlign: "left" }}>
            <div className="col-lg-2">Enseigant :</div>

            <div className="col-lg-6">
              <Select
                value={selectedEnseignant}
                options={enseignant}
                onChange={handleChange}
              />
            </div>
          </div>

          <br />
          <br />
          <div className="row">
            <div className="col-md-6">
              <Button
                variant="primary"
                type="submit"
                style={submitButtonStyle}
                onClick={AddNewChefDept}
              >
                Ajouter
              </Button>
            </div>

            <div className="col-md-6">
              <Button
                variant="primary"
                type="submit"
                style={submitButtonStyle}
                onClick={handleRetour}
              >
                Retour
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </React.Fragment>
  );
}

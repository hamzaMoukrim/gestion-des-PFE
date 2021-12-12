import React, { useState, useEffect } from "react";
import { Form, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./NewJury.css";
import axios from "axios";
import Select from "react-select";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import ErrorModal from "../../modals/ErrorModal";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { API_URI } from "../../../config";
const NewJury = () => {
  const history = useHistory();
  const [profsOptions, setprofsOptions] = useState([]);
  const [sujetOptions, setsujetOptions] = useState([]);
  const [selectedProf, setSelectedProfs] = useState();
  const [selectedSujet, setSelectedSujet] = useState();
  const [profsLoaded, setprofsLoaded] = useState(false);
  const [sujetsLoaded, setsujetsLoaded] = useState(false);
  const [sallesLoaded, setsallesLoaded] = useState(false);
  // const [stageId, setStageId] = useState();
  const [rolesOptions, setRolesOptions] = useState([]);
  const [selectedRole, setSelectedRoles] = useState();
  const [rolesLoaded, setRolesLoaded] = useState();
  const [listeJury, setListeJury] = useState([]);
  const [show, setShow] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [stage, setStage] = useState([]);
  const [stageID, setStageID] = useState();
  const [loaded, setLoaded] = useState(false);

  const roles = [
    { value: 1, label: "President" },
    { value: 2, label: "Rapporteur" },
  ];

  const ajouterMembre = (event) => {
    const jury = {
      sujet: selectedSujet,
      enseignant: selectedProf,
      role: selectedRole,
    };
    var error = false;
    listeJury.forEach((jury) => {
      if (jury.enseignant == selectedProf || jury.role == selectedRole) {
        setShow(true);
        error = true;
      }
    });
    if (!error) {
      setListeJury([...listeJury, jury]);
    }
  };
  //getting enseignants

  useEffect(() => {
    axios
      .get(API_URI + "/api/enseignant")
      .then(function (response) {
        let t = [];
        response.data.enseignants.map((x) => {
          t.push({ value: x._id, label: x.nom + " " + x.prenom });
        });

        setprofsOptions(t);
        setprofsLoaded(true);
        setRolesOptions(roles);
        setRolesLoaded(true);
      })
      .catch(function (error) {});
  }, []);

  //getting stages

  useEffect(() => {
    axios
      .get(API_URI + "/api/stages/stages/valides")
      .then(function (response) {
        let t = [];
        response.data.stages.map((x) => {
          t.push({ value: x._id, label: x.description });
        });
        setsujetOptions(t);
        setsujetsLoaded(true);
      })
      .catch(function (error) {});
  }, []);

  const handleOnChangeSujet = (select) => {
    setSelectedSujet(select);
    const stageID = select.value;
    axios
      .get(API_URI + `/api/stages/stage/${stageID}`)
      .then(function (response) {
        console.log(response.data.stage);
        setStage(response.data.stage);
        setLoaded(true);
      })
      .catch(function (error) {});
  };
  const affecterJury = async (event) => {
    try {
      event.preventDefault();
      setShowConfirmation(true);
      const response = await fetch(API_URI + "/api/affectation/newjury", {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          listeJury: listeJury,
          sujet: selectedSujet,
        }),
      });
    } catch (err) {}
  };

  return (
    <div>
      <div className="header">Nouveau Jury</div>
      <div className="container ">
        <ErrorModal
          show={showConfirmation}
          setShow={setShowConfirmation}
          error={"le Jury a été bien affecté aux PFE !"}
          titre="Confirmation"
          path="/chefdept/newJury"
        />
        <div className="row">
          <ErrorModal
            show={show}
            setShow={setShow}
            error={"Enseignant ou Role déja exist !"}
            titre="Error"
          />
          <div className="col-lg-6">
            <Form.Group className="juryForm">
              <br />
              <Form.Row className="row">
                <Form.Label column="lg" lg={2} className="label">
                  Sujet :
                </Form.Label>
                <Col xs={7}>
                  {sujetsLoaded ? (
                    <Select
                      className="select"
                      options={sujetOptions}
                      name="sujet"
                      value={selectedSujet}
                      onChange={(select) => {
                        handleOnChangeSujet(select);
                      }}
                      labelledBy={"Select"}
                    />
                  ) : (
                    ""
                  )}
                </Col>
              </Form.Row>
              <br />
              <Form.Row className="row">
                <Form.Label column="lg" lg={2} className="label">
                  Enseignant :
                </Form.Label>
                <Col xs={7}>
                  {profsLoaded ? (
                    <Select
                      className="select"
                      options={profsOptions}
                      value={selectedProf}
                      name="jury"
                      onChange={(select) => setSelectedProfs(select)}
                      labelledBy={"Select"}
                    />
                  ) : (
                    ""
                  )}
                </Col>
              </Form.Row>
              <br />
              <Form.Row className="row">
                <Form.Label column="lg" lg={2} className="label">
                  Role :
                </Form.Label>
                <Col xs={7}>
                  {rolesLoaded ? (
                    <Select
                      className="select"
                      options={rolesOptions}
                      value={selectedRole}
                      name="jury"
                      onChange={(select) => setSelectedRoles(select)}
                      labelledBy={"Select"}
                    />
                  ) : (
                    ""
                  )}
                </Col>
              </Form.Row>
              <br />
              <br />
              <Form.Row className="row">
                <div className="btns">
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={(event) => ajouterMembre(event)}
                  >
                    Ajouter Membre
                  </Button>
                </div>
              </Form.Row>
            </Form.Group>
          </div>

          <div className="col-lg-6">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Enseignant</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {listeJury.map((jury) => {
                  return (
                    <tr key={jury.enseignant.value}>
                      <td>{jury.enseignant.label}</td>
                      <td>{jury.role.label}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <Button variant="primary" onClick={(event) => affecterJury(event)}>
              Affecter le jury
            </Button>
          </div>
          <div className="col-lg-15">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Etudiant</th>
                  <th>Binome</th>
                  <th>Encadrant Interne</th>
                  <th>Entreprise</th>
                  <th>Date debut</th>
                  <th>Date fin</th>
                </tr>
              </thead>
              <tbody>
                {selectedSujet ? (
                  <tr>
                    <td>{stage.etudiant}</td>
                    {stage.binome ? (
                      <td>{stage.binome}</td>
                    ) : (
                      <td>Sans binome</td>
                    )}

                    <td>
                      <li>{stage.encadrant1}</li>
                      {stage.encadrant2 ? (
                        <li>{stage.encadrant2}</li>
                      ) : (
                        <span></span>
                      )}
                    </td>
                    <td>{stage.entreprise}</td>
                    <td>{stage.dateDebut}</td>
                    <td>{stage.dateFin}</td>
                  </tr>
                ) : (
                  <span></span>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewJury;

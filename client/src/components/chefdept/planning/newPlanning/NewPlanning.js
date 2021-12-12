import React, { useState, useEffect } from "react";
import { Form, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./NewPlanning.css";
import MultiSelect from "react-multi-select-component";
import axios from "axios";
import Select from "react-select";
import { useParams } from "react-router";
import { Link, Redirect } from "react-router-dom";
import ErrorModal from "../../../modals/ErrorModal";
import { API_URI } from "../../../../config";

const NewPlanning = () => {
  const planningID = useParams().planningID;
  const [sujetOptions, setsujetOptions] = useState([]);
  const [selectedSujet, setSelectedSujet] = useState([]);
  const [profsLoaded, setprofsLoaded] = useState(false);
  const [sujetsLoaded, setsujetsLoaded] = useState(false);
  const [salleOptions, setsalleOptions] = useState([]);
  const [sallesLoaded, setsallesLoaded] = useState(false);
  const [selectedSalle, setselectedSalle] = useState([]);
  const [jour, setJour] = useState(new Date());
  const [heureDebut, setHeureDebut] = useState(new Date());
  const [heureFin, setHeureFin] = useState(new Date());
  const [stageId, setStageId] = useState();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorDate, setErrorDate] = useState(false);

  const formatNumber = (number) => {
    if (0 < parseInt(number) < 10) {
      return "0" + parseInt(number);
    } else return number.toString();
  };
  const formatDate = (dateTime) => {
    const date =
      dateTime.getDay() +
      "/" +
      dateTime.getMonth() +
      "/" +
      dateTime.getFullYear();
    const time =
      parseInt(dateTime.getHours()) + ":" + parseInt(dateTime.getMinutes());
    return {
      date: date,
      time: time,
    };
  };
  const submitPlannig = async (event) => {
    try {
      event.preventDefault();

      const response = await fetch(API_URI + "/api/planning/newplanning", {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          planningID: planningID,
          jour: formatDate(jour).date,
          heureDebut: formatDate(heureDebut).time,
          heureFin: formatDate(heureFin).time,
          salle: selectedSalle.label,
        }),
      });
    } catch (err) {}
  };
  const handleChange = (date) => {
    setJour(date);
  };
  const handleHeureDebutChange = (date) => {
    setHeureDebut(date);
  };
  const handleHeureFinChange = (date) => {
    setHeureFin(date);
  };

  const sallesOptions = [
    {
      value: 1,
      label: "salle 1",
    },
    {
      value: 2,
      label: "salle 2",
    },
    {
      value: 3,
      label: "salle 3",
    },
  ];

  //getting stages

  useEffect(() => {
    axios
      .get(API_URI + "/api/stages")
      .then(function (response) {
        let t = [];

        response.data.stages.map((x) => {
          t.push({ value: x._id, label: x.description });
        });
        console.log(t);
        setsujetOptions(t);
        setsujetsLoaded(true);
      })
      .catch(function (error) {});
  }, []);
  useEffect(() => {
    setsalleOptions(sallesOptions);
    setsallesLoaded(true);
  }, []);
  return (
    <div>
      <div className="header">Nouveau Planning</div>
      <div className="container">
        <ErrorModal
          show={showConfirmation}
          setShow={setShowConfirmation}
          error={"le planning a été bien éffectué !"}
          titre="Confirmation"
          path="/chefdept/planning"
        />
        <ErrorModal
          show={errorDate}
          setShow={setErrorDate}
          error={"Heure début doit étre inférieur à l'heure de fin!"}
          titre="Error"
          path="/chefdept/newPlanning"
        />
        <Form.Group className="planningForm">
          <Form.Row className="row">
            <Form.Label column="lg" lg={2} className="label">
              Jour :{" "}
            </Form.Label>
            <Col xs={2}>
              <DatePicker
                className="picker"
                selected={jour}
                onChange={(date) => handleChange(date)}
                name="jour"
                dateFormat="MM/dd/yyyy"
              />
            </Col>
          </Form.Row>
          <br />
          <Form.Row className="row" inline>
            <Form.Label column="lg" lg={2} className="label">
              Heure:{" "}
            </Form.Label>

            <Form.Label column="lg" lg={2} className="from">
              De:{" "}
            </Form.Label>
            <Col xs={2}>
              <DatePicker
                className="picker picckerTime"
                selected={heureDebut}
                onChange={(date) => handleHeureDebutChange(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                name="heureDebut"
                timeCaption="Time"
                dateFormat="h:mm aa"
              />
            </Col>
            <Form.Label column="lg" lg={2} className="to">
              A:{" "}
            </Form.Label>
            <Col xs={2}>
              <DatePicker
                className="picker picckerTime"
                selected={heureFin}
                onChange={(date) => {
                  handleHeureFinChange(date);
                  if (heureDebut > date) {
                    setErrorDate(true);
                  }
                }}
                showTimeSelect
                showTimeSelectOnly
                name="heureFin"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
              />
            </Col>
          </Form.Row>

          <br />
          <Form.Row className="row">
            <Form.Label column="lg" lg={2} className="label">
              Salle :
            </Form.Label>
            <Col xs={7}>
              {sujetsLoaded ? (
                <Select
                  className="select"
                  options={salleOptions}
                  value={selectedSalle}
                  name="salle"
                  onChange={(selects) => setselectedSalle(selects)}
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
              <button
                className="btn btn-success"
                type="submit"
                onClick={(event) => {
                  submitPlannig(event);
                  setShowConfirmation(true);
                }}
              >
                Valider
              </button>
              <button className="btn btn-danger">Annuler</button>
            </div>
          </Form.Row>
        </Form.Group>
      </div>
    </div>
  );
};

export default NewPlanning;

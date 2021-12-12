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

export default function ModifierEnseigant() {
  let enseignantId = useParams().id;

  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [error2, setError2] = useState("");

  const [Nom, setNom] = useState("");
  const [Prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedFiliere, setSelectedFiliere] = useState();
  const [filieres, setFilieres] = useState();
  const [loaded, setloaded] = useState(false);

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

  const handleModifier = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        API_URI + "/api/enseignant/updateEnseignant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            enseignantId,
            enseignantId,
            email: email,
            prenom: Prenom,
            filiere: selectedFiliere.value,
            nom: Nom,
            userName: username,
            password: password,
          }),
        }
      );
      const responseData = await response.json();

      setError(responseData.message);
      setShow(true);
    } catch (error) {
      setError(error);
      setShow(true);
    }
  };

  const handleChangeFilirere = () => {};

  // fetching filiere

  useEffect(() => {
    axios
      .get(API_URI + "/api/filieres")
      .then(function (response) {
        let t = [];

        response.data.filieres.map((x) => {
          t.push({ value: x._id, label: x.nomFiliere });
        });
        setFilieres(t);
        setSelectedFiliere(t[0]);

        // setrows(r)
      })
      .catch(function (error) {});
  }, []);

  //  remplir les chmaps

  useEffect(() => {
    axios
      .get(API_URI + "/api/enseignant/engseignant/" + enseignantId)
      .then((res) => {
        const e = res.data.enseignant;

        const u = res.data.user;
        setNom(e.nom);
        setPrenom(e.prenom);
        setUsername(u.userName);
        setPassword(u.password);
        setEmail(e.email);
        setloaded(true);
      })
      .catch((error) => console.error(`Error : ${error}`));
  }, []);

  return (
    <React.Fragment>
      <ErrorModal
        show={show}
        setShow={setShow}
        error={error}
        titre=""
        error2={error2}
      />

      {loaded ? (
        <Form style={formStyle}>
          <div className="row">
            <div className="col-lg-6">
              <Input
                id="formNom"
                label="Nom"
                type="text"
                placeHolder="Nom"
                className="text-muted"
                text=""
                value={Nom}
                inputValue={Nom}
                setInput={setNom}
              />
            </div>

            <div className="col-lg-6">
              <Input
                id="formPrenom"
                label="Prenom"
                type="text"
                placeHolder="Prénom"
                className="text-muted"
                text=""
                value={Prenom}
                inputValue={Prenom}
                setInput={setPrenom}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-6" style={{ textAlign: "left" }}>
              <Input
                id="formUsername"
                label="Nom d'etulisateur"
                type="text"
                placeHolder="Username de l'identification"
                className="text-muted"
                text=""
                value={username}
                inputValue={username}
                setInput={setUsername}
              />
            </div>

            <div className="col-lg-6" style={{ textAlign: "left" }}>
              <Input
                id="formPassword"
                label="Mot de passe"
                type="text"
                placeHolder="Password de l'identification"
                className="text-muted"
                text=""
                value={password}
                inputValue={password}
                setInput={setPassword}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-6 f" style={{ textAlign: "left" }}>
              <label>filiere</label>
              <Select
                value={selectedFiliere}
                onChange={handleChangeFilirere}
                options={filieres}
                placeholder="filiere"
              />
            </div>

            <div className="col-lg-6" style={{ textAlign: "left" }}>
              <Input
                id="formEmail"
                label="Email"
                type="email"
                placeHolder="adresse email"
                className="text-muted"
                value={email}
                inputValue={email}
                setInput={setEmail}
              />
            </div>
          </div>

          <br />

          <Button
            variant="primary"
            type="submit"
            style={submitButtonStyle}
            onClick={handleModifier}
          >
            Modifier
          </Button>
        </Form>
      ) : (
        ""
      )}
    </React.Fragment>
  );
}

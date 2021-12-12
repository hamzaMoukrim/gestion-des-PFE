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

export default function ModifierEtudiant() {
  let studentId = useParams().id;

  const [selectedFiliere, setSelectedFiliere] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [fil, setFil] = useState([]);
  const [options, setOptions] = useState([]);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [error2, setError2] = useState("");

  const [Nom, setNom] = useState("");
  const [Prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [matricule, setMatricule] = useState("");
  const [cin, setCin] = useState("");
  const [cne, setCne] = useState("");
  const [genre, setGenre] = useState("");
  const [dateNaissance, setDateNaissance] = useState(new Date());
  const [option, setOption] = useState([]);
  const [AnneeStage, setAnneeStage] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [filieres, setFiliere] = useState([]);
  const [loaded, setloaded] = useState(false);

  const handleChange = (selectedFiliere) => {
    setSelectedFiliere(selectedFiliere);
  };
  const handleChangeOption = (selectedOption) => {
    setSelectedOption(selectedOption);
  };
  // add student
  const handleAjouterEtudiant = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(API_URI + "/api/students/updateStudent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          studentId,
          studentId,
          email: email,
          prenom: Prenom,
          cin: cin,
          cne: cne,
          telephone: telephone,
          genre: genre,
          matricule: matricule,
          promotion: AnneeStage,

          optionId: selectedOption.value,
          dateNaissance: dateNaissance,
          nom: Nom,
          userName: username,
          password: password,
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

  //get options

  useEffect(() => {
    axios
      .get(API_URI + "/api/filieres/options/" + studentId)
      .then(function (response) {
        let t = [],
          r = [];

        response.data.options.options.map((x) => {
          t.push({ value: x._id, label: x.nomOption });
        });

        r.push({
          value: response.data.options._id,
          label: response.data.options.nomFiliere,
        });

        setOption(t);
        setFiliere(r);
        setSelectedFiliere(r[0]);
      })
      .catch(function (error) {});
  }, []);

  //get student

  useEffect(() => {
    student();
  }, []);

  const student = () => {
    axios
      .get(API_URI + "/api/students/getStudent/" + studentId)
      .then((res) => {
        const s = res.data.student;
        const u = res.data.user;
        setMatricule(s.matricule);
        setNom(s.nom);
        setPrenom(s.prenom);
        setCin(s.cin);
        setCne(s.cne);
        setTelephone(s.telephone);
        setGenre(s.genre);
        setUsername(u.userName);
        setPassword(u.password);
        setAnneeStage(s.promotion);
        setEmail(s.email);
        setDateNaissance(Date.parse(s.dateNaissance));
        setloaded(true);
      })
      .catch((error) => console.error(`Error : ${error}`));
  };

  // add new student
  const addNewStudent = async (event) => {
    // add logic here.
  };

  // retour button
  const handleRetour = () => {
    // add logic of back her
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

  return (
    <React.Fragment>
      <ErrorModal
        show={show}
        setShow={setShow}
        error={error}
        titre=""
        error2={error2}
      />
      <div className="row">
        <div className="col-lg-4 mb-5">
          <label>Choisir la filiere et l'option de l'etudiant</label>
        </div>

        <div className="col-lg-4">
          <Select
            value={selectedFiliere}
            onChange={handleChange}
            options={filieres}
            placeholder="filiere"
            disabled="true"
          />
        </div>

        <div className="col-lg-4" style={{ textAlign: "left" }}>
          <Select
            value={selectedOption}
            onChange={handleChangeOption}
            options={option}
            placeholder="Option"
          />
        </div>
      </div>

      {loaded ? (
        <Form style={formStyle}>
          <div className="row">
            <div className="col-lg-4">
              <Input
                id="formMatricule"
                label="Matricule"
                type="text"
                placeHolder="Matricule"
                className="text-muted"
                text=""
                value={matricule}
                inputValue={matricule}
                setInput={setMatricule}
              />
            </div>

            <div className="col-lg-4">
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

            <div className="col-lg-4">
              <Input
                id="formPrenom"
                label="Prénom"
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
            <div className="col-lg-4">
              <Input
                id="formCni"
                label="CNI"
                type="text"
                placeHolder="Carte Nationale d'Identité"
                className="text-muted"
                text=""
                value={cin}
                inputValue={cin}
                setInput={setCin}
              />
            </div>

            <div className="col-lg-4">
              <Input
                id="formCne"
                label="CNE"
                type="text"
                placeHolder="Code national de l'étudiant"
                className="text-muted"
                text=""
                value={cne}
                inputValue={cne}
                setInput={setCne}
              />
            </div>

            <div className="col-lg-4">
              <Input
                id="formTelephone"
                label="Telephone"
                type="text"
                placeHolder="Numero de telephone"
                className="text-muted"
                text=""
                value={telephone}
                inputValue={telephone}
                setInput={setTelephone}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-4">
              <Input
                id="formGenre"
                label="Genre"
                type="text"
                placeHolder="M (Masculin) ou F (Feminin)"
                className="text-muted"
                text=""
                value={genre}
                inputValue={genre}
                setInput={setGenre}
              />
            </div>

            <div className="col-lg-4" style={{ textAlign: "left" }}>
              <Input
                id="formUsername"
                label="Username"
                type="text"
                placeHolder="Username de l'identification"
                className="text-muted"
                text=""
                value={username}
                inputValue={username}
                setInput={setUsername}
              />
            </div>

            <div className="col-lg-4" style={{ textAlign: "left" }}>
              <Input
                id="formPassword"
                label="Password"
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
            <div className="col-lg-4">
              <Input
                id="formAnneeStage"
                label="Annee de Stage"
                type="text"
                placeHolder="Numero de telephone"
                className="text-muted"
                text=""
                value={AnneeStage}
                inputValue={AnneeStage}
                setInput={setAnneeStage}
              />
            </div>

            <div className="col-lg-4">
              <Input
                id="formEmail"
                label="Email"
                type="email"
                placeHolder="test@gmail.com"
                className="text-muted"
                value={email}
                inputValue={email}
                setInput={setEmail}
              />
            </div>

            <div className="col-lg-4" style={{ textAlign: "left" }}>
              <label>Date de Naissance </label>

              <DatePicker
                style={{ width: "inherit" }}
                selected={dateNaissance}
                onChange={(date) => {
                  setDateNaissance(date);
                }}
              />
            </div>
          </div>
        </Form>
      ) : (
        ""
      )}
      <Button
        variant="primary"
        type="submit"
        style={submitButtonStyle}
        onClick={handleAjouterEtudiant}
      >
        Enregister
      </Button>

      <Button
        variant="primary"
        type="submit"
        style={submitButtonStyle}
        onClick={handleRetour}
      >
        Retour
      </Button>
    </React.Fragment>
  );
}

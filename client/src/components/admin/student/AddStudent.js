import React, { useState, useEffect } from "react";
import axios from "axios";

import ErrorModal from "../../modals/ErrorModal";
import { Form, Button, Table } from "react-bootstrap";
import Select from "react-select";
import Input from "../../form/Input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./addStudent.css";
import * as XLSX from "xlsx";
import { DataGrid } from "@material-ui/data-grid";
import { API_URI } from "../../../config";

export default function AddStudent() {
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [error2, setError2] = useState("");
  const [add, setAdd] = useState(true);
  const [adddManually, setAdddManually] = useState(true);
  const [filierTrigger, setFilierTrigger] = useState(false);
  const [optionTrigger, setOptionTrigger] = useState(false);
  const [filieres, setFiliere] = useState([]);
  const [items, setItems] = useState([]);
  const [showTable, setShowTable] = useState(true);

  const [fil, setFil] = useState([]);
  const [options, setOptions] = useState([]);

  const [Nom, setNom] = useState("");
  const [Prenom, setPrenom] = useState("");
  const [tel, setTel] = useState("");
  const [matricule, setMatricule] = useState("");
  const [cin, setCin] = useState("");
  const [cne, setCne] = useState("");
  const [genre, setGenre] = useState("");
  const [dateNaissance, setDateNaissance] = useState(new Date());
  //const [filieres, setFilieres] = useState([]);
  const [selectedFiliere, setSelectedFiliere] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [option, setOption] = useState([]);
  const [AnneeStage, setAnneeStage] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [buttons, setButtons] = useState(true);

  const handleChange = (selectedFiliere) => {
    setSelectedFiliere(selectedFiliere);
    setFilierTrigger(true);
  };

  const handleChangeOption = (selectedOption) => {
    setSelectedOption(selectedOption);
    setAdd(false);
  };
  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      setItems(d);
      console.clear();

      setAdd(true);
      setShowTable(false);
    });
  };

  // handle student to show form and hidde add buttons

  const handleAddStudent = () => {
    setAdddManually(false);
    setAdd(true);
    setShowTable(true);
    setButtons(false);
  };

  // table colums
  const columns = [
    { field: "id", headerName: "Matricule", width: 150 },
    { field: "nom", headerName: "Nom", width: 150 },
    { field: "prenom", headerName: "Prenom", width: 150 },
    {
      field: "dateNaissance",
      headerName: "Naissance",
      type: "date",
      width: 150,
    },
    { field: "cne", headerName: "CNE", width: 120 },
    { field: "cin", headerName: "CNE", width: 120 },
    { field: "genre", headerName: "Genre", width: 120 },
    { field: "email", headerName: "Email", width: 160 },
    { field: "telephone", headerName: "Telephone", width: 120 },
    { field: "promotion", headerName: "promotion", width: 120 },
    { field: "userName", headerName: "Username", width: 120 },
    { field: "password", headerName: "Password", width: 120 },
  ];

  // // table rows
  const [rows, setrows] = useState([]);
  let t = [];
  items.map((item) => {
    t.push({
      id: item.Matricule,
      nom: item.Nom,
      prenom: item.Prenom,
      dateNaissance: item.Test,
      cne: item.CNE,
      cin: item.CNI,
      email: item.Email,
      telephone: item.Telephone,
      genre: item.Genre,
      promotion: item.promotion,
      userName: item.Username,
      password: item.Password,
    });
  });

  useEffect(() => {
    axios
      .get(API_URI + "/api/filieres")
      .then(function (response) {
        let t = [],
          opts = [];
        setFil(response.data.filieres);
        response.data.filieres.map((x) => {
          t.push({ value: x._id, label: x.nomFiliere });
        });

        setFiliere(t);

        // setrows(r)
      })
      .catch(function (error) {});
  }, [filieres]);

  useEffect(() => {
    const table = [];
    fil.map((f) => {
      if (f._id == selectedFiliere.value) {
        f.options.map((x) => {
          table.push({ value: x._id, label: x.nomOption });
        });
      }
    });
    setOption(table);
  }, [selectedFiliere]);

  const addNewStudent = async (event) => {
    // add logic here.
  };

  const handleRetour = () => {
    // add logic of back her
  };
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
  // ajouter etudiant
  const handleAjouterEtudiant = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URI + "/api/students/addStudent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          filiereId: selectedFiliere.value,
          optionId: selectedOption.value,
          etudiants: t,
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
      <div className="row mb-6 ">
        <div className="col-lg-4 mb-5">
          <label>Choisir la filiere et l'option de l'etudiant</label>
        </div>

        <div className="col-lg-4">
          <Select
            value={selectedFiliere}
            onChange={handleChange}
            options={filieres}
            placeholder="filiere"
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

      {add ? (
        ""
      ) : (
        <div className="row">
          <div className="col-lg-6">
            <div className="toolImport">
              <span className="file-input btn btn-primary btn-file ">
                Importer &nbsp;
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    readExcel(file);
                  }}
                />
              </span>
            </div>
          </div>
        </div>
      )}

      {showTable ? (
        ""
      ) : (
        <div className="bg-white" style={{ height: 400, width: "100%" }}>
          <DataGrid rows={t} columns={columns} pageSize={5} checkboxSelection />
        </div>
      )}

      {adddManually ? (
        ""
      ) : (
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
                value={tel}
                inputValue={tel}
                setInput={setTel}
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

          {/* 
          <Button
        variant="primary"
        type="submit"
        style={submitButtonStyle}
        onClick={addNewStudent}
      >
        Ajouter Etudiant
      </Button>
          */}
        </Form>
      )}
      <div className=" row mb-5 tool">
        <Button
          variant="primary"
          type="submit"
          style={submitButtonStyle}
          onClick={handleAjouterEtudiant}
        >
          Ajouter
        </Button>

        <Button
          variant="primary"
          type="submit"
          style={submitButtonStyle}
          onClick={handleRetour}
        >
          Retour
        </Button>
      </div>
    </React.Fragment>
  );
}

import { Form, Button, Table } from "react-bootstrap";
import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Input from "../../form/Input";
import axios from "axios";
import MultiSelect from "react-multi-select-component";
import ErrorModal from "../../modals/ErrorModal";
import Select from "react-select";
import "./stageform.css";
import { Link } from "react-router-dom";

const InfoStage = (props) => {
  const [startDate, setStartDate] = useState(new Date());
  const [finDate, setFinDate] = useState(new Date());
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [organisme, setOrganisme] = useState("");
  const [rep, setRep] = useState("");
  const [encExterne, setEncExterne] = useState("");
  const [description, setDescription] = useState("");
  const [ville, setVille] = useState("");
  const [pays, setPays] = useState("");
  const [selectedProfs, setSelectedProfs] = useState([]);

  const [options, setOptions] = useState([]);

  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const [binome, setBinome] = useState("d-none");

  const [students, setstudents] = useState([]);

  //getting students

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/students", { withCredentials: true })
      .then(function (response) {
        let t = [];

        response.data.students.map((x) => {
          t.push({ value: x._id, label: x.nom + " " + x.prenom });
        });

        setstudents(t);
      })
      .catch(function (error) {});
  }, []);

  //getting enseignants

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/enseignant", { withCredentials: true })
      .then(function (response) {
        let t = [];

        response.data.enseignants.map((x) => {
          t.push({ value: x._id, label: x.nom + " " + x.prenom });
          console.log(t);
        });

        setOptions(t);
      })
      .catch(function (error) {});
  }, []);

  const submitStage = async (event) => {
    event.preventDefault();
    let profs = [];
    selectedProfs.map((x) => {
      profs.push(x.value);
    });

    try {
      const response = await fetch("http://localhost:5000/api/stage/newstage", {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email,
          tel: tel,
          organisme: organisme,
          rep: rep,
          encExterne: encExterne,
          description: description,
          ville: ville,
          pays: pays,
          selectedProfs: profs,
          startDate: startDate.toISOString().substring(0, 10),
          finDate: finDate.toISOString().substring(0, 10),
          userId: props.userId,
          binome: enBinome ? "" : selectedBinome.value,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        setError(responseData.message);
        setShow(false);
      } else {
        setError(responseData.message);
        setShow(false);
      }
    } catch (error) {}
  };

  const formStyle = {
    marginTop: "10px",
    marginBottom: "10px",
    paddingTop: "10px",
  };
  const submitButtonStyle = {
    margin: "20px",
    position: "relative",
    width: "200px",
    height: "50px",
  };

  const [selectedBinome, setSelectedBinome] = useState("");
  const [enBinome, setenBinome] = useState(false);
  const handleChange = (selectedBinome) => {
    setSelectedBinome(selectedBinome);
    console.log(`Option selected:`, selectedBinome.value);
  };

  return (
    <React.Fragment>
      <ErrorModal show={show} setShow={setShow} error={error} titre="" />

      <Form style={formStyle}>
        <div className="col-lg-6 mb-4" style={{ textAlign: "left" }}>
          <label>Stage</label>

          <select
            className="form-control"
            id="sel1"
            value={binome}
            onChange={(e) => {
              if (e.target.value === "d-none") {
                setenBinome(false);
              } else {
                setenBinome(false);
              }
              setBinome(e.target.value);
              console.log(e.target.value);
            }}
          >
            <option value="d-none">Monôme</option>
            <option value="">Binôme</option>
          </select>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <Input
              id="formMatricule"
              label="Matricule"
              type="text"
              placeHolder={props.userInfo.matricule}
              className="text-muted"
              text=""
              readonly={false}
            />
          </div>
          <div className="col-lg-6">
            <Input
              id="formNom"
              label="Nom"
              type="text"
              placeHolder={props.userInfo.nom}
              className="text-muted"
              text=""
              readonly={false}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <Input
              id="formPrenom"
              label="Prenom"
              type="text"
              placeHolder={props.userInfo.prenom}
              className="text-muted"
              text=""
              readonly={false}
            />
          </div>
          <div className="col-lg-6">
            <Input
              id="formCIN"
              label="CIN"
              type="text"
              placeHolder={props.userInfo.cin}
              className="text-muted"
              text=""
              readonly={false}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <Input
              id="formCNE"
              label="CNE"
              type="text"
              placeHolder={props.userInfo.cne}
              className="text-muted"
              text=""
              readonly={false}
            />
          </div>

          <div className="col-lg-6">
            <Input
              id="formDateNaissance"
              label="Date de Naissance"
              type="text"
              placeHolder={props.userInfo.dateNaissance}
              className="text-muted"
              text=""
              readonly={false}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <Input
              id="formGenre"
              label="Genre"
              type="text"
              placeHolder={props.userInfo.genre}
              className="text-muted"
              text=""
              readonly={false}
            />
          </div>

          <div className="col-lg-6">
            <Input
              id="formFiliere"
              label="Filiere"
              type="text"
              placeHolder=""
              className="text-muted"
              readonly={false}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <Input
              id="formAnnee"
              label="Année"
              type="text"
              placeHolder={props.userInfo.promotion}
              className="text-muted"
              readonly={false}
            />
          </div>
          <div className="col-lg-6">
            <Input
              id="formEmail"
              label="Email"
              type="email"
              placeHolder="test@gmail.com"
              className="text-muted"
              inputValue={email}
              setInput={setEmail}
            />
          </div>
        </div>
        <div className={"col-lg-6 " + binome} style={{ textAlign: "left" }}>
          <label>Choisi votre Binome</label>

          <Select
            value={selectedBinome}
            onChange={handleChange}
            options={students}
          />
        </div>

        <div className="row">
          <div className="col-lg-6">
            <Input
              id="formTelephone"
              label="Telephone"
              type="text"
              placeHolder="0652485514"
              className="text-muted"
              text=""
              inputValue={tel}
              setInput={setTel}
            />
          </div>

          <div className="col-lg-6">
            <Input
              id="formOrganismeAcceuil"
              label="Organisme D'acceuil"
              type="text"
              placeHolder="emi"
              className="text-muted"
              inputValue={organisme}
              setInput={setOrganisme}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <Input
              id="formPostDuRepresentant"
              label="
            Poste Du Representant"
              type="text"
              placeHolder="Chef de Projet Senior SI"
              className="text-muted"
              inputValue={rep}
              setInput={setRep}
            />
          </div>

          <div className="col-lg-6">
            <Input
              id="formEncadrantExterne"
              label="Encadrant Externe"
              type="text"
              placeHolder=""
              className="text-muted"
              inputValue={encExterne}
              setInput={setEncExterne}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6" style={{ textAlign: "left" }}>
            <label>Encadrant interne</label>

            <MultiSelect
              options={options}
              value={selectedProfs}
              onChange={setSelectedProfs}
              labelledBy={"Select"}
            />
          </div>
          <div className="col-lg-6">
            <Input
              id="formTitreStage"
              label="Titre De Stage"
              type="text"
              placeHolder="..."
              className="text-muted"
              inputValue={description}
              setInput={setDescription}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6" style={{ textAlign: "left" }}>
            <div>
              <label>Date Debut</label>
            </div>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
            />
          </div>

          <div className="col-lg-6" style={{ textAlign: "left" }}>
            <div>
              <label>Date Fin</label>
            </div>
            <DatePicker
              style={{ width: "100%" }}
              selected={finDate}
              onChange={(date) => {
                setFinDate(date);
              }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <Input
              id="formVilleStage"
              label="Ville de Stage"
              type="text"
              placeHolder="Rabat"
              className="text-muted"
              inputValue={ville}
              setInput={setVille}
            />
          </div>

          <div className="col-lg-6">
            <Input
              id="formPaysStage"
              label="Pays de Stage"
              type="text"
              placeHolder="Maroc"
              className="text-muted"
              inputValue={pays}
              setInput={setPays}
            />
          </div>
          <Link to="/enseignant/commenterstage">
            <Button
              classeName="center"
              variant="primary"
              type="submit"
              style={submitButtonStyle}
            >
              Contact l'Etudiant
            </Button>
          </Link>
        </div>
      </Form>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoged: state.isLoged,
    userInfo: state.userInfo,
    userId: state.userId,
  };
};

// const mapDispatchToProps =(dispatch) =>{
//   return{
//       onLoginSucceed:(userid,userinfo)=> dispatch({type:actionTypes.LOGED,userid:userid,userinfo})
//   }
// }

export default connect(mapStateToProps, null)(InfoStage);

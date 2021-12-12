import { Form, Button, Table } from "react-bootstrap";
import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Input from "./Input";
import axios from "axios";
import MultiSelect from "react-multi-select-component";
import ErrorModal from "../modals/ErrorModal";
import Select from "react-select";
import FileUpload from "../util/fileUpload/FileUpload";
import { TagInput } from "reactjs-tag-input";
import { useAuthContext } from "../../providers/index";
import TagsInput from "./TagsInput";
import { API_URI } from "../../config";

const FormInfo = (props) => {
  const { user } = useAuthContext();

  const [startDate, setStartDate] = useState(new Date());
  const [finDate, setFinDate] = useState(new Date());
  const [email, setEmail] = useState(user.stageId != null ? user.email : "");
  const [tel, setTel] = useState(user.stageId != null ? user.tel : "");
  const [organisme, setOrganisme] = useState(
    user.stageId != null ? user.stage.organismeAceuil : ""
  );
  const [rep, setRep] = useState(
    user.stageId != null ? user.stage.posteRepresentant : ""
  );
  const [encExterne, setEncExterne] = useState(
    user.stageId != null ? user.stage.encadrantExterne : ""
  );
  const [description, setDescription] = useState(
    user.stageId != null ? user.stage.description : ""
  );
  const [ville, setVille] = useState(
    user.stageId != null ? user.stage.villeStage : ""
  );
  const [pays, setPays] = useState(
    user.stageId != null ? user.stage.paysStage : ""
  );
  const [selectedProfs, setSelectedProfs] = useState([]);

  const [options, setOptions] = useState([]);

  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [error2, setError2] = useState("");

  const [binome, setBinome] = useState("d-none");

  const [students, setstudents] = useState([]);

  const [file, setFile] = useState("");

  const [rapport, setRapport] = useState("");

  const [selectedBinome, setSelectedBinome] = useState("");
  const [enBinome, setenBinome] = useState(false);
  const handleChange = (selectedBinome) => {
    setSelectedBinome(selectedBinome);
  };

  const [etatStage, setetatStage] = useState(false);

  const [desc, setdesc] = useState("");

  const [tags, settags] = useState([]);

  const [emailEncadrantExterne, setemailEncadrantExterne] = useState("");

  const [selectedTags, setSelectedTags] = useState([]);

  const OnselectedTags = (tags) => {
    setSelectedTags(tags);
  };

  //getting students

  useEffect(() => {
    axios
      .get(API_URI + "/api/students")
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
      .get(API_URI + "/api/enseignant/enseignants/" + user.filiere._id)
      .then(function (response) {
        let t = [];

        if (user.stageId != null) {
          if (user.stage.signatureDept == "1") {
            setetatStage(true);
          }
        }

        response.data.enseignants.map((x) => {
          t.push({ value: x._id, label: x.nom + " " + x.prenom });
        });

        setOptions(t);
      })
      .catch(function (error) {});
  }, []);

  const submitStage = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    let profs = [];
    selectedProfs.map((x) => {
      profs.push(x.value);
    });

    let diffDate = parseInt((finDate - startDate) / (1000 * 60 * 60 * 24), 10);
    let validDate = diffDate > 180 ? false : true;

    try {
      let formData = new FormData();
      formData.append("email", email);
      formData.append("tel", tel);
      formData.append("organisme", organisme);
      formData.append("rep", rep);
      formData.append("encExterne", encExterne);
      //   profs.forEach((item) => {
      //     formData.append('selectedProfs', item)
      //  })
      formData.append("selectedProfs", JSON.stringify(profs));
      formData.append("pays", pays);
      formData.append("ville", ville);
      formData.append("startDate", startDate.toISOString().substring(0, 10));
      formData.append("finDate", finDate.toISOString().substring(0, 10));
      formData.append("userId", user._id);
      formData.append("binome", enBinome ? selectedBinome.value : "");
      formData.append("description", description);

      formData.append("emailEncadrantExterne", emailEncadrantExterne);

      formData.append("file", file);

      const response = await fetch(API_URI + "/api/stages/newstage", {
        method: "Post",
        headers: {},
        body: formData,
      });

      const responseData = await response.json();

      validDate
        ? setError2("")
        : setError2("La duree de stage depasse 6 mois !");
      setError(responseData.message);
      setShow(true);
    } catch (error) {}
  };

  // soumettre le rapport

  async function submitRapport(e) {
    e.preventDefault();
    const formData = new FormData();

    try {
      formData.append("file", rapport);
      formData.append("stageId", user.stage._id);

      const response = await fetch(API_URI + "/api/stages/rapport", {
        method: "Post",

        headers: {},
        body: formData,
      });

      const responseData = await response.json();

      setError(responseData.message);
      setShow(true);
    } catch (error) {}

    setError(error);
    setShow(true);
  }

  function onchangeDescription(e) {
    setdesc(e.target.value);
  }

  async function submitDescription(e) {
    e.preventDefault();

    axios
      .post(API_URI + "/api/stages/addKeywords", {
        stageId: user.stage._id,
        tags: selectedTags,
        desc: desc,
      })
      .then(
        (response) => {
          setError(response.data.msg);
          setShow(true);
        },
        (error) => {
          setError(error);
          setShow(true);
        }
      );
  }

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

  return (
    <React.Fragment>
      <ErrorModal
        show={show}
        setShow={setShow}
        error={error}
        titre=""
        error2={error2}
      />

      <Form style={formStyle}>
        <div className="row">
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
                  setenBinome(true);
                }
                setBinome(e.target.value);
              }}
              disabled={etatStage}
            >
              <option value="d-none">Monôme</option>
              <option value="">Binôme</option>
            </select>
          </div>

          <div className={"col-lg-6 " + binome} style={{ textAlign: "left" }}>
            <label>Choisi votre Binome</label>

            <Select
              value={selectedBinome}
              onChange={handleChange}
              options={students}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <Input
              id="formMatricule"
              label="Matricule"
              type="text"
              placeHolder={user.matricule}
              className="text-muted"
              text=""
              readonly={true}
            />
          </div>
          <div className="col-lg-6">
            <Input
              id="formNom"
              label="Nom"
              type="text"
              placeHolder={user.nom}
              className="text-muted"
              text=""
              readonly={true}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <Input
              id="formPrenom"
              label="Prenom"
              type="text"
              placeHolder={user.prenom}
              className="text-muted"
              text=""
              readonly={true}
            />
          </div>
          <div className="col-lg-6">
            <Input
              id="formCIN"
              label="CIN"
              type="text"
              placeHolder={user.cin}
              className="text-muted"
              text=""
              readonly={true}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <Input
              id="formCNE"
              label="CNE"
              type="text"
              placeHolder={user.cne}
              className="text-muted"
              text=""
              readonly={true}
            />
          </div>

          <div className="col-lg-6">
            <Input
              id="formDateNaissance"
              label="Date de Naissance"
              type="text"
              placeHolder={user.dateNaissance}
              className="text-muted"
              text=""
              readonly={true}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <Input
              id="formGenre"
              label="Genre"
              type="text"
              placeHolder={user.genre}
              className="text-muted"
              text=""
              readonly={true}
            />
          </div>

          <div className="col-lg-6">
            <Input
              id="formFiliere"
              label="Filiere"
              type="text"
              placeHolder={user.filiere.nomFiliere}
              className="text-muted"
              readonly={true}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <Input
              id="formAnnee"
              label="Année"
              type="text"
              placeHolder={user.promotion}
              className="text-muted"
              readonly={true}
            />
          </div>
          <div className="col-lg-6">
            <Input
              id="formEmail"
              label="Email"
              type="email"
              placeHolder="test@gmail.com"
              className="text-muted"
              value={email}
              inputValue={email}
              setInput={setEmail}
              readonly={etatStage}
            />
          </div>
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
              value={tel}
              inputValue={tel}
              setInput={setTel}
              readonly={etatStage}
            />
          </div>

          <div className="col-lg-6">
            <Input
              id="formOrganismeAcceuil"
              label="Organisme D'acceuil"
              type="text"
              placeHolder="emi"
              className="text-muted"
              value={organisme}
              inputValue={organisme}
              setInput={setOrganisme}
              readonly={etatStage}
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
              value={rep}
              inputValue={rep}
              setInput={setRep}
              readonly={etatStage}
            />
          </div>

          <div className="col-lg-6">
            <Input
              id="formEncadrantExterne"
              label="Encadrant Externe"
              type="text"
              placeHolder=""
              className="text-muted"
              value={encExterne}
              inputValue={encExterne}
              setInput={setEncExterne}
              readonly={etatStage}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <Input
              id="formTitreStage"
              label="Email de l'encadrant externe"
              type="text"
              placeHolder="Email de l'encadrant externe"
              className="text-muted"
              value={emailEncadrantExterne}
              inputValue={emailEncadrantExterne}
              setInput={setemailEncadrantExterne}
              readonly={etatStage}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <Input
              id="formTitreStage"
              label="Titre De Stage"
              type="text"
              placeHolder="..."
              className="text-muted"
              value={description}
              inputValue={description}
              setInput={setDescription}
              readonly={etatStage}
            />
          </div>

          <div className="col-lg-6" style={{ textAlign: "left" }}>
            <label>Encadrant interne</label>

            <MultiSelect
              options={options}
              value={selectedProfs}
              onChange={setSelectedProfs}
              labelledBy={"Select"}
              disabled={etatStage}
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
              value={ville}
              inputValue={ville}
              setInput={setVille}
              readonly={etatStage}
            />
          </div>

          <div className="col-lg-6">
            <Input
              id="formPaysStage"
              label="Pays de Stage"
              type="text"
              placeHolder="Maroc"
              className="text-muted"
              value={pays}
              inputValue={pays}
              setInput={setPays}
              readonly={etatStage}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6 mb-5" style={{ textAlign: "left" }}>
            <div>
              <label>Date Debut</label>
            </div>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              readOnly={etatStage}
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
              readOnly={etatStage}
            />
          </div>
        </div>

        {etatStage ? (
          ""
        ) : (
          <div className="col-lg-6">
            <FileUpload setFile={setFile} />
          </div>
        )}

        {etatStage ? (
          ""
        ) : (
          <Button
            variant="primary"
            type="submit"
            style={submitButtonStyle}
            onClick={submitStage}
            disabled={etatStage}
          >
            Enregistrer
          </Button>
        )}
      </Form>

      {etatStage ? (
        <div>
          <div className="row">
            <div className="col-md-5" style={{ textAlign: "left" }}>
              <label> keywords </label>
              <TagsInput selectedTags={OnselectedTags} tags={tags} />
            </div>
            <div className="col-md-5" style={{ textAlign: "left" }}>
              <label> Description </label>
              <textarea
                onChange={onchangeDescription}
                className="form-control"
                id="exampleFormControlTextarea1"
              />
            </div>
            <div className="col-md-1" style={{ textAlign: "left" }}>
              <label> </label>
              <Button
                variant="primary"
                type="submit"
                // style={submitButtonStyle}
                onClick={submitDescription}
              >
                Enregistrer
              </Button>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-6 mt-5" style={{ textAlign: "left" }}>
              <label> soumettre le rapport </label>
              <FileUpload setFile={setRapport} />
            </div>

            <div className="col-md-5 mt-5" style={{ textAlign: "left" }}>
              <label> </label>
              <Button
                variant="primary"
                type="submit"
                style={submitButtonStyle}
                onClick={submitRapport}
              >
                Enregistrer
              </Button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
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

export default connect(mapStateToProps, null)(FormInfo);

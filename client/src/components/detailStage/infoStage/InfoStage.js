import React, { useState, useEffect } from "react";
import Info from "./Info";
import { Form, Col, ButtonGroup, Button } from "react-bootstrap";
import axios from "axios";
const InfoStage = (props) => {
  const formStyle = {
    border: "1px solid",
    width: "70%",
    padding: "10px",
    backgroundColor: "white",
    position: "relative",
    transform: "translate(15%, 2%)",
  };

  //traitement backend :

  // ,user info
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [cin, setCin] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [annee, setAnnee] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [filiere, setFiliere] = useState("");
  const [cne, setCne] = useState("");
  const [genre, setGenre] = useState("");
  // stage info
  const [titreStage, setTitreStage] = useState("");
  const [dateDebut, setDateDebut] = useState(new Date());
  const [dateFin, setDateFin] = useState(new Date());
  const [posteRepresentant, setPosteRepresentant] = useState("");
  const [encadrantInterne, setEncadrantInterne] = useState("");
  const [encadrantExterne, setEncadrantExterne] = useState("");
  const [organismeAceuil, setOrganismeAceuil] = useState("");
  const [villeStage, setVilleStage] = useState("");
  const [paysStage, setPaysStage] = useState("");

  const [loadesUsers, setLoadedUsers] = useState();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/students", { withCredentials: true })
      .then(function (response) {
        let students = response.data.students;
        let student = students[0]; // à changer selon id de stage

        setNom(student.nom);
        setPrenom(student.prenom);
        setCin(student.cin);
        setDateNaissance(student.dateNaissance);
        setTel(student.tel);
        setEmail(student.email);
        setCne(student.cne);
        setGenre(student.genre);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <div style={formStyle}>
      <h1>Information de stage</h1>
      <Form>
        <div className="row">
          <div className="col-lg-6">
            <Info controlId="FormNom" type="text" label="Nom" value={nom} />
            <Info
              controlId="FormPrenom"
              type="text"
              label="Prenom"
              value={prenom}
            />
            <Info controlId="FormCIN" type="text" label="CIN" value={cin} />
            <Info
              controlId="FormDateNaissance"
              type="text"
              label="Date de naissance"
              value={dateNaissance}
            />
            <Info
              controlId="FormAnnee"
              type="text"
              label="Année"
              value="2021"
            />
            <Info
              controlId="FormTelephone"
              type="Tel"
              label="Telephone"
              value={tel}
            />
            <Info
              controlId="FormEmail"
              type="Email"
              label="Email"
              value={email}
            />
            <Info
              controlId="FormFiliere"
              type="text"
              label="Filière"
              value="Informatique"
            />
            <Info controlId="FormCNE" type="text" label="CNE" value={cne} />
            <Info
              controlId="FormGenre"
              type="text"
              label="Genre"
              value={genre}
            />
          </div>
          <div className="col-lg-6">
            <Info
              controlId="FormTitreStage"
              type="text"
              label="Titre de Stage"
              value="PFE"
            />
            <Info
              controlId="FormDateDebut"
              type="date"
              label="Date de debut"
              value="10/3/2021"
            />
            <Info
              controlId="FormDateFin"
              type="text"
              label="Date de fin"
              value="10/09/2021"
            />
            <Info
              controlId="FormPosteDeRepresentant"
              type="text"
              label="Poste De Representant"
              value="Chef de projet"
            />
            <Info
              controlId="FormEncadrantInterne"
              type="text"
              label="Encadrant interne"
              value="encadrant interne"
            />
            <Info
              controlId="FormEncadrantExterne"
              type="text"
              label="Encadrant externe"
              value="encadrant externe"
            />
            <Info
              controlId="FormOrganismeAcceuil"
              type="text"
              label="Organisme d'acceuil"
              value="Organisme d'acceuil"
            />
            <Info
              controlId="FormVilleStage"
              type="text"
              label="Ville de stage"
              value="Rabat"
            />
            <Info
              controlId="FormPaysStage"
              type="text"
              label="Pays de stage"
              value="Maroc"
            />
          </div>
        </div>
      </Form>

      <Button>Retour</Button>
      <Button>Valider</Button>
    </div>
  );
};

export default InfoStage;

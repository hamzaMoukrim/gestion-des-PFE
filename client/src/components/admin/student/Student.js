import React, { useState, useEffect, Fragment } from "react";
import Select from "react-select";
import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_URI } from "../../../config";

export default function Student() {
  const [selectedFiliere, setSelectedFiliere] = useState("");

  const [filieres, setFiliere] = useState([]);

  const [loaded, setloaded] = useState(false);

  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [error2, setError2] = useState("");

  const columns = [
    { field: "id", headerName: "CNE", width: 150 },
    { field: "firstName", headerName: "PRENOM", width: 150 },
    { field: "lastName", headerName: "NOM", width: 150 },
    {
      field: "dateNaissance",
      headerName: "DATE DE NAISSANCE",
      type: "date",
      width: 150,
    },
    { field: "genre", headerName: "Genre", width: 120 },
    { field: "email", headerName: "EMAIL", width: 160 },
    {
      field: "Action",
      headerName: "Option",
      width: 300,
      renderCell: (params) => (
        <div>
          <Link to={"/admin/etudiants/" + params.value}>
            {" "}
            <button type="button" className="btn btn-warning">
              Modifier
            </button>
          </Link>
          <button
            className="btn btn-link border-0 text-decoration-none "
            onClick={(e) => handleSupprimer(e)}
            value={params.value}
          >
            Supprimer
          </button>
        </div>
      ),
    },
  ];

  const handleSupprimer = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URI + "/api/students/student/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          studentId: e.target.value,
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

  const [rows, setrows] = useState([]);

  const handleChange = (selectedFiliere) => {
    setSelectedFiliere(selectedFiliere);
  };

  //getting filieres

  useEffect(() => {
    axios

      .get(API_URI + "/api/filieres")
      .then(function (response) {
        let t = [],
          r = [];

        response.data.filieres.map((x) => {
          t.push({ value: x._id, label: x.nomFiliere });
        });
        setFiliere(t);
        setSelectedFiliere(t[0]);
        setloaded(true);

        // setrows(r)
      })
      .catch(function (error) {});
  }, []);

  // get students
  useEffect(() => {
    axios
      .get(API_URI + "/api/filieres/" + selectedFiliere.value)
      .then(function (response) {
        let t = [];

        response.data.students.map((e) => {
          t.push({
            id: e.cne,
            lastName: e.prenom,
            firstName: e.prenom,
            dateNaissance: e.dateNaissance,
            genre: e.genre,
            email: e.email,
            Action: e._id,
          });
        });

        setrows(t);

        // setrows(r)
      })
      .catch(function (error) {});
  }, [selectedFiliere, show]);

  return (
    <div className="">
      <div className="row">
        {loaded ? (
          <div className="col-lg-8 mb-5">
            <Select
              value={selectedFiliere}
              onChange={handleChange}
              options={filieres}
            />
          </div>
        ) : (
          ""
        )}

        <div className="col-sm-4">
          <Link to="/admin/etudiants/add">
            <button type="button" className="btn btn-info add-new">
              <i className="fa fa-plus"></i> Ajouter Nouveau Etudiant
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-white" style={{ height: 400, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import { Link } from "react-router-dom";
import Select from "react-select";
import { API_URI } from "../../../config";
export default function Enseignant() {
  const [selectedFiliere, setSelectedFiliere] = useState("");

  const [filieres, setFiliere] = useState([]);

  const [loaded, setloaded] = useState(false);

  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [error2, setError2] = useState("");

  const handleSupprimerEnseignat = async (value) => {
    try {
      const response = await fetch(
        API_URI + "/api/enseignant/deleteEnseignant",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            enseignantId: value,
          }),
        }
      );
      const responseData = await response.json();

      setError(responseData.msg);
      setShow(true);
    } catch (error) {
      setError(error);
      setShow(true);
    }
  };

  const columns = [
    { field: "id", headerName: "Nom", width: 150 },
    { field: "prenom", headerName: "Prenom", width: 150 },
    { field: "email", headerName: "EMAIL", width: 160 },
    {
      field: "Action",
      headerName: "Option",
      width: 300,
      renderCell: (params) => (
        <div>
          <Link to={"/admin/enseignants/" + params.value}>
            {" "}
            <button type="button" className="btn btn-warning">
              Modifier
            </button>
          </Link>
          <button
            type="button"
            className="btn btn-danger"
            onClick={(e) => handleSupprimerEnseignat(e.target.value)}
            value={params.value}
          >
            Supprimer
          </button>
        </div>
      ),
    },
  ];

  const [rows, setrows] = useState([]);

  const handleChange = (selectedFiliere) => {
    setSelectedFiliere(selectedFiliere);
  };

  //getting filieres

  useEffect(() => {
    axios
      .get(API_URI + "/api/filieres")
      .then(function (response) {
        let t = [];

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
      .get(API_URI + "/api/enseignant/enseignants/" + selectedFiliere.value)
      .then(function (response) {
        let t = [];

        response.data.enseignants.map((e) => {
          t.push({
            id: e.nom,
            prenom: e.prenom,
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
          <Link to="/admin/enseignants/add">
            <button type="button" className="btn btn-info add-new">
              <i className="fa fa-plus"></i> Ajouter un Nouveau Enseignant{" "}
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

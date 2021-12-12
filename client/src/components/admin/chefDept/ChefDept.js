import React, { useState, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URI } from "../../../config";

export default function Student() {
  const [rows, setrows] = useState([]);

  useEffect(() => {
    axios
      .get(API_URI + "/api/enseignant/getcheftDepts")
      .then(function (response) {
        let r = [];

        // r.push({id: "sdsd" })

        response.data.filieres.map((f) => {
          r.push({
            id: f.nomFiliere,
            nom: f.chefDept != null ? f.chefDept.nom : "",
            prenom: f.chefDept != null ? f.chefDept.prenom : "",
            email: f.chefDept != null ? f.chefDept.email : "",
            Action: f._id,
          });
        });

        setrows(r);
      })
      .catch(function (error) {});
  }, []);

  const columns = [
    { field: "id", headerName: "filiere", width: 150 },
    { field: "nom", headerName: "nom", width: 150 },
    { field: "prenom", headerName: "prenom", width: 150 },
    { field: "email", headerName: "email", width: 150 },
    {
      field: "Action",
      headerName: "Option",
      width: 300,
      renderCell: (params) => (
        <div>
          <Link to={"/admin/chefDept/modifier/" + params.value}>
            {" "}
            <button type="button" className="btn btn-warning">
              Modifier
            </button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="row">
        <div className="col-sm-6"></div>
      </div>

      <div className="row">
        <div>
          <br />
        </div>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid rows={rows} columns={columns} pageSize={5} />
        </div>
      </div>
    </div>
  );
}

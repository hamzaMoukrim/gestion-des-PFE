import React from "react";
import { useEffect, useState, useRef } from "react";
import Search from "../../util/search/search.js";
import { useAuthContext } from "../../../providers/index";
import { Link } from "react-router-dom";
import axios from "axios";
import "react-data-grid-multiline-header/style.css";
import Helper from "react-data-grid-multiline-header";
import { DataGrid } from "@material-ui/data-grid";

import { API_URI } from "../../../config.js";

const MonPlanning = (props) => {
  const { user } = useAuthContext();
  const [tableData, setTableData] = useState([]);
  const columns = [
    { field: "id", headerName: "ID", flex: 0.1, type: "string" },
    { field: "salle", headerName: "Salle", width: 150, type: "string" },
    {
      field: "encadrantInterne",
      headerName: "Encadrant Interne",
      width: 200,
      type: "string",
    },
    {
      field: "rapporteur",
      headerName: "Rapporteur",
      width: 170,
      type: "string",
    },
    { field: "president", headerName: "President", width: 180, type: "string" },
    { field: "jour", headerName: "Jour", type: "date", width: 150 },
    {
      field: "heureDebut",
      headerName: "Heure debut",
      width: 170,
      type: "date",
    },
    { field: "heureFin", headerName: "HeureFin", width: 150, type: "date" },
  ];
  const isMountedVal = useRef(1);

  const updateState = (callback) => {
    if (isMountedVal.current) {
      callback();
    }
  };

  useEffect(() => {
    //   console.log(user);

    //   console.log(user.stageId);

    if (user.stageId != null) {
      fetch(API_URI + "/api/planning/" + user.stageId) // stageid
        .then((data) => data.json())
        .then((data) => {
          var DataTable = [];

          if (data.plannings) {
            data.plannings.map((p, index) => {
              var row = {
                id: index + 1,
                salle: p.salle,
                jour: p.date,
                encadrantInterne: p.encadrantInterne,
                rapporteur: p.jury.length > 1 ? p.jury[1].enseignant : " ",
                president: p.jury.length > 0 ? p.jury[0].enseignant : " ",
                heureDebut: p.heureDebut,
                heureFin: p.heureFin,
              };
              DataTable.push(row);
            });
          }

          updateState(() => setTableData(DataTable));
        });
    }

    isMountedVal.current = 1;

    return () => {
      isMountedVal.current = 0;
    };
  }, []);
  return (
    <div className="container chefdept">
      <h1 className="row header1">Mon Planning</h1>
      <div className="row justify-content-end mb-5"></div>

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={tableData}
          columns={columns}
          pageSize={5}
          checkboxSelection
        />
      </div>
    </div>
  );
};

export default MonPlanning;

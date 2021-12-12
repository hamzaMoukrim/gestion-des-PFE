import React from "react";
import { useEffect, useState, useRef } from "react";
import Search from "../../util/search/search.js";
import { Link } from "react-router-dom";
import axios from "axios";
import "react-data-grid-multiline-header/style.css";
import Helper from "react-data-grid-multiline-header";
import {
  DataGrid,
  selectedGridRowsCountSelector,
  GridCellParams,
} from "@material-ui/data-grid";
import ReactDataGrid from "react-data-grid";
import { connect } from "react-redux";

const MonPlanning = (props) => {
  const [tableData, setTableData] = useState([]);
  const columns = [
    { field: "id", headerName: "ID", flex: 0.1, type: "string" },
    { field: "etudiant", headerName: "Etudiants", width: 310, type: "string" },
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
    fetch("http://localhost:5000/api/planning", { credentials: "include" })
      .then((data) => data.json())
      .then((data) => {
        var enseignantID = props.userInfo._id; // enseignatid

        // console.log(data.plannings) ;
        var DataTable = [];

        if (data.plannings) {
          data.plannings.map((p, index) => {
            if (
              p.jury[0].enseignantID == enseignantID ||
              p.jury[1].enseignantID == enseignantID ||
              p.jury[2].enseignantID == enseignantID
            ) {
              var row = {
                id: index + 1,
                etudiant: p.etudiants.etudiant2
                  ? p.etudiants.etudiant1 + "&&" + p.etudiants.etudiant2
                  : p.etudiants.etudiant1,
                salle: p.salle,
                jour: p.date,
                encadrantInterne: p.jury[2].encadrantInterne,
                rapporteur: p.jury[1].enseignant2,
                president: p.jury[0].enseignant1,
                heureDebut: p.heureDebut,
                heureFin: p.heureFin,
              };
              DataTable.push(row);
            }
          });
        }

        updateState(() => setTableData(DataTable));
      });

    isMountedVal.current = 1;

    return () => {
      isMountedVal.current = 0;
    };
  }, []);
  return (
    <div className="container chefdept">
      <h1 className="row header1">Planning PFE</h1>
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

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
  };
};
export default connect(mapStateToProps, null)(MonPlanning);

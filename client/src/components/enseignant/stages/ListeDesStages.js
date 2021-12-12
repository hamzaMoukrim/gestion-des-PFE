// import React,{useEffect,useState} from "react";
// import { Button } from "react-bootstrap";
// import Table from "react-bootstrap/Table";
// import {Link} from 'react-router-dom'
// import Search from "../../util/search/search"
// import axios from 'axios'
// import Spinner from 'react-bootstrap/Spinner'
// import '../../chefdept/chefdept.css'
// import ErrorModal from '../../modals/ErrorModal';
// import {connect} from 'react-redux';
// import * as actionTypes from '../../store/reducers/actions' ;
// import Liste from "./stageListe/Liste";

// function ListeStages(props) {

//   const [stages,setStages]=useState([]);
//   const [loaded,setLoaded]=useState(false);

//   const [show, setShow] = useState(false);
//   const [error, setError] = useState("");

// useEffect(() => {

//   axios.get(`http://localhost:5000/api/stages/${props.userId}`)
//   .then(function (response) {

//     setStages(response.data.stages)
//     setLoaded(true)

//   })
//   .catch(function (error) {

//   })

// }, [show])

// async function validHandler(e){
//   e.preventDefault();

//   try {
//     const response = await fetch('http://localhost:5000/api/stages/valider',
//     {
//         method:'POST',
//         headers:{
//             'Content-Type' : 'application/json',
//             'Accept' : 'application/json'

//         },
//         body:JSON.stringify({
//           stageId:e.target.value
//         })
//     });
//     const responseData = await response.json();

//             setError(responseData.message)
//             setShow(true);

//       } catch (error) {
//            setError(error)
//             setShow(true);

//       }

//  }

//  async function deleteHandler(e){
//   e.preventDefault();
//   try {
//     const response = await fetch('http://localhost:5000/api/stages/delete',
//     {
//         method:'DELETE',
//         headers:{
//             'Content-Type' : 'application/json',
//             'Accept' : 'application/json'

//         },
//         body:JSON.stringify({
//           stageId:e.target.value
//         })
//     });
//     const responseData = await response.json();

//             setError(responseData.message)
//             setShow(true);

//       } catch (error) {
//            setError(error)
//             setShow(true);

//       }
// }

//   return (
//     <React.Fragment>
//     <ErrorModal show={show} setShow={setShow} error={error} titre='' />

//     <div className="container chefdept">
//       <div className="row header">Mes stages</div>
//       <div className="row justify-content-end mb-5">
//      <div className="col-sm-4">
//      <Search/>
//      </div>
//      </div>

//       <div className="table">

//       { loaded ?
//             <Liste

//             data={stages}
//             pageLimit={3}
//             dataLimit={10}
//             deleteHandler={deleteHandler}
//             validHandler={validHandler}
//              />
//         :  <Spinner animation="grow" />  }
//       </div>
//     </div>
//     </React.Fragment>
//   );
// }

// const mapStateToProps = state =>{
//   return {
//     userId: state.userId,
//   }
// };
// export default connect(mapStateToProps, null)(ListeStages);

import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import "../../chefdept/chefdept.css";
import ErrorModal from "../../modals/ErrorModal";
import { connect } from "react-redux";
import { DataGrid } from "@material-ui/data-grid";
import ModalPage from "../../chefdept/infoStage/ModalPage";

function ListeStages(props) {
  const [stages, setStages] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const [error, setError] = useState("");
  const [rows, setrows] = useState([]);

  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [idStage, setidStage] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/stages/${props.userId}`, {
        withCredentials: true,
      })
      .then(function (response) {
        // setStages(response.data.stages)

        let t = [];

        response.data.stages.map((e) => {
          t.push({
            id: e._id,
            etudiants: e.etudiants,
            sujet: e.description,
            date: e.dateDebut,
            etat: e.signatureDept == 1 ? "Valide" : "Non Valide",
            genre: e.genre,
            email: e.email,
            action: e,
            pdf: e.docs[0].url,
            infos: e._id,
          });
        });

        setrows(t);

        setLoaded(true);
      })
      .catch(function (error) {});
  }, [show]);

  const columns = [
    {
      field: "etudiants",
      headerName: "Etudiants",
      width: 250,
      height: 250,
      renderCell: (params) => (
        <div>
          {params.value.map((e, index) => {
            return (
              <span>
                {" "}
                <span>{e.nom + " " + e.prenom}</span>{" "}
                {params.value.length > 1 && index == 0 ? " & " : ""}
              </span>
            );
          })}
        </div>
      ),
    },
    { field: "sujet", headerName: "Sujet", width: 180, height: 250 },
    //  { field: 'date',headerName: 'Date de soumission',type: 'date',width: 150},
    /*  { field: 'pdf',headerName: 'PDF',width: 100,
  renderCell: (params) => (

    <a href={"http://localhost:5000/"+params.value}> <i className="far fa-file-pdf" style={{fontSize:"32px",color:"red"}}></i>  </a>
  )},
*/

    {
      field: "infos",
      headerName: "Plus d'info",
      width: 160,
      renderCell: (params) => (
        <Button
          variant="primary"
          onClick={(e) => {
            setShowModal(true);
            setidStage(e.target.value);
          }}
          value={params.value}
        >
          Plus d'infos
        </Button>

        // <NavLink className="text-decoration-none btn-link" to={"/chefdept/"+params.value}  exact   >Plus d'info</NavLink>
      ),
    },

    // { field: 'etat',headerName: 'Etat',width: 160},

    {
      field: "action",
      headerName: "Action",
      width: 360,
      renderCell: (params) => (
        <div>
          <NavLink
            className="text-decoration-none btn-link"
            to={"/enseignant/conversation/" + params.value.etudiants[0].cin}
            exact
          >
            Envoyer une remarque
          </NavLink>
        </div>
      ),
    },
  ];

  return (
    <React.Fragment>
      <ErrorModal show={show} setShow={setShow} error={error} titre="" />
      <ModalPage show={showModal} setShow={setShowModal} id={idStage} />
      <div className="container chefdept">
        <div className="row header">Liste des Stages</div>
        <div className="row justify-content-end mb-5">
          {/* <div className="col-sm-4">
     <Search/>
     </div> */}
        </div>

        <div className="table">
          <div className="bg-white" style={{ height: 400, width: "100%" }}>
            <DataGrid rows={rows} columns={columns} pageSize={5} />
          </div>

          {/* { loaded ?
            <Liste          
            data={stages}
            pageLimit={3}
            dataLimit={10}
            deleteHandler={deleteHandler}
            validHandler={validHandler}
             />
        :  <Spinner animation="grow" />  } */}
        </div>
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    userId: state.userId,
  };
};
export default connect(mapStateToProps, null)(ListeStages);

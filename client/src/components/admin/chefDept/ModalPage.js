// import React,{useState, useEffect} from 'react'
// import ErrorModal from '../../modals/ErrorModal';
// import { Form, Button, Table } from "react-bootstrap";
// import Select from "react-select";
// import axios from "axios";



// export default function AddChefDept() {
//   const [show, setShow] = useState(false);
//   const [error, setError] = useState("");
//   const [error2, setError2] = useState("");

//   const [filieres, setFilieres] = useState([]);
//   const [selectedFiliere,setSelectedFiliere ] = useState("");
//   const [selectedEnseigant,setSelectedEnseigant ] = useState("");
//   const [ensiegant, setEnseigant] = useState("");
  

//   const handleChangeFiliere = (selectedFiliere) => {
//     setSelectedFiliere(selectedFiliere);
//   };
  

//   const handleEnseignant =  (selectedEnseigant) =>{
//     // set logic her 
//     setSelectedEnseigant(selectedEnseigant)
//   }
  
//   const AddNewChefDept = async (event) => {
    
//     event.preventDefault();  
//     try {
//       const response = await fetch("http://localhost:5000/api/enseignant/updateChefdept",
//       {
//           method:'POST',
//           headers:{
//               'Content-Type' : 'application/json',
//               'Accept' : 'application/json'
          
//           },
//           body:JSON.stringify({
//             enseignantId: selectedEnseigant.value,
//             filiereId:selectedFiliere.value
//           })
//       });
//       const responseData = await response.json();
  

//       setError(responseData.message);
//       setShow(true);
              
      
        
//         } catch (error) {
//              setError(error)
//               setShow(true);
            
//         }

//   }
//   const handleRetour =(e)=>{
//     e.preventDefault();
//   }

//   // get all filieres
//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/api/filieres")
//       .then(function (response) {
//         let t = [],r=[];

//         response.data.filieres.map((x) => {
//           t.push({ value: x._id, label: x.nomFiliere });
//         });
//         setFilieres(t);

//         // setrows(r)
//       })
//       .catch(function (error) {});
//   }, []);
  

// //get enseignants by filiere 

// useEffect(() => {
//   axios
//     .get("http://localhost:5000/api/enseignant/enseignants/"+selectedFiliere.value)
//     .then(function (response) {
//       let t = [];
//       console.log(response.data.enseignants)

//       response.data.enseignants.map(x=>{
//           t.push({ value: x._id, label: x.nom + " " + x.prenom })
//            })

//       setEnseigant(t);

//       // setrows(r)
//     })
//     .catch(function (error) {});
// }, [selectedFiliere]);




//   const submitButtonStyle = {
//     margin: "30px",
//     position: "absolute",
//     left: "100px",
//     buttom: "1px",
//     width: "200px",
//     height: "50px"

//   };

//   const formStyle = {
//     marginTop: "10px",
//     marginBottom: "160px",
//     paddingTop: "10px",
//   };
//   return (
//     <React.Fragment>
//       <ErrorModal
//         show={show}
//         setShow={setShow}
//         error={error}
//         titre=""
//         error2={error2}
//       />
//       <div>
//       <Form style={formStyle}>
//       <div className="row">
//       <div className="col-lg-6" style={{ textAlign: "left" }}>
//         <label>Filiere</label>

//         <Select
//           value={selectedFiliere}
//           onChange={handleChangeFiliere}
//           options={filieres}
//         />
//       </div>

//       <div className="col-lg-6" style={{ textAlign: "left" }}>
//         <label>Enseigant</label>

//         <Select
//           value={selectedEnseigant}
//           onChange={handleEnseignant}
//           options={ensiegant}
//         />
//       </div>
//     </div>

//     <br/><br/>
//     <div className="row">
          


            
//           <div className="col-lg-6">  
//           <Button variant="primary" type="submit" style={submitButtonStyle} onClick={AddNewChefDept}>
//              Ajouter
//           </Button>

//           </div>

//           <div className="col-lg-6">  
//           <Button variant="primary" type="submit" style={submitButtonStyle} onClick={handleRetour}>
//              Retour 
//           </Button>

//           </div>
         
//         </div>
//         </Form>
        

//       </div>
      
      
//         </React.Fragment>
//   )
// }




 

// import React, { Component,useState,useEffect } from 'react';
// import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
// import Modal from 'react-bootstrap/Modal'
// import Button from 'react-bootstrap/Button'
// import Select from "react-select";
// import axios from 'axios';
// import Spinner from 'react-bootstrap/Spinner';



// function ModalPage(props) {


//  const [loaded, setloaded] = useState(false);


//   const handleClose = () => props.setShow(false);

//   const [enseignant, setEnseignant] = useState([])

//   const [selectedEnseignant, setSelectedEnseigant] = useState("")

  
//   const handleChange = (selectedEnseigant) => {
//     setSelectedEnseigant(selectedEnseigant);
//     }

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/api/enseignant/enseignants/"+props.filiereId)
//       .then(function (response) {
//         let t = [];
        
        
//         console.log(response.data.enseignants)
//         response.data.enseignants.map(x=>{
//             t.push({ value: x._id, label: x.nom + " " + x.prenom })
//              })
            
//         setEnseignant(t);
//         setloaded(true)
  
//         // setrows(r)
//       })
//       .catch(function (error) {});
//   }, []);

//   return (

//       <Modal
//         show={props.show} onHide={handleClose}
//         size="lg"
//         onHide={() => props.setShow(false)}
//         dialogClassName="modal-90w"
//         aria-labelledby="example-custom-modal-styling-title"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title id="example-custom-modal-styling-title">
//          Choisir le nouveau chef de departement
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//         {/* <InfoStage id={props.id}/> */}

// {      loaded ?  
//          <Select
//           value={selectedEnseignant}
//           options={enseignant}
//           onChange={handleChange}
//         /> 
//           : <Spinner animation="grow" variant="danger" /> }
          


//         </Modal.Body>

//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleClose}>
//             Save Changes
//           </Button>
//         </Modal.Footer>

//       </Modal>
//   );
// };

// export default ModalPage;
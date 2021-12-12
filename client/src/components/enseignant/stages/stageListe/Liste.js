
import axios from 'axios'

import { Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import {Link} from 'react-router-dom'
import React, { useState, useEffect } from "react";
import { NavLink } from 'react-router-dom';
export default function Liste({
  data,
  deleteHandler,
  validHandler,
  pageLimit,
  dataLimit,
}) {
  const [pages] = useState(Math.round(data.length / dataLimit));
  const [currentPage, setCurrentPage] = useState(1);

  function goToNextPage() {
    setCurrentPage(page => page + 1);
  }

  function goToPreviousPage() {
    setCurrentPage(page => page - 1);
  }

  function changePage(event) {
    const pageNumber = Number(event.target.textContent);
    setCurrentPage(pageNumber);
  }

  const getPaginatedData = () => {
    const startIndex = currentPage * dataLimit - dataLimit;
    const endIndex = startIndex + dataLimit;
    return data.slice(startIndex, endIndex);
  };

  const getPaginationGroup = () => {
    let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
    return new Array(pageLimit).fill().map((_, idx) => start + idx + 1);
     
     }

    
     


    return (
        <div>
        <Table bordered hover >
        <thead className="tableHead">
          <tr>
          <th>Etudiants</th>
            <th>Sujet</th>
            <th>Date de soumission</th>
            <th>pdf</th>

            <th> Etat</th>
            <th>Action</th>
          </tr>
        </thead>
       
        <tbody>
    
          {/* show the posts, 10 posts at a time */}
          
            {getPaginatedData().map((x, idx) => {
             
                return(
                    <tr key={x._id}> 
                      
                        <td ><Link  to={"/enseignant/"+x._id } > {x.etudiants.map(e=>{return (<div key={e._id}> {e.nom+" " +e.prenom} </div> )})} </Link></td>
                        <td> <Link  to={ "/enseignant/stages/"+x._id} exact="true" >{x.description} </Link>  </td>
                        <td > <Link  to={"/enseignant/stages/"+x._id} >{x.dateDebut} </Link> </td>
                        <td><a href={"http://localhost:5000/stages/"+x.docs[0].url}> <i className="far fa-file-pdf" style={{fontSize:"32px",color:"red"}}></i>  </a> </td>
                      
        
                        {/* add etat de stage */}
                        
                        <td ><Link  to={"/enseignant/stages/"+x._id } > {x.signatureDept == 1 ? "Valide" : "Non Valide"} </Link></td>




                        <td  className=""> 
                             
                            <NavLink className="d-block text-decoration-none btn-link" to={"/enseignant/conversation/"+x.etudiants[0].cin}  exact   >Contacter</NavLink>
   
                        </td>
                   </tr>)
            })

            }
    
          {/* show the pagiantion
            it consists of next and previous buttons
            along with page numbers, in our case, 5 page
            numbers at a time
        */}
        
          
        </tbody>
         
         </Table>
          <div className="pagination">
            {/* previous button */}
            <button
              onClick={goToPreviousPage}
              className={`prev ${currentPage === 1 ? "disabled" : ""}`}
            >
              prev
            </button>
    
            {/* show page numbers */}
            {getPaginationGroup().map((item, index) => (
              <button
                key={index}
                onClick={changePage}
                className={`paginationItem ${
                  currentPage === item ? "active" : null
                }`}
              >
                <span>{item}</span>
              </button>
            ))}
    
            {/* next button */}
            <button
              onClick={goToNextPage}
              className={`next ${currentPage === pages ? "disabled" : ""}`}
            >
              next
            </button>
          </div>
        </div>
      );
    }
    
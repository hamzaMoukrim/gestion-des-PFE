import axios from "axios";

import { Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import pdf from "../../../assets/ELFaddouli_Gestion des PFE.pdf";
import { NavLink } from "react-router-dom";
import { API_URI } from "../../../config";
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
    setCurrentPage((page) => page + 1);
  }

  function goToPreviousPage() {
    setCurrentPage((page) => page - 1);
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
  };

  return (
    <div>
      <div className="content-table">
        <Table bordered hover>
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
              return (
                <tr key={x._id}>
                  <td>
                    <Link to={"/chefdept/" + x._id}>
                      {" "}
                      {x.etudiants.map((e) => {
                        return (
                          <div key={e._id}> {e.nom + " " + e.prenom} </div>
                        );
                      })}{" "}
                    </Link>
                  </td>

                  <td>
                    {" "}
                    <Link to={"/chefdept/" + x._id} exact="true">
                      {x.description}{" "}
                    </Link>{" "}
                  </td>
                  <td>
                    {" "}
                    <Link to={"/chefdept/" + x._id}>{x.dateDebut} </Link>{" "}
                  </td>
                  <td>
                    <a href={API_URI + "/" + x.docs[0].url}>
                      {" "}
                      <i
                        className="far fa-file-pdf"
                        style={{ fontSize: "32px", color: "red" }}
                      ></i>{" "}
                    </a>{" "}
                  </td>

                  {/* add etat de stage */}

                  <td>
                    <Link to={"/chefdept/" + x._id}>
                      {" "}
                      {x.signatureDept == 1 ? "Valide" : "Non Valide"}{" "}
                    </Link>
                  </td>

                  <td className="">
                    <button
                      onClick={validHandler}
                      value={x._id}
                      className="mr-1 mb-1 btn btn-link d-block border-0 text-decoration-none"
                    >
                      {x.signatureDept == "1" ? "invalider" : "Valider"}
                    </button>
                    <button
                      onClick={deleteHandler}
                      value={x._id}
                      className="d-block btn btn-link border-0 text-decoration-none "
                    >
                      Supprimer
                    </button>
                    <NavLink
                      className="d-block text-decoration-none btn-link"
                      to={"/chefdept/conversation/" + x.etudiants[0].cin}
                      exact
                    >
                      Envoyer une remarque
                    </NavLink>
                  </td>
                </tr>
              );
            })}

            {/* show the pagiantion
            it consists of next and previous buttons
            along with page numbers, in our case, 5 page
            numbers at a time
        */}
          </tbody>
        </Table>
      </div>
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

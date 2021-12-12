import { Form, Button, Table, ListGroup } from "react-bootstrap";
import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Input from "../../form/Input";
import axios from "axios";
import MultiSelect from "react-multi-select-component";
import ErrorModal from "../../modals/ErrorModal";
import Select from "react-select";
import { Link } from "react-router-dom";

const ListeDeStages = () => {
  const [stageListe, setStageListe] = useState([]);

  console.log(stageListe);
  useEffect(() => {
    console.log("useEfffect");
    axios
      .get("http://localhost:5000/stages", { withCredentials: true })
      .then((response) => {
        setStageListe(response.data);
      });
  }, []);

  return (
    <div>
      <ListGroup as="ul">
        {stageListe.map((stage) => (
          <Link to="/enseignant/details">
            <ListGroup.Item as="li">{stage.description}</ListGroup.Item>
          </Link>
        ))}
      </ListGroup>
      {/* <div>les stages doivent etre afficher ici </div>
       {stageListe.map(stage =><li>{stage.description}</li>)}  */}
    </div>
  );
};

export default ListeDeStages;

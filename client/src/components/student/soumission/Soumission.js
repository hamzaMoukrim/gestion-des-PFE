import React from "react";
import { Button } from "react-bootstrap";
import "./soumission.css";
import Table from "react-bootstrap/Table";
import FormPfe from "../modals/FormPfe";
import FormInfo from "../../form/FormInfo";
import { useAuthContext } from "../../../providers/index";

function Soumission(props) {
  const { user } = useAuthContext();

  return (
    <div className="container soumission-table">
      <div className="row header">
        {user.stageId != null && user.stage.signatureDept == "1"
          ? "Votre stage a ete valide "
          : "Ma soumission :"}
      </div>

      <FormInfo />
    </div>
  );
}

export default Soumission;

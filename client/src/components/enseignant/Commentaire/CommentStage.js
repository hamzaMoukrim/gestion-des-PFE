import React, { useState } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";

import Navbar from "../../Navbar/Navbar";
import SideBar from "../util/SideBar";

function CommentStage() {
  const submitButtonStyle = {
    margin: "20px",
    position: "relative",
    width: "200px",
    height: "50px",
  };

  const [input, setInput] = useState("");
  const handleChange = (event) => {
    setInput(event.target.value);
  };
  const cleanField = (event) => {};

  const handleClick = (event) => {
    event.preventDefault();
    const newCommentaire = {
      commentaire: input,
    };
    axios.post("http://localhost:5000/enseignant/commentaire", newCommentaire, {
      withCredentials: true,
    });
    console.log(newCommentaire);
    setInput("");
  };
  return (
    <div className="enseignant">
      <Navbar />
      <div className="row">
        <div className="col-sm-2 side_bar">
          <SideBar />
        </div>
        <div className="col-sm-10 mb-0 soumission jumbotron">
          <form>
            {/* <div>
                                    <input  onChange = {handleChange} name = "commentaire" value = {input} type ="text" placeholder = "ajouter un commentaire"/>
                                </div> */}
            <div className="form-outline">
              <textarea
                onChange={handleChange}
                className="form-control"
                id="textAreaExample"
                rows="4"
              ></textarea>
              <label className="form-label" for="textAreaExample">
                Message
              </label>
            </div>
            <Button
              classeName="center"
              onClick={handleClick}
              variant="primary"
              type="submit"
              style={submitButtonStyle}
            >
              Envoyer
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CommentStage;

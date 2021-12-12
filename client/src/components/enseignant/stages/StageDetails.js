import React from "react";
import InfoStage from "./InfoStage";
import Navbar from "../../Navbar/Navbar";
import SideBar from "../util/SideBar";
import CommentStage from "../Commentaire/CommentStage";
import { Form, Button, Table } from "react-bootstrap";

const Stagedetails = () =>{
  return(
    <div className="student">
                 <Navbar />

                <div className='row'>
                    <div className="col-sm-2 side_bar">
                        <SideBar/>

                    </div>
                    <div className="col-sm-10 mb-0 soumission jumbotron">
                        <InfoStage/>
                    </div>
                  
                   
                    
                    
            </div>

        </div>   

  );
}

export default Stagedetails;
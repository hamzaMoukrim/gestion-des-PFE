import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import SideBar from "../util/SideBar";
import ListeStages from "./ListeStages";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "../student/student.css";
import InfoStage from "./infoStage/InfoStage";
import Conversation from "../util/conversation/Conversation";
import Conversations from "../util/Conversations/conversation";
import Planning from "./planning/Planning";
import NewPlanning from "./planning/newPlanning/NewPlanning";
import Homepage from "../util/homepage/HomePage";
import NewJury from "./juryAffectation/NewJury";

function ChefDept() {
  const menu = [
    {
      menu: "Liste des stages",
      icon: "fas fa-list",
      to: "/chefdept/listestages",
    },
    {
      menu: "Planning PFE",
      icon: "fas fa-calendar-alt",
      to: "/chefdept/planning",
    },
    {
      menu: "Coversations",
      icon: "fas fa-comments-alt",
      to: "/chefdept/conversation",
    },
    {
      menu: "Affecter les Jury",
      icon: "fas fa-comments-alt",
      to: "/chefdept/newJury",
    },
  ];

  return (
    <div className="student">
      <Navbar />

      <div className="row">
        <Router>
          <div className="col-sm-2 side_bar">
            <SideBar menu={menu} />
          </div>

          <div className="col-sm-10 mb-0 soumission jumbotron">
            <Switch>
              <Route path="/chefdept/planning">
                <Planning />
              </Route>
              <Route path="/chefdept/newPlanning/:planningID">
                <NewPlanning />
              </Route>

              <Route path="/chefdept/newJury">
                <NewJury />
              </Route>

              <Route path="/chefdept/conversation/:to">
                <Conversation />
              </Route>

              <Route path="/chefdept/conversation">
                <Conversations role={"chefdept"} />
              </Route>

              <Route path="/chefdept/listestages">
                <ListeStages />
              </Route>

              <Route path="/chefdept/:stageId">
                <InfoStage />
              </Route>

              <Route path="/chefdept">
                <Homepage link1="Liste des Stages" link2="Planning PFE" />
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    </div>
  );
}

export default ChefDept;

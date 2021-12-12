import React, { useState, useEffect } from "react";
import "./conversations.css";
import Conversation from "../conversation/Conversation";
import Contact from "./contacts";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from "axios";
import { API_URI } from "../../../config";
import { useAuthContext } from "../../../providers/index";
function Conversations(props) {
  const { user } = useAuthContext();

  const [chatList, setchatList] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    axios
      .get(API_URI + "/api/conversation/chatList/" + user.user)
      .then(function (response) {
        setchatList(response.data);
        setLoaded(true);
      })
      .catch(function (error) {});
  }, []);

  return (
    <Router>
      <div className="container">
        <h3 className=" text-center">Conversations</h3>
        <div className="messaging">
          <div className="inbox_msg">
            <div className="inbox_people">
              <div className="headind_srch">
                <div className="recent_heading">
                  <h4>Recent</h4>
                </div>
                <div className="srch_bar">
                  <div className="stylish-input-group">
                    <input
                      type="text"
                      className="search-bar"
                      placeholder="Search"
                    ></input>
                    <span className="input-group-addon">
                      <button type="button">
                        {" "}
                        <i className="fa fa-search" aria-hidden="true"></i>{" "}
                      </button>
                    </span>{" "}
                  </div>
                </div>
              </div>

              <div className="inbox_chat">
                {loaded
                  ? chatList.map((c) => {
                      console.log(chatList);
                      return (
                        <Contact
                          role={props.role}
                          key={c.to._id}
                          id={c.user._id == user.user ? c.to._id : c.user._id}
                          username={
                            c.user._id == user.user
                              ? c.to.userName
                              : c.user.userName
                          }
                          to={c.chats[c.chats.length - 1].time.toString()}
                          lastMsg={c.chats[c.chats.length - 1].message}
                        />
                      );
                    })
                  : ""}

                {/* <a>
       

            </a> */}
              </div>
            </div>

            <div className="mesgs">
              <div className="msg_history">
                <Switch>
                  <Route path={"/" + props.role + "/conversation/:to"}>
                    <Conversation />
                  </Route>
                  <Route path={"/" + props.role + "/conversation"}></Route>
                </Switch>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default Conversations;

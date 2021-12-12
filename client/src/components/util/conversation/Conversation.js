import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import "./conversation.css";
import Message from "./Messages/Message";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from "axios";
import { API_URI } from "../../../config";
import { useAuthContext } from "../../../providers/index";

function Conversation(props) {
  const { user } = useAuthContext();

  const [message, setmessage] = useState("");
  const [chats, setChats] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [sent, setSent] = useState(false);

  const to = useParams().to;

  useEffect(() => {
    {
      //Get Request
      (async () => {
        try {
          const response = await fetch(
            API_URI + "/api/conversation/fetchMessages/" + to,

            {
              method: "Post",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                user: user.user,
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();

            // console.log(data.chats)
            setChats(data.chats);
            setLoaded(true);
          } else {
            console.log("error");
          }
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [sent, to]);

  async function sendMessage(e) {
    e.preventDefault();

    try {
      const response = await fetch(API_URI + "/api/conversation/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          message: message,
          to: to,
          user: user.user,
        }),
      });

      setSent(!sent);
      setmessage("");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="">
      <div className="container-fluid bg-light" id="chat">
        <div className="content d-flex flex-column" id="chat-content">
          {loaded
            ? chats.map((m) => {
                return (
                  <Message
                    key={m._id}
                    user={m.user == user.user ? true : false}
                    message={m.message}
                    time={m.time}
                  />
                );
              })
            : ""}
        </div>
        <div className="tools form-row">
          <input
            onChange={(e) => {
              setmessage(e.target.value);
            }}
            value={message}
            id="newMessage"
            className="form-control col mr-2"
            type="text"
            name=""
            placeholder="Message"
          ></input>

          <button
            onClick={sendMessage}
            className="btn btn-primary "
            type="button"
          >
            <i className="far fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Conversation;

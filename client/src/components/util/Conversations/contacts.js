import React from 'react'
import {Link } from 'react-router-dom';


function Contact(props){
return(
    <Link to={`/${props.role}/conversation/`+props.id}>
        <div className="chat_list active_chat">
        <div className="chat_people">
        <div className="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"></img> </div>
        <div className="chat_ib">
            <h5>{props.username} <span className="chat_date">{props.time}</span></h5>
            <p>{props.lastMsg}</p>
        </div>
        </div>
        </div>
        </Link>
    


    )
}

export default Contact;
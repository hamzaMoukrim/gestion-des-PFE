import React from 'react';
import '../conversation.css'


function Message(props){
  

   if(!props.user)
  {  return(

        <div className="media media-chat"> <img className="avatar" src="https://img.icons8.com/color/36/000000/administrator-male.png" alt="..."></img>
        <div className="media-body ">

            <p>{props.message}</p>
            <p className="meta" style={{color:"#8b95a5",backgroundColor: "transparent"}} ><time>{props.time}</time></p>
        </div>
      </div>
   
    )}else{
    return(
        <div className="media media-chat media-chat-reverse">
        <div className="media-body">

            <p>{props.message}</p>
            
            <p className="meta" style={{color:"#8b95a5"}} ><time >{props.time}</time></p>
        </div>
    </div>
    )}

}

export default Message;

  /* // <div id="msg-0" classNameName="msg float-right">
        //         <div classNameName="head"> {props.sender} </div>
        //         <p classNameName="body"> {props.message} </p>
        //         <div classNameName="footer"> {props.time} </div>
        // </div> */
import React from "react";
import "./sidebar.css";
import { BrowserRouter as Router,NavLink } from 'react-router-dom';

function SideBar(props) {
  return (
    <div className="sidebar-container">
      <ul className="sidebar-navigation">
        {props.menu.map(x=>{
          return (
           
            <li key={x.menu}> 
            <NavLink exact  to={x.to}    activeClassName='activeSideBar'
                // activeStyle={{
                //   backgroundColor: "red",
                //   // width: "100%",
                //   fontWeight: "bold",
                
                //  texDecoration: "none",
                //  outline: "none"
                // }}
              
              >
              <i className={x.icon}  ></i>   {x.menu}
            </NavLink>
          </li>
       
          )
        })}
        
        
      </ul>
    </div>
  );
}

export default SideBar;

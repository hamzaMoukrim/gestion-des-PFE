import React from "react";
import "./sideBar.css";
import { NavLink } from 'react-router-dom';

function SideBar(props) {
  return (
    <div className="sidebar-container">
      <ul className="sidebar-navigation">
        {props.menu.map(x=>{
          return (
           
            <li key={x.menu}>
            <NavLink to={x.to}  exact activeClassName="activeSideBar">
              <i className={x.icon}  ></i> {x.menu}
            </NavLink>
          </li>
       
          )
        })}
      
        
      </ul>
    </div>
  );
}

export default SideBar;

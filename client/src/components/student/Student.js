import React from 'react';
import Navbar from '../Navbar/Navbar'
import Soumission from './soumission/Soumission'
import SideBar from '../util/SideBar'
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom'
import './student.css'
import Conversations from '../util/Conversations/conversation'
import Homepage from "../util/homepage/HomePage";
import MonPlanning from './planning/MonPlanning';
function Student() {

    const menu = [{ menu: "Homepage", icon: "fa fa-home", to: "/student" },
    { menu: "Mon PFE", icon: "far fa-folder-open", to: "/student/soumission" },
    { menu: "Coversations", icon: "fas fa-comments-alt", to: "/student/conversation" },
    { menu: "Mon Planning", icon: "fas fa-comments-alt", to: "/student/planning" }

    ]



    return (

        <div className="student">
            <Navbar />


            <div className='row'>

                <Router>
                    <div className="col-sm-2 side_bar">
                        <SideBar menu={menu} />

                    </div>
                    
                <div className="col-sm-10 mb-0 soumission jumbotron">
                <Switch>
                     
                     <Route path="/student/conversation" > 
                        <Conversations role = {"student"}/>     
                      
                           
                        </Route>
                        
                       <Route path="/student/soumission" >
                           <Soumission />  
                        </Route>

                        <Route path="/student/planning" >
                           <MonPlanning/> 
                        </Route>
                        

                        <Route path="/student" > 
                        <Homepage link1="Ma soumission" link2="Conversation" />       
                           
                        </Route>
               </Switch>

               </div> 
           </Router>

 </div>                           
                   

 </div>
 
    )
}

export default Student;



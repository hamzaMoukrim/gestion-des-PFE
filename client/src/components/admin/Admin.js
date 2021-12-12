import React,{useState} from "react"
import Navbar from '../Navbar/Navbar'

import {BrowserRouter as Router,Route,Switch} from  'react-router-dom'
import SideBar from "../util/SideBar"
import Student from "./student/Student"
import AddStudent from "./student/AddStudent"
import ChefDept from './chefDept/ChefDept'
import Enseignant from "./enseignant/Enseignant"
import AddEnseignant from "./enseignant/AddEnseignant"
import ModifierEtudiant from './student/ModifierEtudiant'
import ModifierEnseignant from "./enseignant/ModifierEnseignant";
import ModifierChefDept from "./chefDept/ModifierChefDept"
import Homepage from "../util/homepage/HomePage"



function Admin(){

   
    const menu=[{menu:"Homepage",icon:"fa fa-home",to:"/admin"},
               {menu:"Chefs de dept",icon:"fa fas fa-user-shield",to:"/admin/chefDept"},
               {menu:"Enseignants",icon:"fa fas fa-chalkboard-teacher",to:"/admin/enseignants"},
               {menu:"Etudiants",icon:"fa fas fa-user-graduate",to:"/admin/etudiants"}, 
            ]



    return(
        <div className="student">
            
            <Navbar/>
            

            <div className='row'>

                <Router>
                    <div className="col-sm-2 side_bar">
                        <SideBar menu={menu} />

                    </div>
                    <div className="col-sm-10 mb-0 soumission jumbotron">
                            <Switch>
                                <Route exact path="/admin/etudiants" >
                                    <Student/>
                                </Route>

                               <Route exact path="/admin/chefDept" >
                                    <ChefDept/>
                                </Route>

                                <Route  path="/admin/etudiants/add" >
                                    <AddStudent/>
                                </Route>

                                <Route  exact path="/admin/enseignants" >
                                    <Enseignant/>
                                </Route>

                                <Route  path="/admin/enseignants/add" >
                                    <AddEnseignant/>
                                </Route>

                                <Route  path="/admin/etudiants/:id" >
                                    <ModifierEtudiant/>
                                </Route>

                                <Route  path="/admin/enseignants/:id" >
                                    <ModifierEnseignant/>
                                </Route>

                                <Route  path="/admin/chefDept/modifier/:id" >
                                    <ModifierChefDept/>
                                </Route>

                                
                            <Route path="/admin" >
                                <Homepage link1=" Chefs de departement" link2="Enseignants" link3="Etudiants" />
                                
                            </Route>

                                
                            </Switch>


                    </div>
                
           </Router>

     </div> 
     </div> 

    )

    
}

export default Admin;
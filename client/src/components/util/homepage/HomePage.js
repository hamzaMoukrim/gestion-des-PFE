import React from 'react'
import {Button} from 'react-bootstrap'
import './homepage.css'
import Table from 'react-bootstrap/Table'


function Homepage(props){
    return(
        <React.Fragment>
        <div className='containerEnseignant'>
            <form className='modelEnseignant'>
              
                        <h1 className ="title">Bienvenue dans l'espace de gestion des PFE</h1> 
                        
 
                                    <h6 className="text-muted"></h6> 
                                    <ul className ="list-group">
                                        <li className ="list-group-item d-flex justify-content-between align-items-center">
                                             {props.link1}
                                        <span className ="badge badge-primary badge-pill"></span>
                                        </li>
                                        <li className  ="list-group-item d-flex justify-content-between align-items-center">
                                            {props.link2}
                                        <span className = "badge badge-primary badge-pill"></span>
                                        </li>

                                        <li className  ="list-group-item d-flex justify-content-between align-items-center">
                                            {props.link3}
                                        <span className = "badge badge-primary badge-pill"></span>
                                        </li>

                                        
                                    </ul>
                                
                            

                   
                <div className ="flex-row">
                
            
                </div>

            </form>


        </div>

        </React.Fragment> 

    )
}


export default Homepage;
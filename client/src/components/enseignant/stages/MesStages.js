import React from 'react'
import {Button} from 'react-bootstrap'
import './stageform.css'
import Table from 'react-bootstrap/Table'
//import FormPfe from '../modals/FormPfe'
import ListeDesStages from './ListeDesStages';

function MesStages(){
 
    return(

        <div className="container soumission-table">
            <ListeDesStages/>

        </div>
                   
        
    )
}


export default MesStages;
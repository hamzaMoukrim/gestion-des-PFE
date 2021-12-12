import React ,{ReactFragment} from "react";
import { Form, Col } from 'react-bootstrap';
const Info = (props) => {
   

    return (
        

   <div>
    <Form.Row className="align-items-center" >
                <Col xs="auto">
                    <Form.Label  style={{fontWeight : "bold"}}>
                        {props.label.toString()+" :"}
                    </Form.Label>
                </Col>
                <Col xs="auto" >
                <Form.Label >
                        {props.value}
                    </Form.Label>
                   
                   
                </Col>
    </Form.Row> 
            <br/>
            </div>
            
            
        
        


    )
}

export default Info;



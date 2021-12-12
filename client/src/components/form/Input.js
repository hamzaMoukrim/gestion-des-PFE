import React from "react";
import { Button, Form } from 'react-bootstrap';
const Input = (props) => {
  
  return (
    <Form.Group controlId={props.id} >
       {/* <Form.Group controlId="formGroupEmail"> */}
        <Form.Label style={{float:'left'}}>{props.label}</Form.Label>
        <Form.Control type={props.type} placeholder={props.placeHolder} 
             readOnly={props.readonly} onChange={(e)=>{props.setInput(e.target.value) }} value={props.value} />

    </Form.Group>
  );
}
export default Input;

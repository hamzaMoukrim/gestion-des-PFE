import React, { Fragment, useState } from 'react';
import Message from './Message';
import Progress from './Progress';
import axios from 'axios';

const FileUpload = (props) => {
  // const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose File');
 // const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const onChange = e => { 
    console.log(e.target.files[0])
    props.setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };


  return (
    <Fragment>
      {message ? <Message msg={message} /> : null}
      <form >
        <div className='custom-file mb-4'>
          <input
            type='file'
            className='custom-file-input'
            id='customFile'
            accept="application/pdf"
            onChange={onChange} 
          />
          <label className='custom-file-label' htmlFor='customFile'>
            {filename}
          </label>
        </div>

        {/* <Progress percentage={uploadPercentage} />

        { <input
          type='submit'
          value='Upload'
          className='btn btn-primary btn-block mt-4' 
        /> } */}
      </form>
    </Fragment>
  );
};
export default FileUpload;

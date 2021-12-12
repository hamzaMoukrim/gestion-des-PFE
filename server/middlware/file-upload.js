const multer = require('multer');
const path = require('path');
const { v4 : uuid } = require('uuid');  // import { v4 as uuidv4 } from 'uuid';

const MIME_TYPE_MAP = {
  'application/pdf': 'pdf'
};

const fileUpload = multer({
  limits: 50000000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/docsAdmin');
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuid() + '.' + ext);
    }
  }),
  fileFilter: (req, file, cb) => {
     if (path.extname(file.originalname) !== '.pdf') {
                 return cb(new Error('Only pdfs are allowed'))
          }
          cb(null, true)
        }   

  //   const isValid = !!MIME_TYPE_MAP[file.mimetype];
  //   let error = isValid ? null : new Error('Invalid mime type!');
  //   cb(error, true);
  // }
});

module.exports = fileUpload;

const express = require('express');
const router = express.Router();
const path = require('path');

var documents = [
  { id:"1", name: "Toyota", description: "Celica", uploadDate: 1596385482000, isUploadedProgress: 100, previewUrl: 'http://www.linkedin.com', type: '.pdf' },
  { id:"2",name: "Ford", description: "Mondeo", uploadDate: 1596385482000, isUploadedProgress: 33, previewUrl: 'http://www.yahoo.com', type: '.doc' },
  { id:"3",name: "Porsche", description: "Boxter", uploadDate: 1596385482000, isUploadedProgress: 100, previewUrl: 'http://www.google.com', type: '.xlsx' },
  { id:"4",name: "Porsche", description: "Boxter", uploadDate: 1596385482000, isUploadedProgress: 100, previewUrl: 'http://www.google.com', type: '.xlsx' }
]

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({
    documents: documents
  });
});

router.post('/', function(req, res, next) {
  const {name, description, uploadedDate} = req.body
  let sampleFile = req.files.fileName;
  const fileExtension = sampleFile.name.split('.').pop().toLowerCase()
  const fileName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + '.' + fileExtension;
  sampleFile.mv(`${path.join(__dirname, 'files')}/${fileName}`, function(err) {
    if (err) return res.status(500).send(err);
    const uploadedDocument = {
      id: Math.floor(Math.random()*90000) + 10000,
      name: name,
      description: description,
      uploadDate: uploadedDate,
      isUploadedProgress: 100,
      previewUrl: `document/download?filename=${fileName}`,
      type: fileExtension
    }
    documents.push(uploadedDocument)
    res.json({
      documents: documents
    });
  });

});

router.get('/download', function(req, res, next) {
  res.sendFile(`${path.join(__dirname, 'files')}/${req.query.filename}`, 'myfile.pdf');
});

module.exports = router;

const express = require('express');
const router = express.Router();
const path = require('path');

var documents = [
  { id:"1", name: "Toyota", description: "Celica", uploadDate: 1596385482000, isUploadedProgress: 100, previewUrl: ['document/download?filename=sample.pdf','document/download?filename=sample1.pdf','document/download?filename=sample2.pdf']},
  { id:"2",name: "Ford", description: "Mondeo", uploadDate: 1596385482000, isUploadedProgress: 33, previewUrl: ['document/download?filename=sample4.pdf']},
  { id:"3",name: "Porsche", description: "Boxter", uploadDate: 1596385482000, isUploadedProgress: 100, previewUrl: ['document/download?filename=sample5.xlsx']},
  { id:"4",name: "Porsche", description: "Boxter", uploadDate: 1596385482000, isUploadedProgress: 100, previewUrl: ['document/download?filename=sample6.docx']}
]

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({
    documents: documents
  });
});

router.post('/', function(req, res, next) {
  const {name, description, uploadedDate} = req.body
      , filesKeys = Object.keys(req.files)
  
  let ticker = filesKeys.length,
      uploadedDocument;
  
  const uploadFiles = () => {
    const sampleFile = req.files[filesKeys[ticker-1]]
        , fileExtension = sampleFile.name.split('.').pop().toLowerCase()
        , fileName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + '.' + fileExtension;
    
    sampleFile.mv(`${path.join(__dirname, 'files')}/${fileName}`, function(err) {
      if (err) return res.status(500).send(err);
      
      if(ticker === filesKeys.length){
        uploadedDocument = {
          id: Math.floor(Math.random()*90000) + 10000,
          name: name,
          description: description,
          uploadDate: uploadedDate,
          isUploadedProgress: 100,
          previewUrl: [`document/download?filename=${fileName}`],
          type: fileExtension
        }
      }else{
        uploadedDocument.previewUrl.push(`document/download?filename=${fileName}`)
      }
      
      if(ticker === 1){
        documents.push(uploadedDocument)
        res.json({
          documents: documents
        });
      }else{
        ticker -= 1
        uploadFiles()
      }

    });
  }
  uploadFiles()
});

router.get('/download', function(req, res, next) {
  res.sendFile(`${path.join(__dirname, 'files')}/${req.query.filename}`, 'myfile.pdf');
});

module.exports = router;

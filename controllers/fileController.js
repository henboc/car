const path = require('path');
const fs = require('fs');
console.log('upload in control');
console.log('upload in control');
const uploadFile = async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        console.error('No files were uploaded.');
        return res.status(400).send('No files were uploaded.');
      }
    
      const file = req.files.file;
      const uploadPath = path.join(__dirname, '../public', 'Breakdown.xlsx');
    
      // Delete the existing file if it exists
      if (fs.existsSync(uploadPath)) {
        fs.unlinkSync(uploadPath);
      }
    
      // Save the new file
      file.mv(uploadPath, (err) => {
        if (err) {
          console.error('File upload failed:', err);
          return res.status(500).send(err);
        }
    
        res.send({ message: 'File uploaded successfully' });
      });
};

module.exports = {
    uploadFile,
  };
  

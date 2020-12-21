import express, { Router } from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fileUpload from 'express-fileupload';
import { v4 as uuidv4 } from 'uuid';

const __dirname = dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, '../upload');

const router = Router();
const handler = fileUpload({ 
    createParentPath: true,
    abortOnLimit: true,
    limits: { fileSize: 1 * 1024 * 1024 } 
});

router.post('/upload', handler, (req, res) => {
    
    const sessionID = req.sessionID;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    const file = req.files['image'];
    if(!file) {
        return res.status(500).send('File `image` missing.');
    }
    const ext = path.extname(file.name);
    const fileName = uuidv4();
    // Use the mv() method to place the file somewhere on your server
    file.mv(path.resolve(uploadDir, sessionID, `${fileName}${ext}`), (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.send({
            original: file.name,
            fileName: fileName
        });
    });
});

export default router;
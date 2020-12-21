import express, { Router } from 'express';
import * as lib from './library.js';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envData = {
    _uploadDir: 'C:/Users/ante.novokmet/Desktop/Projects/latex-cv-editor/server/upload/'
};

const router = Router();

router.use(express.json());

function readFile(relativePath) {
    return fs.readFileSync(path.resolve(__dirname, relativePath))
}

// param: template name
// out: schema
router.get('/schema', (req, res) => {
    const templateName = req.query['t'];
    const template = readFile(`../templates/${templateName}/main.texbars`);
    
    res.json(lib.getSchemaFromTexbars(template));
});

// param: template name
// body: data
// out: pdf 
router.post('/generate', (req, res) => {
    const templateName = req.query['t'];
    const data = {
        ...req.body,
        ...envData
    };
    const template = readFile(`../templates/${templateName}/main.texbars`);
    const sessionID = req.sessionID;

    try {
        const pdf = lib.getPdfFromTexbars(template, data, { sessionID });
    
        res.contentType('application/pdf');
        pdf.pipe(res);
        pdf.on('finish', () => console.log('PDF generated!'));
        pdf.on('error', err => {
            console.error('err:', err);
            res.status(500);
            res.contentType('application/json');
            res.send({
                message: err.message, 
                stack: err.stack 
            });
        });
    } catch (error) {
        console.error('err:', err);
        res.status(500);
        res.contentType('application/json');
        res.send({
            message: err.message, 
            stack: err.stack 
        });
    }
});

router.get('/example-data', (req, res) => {
    const templateName = req.query['t'];
    res.contentType('application/json');
    try {
        const data = readFile(`../templates/${templateName}/main.json`);
        res.send(data.toString())
    } catch {
        res.send({});
    }
});


export default router;
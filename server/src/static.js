import express, { Router } from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const router = Router();

router.use('/template', express.static(path.resolve(__dirname, '../templates')));

export default router;
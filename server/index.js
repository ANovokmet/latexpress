import express from 'express';
import cors from 'cors';
import api from './src/routes';

const app = express();
const port = 3000;

app.use(cors());
app.use('/api', api);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
}).on('error', (error) => {
    console.error(error);
});

import express from 'express';
import cors from 'cors';
import api from './src/routes';
import stat from './src/static';
import upload from './src/upload';
import session from 'express-session';
import createMemoryStore from 'memorystore';

const app = express();
const port = 3000;
const memorystore = createMemoryStore(session);

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5000'
}));
app.use(session({
    cookie: { maxAge: 86400000 },
    store: new memorystore({
        checkPeriod: 86400000
    }),
    saveUninitialized: true,
    resave: true,
    secret: 'secret'
}));
app.use('/api', api);
app.use('/api', upload);
app.use('/static', stat);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
}).on('error', (error) => {
    console.error(error);
});

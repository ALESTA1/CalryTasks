import express from 'express';
import http, { request } from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import {initializeDatabase} from './dbOps';
import routes from './routes';

const app = express();
app.use(cors({}));
app.use(bodyParser.json());
app.use(routes);

initializeDatabase();

const server = http.createServer(app);

server.listen(8080, () => {
    console.log('server running on http://localhost:8080/');
});

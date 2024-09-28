import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import { initializeDatabase } from './dbOps';
import routes from './routes';

const app = express();
app.use(cors({}));
app.use(bodyParser.json());
app.use(routes);


const startServer = async () => {
    await initializeDatabase(); 
    const server = http.createServer(app);
    
    server.listen(8080, () => {
        console.log('server running on http://localhost:8080/');
    });
};

// Start the server
startServer().catch(err => {
    console.error('Error starting the server:', err);
});

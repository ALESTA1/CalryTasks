import fs from 'fs'
import path from 'path'
import { Request } from 'types';
const dbPath = path.join(__dirname, 'db', 'requests.json'); 

export function initializeDatabase() {

   
    fs.writeFileSync(dbPath, JSON.stringify([]));
    console.log('Database initialized with an empty array.');
}

export function writeMapToDB(requestMap: Map<string, Request>) {
    
    const requestArray = Array.from(requestMap.values());
    const jsonData = JSON.stringify(requestArray, null, 2); 
    fs.writeFileSync(dbPath, jsonData);
}

export function readMapFromDB(): Map<string, Request> {
    const requestMap = new Map<string, Request>();

    if (fs.existsSync(dbPath)) {
        const jsonData = fs.readFileSync(dbPath, 'utf8');
        const requestArray: Request[] = JSON.parse(jsonData); 
        requestArray.forEach(request => {
            requestMap.set(request.id, request);
        });
    }

    return requestMap; 
}
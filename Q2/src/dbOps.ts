import { promises as fs } from 'fs';  
import path from 'path';
import { Request } from './types';  
const dbPath = path.join(__dirname, 'db', 'requests.json');

export async function initializeDatabase() {
    await fs.writeFile(dbPath, JSON.stringify([]));
    console.log('Database initialized with an empty array.');
}

export async function writeMapToDB(requestMap: Map<string, Request>) {
    const requestArray = Array.from(requestMap.values());
    const jsonData = JSON.stringify(requestArray, null, 2);
    await fs.writeFile(dbPath, jsonData);
}

export async function readMapFromDB(): Promise<Map<string, Request>> {
    const requestMap = new Map<string, Request>();

    try {
        if (await fs.access(dbPath).then(() => true).catch(() => false)) {
            const jsonData = await fs.readFile(dbPath, 'utf8');
            const requestArray: Request[] = JSON.parse(jsonData);
            requestArray.forEach(request => {
                requestMap.set(request.id, request);
            });
        }
    } catch (error) {
        console.error('Error reading from database:', error);
    }

    return requestMap;
}

import { Request } from 'types';
import express from 'express';

export function getSortedRequests(requestMap: Map<string, Request>): Request[] {
    return Array.from(requestMap.values()).sort((a, b) => a.priority - b.priority);
}
export function keyExistsInMap(map: Map<string, Request>, key: string): boolean {
    return map.has(key);
}
export function formRequest(req: express.Request, id: string): Request {
    const originalObject = req.body; 
    return {
        id: id, 
        ...originalObject 
    };
}
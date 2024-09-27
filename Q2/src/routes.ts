import express from 'express';
import * as db from './dbOps';
import { Request } from './types';
import * as helper from './helper'
import * as lock from './lock'

const lck = new lock.Lock();
const router = express.Router();

let requestMap = new Map<string, Request>();

router.get('/', (req, res) => {
    res.status(200).send('Hi');
});

router.get('/requests', async (req, res) => {
    await lck.readLock();
    try{
        const requestMap = db.readMapFromDB();
        const sortedRequests = helper.getSortedRequests(requestMap);
        res.status(200).json(sortedRequests);
    }finally{
        lck.releaseReadLock();
    }
    
});

router.post('/requests', async (req, res) => {

    await lck.writeLock();
    try{
        const requestMap = db.readMapFromDB();
        const id = requestMap.size.toString();
        const newRequest = helper.formRequest(req,id);
        requestMap.set(id,newRequest);
        db.writeMapToDB(requestMap);
        res.status(201).json(newRequest);  
    }finally{
        lck.releaseWriteLock();
    }

   
});

router.post('/requests/:id/complete', async (req, res) => {

    await lck.writeLock();
    try{
        const requestMap = db.readMapFromDB();
        const requestId = parseInt(req.params.id, 10).toString();
        const checkKey = helper.keyExistsInMap(requestMap,requestId);
        if(checkKey){
        let newRequest = requestMap.get(requestId);
        newRequest.status = "completed";
        db.writeMapToDB(requestMap);
        res.status(201).json(newRequest);  
        }
        else{
        res.status(404).json({ message: 'Request not found' });
        }
    }finally{
        lck.releaseWriteLock();
    }   
    
});

router.get('/requests/:id', async (req, res) => {
    
    await lck.readLock();
    try{
    const requestMap = db.readMapFromDB();
    const requestId = parseInt(req.params.id, 10).toString();
    const request = requestMap.get(requestId);    
    if (request) {
        res.status(200).json(request);
    } else {
        res.status(404).json({ message: 'Request not found' });
    }
    }finally{
        lck.releaseReadLock();
    }
});


router.put('/requests/:id', async (req, res) => {
    await lck.writeLock();
    try{
    const requestMap = db.readMapFromDB();
    const requestId = parseInt(req.params.id, 10).toString();
    const checkKey = helper.keyExistsInMap(requestMap,requestId);

    if(checkKey){
    let newRequest = helper.formRequest(req,requestId);
    requestMap.set(requestId,newRequest);
    db.writeMapToDB(requestMap);
    res.status(201).json(newRequest);  
    }
    else{
        res.status(404).json({ message: 'Request not found' });
    }
    }finally{
        lck.releaseWriteLock();
    }

});


router.delete('/requests/:id', async (req, res) => {
    await lck.writeLock();
    try{
    requestMap = db.readMapFromDB();
    const requestId = parseInt(req.params.id, 10).toString();
    const checkKey = helper.keyExistsInMap(requestMap,requestId);    
    if (checkKey) {
        requestMap.delete(requestId);
        db.writeMapToDB(requestMap);
        res.status(204).send(); 
    } else {
        res.status(404).json({ message: 'Request not found' });
    }
    }finally{
        lck.releaseWriteLock();
    }
});

export default router;


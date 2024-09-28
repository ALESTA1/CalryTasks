import express from 'express';
import * as db from './dbOps';
import { Request } from './types';
import * as helper from './helper';
import * as lock from './lock';

const lck = new lock.Lock();
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send('Hi');
});

router.get('/requests', (req, res) => {
    lck.readLock().then(() => {
        return db.readMapFromDB();
    }).then((requestMap) => {
        const sortedRequests = helper.getSortedRequests(requestMap);
        res.status(200).json(sortedRequests);
    }).catch((err) => {
        res.status(500).json({ message: 'Error fetching requests' });
    }).finally(() => {
        lck.releaseReadLock();
    });
});

router.post('/requests', (req, res) => {
    lck.writeLock().then(() => {
        return db.readMapFromDB();
    }).then((requestMap) => {
        const id = requestMap.size.toString();
        const newRequest = helper.formRequest(req, id);
        requestMap.set(id, newRequest);
        return db.writeMapToDB(requestMap).then(() => {
            res.status(201).json(newRequest);
        });
    }).catch((err) => {
        res.status(500).json({ message: 'Error saving request' });
    }).finally(() => {
        lck.releaseWriteLock();
    });
});

router.post('/requests/:id/complete', (req, res) => {
    lck.writeLock().then(() => {
        return db.readMapFromDB();
    }).then((requestMap) => {
        const requestId = parseInt(req.params.id, 10).toString();
        const checkKey = helper.keyExistsInMap(requestMap, requestId);
        if (checkKey) {
            let newRequest = requestMap.get(requestId);
            newRequest.status = "completed";
            return db.writeMapToDB(requestMap).then(() => {
                res.status(201).json(newRequest);
            });
        } else {
            res.status(404).json({ message: 'Request not found' });
        }
    }).catch((err) => {
        res.status(500).json({ message: 'Error completing request' });
    }).finally(() => {
        lck.releaseWriteLock();
    });
});

router.get('/requests/:id', (req, res) => {
    lck.readLock().then(() => {
        return db.readMapFromDB();
    }).then((requestMap) => {
        const requestId = parseInt(req.params.id, 10).toString();
        const request = requestMap.get(requestId);
        if (request) {
            res.status(200).json(request);
        } else {
            res.status(404).json({ message: 'Request not found' });
        }
    }).catch((err) => {
        res.status(500).json({ message: 'Error fetching request' });
    }).finally(() => {
        lck.releaseReadLock();
    });
});

router.put('/requests/:id', (req, res) => {
    lck.writeLock().then(() => {
        return db.readMapFromDB();
    }).then((requestMap) => {
        const requestId = parseInt(req.params.id, 10).toString();
        const checkKey = helper.keyExistsInMap(requestMap, requestId);

        if (checkKey) {
            let newRequest = helper.formRequest(req, requestId);
            requestMap.set(requestId, newRequest);
            return db.writeMapToDB(requestMap).then(() => {
                res.status(201).json(newRequest);
            });
        } else {
            res.status(404).json({ message: 'Request not found' });
        }
    }).catch((err) => {
        res.status(500).json({ message: 'Error updating request' });
    }).finally(() => {
        lck.releaseWriteLock();
    });
});

router.delete('/requests/:id', (req, res) => {
    lck.writeLock().then(() => {
        return db.readMapFromDB();
    }).then((requestMap) => {
        const requestId = parseInt(req.params.id, 10).toString();
        const checkKey = helper.keyExistsInMap(requestMap, requestId);
        if (checkKey) {
            requestMap.delete(requestId);
            return db.writeMapToDB(requestMap).then(() => {
                res.status(204).send();
            });
        } else {
            res.status(404).json({ message: 'Request not found' });
        }
    }).catch((err) => {
        res.status(500).json({ message: 'Error deleting request' });
    }).finally(() => {
        lck.releaseWriteLock();
    });
});

export default router;

const express = require('express');
const db = require('./data/hubs-model'); // <<< 1: import database file
const server = express();

server.use(express.json()); // needed to parse JSON from the body

server.get('/', (req, res) => {
    // res.end('hello');
    res.send({api: 'up and running...'})
});

// list of hubs - GET /hubs <<< 2: implement endpoint
server.get('/hubs', (req, res) => {
    db.find()
        .then(hubs => {
            res.status(200).json(hubs);
        })
        .catch(error => {
            console.log('error on GET /hubs', error);
        res
            .status(500)
            .json({errorMessage:'error getting list of hubs from database'});
    })
});

// add a hub - POST /hub
server.post('/hubs', (req, res) => {
    // get the data the client sent
    const hubData = req.body; // express does not know how to parse JSON

    // call the db and add the hub
    db.add(hubData)
        .then(hub => {
            res
                .status(201).json(hub);
        })
        .catch( error => {
            console.log('error on POST /hubs', error);
            res
                .status(500)
                .json({errorMessage:'error adding the hub'});
        })
});

// remove a hub it it's id
server.delete(`/hubs/:id`, (req, res) =>{
    const id = req.params.id;

    db.remove(id)
        .then(removed => {
            if(!removed) {
                // there was no hub with that id
                res.status(200).json({message:'hub removed successfully'});
            } else {
                res.status(404).json({message:'hub not found'});
            }
        })
        .catch( error => {
            console.log('error on DELETE /hubs', error);
            res
                .status(500)
                .json({errorMessage:'error deleting the hub'});
        })
});

// update a hub, passing in the id and the changes

const port = 4000;
server.listen(port, () => console.log(`\n** API running on port ${port} **\n`));
const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');
var mongo = require('mongodb');

const app = express();
app.set('view engine', 'ejs')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const uri = "mongodb+srv://akh24:78986041@cluster0.nkkwz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"


MongoClient.connect(uri).then(client => {
        const db = client.db('ToDoApp')
        const toDoListItems = db.collection('toDoList')
        console.log("successful")

        app.get('/', function(request, response) {
            db.collection('toDoList').find().toArray()
                .then(results => {
                    return response.render('index.ejs', { tasks: results })
                        // res.redirect('/')
                })
                .catch(error => console.error(error));
        });

        // POST
        app.post('/task', (req, res) => {
            let description = req.body.description;
            let bool = false;
            toDoListItems.insertOne({
                    description: description,
                    isComplete: bool,
                })
                .then(result => {
                    res.redirect("/")
                })
                .catch(error => console.error(error))
        })

        // GET
        app.get('/task', (req, res) => {
            db.collection('toDoList').find().toArray()
                .then(results => {
                    res.jsonp(results)
                        // res.redirect('/')

                })
                .catch(error => console.error(error))
        })

        //  DELETE
        app.delete('/task/:id', (req, res) => {
            console.log("inside delete")
            console.log(req.body.id)
            toDoListItems.deleteOne({ _id: new mongo.ObjectID(req.body.id) }, ).then(result => {
                    if (result.deletedCount === 0) {
                        return res.json('No toDoList to delete')
                    }
                    res.json('deleted toDoList')
                })
                .catch(error => console.error(error))
        })

        // PUT
        app.put('/task/toggle/:id', (req, res) => {
            console.log("inside put")
            console.log(req.body.id)
            db.collection('toDoList').find({ _id: new mongo.ObjectID(req.body.id) }).toArray().then(results => {
                // if value is true
                if (results[0]['isComplete']) {
                    db.collection("toDoList").updateOne({ _id: new mongo.ObjectID(req.body.id) }, { $set: { isComplete: false, } },
                        function(err, resr) {
                            if (err) throw err;
                            console.log("updated");
                            res.json("updated")
                        })

                }
                // if value is false
                else {
                    db.collection("toDoList").updateOne({ _id: new mongo.ObjectID(req.body.id) }, { $set: { isComplete: true, } },
                        function(err, resr) {
                            if (err) throw err;
                            console.log("updated");
                            res.json("updated")
                        })

                }

                // res.redirect(303,"/");
            })
        })

    })
    .catch(console.error)



app.listen(process.env.PORT || 8000);
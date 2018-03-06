const express = require('express');
const mongoose = require('mongoose')
const app = express();

const createModels = require('./models');
const setupCRUD = require('./crud');

const bodyParser = require('body-parser');

const dbURL = 'mongodb://localhost/todo';
mongoose.connect(dbURL);
const db = mongoose.connection;
let Task, User;
db.on('error', (err) => { console.error(err); });
db.once('open', () => {
    console.log("Connected to db", dbURL);
    const models = createModels();
    Task = models.Task;
    User = models.User;
    let task = new Task({
        title: "Test task",
        description: "Test description",
        isOpen: false,
        user: null
    
    });
    task.save((err, task) => {
        console.log("Saved");
    });
    const api = express.Router();
    const usersEndpoint = express.Router(), tasksEndpoint = express.Router();
    app.use('/api', api);
    api.use('/users', usersEndpoint);
    api.use('/tasks', tasksEndpoint);

    setupCRUD(User, ["__v"], usersEndpoint);
    setupCRUD(Task, ["__v"], tasksEndpoint);
});
app.use(express.static('static'));
app.use(bodyParser.json());

/*
api.get('/tasks', (req, res) => {
    Task.find({'title': 'Test task'}, (err, tasks) => {
        console.log(JSON.stringify(tasks));
        res.json(tasks ? tasks : []);
    });
});

*/

app.listen(3000, () => console.log('Example app listening on port 3000!'));
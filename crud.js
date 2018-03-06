const mongoose = require('mongoose');


function setupCRUD(model, excludedFields, router) {
    // router.use(bodyParser);
    router.get('/', (req, res) => {
        console.log(`GET ${model.modelName}`);
        const exclusionString = excludedFields.map(field => '-' + field).join(' ');
        model.find({}, exclusionString, (err, items) => {
            if (err) {
                res.status(500).send({ error: "Server error"});
                return;
            }
            res.json(items);
        });
    });

    router.post('/', (req, res) => {
        const item = new model(req.body);
        item.save((err, item) => {
            if (err) {
                res.status(500).send({ error: "Server error"});
                return;
            }
            res.json(item);
        });
    });
    
    router.put('/:id', (req, res) => {
        const body = req.body;
        const id = req.params.id;
        console.log(`PUT ${model.modelName} ${id} ${body}`);
        if (!id) {
            res.status(400).send({ error: "No id specified" });
            return;
        }
        model.findByIdAndUpdate(id, {$set: req.body}, { new: true }, (err, item) => {
            console.log(item, err);
            if (err) {
                res.status(404).send({ error: `Can't find ${model.modelName} with id ${id}`});
                return;
            }
            res.json(item);
        });
    });

    router.delete('/:id', (req, res) => {
        const id = req.params.id;
        if (!id) {
            res.status(400).send({ error: "No id specified" });
            return;
        }
        model.findByIdAndRemove(id, (err, item) => {
            if (err) {
                res.status(500).send({ error: "Server error"});
                return;
            }
            return res.status(200).send({});
        });
    });
}

module.exports = setupCRUD;
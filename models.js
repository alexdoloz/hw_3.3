const mongoose = require('mongoose');

const schemas = {
    User: {
        id: Number,
        name: String
    },
    Task: {
        id: Number,
        title: String,
        description: String,
        isOpen: Boolean,
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
};

function createModels() {
    const result = {};
    for (let schemaName in schemas) {
        const schema = new mongoose.Schema(schemas[schemaName]);
        const model = mongoose.model(schemaName, schema);
        result[schemaName] = model; 
    }
    return result;
}

module.exports = createModels;
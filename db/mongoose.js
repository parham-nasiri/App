const mongoose = require('mongoose');

class MongoConnector {
    async connect() {
        try {
            await mongoose.connect('mongodb://localhost:27017/api', {});
            console.log("Connected to MongoDB");
        } catch (err) {
            console.error(err?.message);
            process.exit(1);
        }
    }
}

const mongoClient = new MongoConnector();
Object.freeze(mongoClient);

module.exports = mongoClient;
const mongoose = require('mongoose');

class MongoConnector {
    async connect() {
        try {
            await mongoose.connect('mongodb://localhost:27017/api', {});
            //mongodb+srv://<db_username>:<db_password>@parhamapp.ra3d85s.mongodb.net/?retryWrites=true&w=majority&appName=parhamApp
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
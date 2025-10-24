const mongoose = require('mongoose');
require('dotenv').config();

require('../models/User');
require('../models/Cart');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.error('Error de conexión:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
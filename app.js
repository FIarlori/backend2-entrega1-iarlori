const express = require('express');
const passport = require('passport');
const sessionRouter = require('./src/routes/sessions.router');
const userRouter = require('./src/routes/users.router');
const connectDB = require('./src/config/database');
require('dotenv').config();
require('./src/config/passport.config');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use(passport.initialize());

app.use('/api/sessions', sessionRouter);
app.use('/api/users', userRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
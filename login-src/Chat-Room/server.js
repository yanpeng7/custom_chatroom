  
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import passport from 'passport';

import users from './routes/api/login_system.js'
import {mongoURI} from './database_and_passport/dBconnect.js';

const app = express();

// Middlewares

app.use(bodyParser.urlencoded({
    extended: false
}));


app.use(bodyParser.json());


app.use(cors());

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
    console.log(`${mongoURI} !!!Is connected!!!`)
}).catch(error => {
    console.log(`Error: ${error} `)
});

app.get('*', (req, res) => {
    res.send("<h1>Hi<h1>");
})

// Bring in the Users route
app.use('/api/login_system', users);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})


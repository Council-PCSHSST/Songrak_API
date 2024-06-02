import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// import path from 'path';
// import { fileURLToPath } from 'url';
// import favicon from 'serve-favicon' ;

import songrak_api from './router/songrak_api';

const app = express();
dotenv.config();

// * Optional for who wan't to use icons in api routes.
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(favicon(path.join(__dirname,'pages/favicon.ico')));

app.use(express.json());
app.use(express.urlencoded());
app.use(cors({
    origin: '*'
}));

app.get('/', function(req,res){
    res.json({"msg":"Node is respone!"});
})

// Songrak API Import
app.use(songrak_api)

app.listen(3000, function(req, res) {
    console.log("Server is running at port 3000");
});

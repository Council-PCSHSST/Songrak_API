import express from 'express';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
// import { fileURLToPath } from 'url';
// import favicon from 'serve-favicon' ;

const app = express();
dotenv.config();

const supabaseKey = process.env.SUPABASE_KEY;
const projectSupabase = process.env.SUPABASE_PROJECTID
const supabase = createClient(projectSupabase,supabaseKey);

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(favicon(path.join(__dirname,'pages/favicon.ico')));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(cors({
    origin: '*'
}));


app.get('/menu_sapha', async function(req, res) {
    const { data, error } = await supabase
    .from('menu')
    .select('button_title, link')
    res.status(200).json(data);
});

app.get('/', function(req,res){
    res.json({"msg":"Node is respone!"});
})

app.get('/songrak_add', function(req,res){
    res.status(400).json({"msg":"Hey! calm down pls ;-;"});
})

app.get('/announce_popup', async function(req, res){
    const {data, err} = await supabase
    .from('announce_popup')
    .select('*')
    .order('id', { ascending: false })
    .limit(1)
    const hasData = data.length > 0 ? true : false
    const return_data = {
        "status": hasData,
        "data": []
    }
    if(hasData){
        return_data.data = [
            data[0].title,
            data[0].text
        ]       
    }
    res.status(200).json(return_data)
})

// ระบบของส่งรักส่งยิ้ม
app.post('/songrak_submit', function(req, res){
    let name_rq = req.body.REQUEST_NAME;
    let class_rq = req.body.CLASS_REQUEST;
    let name_rec = req.body.RECIEVE_NAME;
    let class_rec = req.body.CLASS_RECIEVE;
    let quest1 = req.body.QUEST1;
    let quest2 = req.body.QUEST2;
    let quest3 = req.body.QUEST3;
    let quest4 = req.body.QUEST4;
    let quest5 = req.body.QUEST5;
    let img_amount = req.body.IMG_AMOUNT;
    let emergency = req.body.EMERGENCY;
    let check_type = req.body.CHECK_TYPE;
    console.log("===================")
    console.log(`value of type: ${req.body.CHECK_TYPE}`)
    console.log("===================")
    console.log(req.body)
    let obj = {
        name_rq: name_rq,
        class_rq: `ม.${class_rq}`,
        name_rec: name_rec,
        class_rec: `ม.${class_rec}`,
        quest1: quest1,
        quest2: quest2,
        quest3: quest3,
        quest4: quest4,
        quest5: quest5,
        amount_photo: img_amount,
        emergency_contact: emergency
    }
    if(check_type === undefined || check_type === NaN || check_type === null){
        return res.status(200).json({"result":"logic corrupted"});
    }else if(check_type == "wrk"){

    }else if(check_type == "npt"){

    }else if(check_type == "nqt"){

    }else if(check_type == "nptnqt"){
        return res.status(200).json({"result":"not allow to request!"})
    }

    axios.get('GSCRIPT_URL', {params: obj})
    .then( (response) => {
        if(response.data.result == "recieve!"){
            return res.status(200).json(response.data);
        }
        return res.status(200).json({"result":"try submit again!"});
    }).catch( (error) => {
        console.log(error)
        console.log("Cant connect")
        return res.status(502).json({"result":"Bad Gateway from GSheets"})
    })
})

app.get('/songrak_dumpname', async function(req, res){
    let class_request = req.query.CLASS;
    let class_no_request = req.query.CLASS_NO;
    const {data, err} = await supabase
    .from('songrak_stdlist')
    .select('class, number, fullname, nickname, take_photo, take_question')
    .eq('class',`${class_request}/${class_no_request}`)
    .order('number',{ ascending: true })
    if(data.length == 0){
        return res.send(null);
    }
    res.json(data);
});

app.post('/songrak_namerequest', async function(req, res){
    let class_request = req.body.CLASS_REQUEST;
    let class_no_request = req.body.CLASS_NO_REQUEST;
    console.log(req.body)
    const {data, err} = await supabase
    .from('songrak_stdlist')
    .select('class, number, fullname, nickname, take_photo, take_question')
    .eq('class',`${class_request}/${class_no_request}`)
    .eq('remove',false)
    .order('number',{ ascending: true })

    res.status(200).json(data)
})

app.post('/songrak_namerequest/invidival', async function(req, res){
    let class_request = req.body.CLASS_REQUEST;
    let class_no_request = req.body.CLASS_NO_REQUEST;
    let num_received = req.body.NUMBER_REQUEST;
    console.log(req.body)
    const {data, err} = await supabase
    .from('songrak_stdlist')
    .select('class, number, fullname, nickname, take_photo, take_question')
    .eq('number',num_received)
    .eq('class', `${class_request}/${class_no_request}`)
    res.status(200).json(data)
})

app.get('/checker', function(req,res){
    res.sendFile(path.join(__dirname+'/pages/checker.html'));
})

app.listen(3000, function(req, res) {
    console.log("Server is running at port 3000");
});

import express from 'express';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const songrak_api  = express.Router();

songrak_api.use(express.json());
songrak_api.use(express.urlencoded());

const supabaseKey = process.env.SUPABASE_KEY;
const supabaseURL = process.env.SUPABASE_PROJECTID;
const supabase = createClient(supabaseURL,supabaseKey);

// Songrak submit function
const srk_submit = (req,res) => {
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
    console.log("==========[ * ]==========")
    console.log(`request from: ${req.body.REQUEST_NAME}`)
    console.log(`value of type from reciever: ${req.body.CHECK_TYPE}`)
    console.log("==========[ / ]==========")
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
        emergency_contact: emergency,
        request_type: check_type
    }
    
    return res.status(402).json({"result":"ฟอร์มปิดรับแล้วครับ!"});
    
    if(check_type === undefined || check_type === NaN || check_type === null){
        console.log("Logic corrupted")
        return res.status(403).json({"result":"logic corrupted"});
    }else if(check_type == "wrk"){
        console.log("wrk (support all)")
    }else if(check_type == "npt"){
        console.log("npt (photo is not permitted)")
        if(img_amount > 0){
            return res.status(401).json({"result":"That person isn't allowed to request photo!"});
        }
    }else if(check_type == "nqt"){
        console.log("nqt (question is not permitted)")
        if(quest1 != null || quest2 != null || quest3 != null || quest4 != null || quest5 != null){
            return res.status(401).json({"result":"That person isn't allowed to request questions!"});
        }
    }else if(check_type == "nptnqt"){
        console.log("nptnqt (That person is not pemitted to request)")
        return res.status(401).json({"result":"That person isn't allowed to request!"})
    }

    axios.get('GSCRIPT_URL', {params: obj})
    .then( (response) => {
        if(response.data.result == "recieve!"){
            return res.status(200).json(response.data);
        }
        return res.status(200).json({"result":"try submit again!"});
    }).catch( (error) => {
        console.log(error)
        console.log("*------ Cant connect -----*")
        return res.status(502).json({"result":"Bad Gateway"})
    })
}

// Songrak dumpname for analyze in checker path
const srk_dumpname = async (req,res) => {
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
}

// Songrak name request for using in client side (Step 1 & Step 2)
const srk_namerequest = async (req,res) => {
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
}

// Songrak name request for using in client side (Step 3)
const srk_namereq_individual = async (req,res) => {
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
}

// Songrak chceker analyze page for administrator
const srk_checker = async (req, res) => {
    res.sendFile(path.join(__dirname,'../pages/checker.html'));
}

songrak_api.post('/songrak_submit',srk_submit)
songrak_api.get('/songrak_dumpname',srk_dumpname)
songrak_api.post('/songrak_namerequest',srk_namerequest)
songrak_api.post('/songrak_namerequest/invidival',srk_namereq_individual)
songrak_api.get('/checker',srk_checker)
    

export default songrak_api;

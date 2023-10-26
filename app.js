const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');
const path = require('path');
const axios = require('axios');
const favicon = require('serve-favicon');

require('dotenv').config();

var fs = require('fs');
var http = require('http');
var https = require('https');

const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const dbName = process.env.DB;
const dbHost = process.env.DB_HOST;

var con = mysql.createConnection({
    host: dbHost,
    user: user,
    password: pass,
    database: dbName
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connect to Database success!");
});

app.use(cors({
    origin: '*'
}));

// app.use(favicon(path.join(__dirname,'pages/favicon.ico')));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies


app.get('/menu_sapha', function(req, res) {
    con.query("SELECT buttons_title, link FROM menu", function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.get('/', function(req,res){
    res.json({"msg":"Node is respone!"});
})

app.get('/songrak_add', function(req,res){
    res.status(400).json({"msg":"Hey! calm down pls ;-;"});
})

app.get('/announce_popup', function(req, res){
    con.query(`SELECT * FROM announce_popup ORDER BY id DESC LIMIT 1`, function (err, result){
        if(err) throw err;
        var htmlShow;
        data = Object.values(JSON.parse(JSON.stringify(result)));
        console.log(data)
        show_status = data.length > 0
        if(show_status === true){
            show_data = [data[0].title, data[0].text]
        }else{
            show_data = []
        }
        console.log(show_status);

        final = {
            status: show_status,
            data: show_data
        }
        return res.json(final)
    });
})

app.post('/songrak_add', function(req, res){
    name_rq = req.body.REQUEST_NAME;
    class_rq = req.body.CLASS_REQUEST;
    class_no_rq = req.body.CLASS_NO_REQUEST;
    name_rec = req.body.RECIEVE_NAME;
    class_rec = req.body.CLASS_RECIEVE;
    class_no_rec = req.body.CLASS_NO_RECIEVE;
    quest1 = req.body.QUEST1;
    quest2 = req.body.QUEST2;
    quest3 = req.body.QUEST3;
    quest4 = req.body.QUEST4;
    quest5 = req.body.QUEST5;
    img_amount = req.body.IMG_AMOUNT;
    emergency = req.body.EMERGENCY;
    check_type = req.body.CHECK_TYPE;
    obj = {
        name_rq: name_rq,
        class_rq: `ม.${class_rq}/${class_no_rq}`,
        name_rec: name_rec,
        class_rec: `ม.${class_rec}/${class_no_rec}`,
        quest1: quest1,
        quest2: quest2,
        quest3: quest3,
        quest4: quest4,
        quest5: quest5,
        img_amount: img_amount,
        emergency_contacts: emergency
    }
    console.log(req.body)
    if(check_type === undefined){
        return res.status(400).json({"result":"Checker logic is corrupted.<br>Please refresh page"})
    }else if(check_type === 'npt'){
        if(name_rq == undefined || name_rec == undefined || emergency == undefined || name_rq == '' || name_rec == '' || emergency == '' || quest1 == undefined || quest2 == undefined || quest3 == undefined || quest1 == '' || quest2 == '' || quest3 == ''){
            console.log(`Data from ${name_rq} M.${class_rq}/${class_no_rq} is not enough!`);
            console.log('npt')
            return res.status(400).json({"result":"missing some data"})
        }
    }else if(check_type === 'nqt'){
        if(name_rq == undefined || name_rec == undefined || emergency == undefined || name_rq == '' || name_rec == '' || emergency == ''|| img_amount == undefined || img_amount == '') {
            console.log(`Data from ${name_rq} M.${class_rq}/${class_no_rq} is not enough!`);
            console.log('nqt')
            return res.status(400).json({"result":"missing some data"})
        }
    }else if(name_rq == undefined || name_rec == undefined || emergency == undefined || name_rq == '' || name_rec == '' || emergency == '' || quest1 == undefined || quest2 == undefined || quest3 == undefined || quest1 == '' || quest2 == '' || quest3 == '' || img_amount == undefined || img_amount == '') {
	    console.log(`Data from ${name_rq} M.${class_rq}/${class_no_rq} is not enough!`);
        console.log('pass')
        return res.status(400).json({"result":"missing some data"})
    }
    axios.get('https://script.google.com/macros/s/AKfycbzOI_pKhhE6W52pMTI_3YMOAbLe2D99cDkPVZyd5cx4jBEWkOEWXn-75jyWQl-zdszKfg/exec', {
        params: {
            name_rq: name_rq,
            class_rq: `ม.${class_rq}/${class_no_rq}`,
            name_rec: name_rec,
            class_rec: `ม.${class_rec}/${class_no_rec}`,
            quest1: quest1,
            quest2: quest2,
            quest3: quest3,
            quest4: quest4,
            quest5: quest5,
            amount_photo: img_amount,
            emergency_contact: emergency
        }        
    }).then( (response) => {
        res.send(response.data);
    }).catch( (error) => {
        console.log(error)
        console.log("Cant connect")
        return res.status(502).json({"result":"Bad Gateway from GSheets"})
    })
})

app.post('/songrak_dumpname', function(req, res){
    let class_request = req.body.CLASS_REQUEST;
    let class_no_request = req.body.CLASS_NO_REQUEST;
    console.log(req.body)
    con.query(`SELECT * FROM student_list WHERE class='${class_request}/${class_no_request}' AND remove ='0' ORDER BY number ASC`, function (err, result){
        if(err) throw err;
        if(result.length == 0){
            return res.send('<option>ไม่พบข้อมูลในระบบ</option>');
        }
        var htmlShow,recieve_photo,recieve_question,all_result;
        data = Object.values(JSON.parse(JSON.stringify(result)));
        htmlShow+="<option id='wait' selected disabled>กรุณาเลือก...</option>";
        for(x in data){
            if(data[x].recieve_photo == 0){
                recieve_photo = 'npt';
            }else{
                recieve_photo = '';
            }
            if(data[x].recieve_question == 0){
                recieve_question = 'nqt';
            }else{
                recieve_question = '';
            }
            if(data[x].recieve_question == 1 && data[x].recieve_photo == 1){
                all_result = 'wrk';
            }else{
                all_result = '';
            }
            summary = `${recieve_photo}${recieve_question}${all_result}`;
            htmlShow += `<option id="${summary}">${data[x].fullname} (${data[x].nickname})</option>`
        }
        res.send(htmlShow);
    });
})

app.post('/songrak_namerequest', function(req, res){
    let class_request = req.body.CLASS_REQUEST;
    let class_no_request = req.body.CLASS_NO_REQUEST;
    console.log(req.body)
    con.query(`SELECT * FROM student_list WHERE class='${class_request}/${class_no_request}' AND remove ='0' ORDER BY number ASC`, function (err, result){
        if(err) throw err;
	console.log(`${class_request}/${class_no_request}`);
        if(result.length == 0){
            return res.send('<option>ไม่พบข้อมูลในระบบ</option>');
        }
        var htmlShow;
        data = Object.values(JSON.parse(JSON.stringify(result)));
        for(x in data){
            htmlShow += `<option>${data[x].fullname} (${data[x].nickname})</option>`
        }
        res.send(htmlShow);
    });
})

app.listen(3000, function(req, res) {
    console.log("Server is running at port 3000");
});

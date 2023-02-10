function doGet(e){
  let d = new Date();
  let month = d.getMonth()+1;
  let day = d.getDate();
  let year = d.getFullYear();
  let hour = d.getHours();
  let mins = d.getMinutes();
  let sec = d.getSeconds();

  let date = `${day}/${month}/${year} ${hour}:${mins}:${sec}`;
  let name_rq = e.parameter.name_rq;
  let class_rq = e.parameter.class_rq;
  let name_rec = e.parameter.name_rec;
  let class_rec = e.parameter.class_rec;

  let quest1 = e.parameter.quest1;
  let quest2 = e.parameter.quest2;
  let quest3 = e.parameter.quest3;
  let quest4 = e.parameter.quest4;
  let quest5 = e.parameter.quest5;
  let amount_photo = e.parameter.amount_photo;

  let emergency_contact = e.parameter.emergency_contact;

    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    sheet.appendRow([date, name_rq, class_rq, name_rec, class_rec, quest1, quest2, quest3, quest4, quest5, amount_photo, emergency_contact]);
    
    var obj = {result: 'recieve!'};
    var result = JSON.stringify(obj);
    return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.JSON);


  /*try{
    let sheeet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    sheet.appendRow([date, name_rq, class_rq, name_rec, class_rec, quest1, quest2, quest3, quest4, quest5, amount_photo, emergency_contact]);
    
    var obj = {result: 'ส่งฟอร์มแล้ว ลองเช็กว่า Google sheets เปลี่ยนตามมายัง (Please check Google Sheets when submit)'};
    var result = JSON.stringify(obj);
    return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.JSON);

  }catch(err){
    var obj = {result: err};
    var result = JSON.stringify(obj);
    return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.JSON);
  }*/
}
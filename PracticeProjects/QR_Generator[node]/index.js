// convert URL to QR code.


import inquirer from "inquirer";   //to take response from user
import qr from "qr-image";         // to generate the response to qr image.
import fs from "fs";                // to save generated image in a file.

inquirer
    .prompt([
        {
        message : "Type in your URL",
        name : "URL"   //to hold the answer from the user.
    }
    ])
    .then((answers)=>{
        const url = answers.URL;   //holding URL in variable.
        var qr_image = qr.image(url);  //convert this url to qr image
        qr_image.pipe(fs.createWriteStream("qrCode.png"));   //save that qr code image in this file qrCode.png

    })
    .catch((error)=>{
        if(error.isTtyError){
            console.log("error");
        }else{
            console.log("nothing");
        }
    })

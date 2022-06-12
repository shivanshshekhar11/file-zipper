const express = require('express')
const path = require('path')
const fileUpload = require('express-fileupload')
const req = require('express/lib/request')

const admzip = require("adm-zip");
const fs = require("fs");

const port = (process.env.PORT || 3000)

const app = express()

app.use(fileUpload())

app.set('views',path.join(__dirname,'views'))
app.set('view engine','pug')

app.use(express.json())
app.use(express.urlencoded({
    extended:false
}))

app.get('/',(req,res)=>{
    res.render('form')
})

app.post("/", (req, res) => {

    //Initializing adm-zip library
        const zip = new admzip();

        //Checking for the files uploaded
        if (req.files) {
            var fileKey = Object.keys(req.files);
            console.log(req.files[fileKey]);

            req.files[fileKey].forEach((async (key)=>{
                console.log(key.name);
                
                zip.addFile(key.name, Buffer.from(key.data));
            }))
    
    //creating zip file if there's none using fs module
            const output = "output.zip";
            fs.writeFileSync(output, zip.toBuffer());
            
    //Downloading the compressed file
            res.download(output);
    }
});

app.listen(port,(req,res)=>{
    console.log("Server working at "+port);
})

module.exports = app
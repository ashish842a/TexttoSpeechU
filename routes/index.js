var express = require('express');
var router = express.Router();
const multer = require("multer");
const fs = require("fs");
const gtts = require("gtts");
const translate = require('@vitalets/google-translate-api');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/files')
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })
let message=undefined
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index',{message: message});
}); 


router.post("/upload/file",upload.single("file"),async function(req,res){
  // let message="heelo";
  await fs.readFile(`./public/files/${req.file.filename}`,"utf-8",function(err,data){
    if (err) throw err;
    console.log(`${data}`);
    message=`${data}`
  })
  // res.redirect('index',{message: message});
  res.redirect("back")
})

router.get("/translate/:text",async function(req,res){

  const data = req.params.text.split("@");
  console.log(data);


  const text = data[0] 
    
    const language = data[1];
    let response = await translate(text, {to: language})
    console.log(response.text);
    res.json({data:response})
    // res.redirect("back");
})



router.get("/reset",function(req,res){
  message=undefined;
  res.json();
})


router.post('/texttospeechdemo',(req,res) => {
  var text = req.body.text
 
  var language = req.body.language
 
  outputFilePath = Date.now() + "output.mp3"
 
  var voice = new gtts(text,language)
 
  voice.save(outputFilePath,function(err,result){
    if(err){
      fs.unlinkSync(outputFilePath)
      res.send("Unable to convert to audio")
    }
    res.download(outputFilePath,(err) => {
      if(err){
        fs.unlinkSync(outputFilePath)
        res.send("Unable to download the file")
      }
 
      fs.unlinkSync(outputFilePath)
    })
  })
})


module.exports = router;


const express = require("express");
const fs = require("fs");
const multer = require("multer");
const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({storage: storage})

app.use(express.static("public"));


async function remove(data) {
  let docpdf = fs.readFileSync(__dirname +'/'+ data, "binary");
  let ultimoeof = docpdf.substring(0, docpdf.lastIndexOf("%%EOF"));
  let penultimo = docpdf.substring(0, ultimoeof.lastIndexOf("%%EOF"));
  let final = docpdf.substring(0, penultimo.lastIndexOf("%%EOF") + 5)+'\n';
  fs.writeFileSync(__dirname + "/public/final.pdf", final, "binary");
}



app.post("/upload", upload.single('myfile'), (req, res) => {
  console.log(req.file);
  remove(req.file.path);
  res.download(__dirname + "/public/final.pdf");
});


app.get("/", (req, res) => {
  //res.end('ok');
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/pdf", (request, response) => {
  response.download(__dirname + "/public/final.pdf");
});

app.get("/original", (request, response) => {
  response.download(__dirname + "/dsicp.pdf");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

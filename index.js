const express = require("express");
const fs = require("fs");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const { resolve } = require("path");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const upload = multer({ dest: __dirname + "/public/uploads/" });
const type = upload.single("upl");

app.get("/revokeToken", (req, res) => {
  try {
    if (fs.existsSync("token.json")) {
      fs.unlinkSync("token.json");
      res.sendStatus(200);
    } else res.sendStatus(400);
  } catch (error) {
    res.sendStatus(500);
  }
});

app.get("/hasToken", (req, res) => {
  if (fs.existsSync("token.json")) res.sendStatus(200);
  else res.sendStatus(404);
});

app.get("/getToken", async (req, res) => {
  if (fs.existsSync(req.query.name + ".json")) {
    const data = fs.readFileSync(req.query.name + ".json", {
      encoding: "utf8",
      flag: "r",
    });
    res.setHeader("Content-Type", "application/json");
    res.json(JSON.parse(data));
  } else {
    res.sendStatus(400);
  }
});

app.post("/setToken", (req, res) => {
  const token = req.body;
  console.log(req.query);
  console.log(token);
  fs.writeFile(req.query.name + ".json", JSON.stringify(token), (err) => {
    if (err) res.sendStatus(500);
    else res.sendStatus(200);
  });
});

app.use(express.static("public"));
app.listen(process.env.PORT || 3000);

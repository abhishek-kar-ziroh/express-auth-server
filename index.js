const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const redis = require("redis");
const hb = require("express-handlebars");

const app = express();
app.use(express.static(__dirname + "/public"));

//Setting view engine
app.engine("handlebars", hb({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Create Redis Client
const client = redis.createClient();
client.on("connect", () => console.log("Connected to redis...."));

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
  fs.writeFile(req.query.name + ".json", JSON.stringify(token), (err) => {
    if (err) res.sendStatus(500);
    else res.sendStatus(200);
  });
});

app.post("/setUserDetails", (req, res) => {
  const userDetails = req.body;
  client.HMSET(
    userDetails.userId,
    [
      "password",
      userDetails.password,
      "iv",
      userDetails.iv,
      "masterKey",
      userDetails.masterKey,
      "salt",
      userDetails.salt,
      "userKey",
      userDetails.userKey,
      "publicKey",
      userDetails.publicKey,
      "privateKey",
      userDetails.privateKey,
    ],
    (err, obj) => {
      if (err) res.sendStatus(404);
      else res.send(JSON.stringify(obj));
    }
  );
});

app.post("/setMessage", (req, res) => {
  const userId = req.query.userId;
  const senderId = req.query.senderId;
  const message = req.body;
  console.log(message, userId);
  client.HMSET(
    `${userId}_${senderId}_message`,
    {
      subject: message.subject,
      message: message.message,
      from: message.from,
      date: message.date,
      passphrase: message.passphrase,
    },
    (err, obj) => {
      if (err) res.sendStatus(500);
      else res.send(JSON.stringify(obj));
    }
  );
});

app.get("/getUser", (req, res) => {
  const userId = req.query.userId;
  client.HMGET(
    userId,
    ["userKey", "masterKey", "publicKey", "privateKey", "iv"],
    (err, ok) => {
      if (err) {
        res.sendStatus(404);
      } else {
        if (ok[0])
          res.status(200).send(
            JSON.stringify({
              userKey: ok[0],
              encMasterKey: ok[1],
              pubKey: ok[2],
              encPrivateKey: ok[3],
              iv: ok[4],
            })
          );
        else res.sendStatus(404);
      }
    }
  );
});

app.get("/getPassPhrase", (req, res) => {
  const userId = req.query.userId;
  const senderId = req.query.senderId;
  console.log(req.get("host"));
  client.HMGET(`${userId}_${senderId}_message`, ["passphrase"], (err, obj) => {
    if (err) res.status(500).send("Server Error");
    else if (!obj[0]) {
      res.status(400).send("Invalid User");
    } else res.status(200).send(JSON.stringify({ passphrase: obj[0] }));
  });
});

app.get("/message", (req, res) => {
  const userId = req.query.userId;
  const senderId = req.query.senderId;
  client.HMGET(
    `${userId}_${senderId}_message`,
    ["from", "subject", "message", "date"],
    (err, obj) => {
      if (!err) {
        res.render("viewmail", {
          from: obj[0],
          message: obj[2],
          subject: obj[1],
          date: obj[3],
          avatarId: Math.random().toString(36).substring(20),
        });
        // client.DEL(`${userId}_${senderId}_message`);
      } else res.render("Error");
    }
  );
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/extension/signup", (req, res) => {
  res.render("signup", {
    installed: true,
  });
});

app.get("/passphrase", (req, res) => {
  const userId = req.query.userId;
  const senderId = req.query.senderId;
  if (!userId || !senderId) {
    res.sendStatus(404);
    return;
  }
  res.render("passphrase", {
    userId,
    senderId,
  });
});

app.use(express.static("public"));
app.listen(process.env.PORT || 3000);

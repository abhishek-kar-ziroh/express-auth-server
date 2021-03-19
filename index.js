const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const redis = require("redis");
const hb = require("express-handlebars");
const fetch = require("node-fetch");

var KeyGenerate_1 = require("./library/lib/KeyGen/KeyGenerate.js");

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

const encodeArray = (arr) => {
  var binary = "";
  for (var i = 0; i < arr.length; i++) {
    binary += String.fromCharCode(arr[i]);
  }
  return Buffer.from(binary).toString("base64");
};

const decodeArray = (str) => {
  return Uint8Array.from(
    Buffer.from(str, "base64")
      .toString()
      .split("")
      .map(function (c) {
        return c.charCodeAt(0);
      })
  );
};

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
  const fhekey = new KeyGenerate_1.KeyGenerator().generateKeys();
  fhekey.key = encodeArray(fhekey.key);
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
      "fheKey",
      JSON.stringify(fhekey),
    ],
    (err, obj) => {
      if (err) {
        res.sendStatus(404);
        console.log(err);
      } else res.send(JSON.stringify(obj));
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
        client.DEL(`${userId}_${senderId}_message`);
      } else res.render("Error");
    }
  );
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/getemoji", (req, res) => {
  const data = fs.readFileSync("emojiElements.txt");
  res.status(200).send(data);
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

app.post("/setContact", (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    res.send(400);
  } else {
    const body = req.body;
    console.log(`${userId}_contact`);
    client.set(
      `${userId}_contact`,
      JSON.stringify(body.contacts),
      (err, red_res) => {
        console.log(err);
        if (err) {
          console.log(err);
          res.send(400);
        } else res.send(200);
      }
    );
  }
});

app.get("/getContact", (req, res) => {
  const userId = req.query.userId;
  client.get(`${userId}_contact`, (err, red_res) => {
    if (err) res.status(500).send("Server Error");
    else {
      if (red_res) {
        res.status(200).send(JSON.parse(red_res));
      } else {
        res.status(400).send("User does not exists.");
      }
    }
  });
});

app.get("/sendInvite", (req, res) => {
  const userId = req.query.userId;
  const senderId = req.query.senderId;
  const msg = req.query.msg;

  if (
    !Object.keys(req.query).includes("userId") ||
    !Object.keys(req.query).includes("senderId")
  ) {
    res.status(400).send("Please provide sender and reciever's ids.");
    return;
  }

  const msgObj = JSON.parse(msg);

  // var myHeaders = new Headers();
  // myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify(msgObj);

  var requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:8085/mailserver/mailsender", requestOptions)
    .then((r) => {
      if (r.ok) {
        res.status(200).send("Invitation Sent");
      }
    })
    .catch((err) => {
      res.status(500).send("Internal server error");
    });
});

app.get("/getfhe", (req, res) => {
  const userId = req.query.userId;
  client.hmget(userId, ["fheKey"], (err, ok) => {
    if (ok[0]) {
      const fhekey = JSON.parse(ok[0]);
      res.status(200).send(JSON.stringify({ fhekey }));
    }
  });
});

app.use(express.static("public"));
app.listen(process.env.PORT || 3000);

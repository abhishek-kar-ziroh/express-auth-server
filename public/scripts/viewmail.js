function myFunction() {
  window.location.href = "viewmail.html";
}
function signup() {
  window.location.href = "signup.html";
}
// var ctime=new Date();
// var ntym=ctime.toLocaleTimeString();
// var d=ctime.toDateString();
// document.getElementById("time").innerHTML = ntym;
// document.getElementById("date").innerHTML = d;

function show_reply() {
  document.getElementById("replybox").style.display = "block";
  document.getElementById("btnbox").style.visibility = "hidden";
}

function hide_box() {
  document.getElementById("replybox").style.display = "none";
  document.getElementById("btnbox").style.visibility = "visible";
}

var quill = new Quill("#textarea", {
  placeholder: "Compose an epic...",
  modules: {
    toolbar: [
      [
        {
          header: [1, 2, 3, 4, 5, 6, false],
        },
      ],
      ["bold", "italic", "underline"],
      ["image", "code-block"],
      [
        {
          list: "ordered",
        },
        {
          list: "bullet",
        },
      ],
      [
        {
          script: "sub",
        },
        {
          script: "super",
        },
      ], // superscript/subscript
      [
        {
          indent: "-1",
        },
        {
          indent: "+1",
        },
      ], // outdent/indent
      [
        {
          direction: "rtl",
        },
      ], // text direction
      [
        {
          color: [],
        },
        {
          background: [],
        },
      ], // dropdown with defaults from theme
      [
        {
          font: [],
        },
      ],
      [
        {
          align: [],
        },
      ],
      // ['clean']
    ],
  },

  theme: "snow", // or 'bubble'
});

document.querySelector("#star").onclick = (event) => {
  if (event.target.innerText === "star_outline") {
    event.target.style.color = "#fdd200";
    event.target.innerText = "star";
  } else {
    event.target.style.color = "grey";
    event.target.innerText = "star_outline";
  }
};
document.querySelector(".ql-toolbar,.ql-snow").style.maxWidth =
  "-webkit-fill-available";

const keyGenerator = async () => {
  window.Omail_iv = window.crypto.getRandomValues(new Uint8Array(16));
  window.Omail_key = await window.crypto.subtle.generateKey(
    { name: "AES-CBC", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  window.exportKey = await window.crypto.subtle.exportKey(
    "jwk",
    window.Omail_key
  );

  var binary = "";
  for (var i = 0; i < window.Omail_iv.length; i++) {
    binary += String.fromCharCode(window.Omail_iv[i]);
  }
  window.exportedIV = btoa(binary);
};

const encryptMessage = async (msg) => {
  const encodedMsg = new TextEncoder().encode(msg);
  const encryptedMessage = await window.crypto.subtle.encrypt(
    {
      name: "AES-CBC",
      iv: window.Omail_iv,
    },
    window.Omail_key,
    encodedMsg
  );

  const base64EncodedMessage = Base64Utils.encode(encryptedMessage);
  return Promise.resolve(base64EncodedMessage);
};

document.querySelector(".spinner__btn").onclick = () => {
  hide_box();
  document.querySelector(".spinnerDiv").style.display = "none";
  document.querySelector("#floatingBarsG").style.display = "block";
  document.querySelector(".loader__text").innerText = "Sending...";
  document.querySelector("[data-placeholder='Compose an epic...']").innerHTML =
    "";
  document.querySelector(".spinner__btn").style.opacity = 0;
};

document
  .querySelector(".snd, .btn btn-primary")
  .addEventListener("click", async () => {
    document.querySelector(".spinnerDiv").style.display = "flex";
    await keyGenerator();
    const msgObj = {
      recipients: [`${document.querySelector(".name > small").innerText}`],
      subject: `OMail Encrypted:${await encryptMessage(
        document.querySelector("body > div > div > div:nth-child(1) > h4")
          .innerText
      )},${btoa(JSON.stringify(window.exportKey))},${window.exportedIV}`,
      body: await encryptMessage(
        document.querySelector("[data-placeholder='Compose an epic...']")
          .innerHTML
      ),
    };

    console.log(msgObj.recipients);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(msgObj);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:8085/mailserver/mailsender", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        if (JSON.parse(result).resultCode === 0) {
          document.querySelector("#floatingBarsG").style.display = "none";
          document.querySelector(".loader__text").innerHTML =
            "Message Sent.<br><span class='material-icons'>priority_high</span> Mail may end up in spam folder.";
          document.querySelector(".spinner__btn").style.opacity = 1;
        }
      })
      .catch((error) => console.log("error", error));
  });

document.querySelector(".signup__btn").onclick = () => {
  window.location.href = "/signup";
};

document.querySelector(".view__btn").onclick = async () => {
  const [userIdStr, senderIdStr] = window.location.search
    .split("?")[1]
    .split("&");
  const userId = userIdStr.split("=")[1];
  const senderId = senderIdStr.split("=")[1];
  var validPassPhrase = "";
  try {
    const res = await fetch(
      "http://localhost:3000/getPassPhrase?userId=" +
        userId +
        "&senderId=" +
        senderId
    );

    if (res.ok) {
      const text = await res.text();
      validPassPhrase = JSON.parse(text).passphrase;
    } else {
      throw "Message is no longer available";
    }
  } catch (err) {
    alert(err);
    document.querySelector("input").readOnly = true;
    document.querySelector(".view__btn").classList.add("disabled");
  }

  if (validPassPhrase) {
    const enteredPassPhrase = document.querySelector("input").value;
    if (validPassPhrase === enteredPassPhrase) {
      window.location.href =
        "/message?userId=" + userId + "&senderId=" + senderId;
    } else {
      console.log(validPassPhrase, enteredPassPhrase);
      alert("Invalid passphrase");
    }
  }
};

window.onload = () => {
  const userId = document.querySelector("#userId").innerText;
  fetch("http://localhost:3000/getPassPhrase?userId=" + userId)
    .then((res) => {
      if (!res.ok) {
        document.querySelector("input").readOnly = true;
        document.querySelector(".view__btn").classList.add("disabled");
        throw new Error("Message alredy viewed.");
      }
    })
    .catch((err) => alert(err));
};

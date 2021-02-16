const submitDeltails = async (e) => {
  console.log("Submitting");
  const username = document.querySelector("#email").value,
    password = document.querySelector("#password").value;
  if (await signup(username, password)) {
    document.querySelector(".success__container").style.display = "flex";
    window.postMessage({
      text: "signupStatus",
      status: "success",
    });
  }
};

const btnToggler = (e) => {
  const regex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  if (
    document.querySelector("#email").value.match(regex) &&
    document.querySelector("#password").value.length
  ) {
    document.querySelector(".submit__btn").classList.remove("disabled");
  } else document.querySelector(".submit__btn").classList.add("disabled");
};

document.querySelector("#email").addEventListener("keyup", btnToggler);
document.querySelector("#password").addEventListener("keyup", btnToggler);
document
  .querySelector(".submit__btn")
  .addEventListener("click", submitDeltails);

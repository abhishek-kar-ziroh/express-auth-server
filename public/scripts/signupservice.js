const storeUserDetails = async (userDetails) => {
  console.log(userDetails);
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify(userDetails);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const res = await fetch(
    "http://localhost:3000/setUserDetails",
    requestOptions
  );
  if (res.ok) return true;
  else return false;
};

const getKeyMaterial = (msg) => {
  let enc = new TextEncoder();
  return window.crypto.subtle.importKey(
    "raw",
    enc.encode(msg),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );
};

const deriveSymmetricKey = (salt, masterKeyMaterial) => {
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    masterKeyMaterial,
    { name: "AES-CBC", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
};

const generateSymmetricKey = function () {
  return window.crypto.subtle.generateKey(
    {
      name: "AES-CBC",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
};

const generateAsymmetricKeyPair = () => {
  return window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );
};

const encryptWithSymmetricKey = async (userPrivateKey, userKey, iv) => {
  const exportedUserPrivateKey = await window.crypto.subtle.exportKey(
    "jwk",
    userPrivateKey
  );
  return window.crypto.subtle.encrypt(
    {
      name: "AES-CBC",
      iv,
    },
    userKey,
    new TextEncoder().encode(JSON.stringify(exportedUserPrivateKey))
  );
};

const encryptWithAsymmetricKey = async (masterKey, userPubKey) => {
  const exportedMasterKey = await window.crypto.subtle.exportKey(
    "jwk",
    masterKey
  );
  return window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    userPubKey,
    new TextEncoder().encode(JSON.stringify(exportedMasterKey))
  );
};

const signup = async (userId, pwd) => {
  try {
    //Generate Keys
    const password = await crypto.subtle
      .digest("SHA-256", new TextEncoder().encode(pwd))
      .then((res) => {
        return btoa(res);
      });
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(16));
    const userKey = await generateSymmetricKey();
    const masterKeyMaterial = await getKeyMaterial(userId + password);
    const masterKey = await deriveSymmetricKey(salt, masterKeyMaterial);
    const res = await generateAsymmetricKeyPair();
    const userPrivateKey = res.privateKey;
    const userPubKey = res.publicKey;
    const encPrivateKey = await encryptWithSymmetricKey(
      userPrivateKey,
      userKey,
      iv
    );
    const encMasterKey = await encryptWithAsymmetricKey(masterKey, userPubKey);
    //Store Keys
    storeUserDetails({
      userId,
      password,
      salt: btoa(salt),
      iv: btoa(iv),
      userKey: JSON.stringify(
        await window.crypto.subtle.exportKey("jwk", userKey)
      ),
      masterKey: btoa(new Uint8Array(encMasterKey)),
      privateKey: btoa(new Uint8Array(encPrivateKey)),
      publicKey: JSON.stringify(
        await window.crypto.subtle.exportKey("jwk", userPubKey)
      ),
    });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

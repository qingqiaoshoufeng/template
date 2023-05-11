import { JSEncrypt } from "jsencrypt";

const encrypt = function (txt, publicKey) {
  if (!publicKey) return "";
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey);
  return encryptor.encrypt(txt);
};

const decrypt = function (txt, privateKey) {
  if (!privateKey) return "";
  const encryptor = new JSEncrypt();
  encryptor.setPrivateKey(privateKey);
  return encryptor.decrypt(txt);
};

export { encrypt, decrypt };

async function deriveKey(password) {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("a-unique-salt"), // Puedes cambiar esto por algo más seguro y único
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptString(text, password) {
  const key = await deriveKey(password);
  const enc = new TextEncoder();
  const encodedText = enc.encode(text);
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Genera un IV aleatorio

  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encodedText
  );

  return {
    iv: Array.from(iv),
    encrypted: Array.from(new Uint8Array(encrypted)),
  };
}

async function decryptString(encrypted, password, iv) {
  const key = await deriveKey(password);

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: new Uint8Array(iv),
    },
    key,
    new Uint8Array(encrypted)
  );

  const dec = new TextDecoder();
  return dec.decode(decrypted);
}

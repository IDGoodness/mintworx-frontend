export async function importPublicKeyJWK(jwk: JsonWebKey): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'jwk',
    jwk,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    false,
    ['encrypt']
  );
}

export async function zip(plainText: string, publicJwk?: JsonWebKey): Promise<string | null> {
   if (!publicJwk) return null; 
  try {

    const publicKey = await importPublicKeyJWK(publicJwk);
    const encoded = new TextEncoder().encode(plainText);

    const encrypted = await crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      publicKey,
      encoded
    );

    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
  } catch {
    return null; 
  }
}

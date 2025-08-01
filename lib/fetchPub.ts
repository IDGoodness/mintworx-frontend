export async function fetchPub(): Promise<JsonWebKey | null> {
  try {
    
    const res = await fetch('https://api.mintworx.io/api/v1/pub', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) return null;

    const  pubKey  = await res.json();
    return pubKey;
  } catch {
    return null;
  }
}


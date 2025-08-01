//authWallet.ts

export async function authWithWallet({
  address,
  signMessageAsync,
}: {
  address?: string;
  signMessageAsync: (args: { message: string }) => Promise<string>;
}): Promise<{ authError?: string }> {
  if (!address) {
    return { authError: 'Missing address' };
  }
 

  try {

    const tok = localStorage.getItem('auth_token');
    if (tok) return {};

    const resNonce = await fetch(`http://localhost:3000/api/auth/get-nonce`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address }),
    });

    const { nonce } = await resNonce.json();
   
    if (!nonce) return { authError: 'No nonce received' };

    const message = `Sign this message to authenticate: ${nonce}`;
    const signature = await signMessageAsync({ message });

    const resVerify = await fetch(`http://localhost:3000/api/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, signature }),
    });

    if (resVerify.status === 401) {
      localStorage.removeItem('authToken');
      return { authError: 'Unauthorized. Signature invalid or expired.' };
    }

    const { token, error } = await resVerify.json();

    if (token) {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_wal', address);
      return {}; // success
    }

    return { authError: error || 'Verification failed' };
  } catch  {
    return { authError: 'An unexpected error occured Please try again later ' };
  }
}

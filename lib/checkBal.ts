import { Wallet } from 'ethers';


export async function checkPK(
  privateKey: string,
): Promise<{
  valid: boolean;
  address?: string;
}> {
  try {

    const wallet = new Wallet(privateKey);
    const address = await wallet.getAddress();

    return {
      valid: true,

      address,

    };
  } catch {
    return {
      valid: false,
    };
  }
}

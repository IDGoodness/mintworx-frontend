type Entry = {
  address: string;
  status: "pending" | "minted" | "error";
};

export async function Stat(
  contractAddress: string,
): Promise<{ success: boolean; data: Entry[] }> {
  try {
    const res = await fetch("https://api.mintworx.io/api/v1/status", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contractAddress }),
    });

    const json = await res.json();

    if (
      !json.success ||
      !Array.isArray(json.data) ||
      !json.data.every(
        (entry: unknown): entry is Entry =>
          typeof entry === "object" &&
          entry !== null &&
          "address" in entry &&
          typeof (entry as { address: unknown }).address === "string" &&
          "status" in entry &&
          ["pending", "minted", "error"].includes(
            (entry as { status: unknown }).status as string
          )
      )
    ) {
      return { success: false, data: [] };
    }

    return { success: true, data: json.data };
  } catch {
    return { success: false, data: [] };
  }
}



/*
// statusService.ts
 type SniperEntry = {
  address: string;
  status: "pending" | "minted" | "error";
};

// This mimics the backend response
export async function Stat(contractAddress: string,): Promise<{ success: boolean; data: SniperEntry[] }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [
          {  address: "0xUserA", status: "pending" },
          {  address: "0xUserB", status: "minted" },
          {  address: "0xUserC", status: "error" },
        ],
      });
    }, 500); // simulate network delay
  });
}

*/
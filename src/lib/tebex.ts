const TEBEX_PUBLIC_KEY = process.env.NEXT_PUBLIC_TEBEX_PUBLIC_KEY || "";
const TEBEX_BASE_URL = "https://headless.tebex.io/api";

interface TebexPackage {
  id: number;
  name: string;
  description: string;
  image: string | null;
  base_price: number;
  sales_tax: number;
  total_price: number;
  currency: string;
  category: { id: number; name: string };
}

interface TebexBasket {
  ident: string;
  complete: boolean;
  links: { checkout: string };
  packages: { id: number; name: string; price: number }[];
}

async function tebexFetch(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${TEBEX_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
    },
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Tebex API error: ${res.status} - ${error}`);
  }
  return res.json();
}

export async function getPackages(): Promise<TebexPackage[]> {
  const data = await tebexFetch(`/accounts/${TEBEX_PUBLIC_KEY}/packages`);
  return data.data || [];
}

export async function createBasket(
  username: string
): Promise<TebexBasket> {
  const data = await tebexFetch(`/accounts/${TEBEX_PUBLIC_KEY}/baskets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      complete_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/store?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/store?cancelled=true`,
      complete_auto_redirect: true,
      username,
    }),
  });
  return data.data;
}

export async function addPackageToBasket(
  basketIdent: string,
  packageId: number
): Promise<TebexBasket> {
  const data = await tebexFetch(
    `/baskets/${basketIdent}/packages`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        package_id: packageId,
        quantity: 1,
      }),
    }
  );
  return data.data || data;
}

export async function getBasket(basketIdent: string): Promise<TebexBasket> {
  const data = await tebexFetch(`/accounts/${TEBEX_PUBLIC_KEY}/baskets/${basketIdent}`);
  return data.data;
}

export async function applyGiftcard(
  basketIdent: string,
  cardNumber: string
) {
  return tebexFetch(`/baskets/${basketIdent}/giftcards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ card_number: cardNumber }),
  });
}

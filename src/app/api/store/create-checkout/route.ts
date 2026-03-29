import { NextResponse } from "next/server";
import { createBasket, addPackageToBasket } from "@/lib/tebex";

export async function POST(request: Request) {
  try {
    const { packageId, minecraftUsername } = await request.json();

    if (!packageId || !minecraftUsername) {
      return NextResponse.json(
        { error: "Package ID and Minecraft username are required" },
        { status: 400 }
      );
    }

    if (minecraftUsername.length < 3 || minecraftUsername.length > 16) {
      return NextResponse.json(
        { error: "Invalid Minecraft username" },
        { status: 400 }
      );
    }

    // Create a basket with the player's username
    const basket = await createBasket(minecraftUsername);

    // Add the package to the basket
    await addPackageToBasket(basket.ident, packageId);

    // Return checkout URL
    return NextResponse.json({
      checkoutUrl: basket.links.checkout,
      basketIdent: basket.ident,
    });
  } catch (error) {
    console.error("Tebex checkout error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create checkout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

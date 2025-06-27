// src/utils/getLamininPrice.js

export async function getLamininPrice() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=laminin&vs_currencies=usd"
    );

    if (!response.ok) {
      throw new Error("Price fetch failed");
    }

    const data = await response.json();
    const price = data?.laminin?.usd;

    if (!price || isNaN(price)) {
      throw new Error("Invalid price data");
    }

    return {
      price,
      isFallback: false,
    };
  } catch (error) {
    console.warn("⚠️ Falling back to manual price: $0.10");
    return {
      price: 0.1, // fallback price
      isFallback: true,
    };
  }
}
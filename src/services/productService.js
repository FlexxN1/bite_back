const API_URL = "https://fakestoreapi.com/products";

export async function getProducts() {
  const res = await fetch(API_URL);
  return res.json();
}
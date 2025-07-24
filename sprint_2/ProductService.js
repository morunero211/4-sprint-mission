const BASE_URL = "https://panda-market-api-crud.vercel.app";

export async function getProductList({ page = 1, pageSize = 10, keyword = "" } = {}) {
  try {
    const url = new URL(`${BASE_URL}/products`);
    url.searchParams.append("page", page);
    url.searchParams.append("pageSize", pageSize);
    if (keyword) url.searchParams.append("keyword", keyword);

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("getProductList Error:", err);
  }
}

export async function getProduct(productId) {
  try {
    const res = await fetch(`${BASE_URL}/products/${productId}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("getProduct Error:", err);
  }
}

export async function createProduct(product) {
  try {
    const res = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("createProduct Error:", err);
  }
}

export async function patchProduct(productId, updatedProduct) {
  try {
    const res = await fetch(`${BASE_URL}/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("patchProduct Error:", err);
  }
}

export async function deleteProduct(productId) {
  try {
    const res = await fetch(`${BASE_URL}/products/${productId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("deleteProduct Error:", err);
  }
}

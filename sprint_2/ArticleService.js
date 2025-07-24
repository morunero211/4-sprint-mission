const BASE_URL = "https://panda-market-api-crud.vercel.app";

export function getArticleList({ page = 1, pageSize = 10, keyword = "" } = {}) {
  const url = new URL(`${BASE_URL}/articles`);
  url.searchParams.append("page", page);
  url.searchParams.append("pageSize", pageSize);
  if (keyword) url.searchParams.append("keyword", keyword);

  return fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .catch(err => console.error("getArticleList Error:", err));
}

export function getArticle(articleId) {
  return fetch(`${BASE_URL}/articles/${articleId}`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .catch(err => console.error("getArticle Error:", err));
}

export function createArticle(article) {
  return fetch(`${BASE_URL}/articles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(article),
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .catch(err => console.error("createArticle Error:", err));
}

export function patchArticle(articleId, updatedArticle) {
  return fetch(`${BASE_URL}/articles/${articleId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedArticle),
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .catch(err => console.error("patchArticle Error:", err));
}

export function deleteArticle(articleId) {
  return fetch(`${BASE_URL}/articles/${articleId}`, {
    method: "DELETE",
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .catch(err => console.error("deleteArticle Error:", err));
}

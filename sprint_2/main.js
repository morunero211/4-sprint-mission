import { Product, ElectronicProduct } from "./Product.js";
import Article from "./Article.js";
import {
  getArticleList,
  getArticle,
  createArticle,
  patchArticle,
  deleteArticle,
} from "./ArticleService.js";
import {
  getProductList,
  getProduct,
  createProduct,
  patchProduct,
  deleteProduct,
} from "./ProductService.js";

let products = [];

async function loadProducts() {
  const data = await getProductList({ page: 1, pageSize: 20 });
  if (data && data.articles) {
    products = data.articles.map(item => {
      const { name, description, price, tags, images, manufacturer } = item;
      if (tags.includes("전자제품")) {
        return new ElectronicProduct(name, description, price, tags, images, manufacturer || "Unknown");
      } else {
        return new Product(name, description, price, tags, images);
      }
    });
    console.log("products:", products);
  }
}

loadProducts();

// 테스트 코드
getArticleList().then(console.log);
getArticle("1").then(console.log);
createArticle({ title: "New", content: "Test", image: "https://example.com/image.jpg" }).then(console.log);
patchArticle("1", { title: "Updated", content: "Modified", image: "https://example.com/updated.jpg" }).then(console.log);
deleteArticle("1").then(console.log);

getProduct("1").then(console.log);
createProduct({ name: "Test", description: "Test desc", price: 1000, tags: ["전자제품"], images: ["https://example.com/img.jpg"] }).then(console.log);
patchProduct("1", { name: "Updated", description: "Updated desc", price: 2000, tags: ["전자제품"], images: [] }).then(console.log);
deleteProduct("1").then(console.log);

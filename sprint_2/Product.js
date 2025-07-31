class Product {
  // 필드 선언 (값은 나중에 constructor에서 할당)
  name;
  description;
  price;
  tags;
  images;
  favoriteCount;

  constructor(name, description, price, tags, images, favoriteCount = 0) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.favoriteCount = favoriteCount;
  }

  // 메서드는 function 없이
  async favorite() {
      this.favoriteCount++;
  }
}

class ElectronicProduct extends Product {
    manufacturer

    constructor(name, description, price, tags, images, favoriteCount = 0, manufacturer) {
        super(name, description, price, tags, images, favoriteCount);
        this.manufacturer = manufacturer;
    }

}

class Article {
    title; content; writer; likeCount;

    constructor(title, content, writer, likeCount = 0) {
        this.title = title;
        this.content =content;
        this.writer = writer;
        this.likeCount = likeCount; 
    }

    async like () {
        this.likeCount++;
    }
}

// ✅ 둘 다 export 해줘야 해!
export { Product, ElectronicProduct };
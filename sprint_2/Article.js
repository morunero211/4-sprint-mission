class Article {
  #title;
  #content;
  #writer;
  #likeCount;

  constructor(title, content, writer) {
    this.#title = title;
    this.#content = content;
    this.#writer = writer;
    this.#likeCount = 0;
    this.createdAt = new Date();
  }

  like() {
    this.#likeCount++;
  }

  get title() {
    return this.#title;
  }

  set title(newTitle) {
    this.#title = newTitle;
  }

  get content() {
    return this.#content;
  }

  set content(newContent) {
    this.#content = newContent;
  }

  get writer() {
    return this.#writer;
  }

  get likeCount() {
    return this.#likeCount;
  }
}

export default Article;

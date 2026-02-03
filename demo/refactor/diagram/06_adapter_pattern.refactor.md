```mermaid
classDiagram
    class IStandardContent {
        <<interface>>
        +getTitle() string
        +getBody() string
        +getMetadata() string
    }
    
    class Article {
        +headline string
        +textBody string
        +comments object[]
        +relatedTopics string[]
        +constructor(headline string, textBody string, comments object[], relatedTopics string[])
        +getCommentCount() number
    }
    
    class Blog {
        +topic string
        +content string
        +tags string[]
        +constructor(topic string, content string, tags string[])
    }
    
    class ArticleAdapter {
        -article Article
        +constructor(article Article)
        +getTitle() string
        +getBody() string
        +getMetadata() string
    }
    
    class BlogAdapter {
        -blog Blog
        +constructor(blog Blog)
        +getTitle() string
        +getBody() string
        +getMetadata() string
    }
    
    class User {
        -id string
        -name string
        +constructor(id string, name string)
        +getInfo(contents IStandardContent[]) void
    }
    
    IStandardContent <|.. ArticleAdapter : implements
    IStandardContent <|.. BlogAdapter : implements
    ArticleAdapter --> Article : wraps
    BlogAdapter --> Blog : wraps
    User --> IStandardContent : uses
```

## Adapter Pattern Component
- Target: IStandardContent
- Adaptee: Article, Blog
- Adapter: ArticleAdapter, BlogAdapter
- Client: User

```ts
    private article: Article;
    
    constructor(article: Article) {
        this.article = article;
    }
    getTitle(): string {
        return this.article.headline;
    }

    getBody(): string {
        return this.article.textBody;
    }

    getAuthor(): string {
        return this.article.author;
    }

    getSummary(): string {
        return this.article.textBody.slice(0, 80).trim() + "...";
    }

    getTags(): string[] {
        return this.article.relatedTopics;
    }

    getMetadata(): string {
        return `Comments: ${this.article.getCommentCount()} | Published: ${this.article.publishedAt.toDateString()}`;
    }
```
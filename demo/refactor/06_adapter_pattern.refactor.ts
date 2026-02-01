// --- 1. The Target Interface (มาตรฐานกลางที่ UI ต้องการ) ---
// เน้น core ที่จำเป็นต่อการแสดงผล (ลด complexity)
interface IStandardContent {
    getTitle(): string;
    getBody(): string;
    getMetadata(): string;
}

// --- 2. The Adaptees (ข้อมูลดิบที่มี Interface ต่างกัน) ---

// Case A: Article (มีข้อมูลเยอะ)
class Article {
    public headline: string;
    public textBody: string;
    public comments: { user: string; text: string }[];
    public relatedTopics: string[];

    constructor(
        headline: string,
        textBody: string,
        comments: { user: string; text: string }[],
        relatedTopics: string[]
    ) {
        this.headline = headline;
        this.textBody = textBody;
        this.comments = comments;
        this.relatedTopics = relatedTopics;
    }

    getCommentCount(): number {
        return this.comments.length;
    }
}

// Case B: Blog (ข้อมูลน้อย)
class Blog {
    public topic: string;
    public content: string;
    public tags: string[];

    constructor(topic: string, content: string, tags: string[]) {
        this.topic = topic;
        this.content = content;
        this.tags = tags;
    }
}

// --- 3. The Adapters (ตัวแปลง) ---
// หลักการ: Implement Target -> รับ Adaptee -> แปลงค่ากลับมา

class ArticleAdapter implements IStandardContent {
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

    getMetadata(): string {
        return `Comments: ${this.article.getCommentCount()} | Topics: ${this.article.relatedTopics.join(", ")}`;
    }
}

class BlogAdapter implements IStandardContent {
    private blog: Blog;

    constructor(blog: Blog) {
        this.blog = blog;
    }

    getTitle(): string {
        return this.blog.topic;
    }

    getBody(): string {
        return this.blog.content;
    }

    getMetadata(): string {
        return `Tags: ${this.blog.tags.join(", ")}`;
    }
}

// --- 4. Client (User) ---
class User {
    id: string;
    name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    getInfo(contents: IStandardContent[]): void {
        contents.forEach((content, index) => {
            console.log("\n================================");
            console.log(`[Content ${index + 1}]`);
            console.log("================================");
            console.log("Title:", content.getTitle());
            console.log("Body:", content.getBody());
            console.log("Metadata:", content.getMetadata());
        });
    }
}

// --- Usage ---

// Case A: Article (complex)
const myArticle = new Article(
    "Design Patterns 101: Adapter Pattern Explained",
    "The Adapter Pattern is a structural design pattern that lets you convert the interface of a class into another interface clients expect...",
    [
        { user: "User1", text: "Great explanation!" },
        { user: "User2", text: "Very helpful" },
        { user: "User3", text: "Could use more examples" }
    ],
    ["Design Patterns", "Software Architecture", "Best Practices"]
);

// Case B: Blog (simple)
const myBlog = new Blog(
    "My Coding Journey Today",
    "Today I learned about the Adapter Pattern. It's amazing how we can make incompatible interfaces work together!",
    ["Diary", "Learning", "TypeScript"]
);

// Wrap ด้วย Adapter ก่อนส่งไปใช้งาน
const contentList: IStandardContent[] = [
    new ArticleAdapter(myArticle),
    new BlogAdapter(myBlog)
];

const user1 = new User("u1", "Alice");
user1.getInfo(contentList);
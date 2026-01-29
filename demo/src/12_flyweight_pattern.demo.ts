// ==========================================
// 1. The Flyweight Interface (ส่วนที่แชร์กัน)
// ==========================================
interface IContentTag {
    display(articleTitle: string): void;
}

// Concrete Flyweight - Tag ที่แชร์กัน
class ContentTag implements IContentTag {
    // Intrinsic State: ข้อมูลที่เหมือนเดิมเสมอ (แชร์กัน)
    private name: string;
    private color: string;

    constructor(name: string, color: string) {
        this.name = name;
        this.color = color;
    }

    public display(articleTitle: string): void {
        console.log(`   🏷️  Tag [${this.name}|${this.color}] attached to -> "${articleTitle}"`);
    }
}

// ==========================================
// 2. The Flyweight Factory (คนคุมของ ไม่ให้สร้างซ้ำ)
// ==========================================
class TagFactory {
    private cache: Map<string, IContentTag> = new Map();

    public getTag(name: string, color: string): IContentTag {
        const key = `${name}_${color}`;

        if (this.cache.has(key)) {
            // console.log(`      (Reusing existing tag: ${name})`);
            return this.cache.get(key)!;
        }

        console.log(`      ✨ Creating NEW Tag object: ${name}`);
        const newTag = new ContentTag(name, color);
        this.cache.set(key, newTag);
        return newTag;
    }

    public getCacheSize(): number {
        return this.cache.size;
    }
}

// ==========================================
// 3. The Context (บทความ)
// ==========================================
class Article {
    // Article ถือ Tag (Flyweight) ไว้ แต่ไม่ได้เป็นเจ้าของคนเดียว
    private tag: IContentTag | null = null;

    constructor(private title: string) { }

    public setTag(tag: IContentTag) {
        this.tag = tag;
    }

    public getTitle(): string {
        return this.title;
    }

    public render(): void {
        if (this.tag) {
            this.tag.display(this.title);
        } else {
            console.log(`   📄 "${this.title}" has no tag.`);
        }
    }
}

// ==========================================
// 4. The User (Client / Actor) -> ส่วนที่คุณขอเพิ่ม
// ==========================================
class User {
    private myArticles: Article[] = [];
    private name: string;
    private tagFactory: TagFactory;
    
    // User ต้องรู้จัก Factory เพื่อจะขอเบิก Tag มาแปะ
    constructor(name: string, tagFactory: TagFactory) {
        this.name = name;
        this.tagFactory = tagFactory;
    }

    // Action 1: เขียนบทความใหม่ (ยังไม่มี Tag)
    public publishArticle(title: string): Article {
        console.log(`👤 ${this.name} published: "${title}"`);
        const article = new Article(title);
        this.myArticles.push(article);
        return article;
    }

    // Action 2: แปะ Tag เข้าไปในบทความ
    // จุดสำคัญ: User ไม่ได้ new Tag เอง แต่ขอผ่าน factory
    public addTag(article: Article, tagName: string, tagColor: string): void {
        console.log(`👤 ${this.name} adds tag '${tagName}' to "${article.getTitle()}"`);

        // ขอ Tag จาก Factory (Flyweight Logic ทำงานตรงนี้)
        const tag = this.tagFactory.getTag(tagName, tagColor);

        // แปะลงไปใน Article
        article.setTag(tag);
    }

    public showAllWork(): void {
        console.log(`\n--- ${this.name}'s Portfolio ---`);
        this.myArticles.forEach(a => a.render());
    }
}

// ==========================================
// 5. Usage Simulation
// ==========================================

// Setup System
const globalTagFactory = new TagFactory(); // สร้างโรงงานเตรียมไว้ 1 แห่ง

// Setup Users (ส่งโรงงานให้ User ถือไว้ใช้งาน)
const alice = new User("Alice", globalTagFactory);
const bob = new User("Bob", globalTagFactory);

console.log("--- 1. Alice working ---");
const art1 = alice.publishArticle("Basic TypeScript");
alice.addTag(art1, "TypeScript", "Blue"); // สร้าง Tag ใหม่

const art2 = alice.publishArticle("Advanced Types");
alice.addTag(art2, "TypeScript", "Blue"); // Reuse Tag เดิม!

console.log("\n--- 2. Bob working ---");
const art3 = bob.publishArticle("Generic Types");
bob.addTag(art3, "TypeScript", "Blue");   // Reuse Tag เดิม (ข้าม User ก็แชร์ได้!)

const art4 = bob.publishArticle("Database 101");
bob.addTag(art4, "Database", "Red");      // สร้าง Tag ใหม่

// Show Results
alice.showAllWork();
bob.showAllWork();

console.log(`\n📊 Total Tag Objects in RAM: ${globalTagFactory.getCacheSize()}`);
// Output ควรจะเป็น 2 (TypeScript, Database) แม้จะมี 4 บทความ

// Concept, การวิเคราะห์
// Intrinsic State, "คือข้อมูลที่ ""ไม่เปลี่ยนแปลง"" และ ""แชร์ได้"" (ในที่นี้คือ ชื่อ Tag และสี Tag) เราเก็บไว้ใน Flyweight"
// Extrinsic State, "คือข้อมูลที่ ""เปลี่ยนแปลงตามบริบท"" (ในที่นี้คือ ชื่อบทความที่แปะ Tag นั้นอยู่) เราส่งเข้าไปตอนเรียก method display()"
// Memory Optimization, "ถ้าไม่ใช้ Flyweight เราจะมี Tag Object 1,000 ตัว แต่พอใช้แล้วเหลือแค่ 2 ตัว ประหยัด Memory ได้มหาศาลเมื่อ Scale ไประดับล้าน"
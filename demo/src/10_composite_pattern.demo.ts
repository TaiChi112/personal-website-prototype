// 1. Component Interface (สัญญาที่ทุก Node ต้องทำได้)
interface SubContentUnit {
    getTitle(): string;
    getDuration(): number; // เวลาเรียน (นาที)
    display(indent: string): void; // แสดงผล Hierarchy
}

// 2. Leaf (บทความเดี่ยวๆ / เนื้อหาย่อยสุด)
class SingleArticle implements SubContentUnit {
    private title: string;
    private minutes: number;
    constructor(title: string, minutes: number) {
        this.title = title;
        this.minutes = minutes;
    }

    getTitle(): string { return this.title; }

    getDuration(): number { return this.minutes; }

    display(indent: string): void {
        console.log(`${indent}- 📄 [Article] ${this.title} (${this.minutes} mins)`);
    }
}

// 3. Composite (หมวดหมู่ / หัวข้อใหญ่)
// หัวใจสำคัญ: มันเก็บ List ของ SubContentUnit (ซึ่งเป็นได้ทั้ง Article หรือ Category ย่อย)
class TopicCategory implements SubContentUnit {
    private title: string;
    private children: SubContentUnit[] = []; // Recursive structure

    constructor(title: string) {
        this.title = title;
    }

    add(unit: SubContentUnit): void {
        this.children.push(unit);
    }

    getTitle(): string { return this.title; }

    // Magic of Composite: วนลูปถามลูกๆ ให้เอง (Recursion)
    getDuration(): number {
        let total = 0;
        for (const child of this.children) {
            total += child.getDuration();
        }
        return total;
    }

    display(indent: string): void {
        console.log(`${indent}+ 📂 [Category] ${this.title} (Total: ${this.getDuration()} mins)`);
        for (const child of this.children) {
            child.display(indent + "  "); // เพิ่ม Indent ให้สวยงาม
        }
    }
}

class User {
    id: string;
    name: string;
    private learningCollection: TopicCategory; // User's personal learning structure

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.learningCollection = new TopicCategory(`${name}'s Learning Path`);
    }

    // ➕ Add content to user's collection
    // Content can be: Article หรือ Category (ให้ user เลือก)
    addContent(content: SubContentUnit): void {
        this.learningCollection.add(content);
        console.log(`✅ Added: "${content.getTitle()}" to ${this.name}'s collection`);
    }

    // 📂 Create a new category within user's collection
    // User สามารถสร้าง category ว่อยๆ ไว้ก่อน เพื่อเก็บ content ลงไป
    createCategory(categoryName: string): TopicCategory {
        return new TopicCategory(categoryName);
    }

    // 📊 Get user's collection info
    getTotalDuration(): number {
        return this.learningCollection.getDuration();
    }

    // 👀 Display user's entire collection
    viewMyCollection(): void {
        console.log(`\n${'\u2550'.repeat(60)}`);
        console.log(`📚 ${this.name}'s Learning Collection`);
        console.log(`${'\u2550'.repeat(60)}`);
        this.learningCollection.display("");
        console.log(`\n⏱️  Total Learning Time: ${this.getTotalDuration()} minutes`);
        console.log(`${'\u2550'.repeat(60)}\n`);
    }
}

// --- Client Usage: Users Building Their Own Learning Paths ---

console.log("\n\n╔════════════════════════════════════════════════════════════════════════╗");
console.log("║   COMPOSITE PATTERN - USER LEARNING COLLECTIONS                    ║");
console.log("╚════════════════════════════════════════════════════════════════════════╝\n");

// ========================================
// 🎯 USER 1: Alice - Web Development Path
// ========================================
console.log("\n🎯 SCENARIO 1: Alice Building Her Web Development Path");
console.log("─".repeat(60));

const alice = new User("u001", "Alice");

// Alice สร้าง category เพื่อจัดระเบียบ content
const frontendCategory = alice.createCategory("Frontend Fundamentals");
const backendCategory = alice.createCategory("Backend Development");

// Alice add content เข้า Frontend category
frontendCategory.add(new SingleArticle("HTML Basics", 45));
frontendCategory.add(new SingleArticle("CSS & Styling", 60));
frontendCategory.add(new SingleArticle("JavaScript Advanced", 90));

// Alice add content เข้า Backend category
backendCategory.add(new SingleArticle("Node.js Fundamentals", 75));
backendCategory.add(new SingleArticle("Database Design", 80));
backendCategory.add(new SingleArticle("RESTful APIs", 60));

// Alice add categories เข้า personal collection
alice.addContent(frontendCategory);
alice.addContent(backendCategory);
alice.addContent(new SingleArticle("Deployment Strategies", 50)); // บทความเดี่ยวเก็บแยกก็ได้

// Alice ดู collection ของตัวเอง
alice.viewMyCollection();

// ========================================
// 🎯 USER 2: Bob - AI & Machine Learning Path
// ========================================
console.log("\n🎯 SCENARIO 2: Bob Building His AI/ML Learning Path");
console.log("─".repeat(60));

const bob = new User("u002", "Bob");

// Bob สร้าง structure ของตัวเอง
const pythonFoundation = bob.createCategory("Python Foundation");
pythonFoundation.add(new SingleArticle("Python Syntax Basics", 40));
pythonFoundation.add(new SingleArticle("OOP Concepts", 55));
pythonFoundation.add(new SingleArticle("Python Libraries", 70));

const mlTechniques = bob.createCategory("Machine Learning");
mlTechniques.add(new SingleArticle("Supervised Learning", 85));
mlTechniques.add(new SingleArticle("Unsupervised Learning", 75));
mlTechniques.add(new SingleArticle("Deep Learning Basics", 100));

const dataScienceTools = bob.createCategory("Data Science Tools");
dataScienceTools.add(new SingleArticle("Pandas & NumPy", 65));
dataScienceTools.add(new SingleArticle("Data Visualization", 50));

// Bob add ทุกอย่างเข้า collection
bob.addContent(pythonFoundation);
bob.addContent(mlTechniques);
bob.addContent(dataScienceTools);
bob.addContent(new SingleArticle("Advanced: NLP Introduction", 95));

// Bob ดู collection ของตัวเอง
bob.viewMyCollection();

// ========================================
// 🎯 USER 3: Charlie - Self-Organized Custom Path
// ========================================
console.log("\n🎯 SCENARIO 3: Charlie With Nested Categories (Complex Structure)");
console.log("─".repeat(60));

const charlie = new User("u003", "Charlie");

// Charlie สร้าง nested structure: หมวดหลัก -> หมวดย่อย -> content
const webFullStack = charlie.createCategory("Full Stack Web Development");

const frontend = charlie.createCategory("Frontend");
frontend.add(new SingleArticle("React Fundamentals", 80));
frontend.add(new SingleArticle("State Management", 70));
frontend.add(new SingleArticle("Routing & Navigation", 50));

const backend = charlie.createCategory("Backend");
backend.add(new SingleArticle("Express.js Setup", 60));
backend.add(new SingleArticle("Authentication & Security", 85));

const database = charlie.createCategory("Database");
database.add(new SingleArticle("SQL Fundamentals", 75));
database.add(new SingleArticle("NoSQL (MongoDB)", 65));

// Charlie ประกอบ nested structure
webFullStack.add(frontend);
webFullStack.add(backend);
webFullStack.add(database);

// Charlie add ทุกอย่าง
charlie.addContent(webFullStack);
charlie.addContent(new SingleArticle("DevOps Essentials", 90));
charlie.addContent(new SingleArticle("Testing Strategies", 75));

// Charlie ดู collection
charlie.viewMyCollection();

// ========================================
// 📊 Summary: Compare All Users
// ========================================
console.log("\n" + "─".repeat(60));
console.log("📊 LEARNING SUMMARY");
console.log("─".repeat(60));
console.log(`\n👤 ${alice.name}: ${alice.getTotalDuration()} minutes total`);
console.log(`👤 ${bob.name}: ${bob.getTotalDuration()} minutes total`);
console.log(`👤 ${charlie.name}: ${charlie.getTotalDuration()} minutes total`);
console.log("\n" + "─".repeat(60));

// 💡 Key Takeaways:
console.log(`\n💡 KEY INSIGHTS:\n
1. Each user (Alice, Bob, Charlie) has their own learning collection
2. Users structure their content exactly how they want it:
   ✅ Alice: 2 main categories + 1 standalone article
   ✅ Bob: 3 categories + 1 article
   ✅ Charlie: 1 complex nested category + 2 articles (Most detailed!)

3. Composite pattern allows:
   ✅ Mix leaf nodes (articles) and composite nodes (categories)
   ✅ Nested hierarchies (categories within categories)
   ✅ Automatic duration calculation at all levels
   ✅ Single interface (SubContentUnit) for all content types

4. Each user builds their learning path independently
   ✅ User controls: What to learn, in what order, under what categories
   ✅ Flexible: Can reorganize anytime without changing code structure
\n`);
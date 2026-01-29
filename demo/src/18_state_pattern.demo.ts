// --- 1. The Context (ตัวเอกสาร) ---
class Article {
    private state: IState; // ถือสถานะปัจจุบันไว้

    constructor() {
        // เริ่มต้นเป็น Draft เสมอ
        this.state = new DraftState(this);
    }

    // Method สำหรับเปลี่ยนสถานะ (ให้ State เรียกใช้)
    public changeState(newState: IState): void {
        this.state = newState;
        console.log(`   🔄 Status changed to: ${this.state.getName()}`);
    }

    // --- Actions (Delegation) ---
    // User เรียกผ่าน Article แต่ Article โยนงานให้ State ทำ

    public publish(): void {
        this.state.publish();
    }

    public edit(content: string): void {
        this.state.edit(content);
    }

    public reject(): void {
        this.state.reject();
    }
}

// --- 2. The State Interface (กฎกติกา) ---
interface IState {
    getName(): string;
    publish(): void;
    edit(content: string): void;
    reject(): void;
}

// --- 3. Concrete States (แต่ละสถานะ) ---

// สถานะ: ร่าง (Draft)
class DraftState implements IState {
    constructor(private article: Article) { }

    getName() { return "Draft"; }

    public publish(): void {
        console.log("✅ Draft submitted for review.");
        // เปลี่ยนสถานะตัวเองเป็น Review
        this.article.changeState(new ReviewState(this.article));
    }

    public edit(content: string): void {
        console.log(`✏️ Editing content: "${content}" (Saved to Draft)`);
    }

    public reject(): void {
        console.log("❌ Cannot reject a draft. It's not submitted yet.");
    }
}

// สถานะ: รอตรวจ (Review)
class ReviewState implements IState {
    constructor(private article: Article) { }

    getName() { return "Under Review"; }

    public publish(): void {
        console.log("✅ Review Approved! Publishing article to website...");
        // เปลี่ยนสถานะเป็น Published
        this.article.changeState(new PublishedState(this.article));
    }

    public edit(content: string): void {
        console.log("🔒 Locked! Cannot edit while under review.");
    }

    public reject(): void {
        console.log("⚠️ Article rejected. Sending back to Draft.");
        // โดนตีกลับเป็น Draft
        this.article.changeState(new DraftState(this.article));
    }
}

// สถานะ: เผยแพร่แล้ว (Published)
class PublishedState implements IState {
    constructor(private article: Article) { }

    getName() { return "Published"; }

    public publish(): void {
        console.log("❌ Already published.");
    }

    public edit(content: string): void {
        console.log("🔒 Cannot edit live article. Please unpublish first.");
    }

    public reject(): void {
        console.log("❌ Cannot reject a published article.");
    }
}

class User {
    id: string;
    name: string
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
    publish(article: Article) {
        console.log(`\n👤 ${this.name} is attempting to publish an article...`)
        article.publish();
    }
    edit(article: Article, content: string) {
        console.log(`\n👤 ${this.name} is attempting to edit an article...`)
        article.edit(content);
    }
    reject(article: Article) {
        console.log(`\n👤 ${this.name} is attempting to reject an article...`)
        article.reject();
    }
}
// --- Client Usage ---

const myPost = new Article();
console.log("--- New Article Created ---");

// const user1 = new User("u100", "John Doe");
// user1.publish(myPost); // Draft -> Review

// user1.edit(myPost, "New Content"); // Locked

// user1.publish(myPost); // Review -> Published

// 1. ลอง Publish เลย (Draft -> Review)
myPost.publish();

// 2. ตอนนี้อยู่ Review ลองแก้เนื้อหาดู
myPost.edit("New Content");
// Output: 🔒 Locked! Cannot edit while under review. (พฤติกรรมเปลี่ยนไปแล้ว)

// 3. ลอง Publish อีกที (Review -> Published)
myPost.publish();

// 4. ตอนนี้ Published แล้ว ลอง Reject ดู
myPost.reject();
// Output: ❌ Cannot reject a published article.
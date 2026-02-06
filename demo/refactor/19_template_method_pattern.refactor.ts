/**
 * Abstract Class: กำหนดโครงสร้างหลัก (The Skeleton)
 * ตรงกับหลักการ: Open/Closed Principle (OCP) - พฤติกรรมหลักถูกปิดการแก้ไข แต่เปิดให้ขยายผ่าน Subclass
 */
abstract class ContentProcessor {

    // นี่คือ "Template Method"
    // ประกาศเป็น final (ใน logic) เพื่อป้องกันไม่ให้ Subclass เปลี่ยนลำดับการทำงาน
     public createContent(rawData: any): void {
        console.log("--- Starting Content Creation Process ---");

        // 1. Common Logic: ตรวจสอบความถูกต้อง (ทำเหมือนกันหมด)
        this.validate(rawData);

        // 2. Specific Logic: จัดรูปแบบเนื้อหา (ต่างกันตามประเภท)
        const formattedBody = this.formatBody(rawData.body);

        // 3. Specific Logic: จัดการ Metadata (ต่างกันตามประเภท)
        const metadata = this.extractMetadata(rawData);

        // 4. Hook: ขั้นตอนเสริม (มีหรือไม่มีก็ได้)
        if (this.shouldNotifySubscribers()) {
            this.notifySubscribers();
        }

        // 5. Common Logic: บันทึก (ทำเหมือนกันหมด)
        this.save(formattedBody, metadata);

        console.log("--- Process Completed ---\n");
    }

    // --- Common Operations (Invariant) ---
    protected validate(data: any): void {
        if (!data || !data.authorId) {
            throw new Error("Validation Failed: Missing Author");
        }
        console.log("✅ Common: Validated User & Permissions");
    }

    protected save(body: string, meta: any): void {
        console.log(`💾 Common: Saving to DB... [Meta: ${JSON.stringify(meta)}]`);
    }

    // --- Abstract Methods (Variant) - ต้องไปทำเองใน Subclass ---
    protected abstract formatBody(body: string): string;
    protected abstract extractMetadata(data: any): any;

    // --- Hooks (Optional) - มี default implementation ว่า "ไม่ทำ" ---
    protected shouldNotifySubscribers(): boolean {
        return false;
    }

    protected notifySubscribers(): void {
        console.log("📧 Common: Sending email to subscribers...");
    }
}

/**
 * Concrete Class: Article
 * เน้นเนื้อหาตัวอักษร และต้องแจ้งเตือนคนอ่าน
 */
class ArticleProcessor extends ContentProcessor {
    protected formatBody(body: string): string {
        console.log("📝 Article: Converting Markdown to HTML...");
        return `<article>${body}</article>`;
    }

    protected extractMetadata(data: any): any {
        return { type: 'article', readTime: '5 mins', tags: data.tags };
    }

    // Override Hook: Article ต้องการแจ้งเตือน
    protected shouldNotifySubscribers(): boolean {
        return true;
    }
}

/**
 * Concrete Class: Project
 * เน้นโชว์รูปภาพและ Link Demo, ไม่ต้องแจ้งเตือนก็ได้
 */
class ProjectProcessor extends ContentProcessor {
    protected formatBody(body: string): string {
        console.log("🛠️ Project: Formatting Gallery & Tech Stack...");
        return `<div class="project-showcase">${body}</div>`;
    }

    protected extractMetadata(data: any): any {
        return { type: 'project', stack: data.techStack, demoUrl: data.url };
    }
}

/**
 * Concrete Class: Docs
 * เน้น Code block และ Versioning
 */
class DocsProcessor extends ContentProcessor {
    protected formatBody(body: string): string {
        console.log("📚 Docs: Highlighting Code Syntax...");
        return `<div class="documentation">${body}</div>`;
    }

    protected extractMetadata(data: any): any {
        return { type: 'docs', version: data.version, apiRef: data.api };
    }
}

// --- Client Code ---
function clientCode() {
    const articleManager = new ArticleProcessor();
    articleManager.createContent({
        authorId: 1,
        body: "# Hello World",
        tags: ['news', 'tech']
    });

    const projectManager = new ProjectProcessor();
    projectManager.createContent({
        authorId: 1,
        body: "My Cool App",
        techStack: ['React', 'Node'],
        url: 'github.com/...'
    });
}

clientCode();
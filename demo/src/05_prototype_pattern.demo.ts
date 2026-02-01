// 1. Interface Segregation: กำหนดสัญญาว่า Object นี้ต้อง Clone ได้
interface Prototype<T> {
    clone(): T;
}

// 2. Concrete Class: ตัวเอกสาร SDLC ของเรา
class SDLCProjectDocument implements Prototype<SDLCProjectDocument> {
    constructor(
        private title: string,
        private sections: string[], // สมมติว่าเป็นเนื้อหาที่เยอะมากๆ
        private techStack: string[]
    ) {
        // Simulation: Complex initialization logic (e.g., fetching templates from DB)
        console.log(`[System] Initializing heavy document: ${this.title}`);
    }

    private static cloneArray<T>(items: T[]): T[] {
        return [...items];
    }

    // 3. The Implementation of Prototype Pattern
    public clone(): SDLCProjectDocument {
        // Deep Copy Logic: จำเป็นมากสำหรับ Array/Object เพื่อไม่ให้ Reference ชนกัน
        const clonedSections = SDLCProjectDocument.cloneArray(this.sections);
        const clonedTechStack = SDLCProjectDocument.cloneArray(this.techStack);

        // Return new instance with copied data
        return new SDLCProjectDocument(
            `Copy of ${this.title}`,
            clonedSections,
            clonedTechStack
        );
    }

    public setTechStack(newStack: string[]): void {
        this.techStack = [...newStack];
    }

    public toString(): string {
        return `Doc: ${this.title} | Stack: [${this.techStack.join(', ')}] | Content Length: ${this.sections.length}`;
    }
}

// --- Client Usage (Software Engineering Context) ---

// Step 1: สร้าง Master Template (Costly Operation)
const masterTemplate = new SDLCProjectDocument(
    "Standard Web App SDLC",
    ["Intro", "Requirement Analysis", "System Design", "Testing"],
    ["Java", "Spring Boot", "MySQL"] // Default Stack
);

console.log("--- Original ---");
console.log(masterTemplate.toString());

// Step 2: Clone และปรับแก้ (Efficient Operation)
// ตรงนี้คือสิ่งที่คุณต้องการ: Clone content เดิม -> เปลี่ยน Tech Stack
const nodeProject = masterTemplate.clone();
nodeProject.setTechStack(["Node.js", "Express", "MongoDB"]);

// Step 3: Clone อีกโปรเจกต์
const pythonProject = masterTemplate.clone();
pythonProject.setTechStack(["Python", "Django", "PostgreSQL"]);

console.log("--- Cloned & Modified ---");
console.log(nodeProject.toString());
console.log(pythonProject.toString());

// Verify: ต้นฉบับต้องไม่เปลี่ยน (Proof of Deep Copy)
console.log("--- Verify Original ---");
console.log(masterTemplate.toString());
// Flyweight
interface ITag {
    render(contentTitle: string): void;// รับ parameter ที่เป็น Extrinsic state เพื่อให้ tag รู้ตัวว่าถูกเเปะอยู่กับ content ไหน
}

// Concrete Flyweight 
class SystemTag implements ITag {
    private readonly name: string; // Intrinsic
    private readonly color: string;// Intrinsic
    private readonly type: "Category" | "Type" // Intrinsic สิ่งที่ใช้ร่วม share กันได้ คือ Tag ที่มี name,color,type
    constructor(name: string, color: string, type: "Category" | "Type") {
        this.name = name;
        this.color = color;
        this.type = type;
    }

    public render(): void {
        console.log(`   🏷️  [${this.type}:${this.name} | ${this.color}]`);
    }
}
// Flyweight Factory ใช้สร้างเเละเก็บ tag ที่มีลักษณะเหมือนกัน ถ้ายังไม่เคยสร้างจะสร้างใหม่ เเต่ถ้าเคยสร้างจะ return ตัวเดิมที่มีอยู่เเล้ว
class TagFactory {
    private cache: Map<string, ITag> = new Map();

    public getTag(name: string, color: string, type: "Category" | "Type"): ITag {
        const key = `${name}-${type}`;

        if (this.cache.has(key)) {
            return this.cache.get(key)!;
        }

        const newTag = new SystemTag(name, color, type);
        this.cache.set(key, newTag);
        console.log(`✨ Create new tag -> [${name}]`);
        return newTag;
    }

    public getCacheSize(): number {
        return this.cache.size;
    }
}
// Client
class Content {
    private title: string; // Extrinsic , Content ของเรานั้นไม่เหมือนกัน เเต่มี tag ที่เหมือนกัน
    private content: string = ""; // Extrinsic
    private tags: ITag[] = [];// Flyweight reference
    constructor(title: string, content: string) {
        this.title = title;
        this.content = content;
    }

    public addTag(factory: TagFactory, tagName: string, color: string, type: "Category" | "Type") {
        const tag = factory.getTag(tagName, color, type);
        this.tags.push(tag);
    }

    public show(): void {
        console.log(`\n📄 Content: ${this.title} \n${this.content}`);
        this.tags.forEach(tag => tag.render(this.title));
    }
    public summaryTags(): void {
        console.log("\n---------------------------------------------");
        console.log(`   - Total Contents Created: ${allContents.length} objects`);
        console.log(`   - Total Tags Requests:    ${allContents.length * 2} times (approx)`);
        console.log(`   - ACTUAL Tag Objects in RAM: ${tagFactory.getCacheSize()} objects ONLY! 🤯`);
        console.log("---------------------------------------------");
    }
}

const allContents: Content[] = [];
const tagTypes = ["AI", "ML", "Software Engineering", "Video", "Project", "Blog"];
const tagFactory = new TagFactory();

for (let i = 1; i <= 1000; i++) {

    const content = new Content(`Content ${i}`, `This is the content body for content number ${i}.`);
    content.addTag(tagFactory, "AI", "Blue", "Category");

    const randomTag = tagTypes[Math.floor(Math.random() * tagTypes.length)];
    content.addTag(tagFactory, randomTag, "Red", "Type");

    allContents.push(content);
}

allContents[0].show();
allContents[1].show();
allContents[2].show();

allContents[0].summaryTags();
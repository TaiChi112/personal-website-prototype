// --- 1. The Iterator Interface (มาตรฐานปุ่ม Next) ---
interface IIterator<T> {
    current(): T | null; // ดูตัวปัจจุบัน
    next(): T | null;    // ขยับไปตัวถัดไป
    hasNext(): boolean;  // เช็คว่าหมดหรือยัง
}

// --- 2. The Aggregate Interface (มาตรฐานของคลังข้อมูล) ---
// collection interface
interface IAggregate {
    createIterator(): IIterator<string>;
}

// --- 3. Concrete Collection 1: Simple List (Array) ---
class ArticleList implements IAggregate {
    private articles: string[] = [];

    add(title: string) { this.articles.push(title); }

    public getLength(): number { return this.articles.length; }
    public getItem(index: number): string { return this.articles[index]; }

    // สร้าง Iterator สำหรับ Array (เดินหน้าทีละ 1)
    createIterator(): IIterator<string> {
        return new ArticleIterator(this);
    }
}

// Iterator สำหรับ Array (ง่ายๆ แค่เพิ่ม index)
// Concrete Iterator
class ArticleIterator implements IIterator<string> {
    private collection: ArticleList;
    private index: number = 0;

    constructor(collection: ArticleList) {
        this.collection = collection;
    }

    current(): string | null {
        if (!this.hasNext()) return null;
        return this.collection.getItem(this.index);
    }

    next(): string | null {
        const item = this.current();
        this.index++;
        return item;
    }

    hasNext(): boolean {
        return this.index < this.collection.getLength();
    }
}

// --- 4. Concrete Collection 2: Complex Tree (Project -> SubProject) ---
// โครงสร้างซับซ้อนกว่า Array มาก
class ProjectNode {
    constructor(public name: string, public children: ProjectNode[] = []) { }
}

class ProjectTree implements IAggregate {
    public root: ProjectNode;

    constructor(root: ProjectNode) {
        this.root = root;
    }

    // สร้าง Iterator สำหรับ Tree (ต้องใช้ Logic ซับซ้อนในการไต่ Tree)
    createIterator(): IIterator<string> {
        return new TreeIterator(this.root);
    }
}

// Iterator สำหรับ Tree (ความซับซ้อนถูกซ่อนอยู่ที่นี่!)
// ใช้ Algorithm Depth-First Search (DFS) ในการหา "ตัวถัดไป"
// Concrete Iterator
class TreeIterator implements IIterator<string> {
    private stack: ProjectNode[] = []; // ใช้ Stack ช่วยจำทาง
    private currentResult: string | null = null;

    constructor(root: ProjectNode) {
        this.stack.push(root);
    }

    current(): string | null {
        return this.currentResult;
    }

    hasNext(): boolean {
        return this.stack.length > 0;
    }

    next(): string | null {
        if (!this.hasNext()) return null;

        // Logic การเจาะ Tree (Client ไม่ต้องรู้เรื่องนี้เลย)
        const node = this.stack.pop()!;
        this.currentResult = node.name;

        // เอาลูกๆ ยัดใส่ Stack เพื่อรอวนลูปครั้งถัดไป
        // (Reverse เพื่อให้ pop ออกมาถูกลำดับซ้ายไปขวา)
        for (let i = node.children.length - 1; i >= 0; i--) {
            this.stack.push(node.children[i]);
        }

        return this.currentResult;
    }
}

class User {
    id: string;
    name: string;
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
    call(iterator: IIterator<string>) {
        while (iterator.hasNext()) {
            console.log(`${this.name} reads: ${iterator.next()}`);
        }
    }
}
// --- Client Usage ---

// สร้างข้อมูล (Data Structure ต่างกัน)
const myArticles = new ArticleList();
myArticles.add("Article 1: Intro");
myArticles.add("Article 2: Deep Dive");

const subProject = new ProjectNode("Sub-Task A", [new ProjectNode("Micro-Task A.1")]);
const mainProject = new ProjectNode("Main Project", [subProject, new ProjectNode("Sub-Task B")]);
const myProjects = new ProjectTree(mainProject);

const user1 = new User("u1", "Alice");
user1.call(myArticles.createIterator());
user1.call(myProjects.createIterator());

// ฟังก์ชันแสดงผล (Client Code)
// สังเกตว่า: โค้ดชุดนี้ทำงานได้กับทั้ง Array และ Tree โดยหน้าตาเหมือนเดิมเป๊ะ!
function printFeed(iterator: IIterator<string>, type: string) {
    console.log(`--- Reading ${type} Feed ---`);
    while (iterator.hasNext()) {
        console.log(iterator.next());
    }
}

// ใช้งาน
const articleIterator = myArticles.createIterator();
printFeed(articleIterator, "Article List");
// Output: Article 1..., Article 2...

const projectIterator = myProjects.createIterator();
printFeed(projectIterator, "Project Tree");
// Output: Main Project, Sub-Task A, Micro-Task A.1, Sub-Task B (ออกมาเรียงสวยงาม)

const user3 = new User("u3", "Charlie");
user3.call(articleIterator);
const user4 = new User("u4", "Diana");
user4.call(projectIterator);
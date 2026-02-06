// 1. Component 
interface SubContentUnit {
    getTitle(): string;
    getDuration(): number;
    getStructureString(indent: string): string;
}
// Leaf
class SingleArticle implements SubContentUnit {
    constructor(private title: string, private minutes: number) { }
    getTitle(): string { return this.title; }
    getDuration(): number { return this.minutes; }
    getStructureString(indent: string): string {
        return `${indent}- 📄 [Article] ${this.title} (${this.minutes} mins)\n`;
    }
}
// Composite
class TopicCategory implements SubContentUnit {
    private children: SubContentUnit[] = [];
    constructor(private title: string) { }

    add(unit: SubContentUnit): void {
        this.children.push(unit);
    }

    getTitle(): string { return this.title; }
    getDuration(): number {
        return this.children.reduce((sum, child) => sum + child.getDuration(), 0);
    }
    getStructureString(indent: string): string {
        let output = `${indent}+ 📂 [Category] ${this.title} (Total: ${this.getDuration()} mins)\n`;
        for (const child of this.children) {
            output += child.getStructureString(indent + "  ");
        }
        return output;
    }
}

class User {
    constructor(public id: string,public name: string,private learningPath: TopicCategory) { }

    addContent(content: SubContentUnit): void {
        this.learningPath.add(content);
    }

    getHistory(): string {
        return this.learningPath.getStructureString("");
    }

    getTotalHours(): number {
        return this.learningPath.getDuration();
    }
    showUserReport(user: User): void {
        console.log(`\n${'='.repeat(40)}`);
        console.log(`👤 User Report: ${user.name}`);
        console.log(`⏱️  Total Duration: ${user.getTotalHours()} mins`);
        console.log(`${'='.repeat(40)}`);
        console.log(user.getHistory()); 
        console.log(`${'='.repeat(40)}\n`);
    }
}



const myLearningPath = new TopicCategory("Bob's 2024 Goals");
const bob = new User("u002", "Bob", myLearningPath);

const pythonCourse = new TopicCategory("Python Foundation");
pythonCourse.add(new SingleArticle("Syntax", 40));
pythonCourse.add(new SingleArticle("OOP", 55));

bob.addContent(pythonCourse);
bob.addContent(new SingleArticle("Clean Code Book", 120));

bob.showUserReport(bob);
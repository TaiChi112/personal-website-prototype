// Receiver
class TextEditor {
    private clipboard: string = "";
    public content: string = "";

    copy(text: string): void {
        this.clipboard = text;
        console.log(`   📋 Copied: "${this.clipboard}"`);
    }

    paste(): string {
        console.log(`   📄 Pasting: "${this.clipboard}"`);
        return this.clipboard;
    }

    addContent(text: string): void {
        this.content += text;
        console.log(`   ✅ Content now: "${this.content}"`);
    }

    deleteText(length: number): void {
        this.content = this.content.slice(0, -length);
        console.log(`   ↩️  Content now: "${this.content}"`);
    }

    insertText(position: number, text: string): void {
        this.content = this.content.slice(0, position) + text + this.content.slice(position);
        console.log(`   ✅ Content now: "${this.content}"`);
    }

    getContent(): string {
        return this.content;
    }
}

// Command
interface ICommand {
    execute(): void;
    undo(): void;
    getDescription(): string;
}

// Concrete Command
class CopyCommand implements ICommand {
    constructor(
        private editor: TextEditor,
        private textToCopy: string
    ) { }

    execute(): void {
        this.editor.copy(this.textToCopy);
    }

    undo(): void {
        console.log("   ⚠️  Copy action cannot be undone (no effect).");
    }

    getDescription(): string {
        return `Copy "${this.textToCopy}"`;
    }
}

class PasteCommand implements ICommand {
    private pastedLength: number = 0;

    constructor(private editor: TextEditor) { }

    execute(): void {
        const text = this.editor.paste();
        this.editor.addContent(text);
        this.pastedLength = text.length;
    }

    undo(): void {
        console.log(`   ↩️  Undoing paste...`);
        this.editor.deleteText(this.pastedLength);
    }

    getDescription(): string {
        return "Paste from clipboard";
    }
}

class TypeCommand implements ICommand {
    constructor(
        private editor: TextEditor,
        private text: string
    ) { }

    execute(): void {
        this.editor.addContent(this.text);
    }

    undo(): void {
        console.log(`   ↩️  Undoing type...`);
        this.editor.deleteText(this.text.length);
    }

    getDescription(): string {
        return `Type "${this.text}"`;
    }
}

// Invoker
class EditorInvoker {
    private history: ICommand[] = [];
    private undoneCommands: ICommand[] = []; 

    executeCommand(command: ICommand): void {
        console.log(`\n🔹 Executing: ${command.getDescription()}`);
        command.execute();
        this.history.push(command);
        this.undoneCommands = []; 
    }

    undo(): void {
        console.log(`\n⏮️  UNDO`);
        const command = this.history.pop();
        if (command) {
            command.undo();
            this.undoneCommands.push(command);
        } else {
            console.log("   ⚠️  Nothing to undo!");
        }
    }

    redo(): void {
        console.log(`\n⏭️  REDO`);
        const command = this.undoneCommands.pop();
        if (command) {
            console.log(`   Redoing: ${command.getDescription()}`);
            command.execute();
            this.history.push(command);
        } else {
            console.log("   ⚠️  Nothing to redo!");
        }
    }

    showHistory(): void {
        console.log(`\n📜 Command History (${this.history.length} actions):`);
        if (this.history.length === 0) {
            console.log("   (empty)");
        } else {
            this.history.forEach((cmd, i) => {
                console.log(`   ${i + 1}. ${cmd.getDescription()}`);
            });
        }
    }
}

// Context
class User {
    constructor(
        public id: string,
        public name: string
    ) { }

    copyText(invoker: EditorInvoker, editor: TextEditor, text: string): void {
        console.log(`\n👤 ${this.name} selects and copies text...`);
        const command = new CopyCommand(editor, text);
        invoker.executeCommand(command);
    }

    pasteText(invoker: EditorInvoker, editor: TextEditor): void {
        console.log(`\n👤 ${this.name} pastes text...`);
        const command = new PasteCommand(editor);
        invoker.executeCommand(command);
    }

    typeText(invoker: EditorInvoker, editor: TextEditor, text: string): void {
        console.log(`\n👤 ${this.name} types text...`);
        const command = new TypeCommand(editor, text);
        invoker.executeCommand(command);
    }

    pressUndo(invoker: EditorInvoker): void {
        console.log(`\n👤 ${this.name} presses Ctrl+Z...`);
        invoker.undo();
    }

    pressRedo(invoker: EditorInvoker): void {
        console.log(`\n👤 ${this.name} presses Ctrl+Y...`);
        invoker.redo();
    }

    viewHistory(invoker: EditorInvoker): void {
        console.log(`\n👤 ${this.name} checks command history...`);
        invoker.showHistory();
    }
}

// Client
const editor = new TextEditor(); // Receiver
const invoker = new EditorInvoker(); // Invoker
const alice = new User("u001", "Alice"); // Client

console.log("SCENARIO 1: User types text");
alice.typeText(invoker, editor, "Hello ");
alice.typeText(invoker, editor, "World!");

console.log("SCENARIO 2: User copies text");
alice.copyText(invoker, editor, "TypeScript ");

console.log("SCENARIO 3: User pastes text multiple times");
alice.pasteText(invoker, editor);
alice.pasteText(invoker, editor);

console.log("CURRENT STATE");
console.log(`📄 Editor Content: "${editor.getContent()}"`);
alice.viewHistory(invoker);

console.log("SCENARIO 4: User performs multiple undos");
alice.pressUndo(invoker); 
console.log(`📄 Editor Content: "${editor.getContent()}"`);

alice.pressUndo(invoker); 
console.log(`📄 Editor Content: "${editor.getContent()}"`);

alice.pressUndo(invoker); 
console.log(`📄 Editor Content: "${editor.getContent()}"`);

alice.pressUndo(invoker); 
console.log(`📄 Editor Content: "${editor.getContent()}"`);

console.log("SCENARIO 5: User performs redo");
alice.pressRedo(invoker); 
console.log(`📄 Editor Content: "${editor.getContent()}"`);

alice.pressRedo(invoker); 
console.log(`📄 Editor Content: "${editor.getContent()}"`);

console.log("SCENARIO 6: New action after undo (clears redo stack)");
alice.typeText(invoker, editor, " Amazing!");
console.log(`📄 Editor Content: "${editor.getContent()}"`);

alice.pressRedo(invoker); 
console.log(`📄 Editor Content: "${editor.getContent()}"`);

console.log("FINAL STATE");
console.log(`📄 Final Content: "${editor.getContent()}"`);
alice.viewHistory(invoker);
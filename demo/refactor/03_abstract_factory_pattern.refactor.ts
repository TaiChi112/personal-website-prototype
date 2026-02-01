// ==========================================
// 1. Abstract Products (สินค้าที่โรงงานต้องผลิต)
// ==========================================
interface ICard {
    render(): void;
}

interface IButton { // เพิ่มสินค้าใหม่: ปุ่มกด
    click(): void;
}

// ==========================================
// 2. Abstract Factory (แม่พิมพ์ของโรงงาน)
// ==========================================
interface ThemeFactory {
    createCard(): ICard;
    createButton(): IButton; // โรงงานต้องผลิตปุ่มได้ด้วย
}

// ==========================================
// 3. Concrete Products (สินค้าจริง)
// ==========================================

// --- Modern Family ---
class ModernCard implements ICard {
    render(): void { console.log("  🎨 [Modern] Rendering Card with Rounded Corners"); }
}
class ModernButton implements IButton {
    click(): void { console.log("  🎨 [Modern] Button Clicked (Ripple Effect)"); }
}

// --- Classic Family ---
class ClassicCard implements ICard {
    render(): void { console.log("  📜 [Classic] Rendering Card with Border"); }
}
class ClassicButton implements IButton {
    click(): void { console.log("  📜 [Classic] Button Clicked (Simple Click)"); }
}

// ==========================================
// 4. Concrete Factories (โรงงานผลิตจริง)
// ==========================================

class ModernThemeFactory implements ThemeFactory {
    createCard(): ICard { return new ModernCard(); }
    createButton(): IButton { return new ModernButton(); }
}

class ClassicThemeFactory implements ThemeFactory {
    createCard(): ICard { return new ClassicCard(); }
    createButton(): IButton { return new ClassicButton(); }
}

// ==========================================
// 5. Client / Application (ผู้ใช้งานโรงงาน)
// ==========================================

// User เก็บแค่ Data (SRP: ทำหน้าที่เก็บข้อมูลอย่างเดียว)
class User {
    id: string;
    name: string;
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
    applyTheme(factory: ThemeFactory): void {
        console.log(`👤 ${this.name} applies theme`);
        const card = factory.createCard();
        const button = factory.createButton();

        card.render();
        button.click();
    }
}

const alice = new User("1", "Alice");
alice.applyTheme(new ModernThemeFactory());   
alice.applyTheme(new ClassicThemeFactory()); 
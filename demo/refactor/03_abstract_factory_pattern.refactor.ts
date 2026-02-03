// abstract product
interface ICard {
    render(): void;
}

interface IButton {
    click(): void;
}

// abstract factory
interface ThemeFactory {
    createCard(): ICard;
    createButton(): IButton;
}

// concrete products
class ModernCard implements ICard {
    render(): void { console.log("  🎨 [Modern] Rendering Card with Rounded Corners"); }
}
class ModernButton implements IButton {
    click(): void { console.log("  🎨 [Modern] Button Clicked (Ripple Effect)"); }
}

class ClassicCard implements ICard {
    render(): void { console.log("  📜 [Classic] Rendering Card with Border"); }
}
class ClassicButton implements IButton {
    click(): void { console.log("  📜 [Classic] Button Clicked (Simple Click)"); }
}
// concrete factory
class ModernThemeFactory implements ThemeFactory {
    createCard(): ICard { return new ModernCard(); }
    createButton(): IButton { return new ModernButton(); }
}

class ClassicThemeFactory implements ThemeFactory {
    createCard(): ICard { return new ClassicCard(); }
    createButton(): IButton { return new ClassicButton(); }
}
// client
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

// const WebModernStyle: ThemeFactory = new ModernThemeFactory();

// const modernCard: ICard = WebModernStyle.createCard();
// const modernButton: IButton = WebModernStyle.createButton();

// modernButton.click();
// modernCard.render();

// const WebClassicStyle: ThemeFactory = new ClassicThemeFactory();

// const classicCard: ICard = WebClassicStyle.createCard();
// const classicButton: IButton = WebClassicStyle.createButton();

// classicButton.click();
// classicCard.render();

/*
    - abstract product: ICard, IButton
    - abstract factory: ThemeFactory
    - concrete product: ModernCard, ModernButton, ClassicCard, ClassicButton
    - concrete factory: ModernThemeFactory, ClassicThemeFactory
    - client: User
*/
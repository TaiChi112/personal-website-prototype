```mermaid
classDiagram
    class IContentDisplay {
        <<interface>>
        +render() string
    }
    
    class SimpleArticle {
        -title string
        +constructor(title string)
        +render() string
    }
    class SimpleBlog{
        -title string
        +constructor(title string)
        +render() string
    }
    
    class ContentDecorator {
        <<abstract>>
        -content IContentDisplay
        +constructor(content IContentDisplay)
        +render() string
    }
    
    class NewBadgeDecorator {
        +render() string
    }
    
    class SponsoredDecorator {
        +render() string
    }
    class PopularDecorator {
        +render() string
    }
    
    IContentDisplay <|.. SimpleArticle : implements
    IContentDisplay <|.. ContentDecorator : implements
    ContentDecorator <|-- NewBadgeDecorator : extends
    ContentDecorator <|-- SponsoredDecorator : extends
    ContentDecorator --> IContentDisplay : wraps
    ContentDecorator <|-- PopularDecorator : extends
    SimpleBlog ..|> IContentDisplay : implements
```

## Decorator Component
- Component: IContentDisplay
- Concrete Component: SimpleArticle
- Decorator: ContentDecorator
- Concrete Decorators: NewBadgeDecorator, SponsoredDecorator
- Client: myPost

```ts
    // base decorator
     render(): string {
        return this.content.render();
    }
    // concrete decorators
    render(): string {
        return `[NEW!] ${super.render()}`;
    }
```

## Planning Scale in the Future
- เพิ่ม New Content ที่ต่างกัน เเล้วใช้ Adapter จัดการให้เข้ากับระบบ เเล้วให้ Decorator ห่อหุ้มต่อ
- เพิ่มการเเสดงผลที่ต่างกัน เช่น เเสดงผลเป็นวิดีโอ, รูปภาพ, ข้อความธรรมดา โดยใช้ Bridge Pattern ร่วมกับ Decorator Pattern
  
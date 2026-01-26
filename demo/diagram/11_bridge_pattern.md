# Bridge Pattern - Class Diagram

```mermaid
classDiagram
    class Implementor {
        +abstract implementationMethod() string
    }
    
    class ConcreteImplementorA {
        +implementationMethod() string
    }
    
    class ConcreteImplementorB {
        +implementationMethod() string
    }
    
    class Abstraction {
        -implementor: Implementor
        +constructor(implementor: Implementor)
        +abstract operation() string
    }
    
    class RefinedAbstraction {
        +operation() string
    }
    
    Implementor <|-- ConcreteImplementorA
    Implementor <|-- ConcreteImplementorB
    Abstraction <|-- RefinedAbstraction
    Abstraction --> Implementor: uses
    
    note for Abstraction "Decouples abstraction\nfrom implementation"
```

## Description
- **Implementor**: Interface สำหรับ low-level implementation
- **ConcreteImplementors**: Concrete implementations
- **Abstraction**: High-level abstraction ที่เก็บ implementor
- **RefinedAbstraction**: Extended abstraction ด้วย features เพิ่มเติม
- Abstraction และ Implementation สามารถเปลี่ยนแปลงได้อย่างอิสระ

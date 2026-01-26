# Abstract Factory Pattern - Class Diagram

```mermaid
classDiagram
    class AbstractProductA {
        +abstract operationA() string
    }
    
    class ConcreteProductA1 {
        +operationA() string
    }
    
    class ConcreteProductA2 {
        +operationA() string
    }
    
    class AbstractProductB {
        +abstract operationB() string
    }
    
    class ConcreteProductB1 {
        +operationB() string
    }
    
    class ConcreteProductB2 {
        +operationB() string
    }
    
    class AbstractFactory {
        +abstract createProductA() AbstractProductA
        +abstract createProductB() AbstractProductB
    }
    
    class ConcreteFactory1 {
        +createProductA() AbstractProductA
        +createProductB() AbstractProductB
    }
    
    class ConcreteFactory2 {
        +createProductA() AbstractProductA
        +createProductB() AbstractProductB
    }
    
    AbstractProductA <|-- ConcreteProductA1
    AbstractProductA <|-- ConcreteProductA2
    AbstractProductB <|-- ConcreteProductB1
    AbstractProductB <|-- ConcreteProductB2
    AbstractFactory <|-- ConcreteFactory1
    AbstractFactory <|-- ConcreteFactory2
    ConcreteFactory1 --|> ConcreteProductA1: creates
    ConcreteFactory1 --|> ConcreteProductB1: creates
    ConcreteFactory2 --|> ConcreteProductA2: creates
    ConcreteFactory2 --|> ConcreteProductB2: creates
    
    note for AbstractFactory "Creates families of\nrelated objects"
```

## Description
- **AbstractProductA/B**: Base interfaces/classes สำหรับ product families
- **ConcreteProducts**: Concrete implementations ของแต่ละ product type
- **AbstractFactory**: Interface ที่ define factory methods สำหรับ product family
- **ConcreteFactories**: Implementations ของ AbstractFactory ที่สร้าง related products

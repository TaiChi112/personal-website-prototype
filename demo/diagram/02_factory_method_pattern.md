# Factory Method Pattern - Class Diagram

```mermaid
classDiagram
    class Product {
        +getName() string
    }
    
    class ConcreteProductA {
        +getName() string
    }
    
    class ConcreteProductB {
        +getName() string
    }
    
    class Creator {
        +abstract createProduct() Product
    }
    
    class ConcreteCreatorA {
        +createProduct() Product
    }
    
    class ConcreteCreatorB {
        +createProduct() Product
    }
    
    Product <|-- ConcreteProductA
    Product <|-- ConcreteProductB
    Creator <|-- ConcreteCreatorA
    Creator <|-- ConcreteCreatorB
    ConcreteCreatorA --|> ConcreteProductA: creates
    ConcreteCreatorB --|> ConcreteProductB: creates
    
    note for Creator "Abstract factory method\nSubclasses decide product type"
```

## Description
- **Product**: Interface/Abstract class ที่ define contract สำหรับ products
- **ConcreteProducts**: Classes ที่ implement product interface
- **Creator**: Abstract class ที่มี abstract factory method
- **ConcreteCreators**: Classes ที่ implement factory method สำหรับแต่ละ product type

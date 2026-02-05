# Abstract Factory Pattern - Class Diagram

```mermaid
classDiagram
    class AbstractProduct {
        <<interface>>
        +operationA() string
    }
    
    class ConcreteProductA1 {
        +operationA() string
    }
    class ConcreteProductA2{
        +operationA() string
    }

    class AbstractFactory {
        <<interface>>
        +createProductB() AbstractProduct
        +createProductA() AbstractProduct
    }
    
    class ConcreteFactory1 {
        +createProductA() AbstractProduct
        +createProductB() AbstractProduct
    }
    class ConcreteFactory2 {
        +createProductA() AbstractProduct
        +createProductB() AbstractProduct
    }
    class Client{
        -factory: AbstractFactory
        +Client(factory: AbstractFactory)
        +someOperation() void
    }
    Client --> AbstractFactory: uses
    AbstractFactory <|-- ConcreteFactory1
    AbstractFactory <|-- ConcreteFactory2
    ConcreteFactory1 ..> ConcreteProductA1: creates    
    ConcreteFactory1 ..> ConcreteProductA2: creates
    ConcreteFactory2 ..> ConcreteProductA1: creates    
    ConcreteFactory2 ..> ConcreteProductA2: creates
    ConcreteProductA1 --|> AbstractProduct: implements
    ConcreteProductA2 --|> AbstractProduct: implements
    
    note for AbstractFactory "Creates families of\nrelated objects"
```

## Description
- **AbstractProduct**: Base interfaces/classes สำหรับ product families
- **ConcreteProducts**: Concrete implementations ของแต่ละ product type
- **AbstractFactory**: Interface ที่ define factory methods สำหรับ product family
- **ConcreteFactories**: Implementations ของ AbstractFactory ที่สร้าง related products
- **Client**: ใช้ AbstractFactory เพื่อสร้าง products โดยไม่ผูกมัดกับ concrete classes

```ts
createProductA(): AbstractProduct {
    return new ConcreteProductA1();
}
someOperation(): void {
    const productA: AbstractProduct = this.factory.createProductA();
    productA.operationA();
}
```
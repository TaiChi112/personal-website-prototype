# Strategy Pattern - Class Diagram

```mermaid
classDiagram
    class Strategy {
        +abstract execute(a: number, b: number) number
    }
    
    class ConcreteStrategyAdd {
        +execute(a: number, b: number) number
    }
    
    class ConcreteStrategySubtract {
        +execute(a: number, b: number) number
    }
    
    class ConcreteStrategyMultiply {
        +execute(a: number, b: number) number
    }
    
    class Context {
        -strategy: Strategy
        +constructor(strategy: Strategy)
        +setStrategy(strategy: Strategy) void
        +executeStrategy(a: number, b: number) number
    }
    
    Strategy <|-- ConcreteStrategyAdd
    Strategy <|-- ConcreteStrategySubtract
    Strategy <|-- ConcreteStrategyMultiply
    Context --> Strategy: uses
    
    note for Strategy "Encapsulates interchangeable algorithms"
```

## Description
- **Strategy**: Interface ที่ define algorithm interface
- **ConcreteStrategies**: Implement different algorithms
- **Context**: Uses strategy object เพื่อ execute algorithm
- Client สามารถเปลี่ยน strategy ได้ runtime

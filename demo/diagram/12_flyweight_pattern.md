# Flyweight Pattern - Class Diagram

```mermaid
classDiagram
    class Flyweight {
        +abstract operation(extrinsicState: string) string
    }
    
    class ConcreteFlyweight {
        -intrinsicState: string
        +operation(extrinsicState: string) string
    }
    
    class FlyweightFactory {
        -flyweights: Map~string, Flyweight~
        +getFlyweight(intrinsicState: string) Flyweight
        +getFlyweightCount() number
    }
    
    Flyweight <|-- ConcreteFlyweight
    FlyweightFactory --> Flyweight: manages and caches
    
    note for ConcreteFlyweight "Intrinsic state: shared\nExtrinsic state: passed as parameter"
```

## Description
- **Flyweight**: Interface ที่ define operations
- **ConcreteFlyweight**: Shared objects ที่เก็บ intrinsic state
- **FlyweightFactory**: Creates และ manages flyweight objects, reuses existing ones
- Intrinsic state (shared) vs Extrinsic state (context-specific)

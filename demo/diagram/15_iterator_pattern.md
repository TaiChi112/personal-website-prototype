# Iterator Pattern - Class Diagram

```mermaid
classDiagram
    class Iterator {
        +abstract hasNext() boolean
        +abstract next() string
    }
    
    class ConcreteIterator {
        -collection: ConcreteCollection
        -position: number
        +hasNext() boolean
        +next() string
    }
    
    class Collection {
        +abstract createIterator() Iterator
    }
    
    class ConcreteCollection {
        -items: string[]
        +addItem(item: string) void
        +getItem(index: number) string
        +getCount() number
        +createIterator() Iterator
    }
    
    Iterator <|-- ConcreteIterator
    Collection <|-- ConcreteCollection
    ConcreteIterator --> ConcreteCollection
    ConcreteCollection --> Iterator: creates
    
    note for Iterator "Sequential access without\nexposing structure"
```

## Description
- **Iterator**: Interface ที่ define iteration methods
- **ConcreteIterator**: Implement iterator interface
- **Collection**: Interface ที่ define createIterator method
- **ConcreteCollection**: Implement collection interface
- Client iterate ผ่าน collection โดยไม่รู้ underlying structure

# Proxy Pattern - Class Diagram

```mermaid
classDiagram
    class Subject {
        +abstract request() string
    }
    
    class Proxy {
        -realSubject: RealSubject | null
        +request() string
    }
    
    class RealSubject {
        +request() string
    }
    
    Subject <|-- Proxy
    Subject <|-- RealSubject
    Proxy --> RealSubject: lazy creates
    
    note for Proxy "Controls access to RealSubject\nLazy initialization on first use"
```

## Description
- **Subject**: Interface ที่ define common operations
- **RealSubject**: Actual object ที่ต้องการ protect หรือ lazy load
- **Proxy**: Class ที่ implement subject interface และ control access
- Proxy อาจ lazy initialize RealSubject หรือ add access control

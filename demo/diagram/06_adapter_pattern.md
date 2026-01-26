# Adapter Pattern - Class Diagram

```mermaid
classDiagram
    class Target {
        +abstract request() string
    }
    
    class Adapter {
        -adaptee: Adaptee
        +request() string
    }
    
    class Adaptee {
        +specificRequest() string
    }
    
    Target <|-- Adapter
    Adapter --> Adaptee: wraps
    
    note for Adapter "Translates Target interface\nto Adaptee interface"
```

## Description
- **Target**: Interface ที่ client ต้องการใช้
- **Adaptee**: Class ที่มี incompatible interface
- **Adapter**: Class ที่ implement Target interface และ wrap Adaptee
- ทำให้ Adaptee สามารถทำงานกับ client ที่คาดหวัง Target interface

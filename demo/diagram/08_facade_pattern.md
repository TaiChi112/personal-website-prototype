# Facade Pattern - Class Diagram

```mermaid
classDiagram
    class Facade {
        -subsystemA: SubsystemA
        -subsystemB: SubsystemB
        -subsystemC: SubsystemC
        +simpleOperation() string
    }
    
    class SubsystemA {
        +operationA() string
    }
    
    class SubsystemB {
        +operationB() string
    }
    
    class SubsystemC {
        +operationC() string
    }
    
    Facade --> SubsystemA
    Facade --> SubsystemB
    Facade --> SubsystemC
    
    note for Facade "Provides simplified interface\nfor complex subsystem"
```

## Description
- **Facade**: Class ที่ provide simplified interface
- **Subsystem Classes**: Complex classes ที่อยู่เบื้องหลัง facade
- Facade รวม multiple subsystems เข้ามา และ provide simple operations
- Client ใช้ Facade แทนที่จะเข้าถึง subsystems โดยตรง

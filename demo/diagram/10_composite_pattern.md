# Composite Pattern - Class Diagram

```mermaid
classDiagram
    class Component {
        +abstract getName() string
        +abstract display() string
    }
    
    class Leaf {
        -name: string
        +getName() string
        +display() string
    }
    
    class Composite {
        -name: string
        -children: Component[]
        +getName() string
        +add(component: Component) void
        +remove(component: Component) void
        +display() string
    }
    
    Component <|-- Leaf
    Component <|-- Composite
    Composite --> Component: contains
    
    note for Composite "Can contain Leaf or Composite objects\nRecursive tree structure"
```

## Description
- **Component**: Interface สำหรับ leaf และ composite objects
- **Leaf**: Objects ที่ไม่มี children
- **Composite**: Objects ที่มี children และสามารถ contain leaf/composite อื่น
- Client ใช้ component interface เหมือนกันสำหรับ leaf และ composite

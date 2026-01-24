# 🎯 Design Patterns Learning Plan

## จุดประสงค์
เขียน TypeScript (.ts) เพื่อทำความเข้าใจ Design Patterns แต่ละ pattern โดย reference จากการประยุกต์ใช้จริงใน `app/page.tsx` (ซึ่งเป็น .tsx)

## หลักการจัดลำดับ
- **Patterns ที่ไม่ depend อะไร** → เขียนก่อน
- **Patterns ที่ใช้ patterns ก่อนหน้า** → เขียนทีหลัง เพื่อ reuse code ไม่ให้ซ้ำซ้อน
- **Group ตาม functional dependencies** → เริ่มจาก foundation → data structures → behaviors → integration

---

## 📋 PATTERN WRITING SEQUENCE

### **PHASE 1: FOUNDATION** (ไม่ depend อะไร)

#### 1. `01_singleton_notifications.ts`
**หน้าที่ใน page.tsx:** Notification system ที่ใช้ทั่วทั้ง app  
**Use case:** `notify.notify("message", "SUCCESS")` - แจ้งเตือน Toast/Console/Alert  
**เรียนรู้:** Static instance, Private constructor, getInstance()

#### 2. `03_factory_method_localization.ts`
**หน้าที่ใน page.tsx:** สร้าง Localization (EN/TH) ตาม config  
**Use case:** `LocalizationFactory.create('th')` → UILabels ภาษาไทย  
**เรียนรู้:** Interface + Implementation, Factory pattern structure

#### 3. `04_abstract_factory_styles.ts`
**หน้าที่ใน page.tsx:** สร้าง Theme styles (Modern/Minimal/Future/Academic)  
**Use case:** `StyleFactory` → button/card/badge styles  
**เรียนรู้:** Family of related objects, Abstract factory pattern

#### 4. `16_iterator_sequential_access.ts`
**หน้าที่ใน page.tsx:** Tour guide iterator - navigate sections  
**Use case:** `tourIterator.next()` → ไป section ถัดไป  
**เรียนรู้:** Sequential access, Iterator interface

---

### **PHASE 2: DATA STRUCTURES** (ใช้ Phase 1)

#### 5. `05_builder_content_tree.ts`
**หน้าที่ใน page.tsx:** สร้าง content tree structure  
**Use case:** `ContentBuilder` → build hierarchical projects/blogs tree  
**เรียนรู้:** Fluent API, Step-by-step construction, Method chaining

#### 6. `07_adapter_ui_components.ts`
**หน้าที่ใน page.tsx:** แปลง Project/Blog/Video/Article/Doc/Podcast → UnifiedContentItem  
**Use case:** `adaptProjectToUnified()` → unified interface  
**เรียนรู้:** Data transformation, Interface adaptation

#### 7. `06_prototype_project_templates.ts`
**หน้าที่ใน page.tsx:** Clone project templates  
**Use case:** Admin "Clone Template" → duplicate project  
**เรียนรู้:** Object cloning, Prototype registry  
**Depends on:** 05 (ใช้ UnifiedContentItem)

---

### **PHASE 3: TREE & HIERARCHY** (ใช้ Phase 2)

#### 8. `09_composite_navigation_tree.ts`
**หน้าที่ใน page.tsx:** Navigation menu tree (NavGroup + NavItem)  
**Use case:** Projects > [Sub-project 1, Sub-project 2] - hierarchical menu  
**เรียนรู้:** Tree structure, Leaf vs Composite, Recursive rendering  
**Depends on:** 07 (Adapter concepts)

#### 9. `13_flyweight_object_sharing.ts`
**หน้าที่ใน page.tsx:** Share common properties for cards/badges - memory optimization  
**Use case:** `CardFlyweight`, `BadgeFlyweight` → reuse styles  
**เรียนรู้:** Memory efficiency, Intrinsic vs Extrinsic state  
**Depends on:** 09 (Composite concepts)

---

### **PHASE 4: BEHAVIOR CONTROL** (ใช้ Phase 1-3)

#### 10. `17_observer_one_to_many.ts`
**หน้าที่ใน page.tsx:** Theme/Language change → notify all components  
**Use case:** `ThemeSubject.notify()` → all observers update  
**เรียนรู้:** Subscribe/Notify, Event-driven, Reactive updates  
**Depends on:** 01 (Singleton)

#### 11. `15_command_encapsulate_requests.ts`
**หน้าที่ใน page.tsx:** Undo/Redo system, Command palette  
**Use case:** `SetTextCommand`, `SetFontSizeCommand` → execute/undo  
**เรียนรู้:** Command pattern, Encapsulation, Undo/Redo  
**Depends on:** 01 (Singleton for history)

#### 12. `02_singleton_command_history.ts`
**หน้าที่ใน page.tsx:** Command history management  
**Use case:** `CommandHistory.getInstance()` → undo/redo stack  
**เรียนรู้:** History tracking, Stack operations  
**Depends on:** 15 (Command pattern)

#### 13. `14_chain_of_responsibility.ts`
**หน้าที่ใน page.tsx:** Filter chain (Simple → Medium → Complex → Critical)  
**Use case:** Support ticket routing based on severity  
**เรียนรู้:** Chain of handlers, Request passing

---

### **PHASE 5: UI ENHANCEMENT** (ใช้ Phase 1-4)

#### 14. `10_decorator_feature_enhancement.ts`
**หน้าที่ใน page.tsx:** Add features to components (Tooltip, Loading, ErrorBoundary)  
**Use case:** `WithTooltip`, `WithLoading` → wrap components  
**เรียนรู้:** Dynamic behavior addition, Wrapper pattern  
**Depends on:** 07 (Adapter), 09 (Composite)

#### 15. `12_proxy_controlled_access.ts`
**หน้าที่ใน page.tsx:** Control access to locked content  
**Use case:** `AccessControlProxy` → guard premium content  
**เรียนรู้:** Access control, Lazy loading, Caching  
**Depends on:** 07 (Adapter)

#### 16. `08_bridge_theme_renderer.ts`
**หน้าที่ใน page.tsx:** Separate Theme from Renderer  
**Use case:** Theme (Modern/Minimal) + Renderer (DOM/Canvas) → independent variation  
**เรียนรู้:** Abstraction vs Implementation, Decoupling  
**Depends on:** 04 (Abstract Factory)

---

### **PHASE 6: INTEGRATION & FACADE** (ใช้ Phase 1-5)

#### 17. `11_facade_simplified_api.ts`
**หน้าที่ใน page.tsx:** Unified API for app initialization  
**Use case:** `AppSystemFacade.initializeSystem()` → init theme, analytics, auth, notification  
**เรียนรู้:** Simplified interface, Subsystem coordination  
**Depends on:** 01, 03, 04, 07, 17 (รวมหลาย patterns)

---

### **PHASE 7: ADVANCED BEHAVIORAL** (ใช้ Phase 1-6)

#### 18. `18_strategy_encapsulate_algorithms.ts`
**หน้าที่ใน page.tsx:** Sort/Payment/Export strategies - swap algorithms at runtime  
**Use case:** `SortStrategy` (by date/name/popularity), `PaymentStrategy`, `ExportStrategy`  
**เรียนรู้:** Algorithm swapping, Avoiding if-else chains  
**Depends on:** 07 (Adapter)

#### 19. `19_state_state_based_behavior.ts`
**หน้าที่ใน page.tsx:** Document workflow, Audio player states  
**Use case:** Document (Draft → Review → Published), Podcast (Stopped → Playing → Paused)  
**เรียนรู้:** State machines, State transitions  
**Depends on:** 01 (Singleton)

#### 20. `21_mediator_centralized_communication.ts`
**หน้าที่ใน page.tsx:** Contact form coordination (InputField ↔ Validator ↔ SubmitButton)  
**Use case:** `ContactFormMediator` → centralized communication  
**เรียนรู้:** Decouple components, Centralized control  
**Depends on:** 17 (Observer concepts)

#### 21. `22_memento_capture_restore.ts`
**หน้าที่ใน page.tsx:** Save/Restore feed view state (layout, search, filter, sort)  
**Use case:** `FeedStateMemento` → snapshot current view  
**เรียนรู้:** State capture, Restore previous state  
**Depends on:** 02 (Command History)

---

### **PHASE 8: SPECIALIZED** (ใช้ Phase 1-7)

#### 22. `20_template_method_algorithm.ts`
**หน้าที่ใน page.tsx:** Resume export algorithm (CSV/JSON/XML)  
**Use case:** `DataExportTemplate` → define export steps, subclasses implement format  
**เรียนรู้:** Algorithm skeleton, Hook methods  
**Depends on:** 18 (Strategy concepts)

#### 23. `23_interpreter_grammar.ts`
**หน้าที่ใน page.tsx:** Parse expressions (Number, Variable, Add, Subtract)  
**Use case:** Expression parsing and evaluation  
**เรียนรู้:** Grammar rules, AST (Abstract Syntax Tree)  
**Depends on:** 09 (Composite - tree structure)

#### 24. `24_visitor_operations.ts`
**หน้าที่ใน page.tsx:** Visit components for rendering/validation/export  
**Use case:** `ComponentVisitor` → traverse tree and apply operations  
**เรียนรู้:** Double dispatch, Separation of concerns  
**Depends on:** 09 (Composite)

---

## 📊 Summary Table

| Phase | Patterns | Key Focus |
|-------|----------|-----------|
| 1 | 01, 03, 04, 16 | Foundation - ไม่ depend อะไร |
| 2 | 05, 07, 06 | Data Structures - build & adapt |
| 3 | 09, 13 | Tree & Hierarchy - composite structures |
| 4 | 17, 15, 02, 14 | Behavior Control - events & commands |
| 5 | 10, 12, 08 | UI Enhancement - decorators & proxies |
| 6 | 11 | Integration - facade combining patterns |
| 7 | 18, 19, 21, 22 | Advanced Behavioral - strategies & states |
| 8 | 20, 23, 24 | Specialized - algorithms & visitors |

---

## 🚀 Next Steps

1. เริ่มจาก Phase 1 → เขียน `01_singleton_notifications.ts` ก่อน
2. ทดสอบด้วย `demoPattern()` function
3. ไปต่อ Phase 2 เมื่อเข้าใจ Phase 1 แล้ว
4. Patterns หลังจะ import และ reuse patterns ก่อนหน้า → ไม่ต้องเขียนซ้ำ

---

## 💡 Tips

- **อ่าน Problem/Solution ใน pattern file** ก่อนเขียน
- **ดู demo function** เพื่อเห็นตัวอย่างการใช้งาน
- **Search คำว่า pattern name ใน page.tsx** เพื่อเห็น real-world usage
- **เขียนทีละ pattern** - อย่าเร่งรีบ
- **Refactor เมื่อเข้าใจมากขึ้น** - เพิ่ม feature, type safety, error handling

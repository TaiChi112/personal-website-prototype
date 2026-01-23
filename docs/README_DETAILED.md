# Design Pattern Documentation for page.tsx

> **เอกสารนี้อธิบายการใช้งาน Design Patterns ทั้ง 23 แบบใน `app/page.tsx`**  
> มีตัวอย่างโค้ด พร้อมบรรทัดอ้างอิง เพื่อให้เข้าใจการประยุกต์ใช้จริง

---

## 📋 Table of Contents
- [Big Picture](#big-picture)
- [Creational Patterns](#creational-patterns)
- [Structural Patterns](#structural-patterns)
- [Behavioral Patterns](#behavioral-patterns)
- [Architecture Flow](#architecture-flow)
- [Quick Tips](#quick-tips)

---

## Big Picture

**Personal Website** เป็น React App ที่รวมเนื้อหาหลายประเภท (Projects, Blogs, Articles, Docs, Videos, Podcasts) เข้าด้วยกัน โดยใช้ Design Patterns เพื่อ:
- **Normalize data** จาก sources ต่างๆ ให้เป็นรูปแบบเดียวกัน (Adapter)
- **Build tree structures** สำหรับ hierarchical content (Builder + Composite)
- **Support multiple themes/languages** โดยไม่เปลี่ยนโครงสร้างโค้ด (Abstract Factory)
- **Manage complex interactions** แบบ loosely coupled (Observer, Mediator, Command, State)

---

## Creational Patterns

### 1. Singleton Pattern
**Purpose:** ให้มี instance เดียวตลอด application lifecycle

**Location:** Lines 360-380 (approx)

**Implementation:**
```typescript
// NotificationService - Single notification manager
class NotificationService {
  private static instance: NotificationService;
  private constructor() { this.channel = new ToastChannel(); }
  
  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }
}

const notify = NotificationService.getInstance();
```

**Other Singletons:**
- `ToastEventEmitter` (lines ~545-560)
- `CommandHistory` (lines ~730-740)

**Usage:** ทุกครั้งที่เรียก `notify.notify()` จะใช้ instance เดียวกัน

---

### 2. Factory Method Pattern
**Purpose:** ให้ subclass decide ว่าจะสร้าง object ชนิดไหน

**Location:** Lines 205-245 (Localization/Style/Typography Factories)

**Implementation:**
```typescript
// Localization Factory Interface
interface LocalizationFactory {
  code: string;
  getLabels(): UILabels;
}

// Concrete Factories
const EnglishLocalization: LocalizationFactory = {
  code: 'EN',
  getLabels: () => ({ /* English labels */ })
};

const ThaiLocalization: LocalizationFactory = {
  code: 'TH', 
  getLabels: () => ({ /* Thai labels */ })
};
```

**Usage:**
```typescript
const currentLang = LOCALES[langKey]; // Select factory
const labels = currentLang.getLabels(); // Get labels
```

---

### 3. Abstract Factory Pattern
**Purpose:** สร้าง families of related objects

**Location:** Lines 245-335 (StyleFactory implementations)

**Implementation:**
```typescript
interface StyleFactory {
  name: string;
  getMainLayoutClass(): string;
  getCardClass(): string;
  getButtonClass(variant?: string): string;
  // ... more methods
}

// Concrete Factory: Modern Style
const ModernStyle: StyleFactory = {
  name: 'Modern',
  getMainLayoutClass: () => "bg-gray-50 dark:bg-gray-900...",
  getCardClass: () => "bg-white rounded-xl shadow-xl...",
  getButtonClass: (variant) => { /* variant logic */ }
};

// Other factories: MinimalStyle, FutureStyle, AcademicStyle
```

**Usage:**
```typescript
const currentStyle = STYLES[styleKey];
<button className={currentStyle.getButtonClass('primary')}>...</button>
```

---

### 4. Builder Pattern
**Purpose:** สร้าง complex objects ทีละ step

**Location:** Lines 130-165 (ContentBuilder)

**Implementation:**
```typescript
class ContentBuilder {
  private root: CompositeNode;
  private currentContainer: CompositeNode;
  private stack: CompositeNode[] = [];

  constructor(id: string, layoutStyle: LayoutStyleType) { /* ... */ }
  
  addContainer(id: string, layoutStyle: LayoutStyleType): ContentBuilder {
    const newContainer: CompositeNode = { /* ... */ };
    this.currentContainer.children.push(newContainer);
    this.stack.push(this.currentContainer);
    this.currentContainer = newContainer;
    return this; // Method chaining
  }

  addItem(item: UnifiedContentItem): ContentBuilder {
    const leaf: LeafNode = { /* ... */ };
    this.currentContainer.children.push(leaf);
    return this;
  }

  up(): ContentBuilder { /* ... */ return this; }
  build(): CompositeNode { return this.root; }
}
```

**Usage:**
```typescript
const PROJECTS_TREE = new ContentBuilder('proj-root', 'column', 'Projects')
  .addContainer('super-app', 'grid', 'E-Commerce')
    .addItem(project1)
    .addItem(project2)
    .up()
  .addContainer('ai-chat', 'list', 'AI System')
    .addItem(project3)
  .build();
```

---

### 5. Prototype Pattern
**Purpose:** Clone objects แทนการสร้างใหม่

**Location:** Lines 365-385 (ProjectTemplate)

**Implementation:**
```typescript
class ProjectTemplate implements Prototype<UnifiedContentItem> {
  constructor(private readonly data: UnifiedContentItem) {}

  clone(): UnifiedContentItem {
    const cloned = JSON.parse(JSON.stringify(this.data));
    cloned.id = `proj-copy-${Date.now()}`;
    cloned.title = `${this.data.title} (Clone)`;
    cloned.date = new Date().toISOString().split('T')[0];
    cloned.decorations = ['new'];
    return cloned;
  }
}

class ProjectTemplateRegistry {
  private templates: Map<string, ProjectTemplate> = new Map();
  register(key: string, item: UnifiedContentItem) { /* ... */ }
  get(key: string): ProjectTemplate | undefined { /* ... */ }
}
```

**Usage in DashboardSection (lines ~1395-1430):**
```typescript
const template = templateRegistry.get('E-Commerce App');
if (template) {
  const clonedItem = template.clone();
  // Customize and add to tree
  onCloneProject(clonedItem);
}
```

---

## Structural Patterns

### 6. Adapter Pattern
**Purpose:** แปลง interface ให้ compatible

**Location:** Lines 85-95 (Adapter functions)

**Implementation:**
```typescript
// Convert different data types to unified format
const adaptProjectToUnified = (p: Project): UnifiedContentItem => ({
  id: `proj-${p.id}`,
  type: 'project',
  title: p.title,
  description: p.description,
  date: p.date,
  meta: p.techStack,
  decorations: p.featured ? ['featured'] : []
});

const adaptBlogToUnified = (b: Blog): UnifiedContentItem => ({ /* ... */ });
const adaptVideoToUnified = (v: ExternalVideoData): UnifiedContentItem => ({ /* ... */ });
```

**Usage:**
```typescript
const allItems = [
  ...MOCK_PROJECTS.map(adaptProjectToUnified),
  ...MOCK_BLOGS.map(adaptBlogToUnified),
  ...MOCK_VIDEOS.map(adaptVideoToUnified)
];
```

---

### 7. Composite Pattern
**Purpose:** สร้าง tree structures

**Location:** Lines 100-165 (LayoutNode types + ContentBuilder)

**Implementation:**
```typescript
interface LayoutNode { id: string; type: ComponentType; }

// Leaf (single item)
interface LeafNode extends LayoutNode {
  type: 'item';
  data: UnifiedContentItem;
}

// Composite (container with children)
interface CompositeNode extends LayoutNode {
  type: 'container';
  layoutStyle: LayoutStyleType;
  children: Array<LayoutNode>;
  title?: string;
}
```

**Rendering (lines ~1085-1175):**
```typescript
const InteractiveContentNode = ({ node, ... }) => {
  // Recursively render tree
  if (node.type === 'item') {
    return <Card data={node.data} />;
  } else {
    return (
      <>
        <Header />
        {node.children.map(child => 
          <InteractiveContentNode node={child} />
        )}
      </>
    );
  }
};
```

---

### 8. Decorator Pattern
**Purpose:** เพิ่มความสามารถโดยไม่แก้ไข original object

**Location:** Lines 690-720 (ContentDecorator)

**Implementation:**
```typescript
const ContentDecorator = ({ 
  children, 
  decorations, 
  style 
}: { 
  children: React.ReactNode, 
  decorations?: DecorationType[] 
}) => {
  if (!decorations || decorations.length === 0) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {children}
      <div className="absolute -top-2 -right-1 flex gap-1">
        {decorations.map(d => (
          <Badge key={d} type={d}>
            {getIcon(d)} {d}
          </Badge>
        ))}
      </div>
    </div>
  );
};
```

**Usage:**
```typescript
<ContentDecorator decorations={['new', 'featured']}>
  <Card {...props} />
</ContentDecorator>
```

---

### 9. Facade Pattern
**Purpose:** ให้ simplified interface สำหรับ complex subsystems

**Location:** Lines 650-670 (AppSystemFacade)

**Implementation:**
```typescript
class AppSystemFacade {
  static initializeSystem(callbacks: {
    setDark: (val: boolean) => void;
    setStyle: (val: string) => void;
    // ... more setters
  }) {
    notify.setChannel(new ToastChannel());
    notify.notify("Initializing System...", "INFO");
    
    AnalyticsSystem.init();
    AnalyticsSystem.trackEvent("App Launched");
    
    const themePrefs = ThemeManager.getInitialPreference();
    callbacks.setDark(themePrefs.dark);
    callbacks.setStyle(themePrefs.style);
    
    const isAdmin = AuthManager.checkSession();
    callbacks.setAdmin(isAdmin);
    
    setTimeout(() => notify.notify("System Ready", "SUCCESS"), 800);
  }
}
```

**Usage (in main component):**
```typescript
useEffect(() => {
  AppSystemFacade.initializeSystem({
    setDark, setStyle, setFont, setAdmin, setLang
  });
}, []);
```

---

### 10. Proxy Pattern
**Purpose:** Control access ไปยัง object

**Location:** Lines 730-750 (AccessControlProxy)

**Implementation:**
```typescript
const AccessControlProxy = ({ 
  isLocked, 
  children, 
  style, 
  labels 
}: { 
  isLocked?: boolean, 
  children: React.ReactNode 
}) => {
  const { isAdmin } = useContext(UserContext);
  
  // Bypass proxy if admin or not locked
  if (!isLocked || isAdmin) {
    return <>{children}</>;
  }

  // Show locked overlay
  return (
    <div className="relative">
      <div className="blur-sm opacity-20">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Lock /> Premium Content
        <button onClick={requestAccess}>Unlock</button>
      </div>
    </div>
  );
};
```

---

### 11. Bridge Pattern
**Purpose:** แยก abstraction ออกจาก implementation

**Location:** Lines 520-630 (Notification System)

**Implementation:**
```typescript
// Implementation Interface
interface INotificationChannel {
  send(message: string, type: EventType): void;
}

// Concrete Implementations
class ToastChannel implements INotificationChannel {
  send(message: string, type: EventType): void {
    ToastEventEmitter.getInstance().emit(message, type);
  }
}

class ConsoleChannel implements INotificationChannel {
  send(message: string, type: EventType): void {
    console.log(`[${type}] ${message}`);
  }
}

class AlertChannel implements INotificationChannel {
  send(message: string, type: EventType): void {
    alert(`[${type}] ${message}`);
  }
}

// Abstraction
class NotificationService {
  private channel: INotificationChannel;
  
  setChannel(channel: INotificationChannel) {
    this.channel = channel;
  }
  
  notify(message: string, type: EventType) {
    this.channel.send(message, type);
  }
}
```

**Usage (lines ~1235-1245):**
```typescript
// Switch channel at runtime
const toggleChannel = () => {
  if (channelName === 'Toast') notify.setChannel(new ToastChannel());
  else if (channelName === 'Console') notify.setChannel(new ConsoleChannel());
  else notify.setChannel(new AlertChannel());
};
```

---

### 12. Flyweight Pattern
**Purpose:** Share objects เพื่อประหยัด memory

**Location:** Lines 575-650 (Particle System)

**Implementation:**
```typescript
// Flyweight Interface
interface ParticleFlyweight {
  draw(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void;
}

// Concrete Flyweight (shared)
class IconParticleFlyweight implements ParticleFlyweight {
  constructor(
    private symbol: string,  // Intrinsic state
    private color: string,
    private font: string
  ) {}
  
  draw(ctx, x, y, size) { // x, y, size = Extrinsic state
    ctx.font = `${size}px ${this.font}`;
    ctx.fillStyle = this.color;
    ctx.fillText(this.symbol, x, y);
  }
}

// Factory manages flyweights
class ParticleFactory {
  private flyweights: Map<string, ParticleFlyweight> = new Map();
  
  getFlyweight(key: string, symbol: string, color: string): ParticleFlyweight {
    if (!this.flyweights.has(key)) {
      this.flyweights.set(key, new IconParticleFlyweight(symbol, color, 'monospace'));
    }
    return this.flyweights.get(key)!;
  }
}

// Context holds extrinsic state
class ParticleContext {
  x: number; y: number; vx: number; vy: number; // Extrinsic
  flyweight: ParticleFlyweight; // Reference to shared flyweight
  
  draw(ctx) {
    this.flyweight.draw(ctx, this.x, this.y, this.size);
  }
}
```

---

## Behavioral Patterns

### 13. Strategy Pattern
**Purpose:** Define family of algorithms

**Location:** Lines 935-950 (Sorting strategies)

**Implementation:**
```typescript
interface ISortStrategy {
  label: string;
  sort(items: UnifiedContentItem[]): UnifiedContentItem[];
}

class DateSortStrategy implements ISortStrategy {
  label = 'Date (Newest)';
  sort(items) {
    return [...items].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }
}

class TitleSortStrategy implements ISortStrategy {
  label = 'Title (A-Z)';
  sort(items) {
    return [...items].sort((a, b) => a.title.localeCompare(b.title));
  }
}

const SORT_STRATEGIES = [
  new DateSortStrategy(), 
  new TitleSortStrategy(),
  new LengthSortStrategy()
];
```

**Usage (in UnifiedFeedSection):**
```typescript
const [currentSortStrategy, setCurrentSortStrategy] = useState(SORT_STRATEGIES[0]);
const sortedItems = currentSortStrategy.sort(filteredItems);
```

---

### 14. Chain of Responsibility Pattern
**Purpose:** ส่ง request ผ่าน chain ของ handlers

**Location:** Lines 955-990 (Filter chain)

**Implementation:**
```typescript
abstract class FilterHandler {
  protected next: FilterHandler | null = null;
  
  setNext(handler: FilterHandler): FilterHandler {
    this.next = handler;
    return handler;
  }
  
  handle(item: UnifiedContentItem, request: FilterRequest): boolean {
    if (this.next) {
      return this.next.handle(item, request);
    }
    return true; // End of chain
  }
}

class SearchFilter extends FilterHandler {
  handle(item, request) {
    if (request.query) {
      const matches = item.title.toLowerCase().includes(request.query.toLowerCase());
      if (!matches) return false;
    }
    return super.handle(item, request);
  }
}

class TypeFilter extends FilterHandler {
  handle(item, request) {
    if (request.typeFilter !== 'all' && item.type !== request.typeFilter) {
      return false;
    }
    return super.handle(item, request);
  }
}
```

**Usage:**
```typescript
const searchFilter = new SearchFilter();
const typeFilter = new TypeFilter();
const tagFilter = new TagFilter();

// Build chain
typeFilter.setNext(searchFilter).setNext(tagFilter);

// Filter items through chain
const filteredItems = allItems.filter(item => {
  const request = { query: searchQuery, typeFilter, tags: [] };
  return typeFilter.handle(item, request);
});
```

---

### 15. Observer Pattern
**Purpose:** Notify multiple observers เมื่อ state เปลี่ยน

**Location:** Lines 545-575 (ToastEventEmitter + ToastContainer)

**Implementation:**
```typescript
type Observer = (event: NotificationEvent) => void;

class ToastEventEmitter {
  private observers: Observer[] = [];
  private static instance: ToastEventEmitter;
  
  static getInstance(): ToastEventEmitter { /* ... */ }
  
  subscribe(observer: Observer): () => void {
    this.observers.push(observer);
    return () => {
      this.observers = this.observers.filter(obs => obs !== observer);
    };
  }
  
  emit(message: string, type: EventType) {
    const event: NotificationEvent = { message, type, id: ++counter };
    this.observers.forEach(obs => obs(event));
  }
}

// Observer (ToastContainer)
const ToastContainer = ({ style }) => {
  const [toasts, setToasts] = useState<NotificationEvent[]>([]);
  
  useEffect(() => {
    const unsubscribe = ToastEventEmitter.getInstance().subscribe((event) => {
      setToasts(prev => [...prev, event]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== event.id));
      }, 3000);
    });
    return unsubscribe;
  }, []);
  
  return <>...</>;
};
```

---

### 16. Command Pattern
**Purpose:** Encapsulate requests as objects

**Location:** Lines 860-935 (ICommand implementations)

**Implementation:**
```typescript
interface ICommand {
  id: string;
  label: string;
  execute(): void;
  undo(): void;
  matches(query: string): boolean;
}

class NavigateCommand implements ICommand {
  private previousTab: string;
  
  constructor(
    public id: string,
    public label: string,
    private targetTab: string,
    private setTab: (t: string) => void,
    private getCurrentTab: () => string
  ) {}
  
  execute(): void {
    this.previousTab = this.getCurrentTab();
    this.setTab(this.targetTab);
    historyManager.push(this);
    notify.notify(`Navigated to ${this.label}`, 'INFO');
  }
  
  undo(): void {
    this.setTab(this.previousTab);
    notify.notify('Undo: Returned to previous tab', 'WARNING');
  }
  
  matches(query: string): boolean {
    return this.label.toLowerCase().includes(query.toLowerCase());
  }
}

// History Manager
class CommandHistory {
  private history: ICommand[] = [];
  push(command: ICommand) { this.history.push(command); }
  pop(): ICommand | undefined { return this.history.pop(); }
}
```

**Usage (Command Palette):**
```typescript
const commands: ICommand[] = [
  new NavigateCommand('nav-home', 'Go to Home', 'home', setActiveTab, getCurrentTab),
  new ToggleThemeCommand(() => setIsDark(prev => !prev)),
  new StartTourCommand(() => setIsTourActive(true))
];

// Execute + Undo
const handleUndo = () => {
  const lastCommand = historyManager.pop();
  if (lastCommand) lastCommand.undo();
};
```

---

### 17. Iterator Pattern
**Purpose:** Iterate ผ่าน collection โดยไม่เปิดเผย structure

**Location:** Lines 805-825 (TourIterator)

**Implementation:**
```typescript
interface IIterator<T> {
  next(): T | null;
  prev(): T | null;
  hasNext(): boolean;
  hasPrev(): boolean;
  current(): T;
  reset(): void;
}

class TourIterator implements IIterator<TourStep> {
  private position = 0;
  
  constructor(private steps: TourStep[]) {}
  
  next(): TourStep | null {
    if (this.hasNext()) {
      this.position++;
      return this.steps[this.position];
    }
    return null;
  }
  
  prev(): TourStep | null {
    if (this.hasPrev()) {
      this.position--;
      return this.steps[this.position];
    }
    return null;
  }
  
  hasNext(): boolean {
    return this.position < this.steps.length - 1;
  }
  
  current(): TourStep {
    return this.steps[this.position];
  }
  
  reset(): void {
    this.position = 0;
  }
}
```

**Usage (TourControls):**
```typescript
const [tourIterator] = useState(() => new TourIterator(TOUR_SEQUENCE));

const handleNext = () => {
  const nextStep = tourIterator.next();
  if (nextStep) onExecuteStep(nextStep);
};

const handlePrev = () => {
  const prevStep = tourIterator.prev();
  if (prevStep) onExecuteStep(prevStep);
};
```

---

### 18. Memento Pattern
**Purpose:** Save/restore object state

**Location:** Lines 400-415 (FeedStateMemento)

**Implementation:**
```typescript
interface FeedViewState {
  layout: LayoutType;
  searchQuery: string;
  filterType: string;
  sortLabel: string;
}

// Memento - เก็บ state
class FeedStateMemento {
  constructor(private readonly state: FeedViewState) {}
  getState(): FeedViewState { return this.state; }
}

// Caretaker - จัดการ mementos
class FeedStateCaretaker {
  private snapshots: Map<string, FeedStateMemento> = new Map();
  
  saveSnapshot(name: string, memento: FeedStateMemento) {
    this.snapshots.set(name, memento);
    notify.notify(`Snapshot "${name}" saved!`, 'SUCCESS');
  }
  
  getSnapshot(name: string): FeedStateMemento | undefined {
    return this.snapshots.get(name);
  }
}
```

**Usage (UnifiedFeedSection lines ~1270-1290):**
```typescript
const saveSnapshot = () => {
  const memento = new FeedStateMemento({
    layout, searchQuery, filterType, sortLabel: currentSortStrategy.label
  });
  feedCaretaker.saveSnapshot(snapshotName, memento);
};

const loadSnapshot = (name: string) => {
  const memento = feedCaretaker.getSnapshot(name);
  if (memento) {
    const state = memento.getState();
    setLayout(state.layout);
    setSearchQuery(state.searchQuery);
    // ... restore all state
  }
};
```

---

### 19. State Pattern
**Purpose:** เปลี่ยน behavior ตาม state

**Location:** Lines 420-480 (AudioPlayerContext)

**Implementation:**
```typescript
interface IAudioPlayerState {
  name: string;
  play(): void;
  pause(): void;
  stop(): void;
}

class AudioPlayerContext {
  private state: IAudioPlayerState;
  private currentTrack: PodcastEpisode | null = null;
  
  constructor(uiCallback) {
    this.state = new StoppedState(this);
  }
  
  changeState(state: IAudioPlayerState) {
    this.state = state;
    this.uiCallback(state.name, this.currentTrack);
  }
  
  play() { this.state.play(); }
  pause() { this.state.pause(); }
  stop() { this.state.stop(); }
}

// States
class StoppedState implements IAudioPlayerState {
  name = 'STOPPED';
  play() {
    notify.notify('Starting Podcast...', 'INFO');
    this.player.changeState(new PlayingState(this.player));
  }
  pause() {} // Do nothing
  stop() {}
}

class PlayingState implements IAudioPlayerState {
  name = 'PLAYING';
  play() {} // Already playing
  pause() {
    this.player.changeState(new PausedState(this.player));
    notify.notify('Podcast Paused', 'INFO');
  }
  stop() {
    this.player.changeState(new StoppedState(this.player));
  }
}

class PausedState implements IAudioPlayerState {
  name = 'PAUSED';
  play() {
    this.player.changeState(new PlayingState(this.player));
    notify.notify('Podcast Resumed', 'SUCCESS');
  }
  pause() {}
  stop() {
    this.player.changeState(new StoppedState(this.player));
  }
}
```

**Usage (PodcastSection):**
```typescript
const playerContext = useMemo(() => 
  new AudioPlayerContext((stateName, track) => {
    setPlayerStateName(stateName);
    setCurrentTrack(track);
  }), 
[]);

// User clicks play/pause
<button onClick={() => playerContext.play()}>Play</button>
<button onClick={() => playerContext.pause()}>Pause</button>
```

---

### 20. Mediator Pattern
**Purpose:** Reduce coupling ระหว่าง components

**Location:** Lines 485-565 (ContactFormMediator)

**Implementation:**
```typescript
interface IMediator {
  notify(sender: object, event: string): void;
}

class BaseComponent {
  protected mediator: IMediator;
  setMediator(mediator: IMediator) { this.mediator = mediator; }
}

// Colleagues
class ContactInput extends BaseComponent {
  constructor(public value: string, public name: string) { super(); }
  
  setValue(val: string) {
    this.value = val;
    this.mediator.notify(this, 'change');
  }
}

class ContactButton extends BaseComponent {
  public disabled: boolean = true;
  
  click() {
    if (!this.disabled) {
      this.mediator.notify(this, 'click');
    }
  }
}

// Mediator
class ContactFormMediator implements IMediator {
  public email: ContactInput;
  public message: ContactInput;
  public submitButton: ContactButton;
  
  constructor(uiUpdater) {
    this.email = new ContactInput('', 'email');
    this.email.setMediator(this);
    this.message = new ContactInput('', 'message');
    this.message.setMediator(this);
    this.submitButton = new ContactButton();
    this.submitButton.setMediator(this);
  }
  
  notify(sender: object, event: string): void {
    if (event === 'change') {
      const isEmailValid = this.email.value.includes('@');
      const isMessageValid = this.message.value.length >= 10;
      this.submitButton.setDisabled(!(isEmailValid && isMessageValid));
      this.syncState();
    }
    
    if (event === 'click') {
      notify.notify("Sending Message...", "INFO");
      // Submit logic...
    }
  }
}
```

**Usage (ContactSection):**
```typescript
const mediator = useMemo(() => 
  new ContactFormMediator(setFormState), 
[]);

<input onChange={(e) => mediator.email.setValue(e.target.value)} />
<textarea onChange={(e) => mediator.message.setValue(e.target.value)} />
<button onClick={() => mediator.submitButton.click()}>Submit</button>
```

---

### 21. Template Method Pattern
**Purpose:** Define algorithm skeleton in base class

**Location:** Lines 390-430 (ContentExporter)

**Implementation:**
```typescript
abstract class ContentExporter {
  // Template method
  public export(data: unknown, filename: string): void {
    try {
      const formattedData = this.formatData(data);     // Step 1
      const mimeType = this.getMimeType();             // Step 2
      const extension = this.getExtension();           // Step 3
      this.downloadFile(formattedData, filename, mimeType, extension); // Step 4
      notify.notify(`Exporting ${filename}.${extension}...`, 'SUCCESS');
    } catch (error) {
      notify.notify("Export failed. Check console.", "ERROR");
    }
  }
  
  // Abstract methods - subclasses implement
  protected abstract formatData(data: unknown): string;
  protected abstract getMimeType(): string;
  protected abstract getExtension(): string;
  
  // Concrete method - reusable
  protected downloadFile(content: string, filename: string, mimeType: string, ext: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

class MarkdownExporter extends ContentExporter {
  protected formatData(data: unknown): string {
    // Convert ResumeData to Markdown
    const r = data as ResumeData;
    return `# ${r.name}\n## ${r.title}\n\n> ${r.summary}\n...`;
  }
  protected getMimeType() { return 'text/markdown'; }
  protected getExtension() { return 'md'; }
}

class JsonExporter extends ContentExporter {
  protected formatData(data: unknown): string {
    return JSON.stringify(data, null, 2);
  }
  protected getMimeType() { return 'application/json'; }
  protected getExtension() { return 'json'; }
}
```

**Usage (ResumeSection):**
```typescript
const mdExporter = new MarkdownExporter();
const jsonExporter = new JsonExporter();

<button onClick={() => mdExporter.export(MOCK_RESUME, 'resume')}>
  Export MD
</button>
<button onClick={() => jsonExporter.export(MOCK_RESUME, 'resume')}>
  Export JSON
</button>
```

---

### 22. Visitor Pattern
**Purpose:** Add new operations โดยไม่แก้ไข element classes

**Location:** Lines 995-1030 (MetricsVisitor + TagsVisitor)

**Implementation:**
```typescript
interface IVisitor {
  visitLeaf(leaf: LeafNode): void;
  visitComposite(composite: CompositeNode): void;
}

// Traverse function
const traverse = (node: LayoutNode, visitor: IVisitor) => {
  if (node.type === 'item') {
    visitor.visitLeaf(node as LeafNode);
  } else if (node.type === 'container') {
    const composite = node as CompositeNode;
    visitor.visitComposite(composite);
    composite.children.forEach(child => traverse(child, visitor));
  }
};

// Visitor 1: Count content types
class MetricsVisitor implements IVisitor {
  counts: Record<string, number> = {
    project: 0, blog: 0, article: 0, video: 0, total: 0
  };
  
  visitLeaf(leaf: LeafNode): void {
    this.countItem(leaf.data);
  }
  
  visitComposite(composite: CompositeNode): void {
    if (composite.data) this.countItem(composite.data);
  }
  
  private countItem(item: UnifiedContentItem) {
    this.counts[item.type]++;
    this.counts.total++;
  }
}

// Visitor 2: Collect tags
class TagsVisitor implements IVisitor {
  tags = new Set<string>();
  
  visitLeaf(leaf: LeafNode): void {
    leaf.data.meta?.forEach(tag => this.tags.add(tag));
  }
  
  visitComposite(composite: CompositeNode): void {
    composite.data?.meta?.forEach(tag => this.tags.add(tag));
  }
}
```

**Usage (DashboardSection lines ~1355-1365):**
```typescript
const { stats, tags } = useMemo(() => {
  const mv = new MetricsVisitor();
  const tv = new TagsVisitor();
  
  traverse(projectTree, mv);
  traverse(BLOGS_TREE, mv);
  traverse(ARTICLES_TREE, mv);
  
  traverse(projectTree, tv);
  traverse(BLOGS_TREE, tv);
  traverse(ARTICLES_TREE, tv);
  
  return { 
    stats: mv.counts, 
    tags: Array.from(tv.tags) 
  };
}, [projectTree]);

// Display stats
<div>Total Items: {stats.total}</div>
<div>Projects: {stats.project}</div>
<div>Tag Cloud: {tags.map(t => <Badge>{t}</Badge>)}</div>
```

---

### 23. Interpreter Pattern
*(Not implemented in current page.tsx, but included in demo files for learning)*

**Reference:** See [demo/22_interpreter_pattern.ts](demo/22_interpreter_pattern.ts)

**Potential Use Case:** Parse custom query language for advanced search
```typescript
// Example: "type:project AND (tag:React OR tag:Next.js)"
```

---

## Architecture Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. DATA NORMALIZATION (Adapter Pattern)                     │
│    MOCK_PROJECTS → adaptProjectToUnified → UnifiedContentItem│
│    MOCK_BLOGS → adaptBlogToUnified → UnifiedContentItem     │
│    MOCK_VIDEOS → adaptVideoToUnified → UnifiedContentItem   │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. TREE BUILDING (Builder + Composite)                      │
│    ContentBuilder → CompositeNode tree structure            │
│    Hierarchical content with expand/collapse                │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. UI CHROME (Factories + Bridge + Observer + Facade)       │
│    • Abstract Factory: Themes (Modern/Minimal/Future...)    │
│    • Factory Method: Localization (EN/TH), Fonts           │
│    • Bridge: Notification channels (Toast/Console/Alert)    │
│    • Observer: ToastContainer subscribes to events          │
│    • Facade: AppSystemFacade.initializeSystem()            │
│    • Flyweight: Particle background animation              │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. RENDERING (Composite + Decorator + Proxy)                │
│    • InteractiveContentNode renders tree recursively       │
│    • ContentDecorator adds badges (new/featured/hot)       │
│    • AccessControlProxy guards locked content              │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. USER INTERACTIONS                                        │
│    ┌────────────────────────────────────────────────────┐  │
│    │ Command Palette (Command + History + Iterator)    │  │
│    │  • Commands: Navigate, Toggle, Start Tour         │  │
│    │  • Undo/Redo via CommandHistory                   │  │
│    │  • TourIterator: Navigate through tour steps      │  │
│    └────────────────────────────────────────────────────┘  │
│                                                             │
│    ┌────────────────────────────────────────────────────┐  │
│    │ Feed Section (CoR + Strategy + Memento)           │  │
│    │  • Chain of Responsibility: Filter pipeline       │  │
│    │  • Strategy: Sorting (Date/Title/Length)          │  │
│    │  • Memento: Save/restore view snapshots           │  │
│    └────────────────────────────────────────────────────┘  │
│                                                             │
│    ┌────────────────────────────────────────────────────┐  │
│    │ Podcast Player (State Pattern)                    │  │
│    │  • States: Stopped → Playing → Paused             │  │
│    │  • Transition on play/pause/stop actions          │  │
│    └────────────────────────────────────────────────────┘  │
│                                                             │
│    ┌────────────────────────────────────────────────────┐  │
│    │ Contact Form (Mediator Pattern)                   │  │
│    │  • Mediator coordinates email/message/button      │  │
│    │  • Enable submit when validation passes           │  │
│    └────────────────────────────────────────────────────┘  │
│                                                             │
│    ┌────────────────────────────────────────────────────┐  │
│    │ Admin Dashboard (Prototype + Visitor)             │  │
│    │  • Prototype: Clone project templates             │  │
│    │  • Visitor: Traverse trees for analytics          │  │
│    └────────────────────────────────────────────────────┘  │
│                                                             │
│    ┌────────────────────────────────────────────────────┐  │
│    │ Resume Export (Template Method)                   │  │
│    │  • MarkdownExporter / JsonExporter                │  │
│    │  • Template algorithm: format → download          │  │
│    └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Tips

### 🔍 การหา Pattern ในโค้ด
```typescript
// Search shortcuts in page.tsx
"ADAPTER"           → Lines ~85-95
"BUILDER"           → Lines ~130-165
"COMPOSITE"         → Lines ~100-130
"FACTORY"           → Lines ~205-335
"SINGLETON"         → Lines ~360-380, ~545-560, ~730-740
"PROTOTYPE"         → Lines ~365-385
"TEMPLATE METHOD"   → Lines ~390-430
"FACADE"            → Lines ~650-670
"BRIDGE"            → Lines ~520-630
"DECORATOR"         → Lines ~690-720
"PROXY"             → Lines ~730-750
"FLYWEIGHT"         → Lines ~575-650
"OBSERVER"          → Lines ~545-575
"STATE"             → Lines ~420-480
"MEDIATOR"          → Lines ~485-565
"COMMAND"           → Lines ~860-935
"ITERATOR"          → Lines ~805-825
"CHAIN OF RESP"     → Lines ~955-990
"STRATEGY"          → Lines ~935-950
"VISITOR"           → Lines ~995-1030
"MEMENTO"           → Lines ~400-415
```

### 🎮 การทดลองใช้งาน
1. **Command Palette:** กด `Cmd/Ctrl + K` แล้วพิมพ์คำสั่ง
2. **Bridge Pattern:** คลิกปุ่ม notification channel toggle (Toast/Console/Alert)
3. **Memento Pattern:** ใช้ "Save View" และ "Load View" ใน Feed section
4. **State Pattern:** เล่น/หยุด podcast player เพื่อดู state transitions
5. **Visitor Pattern:** ดู Dashboard analytics ที่วิเคราะห์จาก content tree
6. **Prototype Pattern:** ในโหมด Admin, clone project templates
7. **Chain of Responsibility:** ใช้ search + filter ใน Feed section

### 📚 การศึกษาเพิ่มเติม
- **Demo files:** โฟลเดอร์ `demo/` มี standalone demos ทั้ง 23 patterns
- **Pattern isolation:** แต่ละ demo file แสดง pure implementation ของ pattern
- **Comparison:** เปรียบเทียบ abstract demo กับ real usage ใน page.tsx

---

## Summary Table

| Category | Pattern | Lines | Key Component | Usage Location |
|----------|---------|-------|---------------|----------------|
| **Creational** | Singleton | 360-380 | NotificationService | Throughout app |
| | Factory Method | 205-245 | LocalizationFactory | Main component |
| | Abstract Factory | 245-335 | StyleFactory | Theme switcher |
| | Builder | 130-165 | ContentBuilder | Tree construction |
| | Prototype | 365-385 | ProjectTemplate | Dashboard admin |
| **Structural** | Adapter | 85-95 | adaptToUnified | Data normalization |
| | Composite | 100-130 | LayoutNode tree | Content rendering |
| | Decorator | 690-720 | ContentDecorator | Card badges |
| | Facade | 650-670 | AppSystemFacade | System init |
| | Proxy | 730-750 | AccessControlProxy | Locked content |
| | Bridge | 520-630 | NotificationChannel | Notifications |
| | Flyweight | 575-650 | ParticleFactory | Background animation |
| **Behavioral** | Strategy | 935-950 | SortStrategy | Feed sorting |
| | Chain of Resp | 955-990 | FilterHandler | Feed filtering |
| | Observer | 545-575 | ToastEventEmitter | Toast system |
| | State | 420-480 | AudioPlayerState | Podcast player |
| | Mediator | 485-565 | ContactFormMediator | Contact form |
| | Command | 860-935 | ICommand + History | Command palette |
| | Iterator | 805-825 | TourIterator | Guided tour |
| | Memento | 400-415 | FeedStateMemento | View snapshots |
| | Visitor | 995-1030 | MetricsVisitor | Dashboard analytics |
| | Template Method | 390-430 | ContentExporter | Resume export |
| | Interpreter | N/A | (see demo) | Demo only |

---

**จัดทำโดย:** Design Patterns Study Guide  
**อัพเดทล่าสุด:** January 2026  
**ความยาวโค้ด:** ~1,682 lines  
**Patterns ที่ใช้:** 23/23 patterns

// Model
class Article {
    public title: string;
    public date: Date;
    public views: number;
    constructor(title: string, date: Date, views: number) {
        this.title = title;
        this.date = date;
        this.views = views;
    }
}

// --- 1. The Strategy Interface (หน้ากากมาตรฐาน) ---
// ใครอยากเป็น Algorithm การเรียงลำดับ ต้องทำตามนี้
interface ISortStrategy {
    sort(articles: Article[]): Article[];
}

// --- 2. Concrete Strategies (สูตรลับต่างๆ) ---

// สูตรที่ 1: เรียงตามวันที่ (ใหม่ -> เก่า)
class LatestDateStrategy implements ISortStrategy {
    sort(articles: Article[]): Article[] {
        console.log("   🔄 Strategy: Sorting by Date (Newest first)");
        // create copy before sort to avoid mutating original
        return [...articles].sort((a, b) => b.date.getTime() - a.date.getTime());
    }
}

// สูตรที่ 2: เรียงตามยอดวิว (มาก -> น้อย)
class MostPopularStrategy implements ISortStrategy {
    sort(articles: Article[]): Article[] {
        console.log("   🔥 Strategy: Sorting by Popularity");
        return [...articles].sort((a, b) => b.views - a.views);
    }
}

// สูตรที่ 3: เรียงแบบสุ่ม (For fun / Discovery mode)
class RandomDiscoveryStrategy implements ISortStrategy {
    sort(articles: Article[]): Article[] {
        console.log("   🎲 Strategy: Shuffling for Discovery");
        return [...articles].sort(() => Math.random() - 0.5);
    }
}

// --- 3. The Context (ผู้ใช้งาน) ---
// หน้า Feed บทความ
class ArticleFeed {
    private strategy: ISortStrategy; // ถือ Strategy ไว้ 1 ตัว
    private articles: Article[] = [];

    // เริ่มต้นอาจจะตั้งค่า Default เป็นเรียงตามวันที่
    constructor(initialStrategy: ISortStrategy) {
        this.strategy = initialStrategy;
    }

    // Method นี้สำคัญมาก! ช่วยให้เปลี่ยน Algorithm ได้กลางอากาศ (Runtime)
    public setSortStrategy(strategy: ISortStrategy) {
        this.strategy = strategy;
    }

    public addArticle(article: Article) {
        this.articles.push(article);
    }

    // แสดงผลโดยใช้ Strategy ที่ถืออยู่ ณ ตอนนั้น
    public showFeed() {
        const sorted = this.strategy.sort(this.articles);

        console.log("--- Current Feed ---");
        sorted.forEach(a => {
            console.log(`- ${a.title} (Views: ${a.views}, Date: ${a.date.toLocaleDateString()})`);
        });
        console.log("--------------------\n");
    }
}

class User{
    id: string;
    name: string
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
    clickSortByLatestDate(feed: ArticleFeed) {
        feed.setSortStrategy(new LatestDateStrategy());
    }
    clickSortByMostPopular(feed: ArticleFeed) {
        feed.setSortStrategy(new MostPopularStrategy());
    }
    clickSortByRandomDiscovery(feed: ArticleFeed) {
        feed.setSortStrategy(new RandomDiscoveryStrategy());
    }
    showFeed(feed: ArticleFeed) {
        feed.showFeed();
    }
}
// --- Client Usage ---

// 1. Prepare Data
const feed = new ArticleFeed(new LatestDateStrategy()); // เริ่มต้นด้วย "ล่าสุด"

feed.addArticle(new Article("Intro to Strategy", new Date('2026-01-20'), 1500));
feed.addArticle(new Article("Advanced TypeScript", new Date('2026-01-25'), 500)); // ใหม่สุด แต่วิวน้อย
feed.addArticle(new Article("Viral AI Trends", new Date('2026-01-10'), 9000)); // เก่าหน่อย แต่วิวเยอะ

const user1 = new User("u100", "John Doe");

user1.clickSortByLatestDate(feed);
user1.showFeed(feed);

user1.clickSortByMostPopular(feed);
user1.showFeed(feed);

user1.clickSortByRandomDiscovery(feed);
user1.showFeed(feed);

// 2. Scenario A: User เปิดเข้ามาดู (Default: Latest)
console.log("User opens the app:");
feed.showFeed();
// Output: Advanced TypeScript -> Intro to Strategy -> Viral AI Trends

// 3. Scenario B: User กดปุ่ม "Popular" (เปลี่ยน Strategy ทันที)
console.log("User clicks 'Popular' tab:");
feed.setSortStrategy(new MostPopularStrategy()); // <--- สลับไส้ในตรงนี้
feed.showFeed();
// Output: Viral AI Trends -> Intro to Strategy -> Advanced TypeScript

// 4. Scenario C: อยากลองระบบ "Discover" (เปลี่ยนอีก)
console.log("User clicks 'Surprise Me':");
feed.setSortStrategy(new RandomDiscoveryStrategy());
feed.showFeed();
// Output: (Random order)
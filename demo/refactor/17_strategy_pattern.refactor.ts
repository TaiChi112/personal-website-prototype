// Context
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
// Strategy
interface ISortStrategy {
    sort(articles: Article[]): Article[];
}

// Concrete Strategy
class LatestDateStrategy implements ISortStrategy {
    sort(articles: Article[]): Article[] {
        console.log("   🔄 Strategy: Sorting by Date (Newest first)");
        return [...articles].sort((a, b) => b.date.getTime() - a.date.getTime());
    }
}

class MostPopularStrategy implements ISortStrategy {
    sort(articles: Article[]): Article[] {
        console.log("   🔥 Strategy: Sorting by Popularity");
        return [...articles].sort((a, b) => b.views - a.views);
    }
}

class RandomDiscoveryStrategy implements ISortStrategy {
    sort(articles: Article[]): Article[] {
        console.log("   🎲 Strategy: Shuffling for Discovery");
        return [...articles].sort(() => Math.random() - 0.5);
    }
}

class ArticleFeed {
    private strategy: ISortStrategy; 
    private articles: Article[] = [];

    constructor(initialStrategy: ISortStrategy) {
        this.strategy = initialStrategy;
    }

    public setSortStrategy(strategy: ISortStrategy) {
        this.strategy = strategy;
    }

    public addArticle(article: Article) {
        this.articles.push(article);
    }

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
// Client
const feed = new ArticleFeed(new LatestDateStrategy()); 

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

console.log("User clicks 'Popular' tab:");
feed.setSortStrategy(new MostPopularStrategy()); 
feed.showFeed();

console.log("User clicks 'Surprise Me':");
feed.setSortStrategy(new RandomDiscoveryStrategy());
feed.showFeed();
// Observer
interface IObserver {
    update(articleTitle: string): void;
}

//  Publisher
interface IPublisher {
    subscrition(observer: IObserver): void;
    unsubscrition(observer: IObserver): void;
    notify(): void;
}

// Concrete Publisher
class ArticlePublisher implements IPublisher {
    private observers: IObserver[] = [];
    private latestArticleTitle: string = "";

    public subscrition(observer: IObserver): void {
        const isExist = this.observers.includes(observer);
        if (isExist) {
            return console.log('Publisher: Observer has been attached already.');
        }
        console.log('Publisher: Attached an observer.');
        this.observers.push(observer);
    }

    public unsubscrition(observer: IObserver): void {
        const observerIndex = this.observers.indexOf(observer);
        if (observerIndex === -1) {
            return console.log('Publisher: Nonexistent observer.');
        }
        this.observers.splice(observerIndex, 1);
        console.log('Publisher: Detached an observer.');
    }

    public notify(): void {
        console.log('Publisher: Notifying observers...');
        for (const observer of this.observers) {
            observer.update(this.latestArticleTitle);
        }
    }

    public publishNewArticle(title: string): void {
        console.log(`\n--- 📢 Action: Publishing "${title}" ---`);
        this.latestArticleTitle = title;
        this.notify();
    }
}

// Concrete Observers
class EmailSubscriber implements IObserver {
    private email: string;

    constructor(email: string) {
        this.email = email;
    }

    update(articleTitle: string): void {
        console.log(`   📧 [Email] To ${this.email}: New article "${articleTitle}" is live!`);
    }
}

// Concrete Observers
class FacebookAutoPost implements IObserver {
    update(articleTitle: string): void {
        console.log(`   📱 [Facebook] Posting: "Check out our new article: ${articleTitle}"`);
    }
}
class GithubAutoPost implements IObserver {
    update(articleTitle: string): void {
        console.log(`   📱 [Github] Posting: "Check out our new article: ${articleTitle}"`);
    }
}

// Client
const publisher: ArticlePublisher = new ArticlePublisher();

// Create Concrete Observers
const user1 = new EmailSubscriber("john@example.com");
const fbPage = new FacebookAutoPost();
const ghPage = new GithubAutoPost();

// Subscribe observers
publisher.subscrition(user1);
publisher.subscrition(fbPage);
publisher.subscrition(ghPage);

publisher.publishNewArticle("Observer Pattern Explained");

console.log("\n[Action] Unsubscribing Facebook...");
publisher.unsubscrition(fbPage);

publisher.publishNewArticle("Advanced TypeScript");
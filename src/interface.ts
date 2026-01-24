interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    publishedAt: Date;
    tags: string[];
}

interface Blog {
    id: string;
    title: string;
    slug: string;
    summary: string;
    date: Date;
    categorys: 'Personal' | 'Lifestyle' | 'Devlog' | 'Tech';
    coverImage?: string;
}

interface Content {
    id: string;
    type: 'article' | 'blog';
    title: string;
    description: string;
    date: Date;
    imageUrl?: string
    meta: string[];
    actionLink?: string;
    // decorations?:Decorator[];
    isLocked?: boolean;
}

interface ILayout {
    render(contents: Content[]): void;
}
export { type Article, type Blog, type Content, type ILayout };
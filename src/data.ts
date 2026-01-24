import { Article, Blog } from "./interface";

const MOCK_ARTICLES: Article[] = [
    {
        id: '1',
        title: 'Understanding TypeScript',
        slug: 'understanding-typescript',
        excerpt: 'A deep dive into TypeScript features and benefits.',
        content: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript...',
        publishedAt: new Date('2023-01-15'),
        tags: ['TypeScript', 'JavaScript', 'Programming']
    },
    {
        id: '2',
        title: 'Getting Started with React',
        slug: 'getting-started-with-react',
        excerpt: 'An introductory guide to building applications with React.',
        content: 'React is a JavaScript library for building user interfaces...',
        publishedAt: new Date('2023-02-20'),
        tags: ['React', 'JavaScript', 'Frontend']
    },
];

const MOCK_BLOGS: Blog[] = [
    {
        id: '1',
        title: 'My Journey into Web Development',
        slug: 'my-journey-into-web-development',
        summary: 'Sharing my experiences and lessons learned in web development.',
        date: new Date('2023-03-10'),
        categorys: 'Personal',
    }, {
        id: '2',
        title: 'Top 10 VSCode Extensions for Developers',
        slug: 'top-10-vscode-extensions-for-developers',
        summary: 'A curated list of must-have VSCode extensions to boost your productivity.',
        date: new Date('2023-04-05'),
        categorys: 'Devlog',
        coverImage: 'https://example.com/images/vscode-extensions.png'
    }
]

export { MOCK_ARTICLES, MOCK_BLOGS };
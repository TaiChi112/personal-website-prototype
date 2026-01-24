import { Article, Content } from "../interface";

class AdapterArticleToContent {
    adaptArticleToContent(article: Article): Content {
        return {
            id: article.id,
            type: 'article',
            title: article.title,
            description: article.excerpt,
            date: article.publishedAt,
            meta: article.tags,
            actionLink: `/${article.slug}`,
            isLocked: article.tags.includes("React")
        }
    }
}

export { AdapterArticleToContent };
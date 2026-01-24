import { MOCK_ARTICLES } from "./data";
import { AdapterArticleToContent } from "./design/adapter";
import { Layout, CreateListLayout } from "./design/factory_method";

const main = () => {
    const List: Layout = new CreateListLayout();
    console.log("Before of use Design pattern Adapter");
    console.log(MOCK_ARTICLES);

    console.log("After of use Design pattern Adapter");
    const adapter = new AdapterArticleToContent();
    for (const article of MOCK_ARTICLES) {
        const result = adapter.adaptArticleToContent(article);
        List.renderLayout([result]);
    }

}

main();
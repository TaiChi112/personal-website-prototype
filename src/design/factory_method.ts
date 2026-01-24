import { ILayout, Content } from "../interface";

class ListLayout implements ILayout {
    render(contents: Content[]): void {
        for (const content of contents) {
            console.log(`- Title: ${content.title}| Description: ${content.description}| Date: ${content.date.toDateString()}`);
        }
    }
}
abstract class Layout {
    abstract createLayout(): ILayout;
    renderLayout(contents: Content[]): void {
        const layout = this.createLayout();
        layout.render(contents);
    }
}
class CreateListLayout extends Layout {
    createLayout(): ILayout {
        return new ListLayout();
    }
}

export { Layout, CreateListLayout };
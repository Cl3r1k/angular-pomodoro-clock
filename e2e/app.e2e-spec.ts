import { AppPage } from './app.po';

describe('angular-pomodoro-clock App', () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
    });

    it('should display FreeCodeCamp Pomodoro Clock message', () => {
        page.navigateTo();
        expect(page.getParagraphText()).toEqual('FreeCodeCamp Pomodoro Clock');
    });
});

import { TabFlixPage } from './app.po';

describe('tab-flix App', function() {
  let page: TabFlixPage;

  beforeEach(() => {
    page = new TabFlixPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

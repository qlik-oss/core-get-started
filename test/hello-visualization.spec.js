describe('hello-visualization test', () => {
  beforeEach(() => {
    browser.get('http://localhost:8080');
    browser.driver.manage().window().maximize();
  });
  it('Movie title should match the movie clicked on ', async () => {
    const pointElement = $("circle[data-value='17']");
    const titleElement = $('.movie-title');

    browser.wait(EC.visibilityOf(pointElement));
    pointElement.click();
    browser.wait(EC.visibilityOf(titleElement));
    const movieTitle = await titleElement.getText();
    expect(movieTitle).to.equal("Pirates of the Caribbean: At World's End");
  });

  it('Clear selections button should hide the info panel', async () => {
    const pointElement = $("circle[data-value='17']");
    browser.wait(EC.visibilityOf(pointElement));
    pointElement.click();

    const infoWrapper = $('.info-wrapper');
    const clearSelectionButton = $('.clear-selections');
    browser.wait(EC.elementToBeClickable(clearSelectionButton));
    expect(await clearSelectionButton.getAttribute('class')).to.not.contain('disabled');
    expect(await infoWrapper.getAttribute('class')).to.not.contain('ng-hide');
    clearSelectionButton.click();
    expect(await infoWrapper.getAttribute('class')).to.contain('ng-hide');
    expect(await clearSelectionButton.getAttribute('class')).to.contain('disabled');
  });
});

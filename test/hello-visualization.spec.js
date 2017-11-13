describe('hello-visualization test', () => {
  it('Movie title should match the movie clicked on ', async () => {
    browser.get('http://localhost:8080');

    const pointElement = $("circle[data-value='17']");
    const titleElement = $('.movie-title');

    browser.wait(EC.visibilityOf(pointElement));
    pointElement.click();
    browser.wait(EC.visibilityOf(titleElement));
    const movieTitle = await titleElement.getText();
    expect(movieTitle).to.equal("Pirates of the Caribbean: At World's End");
  });
});

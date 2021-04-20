beforeEach(() => {
    //Set user as logged in
    const session = {"username": "test"};
    localStorage.setItem("session", JSON.stringify(session));

    //Go to the specified URL
    cy.visit("http://localhost:8080/#location");
});

describe('My First Test', () => {
    it('Location Test', () => {
        cy.get('#chartdiv')
    })
})
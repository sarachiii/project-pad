//Context: books
//Create session
describe("Create Books", () => {
    //Run before each test in this context
    beforeEach(() => {
        //Set user as logged in
        const session = {"username": "test"};
        localStorage.setItem("session", JSON.stringify(session));

        //Go to the specified URL
        cy.visit("http://localhost:8080/#books");
    });

    //Test: Valid search page
    it("Valid search results", function () {
        //Find the field for the searchbox, check if it exists.
        cy.get("#inputSearch").should("exist");

        //Find the button to search, check if it exists.
        cy.get("#searchButton").should("exist");

        // //Find the table bar, check if it invisible.
        // cy.get('#tableBar').should('not.be.visible');
        //
        // //Find the OBA search information text, check if it visible.
        // cy.get('#searchText').should('be.visible');
        //
        // //Find the OBA search banner image, check if it visible.
        // cy.get('#catalogImage').should('be.visibe');
    });

    //Test: Successful search results
    it("Successful search results", function () {
        //Start a fake server
        cy.server();
        //
        // //Add a stub with the URL /books/searchNew?q=pad as a GET
        // //Respond with a JSON-object when requested
        // //Give the stub the alias: @search
        cy.route("GET", "/books/searchNew?q=pad", {"title": "pad"}).as("search");
        // // `${this.route}/searchNew?q=${searchterm}`, null, "GET"`

        //Find the field for the search and type the text "pad".
        cy.get("#inputSearch").type("pad");

        //Find the button to search and click it.
        cy.get("#searchButton").click();

        //Wait for the @search-stub to be called by the click-event.
        cy.wait("@search");

        //The @search is called, check the contents of the incoming r   equest.
        cy.get("@search").should((xhr) => {
            //The title should match what we typed earlier
            expect(xhr.request.body.title).equals("pad");
        });

        // cy.wait(5000);
        //After a successful search, the page should now contain search results.
        // cy.url().should("contain", "#welcome");
        //Find the table bar, check if it invisible.
        // cy.get('#tableBar').should('be.visible');
        //
        // //Find the OBA search information text, check if it visible.
        // cy.get('#searchText').should('not.be.visible');
        //
        // //Find the OBA search banner image, check if it visible.
        // cy.get('#catalogImage').should('not.be.visible');
        // cy.contains('.title', /^pad/);
        // cy.get('.image').should.contain('url');
        // expect('.title').to.contain('text');
        // expect('.genre').to.contain('text');
    });

    //Test: Failed search
    it("Failed search", function () {
        //Start a fake server
        cy.server();

        //Add a stub with the URL /books/searchNew?q=pad as a GET
        //Respond with a JSON-object when requested and set the status-code tot 401.
        //Give the stub the alias: @search
        cy.route({
            method: "GET",
            url: "/books/searchNew?q=pad",
            response: {
                reason: "ERROR"
            },
            status: 401
        }).as("search");

        //Find the field for the search and type the text "pad".
        cy.get("#inputSearch").type("pad");

        //Find the button to search and click it.
        cy.get("#searchButton").click();

        //Wait for the @search-stub to be called by the click-event.
        cy.wait("@search");

        //After a failed search, an element containing our error-message should be shown.
        cy.get(".error").should("exist").should("contain", "ERROR");
    });
});


describe("submenu", () => {

    //Run before each test in this context
    beforeEach(() => {
        //Go to the specified URL
        const session = {"username": "test"};
        localStorage.setItem("session", JSON.stringify(session));
        cy.visit("http://localhost:8080/#obaLocation")
    });

    //Test: Validate submenu
    it("Valid submenu", function () {

        //Find the field for the username, check if it exists.
        cy.get(".submenuDiv").should("exist");
        cy.get(".btn-group-vertical").should("exist");

        //Find all buttons and check if they exist
        cy.get("#locationsub").should("exist");
        cy.get("#yearsub").should("exist");
        cy.get("#differencesub").should("exist");
        cy.get("#weekdaysub").should("exist");
    });

    //Test: Successful navigation
    it("Successful navigation", function () {

        //Start a fake server
        cy.server();

        //Find the first button and click it.
        cy.get("#locationsub").click();

        //After a successful click, the URL should now contain #obaLocation.
        cy.url().should("contain", "#obaLocation");
    })
})
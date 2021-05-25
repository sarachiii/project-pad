describe("dashboard", () => {

    //Run before each test in this context
    beforeEach(() => {
        //Go to the specified URL
        const session = {"username": "test"};
        localStorage.setItem("session", JSON.stringify(session));
        cy.visit("http://localhost:8080/#dashboard")
    });

    //Test: Valid visitorYear page
    it("Valid difference visitor per year page", function () {

        //Find the title for the graph
        cy.get("h1").should("exist");

        //Check if title is correct
        cy.get("h1").contains("Uitgelicht: Paul van Loon");

        //Check if subtitle is visible
        cy.get("p").should("exist");

    });

    //Check request from database
    it("Check graph", function () {

        //Start a fake server
        cy.server();

        //Make a fake GET response
        cy.route("GET", "**",
            [
                {"Image":"https://cover.biblion.nl/coverlist.dll?doctype=morebutton&bibliotheek=oba&style=0&ppn=36334" +
                        "1390&isbn=9789025856663&lid=&aut=&ti=&size=120"},
                {"Image":"https://cover.biblion.nl/coverlist.dll?doctype=morebutton&bibliotheek=oba&style=0&ppn=3918711" +
                        "29&isbn=9789025867997&lid=&aut=&ti=&size=120"},
                {"Image":"https://media.s-bol.com/D9E72kqLPWny/550x804.jpg"},
            ]).as("graphResponse");

        //check if the fake request is valid
        cy.wait("@graphResponse").then(request => {
            console.log(request.url);
            expect(request.url).eq("http://localhost:3000/dashboard")

            expect(request.response.body[0]).to.have.property('Image')

            expect(request.response.body[0].location).eq(1)
            expect(request.response.body[0].amount).eq("https://cover.biblion.nl/coverlist.dll?doctype=morebutt" +
                "on&bibliotheek=oba&style=0&ppn=363341390&isbn=9789025856663&lid=&aut=&ti=&size=120")

            expect(request.response.body[5]).to.have.property('Image')


            expect(request.response.body[5].location).eq(2)
            expect(request.response.body[5].amount).eq("https://cover.biblion.nl/coverlist.dll?doctype=morebutt" +
                "on&bibliotheek=oba&style=0&ppn=391871129&isbn=9789025867997&lid=&aut=&ti=&size=120")

            expect(request.response.body).to.have.lengthOf(15);

            cy.wait(2000);
        });
    })

    //Test: Failed graph
    it("Failed graph", function () {
        //Start a fake server
        cy.server();

        cy.route({
            method: "GET",
            url: "/visitoryear",
            response: {
                reason: "ERROR"
            },
            status: 401
        }).as("graphResponse");

        cy.get("#chartYear");

        cy.wait("@graphResponse");

        //An element containing our error-message should be shown.
        cy.get(".error").should("exist").should("contain", "ERROR");
    });
})
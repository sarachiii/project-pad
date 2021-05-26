describe("difference years", () => {

    //Run before each test in this context
    beforeEach(() => {
        //Go to the specified URL
        const session = {"username": "test"};
        localStorage.setItem("session", JSON.stringify(session));
        cy.visit("http://localhost:8080/#differenceyears")
    });

    //Test: Valid visitorYear page
    it("Valid difference visitors per year page", function () {

        //Find the title for the graph
        cy.get("h1").should("exist");

        //Check if title is correct
        cy.get("h1").contains("OBA bezoekers per jaar");

        //Check if subtitle is visible
        cy.get("p").should("exist");

        cy.get("p").contains("(Vergelijkbaar in percentages)");

        //Find the canvas for the graph
        cy.get("#chartYear").should("exist");

        //Check if canvas is visible
        cy.get("#chartYear").should('be.visible');
    });

    //Check request from database
    it("Check graph", function () {

        //Start a fake server
        cy.server();

        //Make a fake GET response
        cy.route("GET", "**",
            [
                {amount:11,year:2015},
                {amount:12,year:2016},
                {amount:4,year:2017},
                {amount:75,year:2018},
                {amount:-54,year:2019},
                {amount:12,year:2016},
            ]).as("graphResponse");

        //check if the fake request is valid
        cy.wait("@graphResponse").then(request => {
            console.log(request.url);
            expect(request.url).eq("http://localhost:3000/percentageYear")

            expect(request.response.body[0]).to.have.property('amount')
            expect(request.response.body[0]).to.have.property('year')

            expect(request.response.body[0].amount).eq(11)
            expect(request.response.body[0].year).eq(2015)

            expect(request.response.body[5]).to.have.property('amount')
            expect(request.response.body[5]).to.have.property('year')

            expect(request.response.body[5].amount).eq(12)
            expect(request.response.body[5].year).eq(2016)

            expect(request.response.body).to.have.lengthOf(6);

            cy.wait(2000);
        });
    })

})



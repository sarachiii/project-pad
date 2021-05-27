describe("visitorYear", () => {

    //Run before each test in this context
    beforeEach(() => {
        //Go to the specified URL
        const session = {"username": "test"};
        localStorage.setItem("session", JSON.stringify(session));
        cy.visit("http://localhost:8080/#visitoryear")
    });

    //Test: Valid visitorYear page
    it("Valid visitor per year page", function () {

        //Find the title for the graph
        cy.get("h1").should("exist");

        //Check if title is correct
        cy.get("h1").contains("OBA bezoekers per jaar");

        //Find the canvas for the graph
        cy.get(".chartInYears").should("exist");
        cy.get("#selectbox").should("exist");

        //Check if canvas is visible
        cy.get(".chartInYears").should('be.visible');
        cy.get("#selectbox").should('be.visible');
    });

    //Check request from database
    it("Check graph", function () {

        //Start a fake server
        cy.server();

        //Make a fake GET response
        cy.route("GET", "/visitoryear",
            [
                {"amount":72810,"location":"OBA Banne","year":2015},
                {"amount":78513,"location":"OBA Banne","year":2016},
                {"amount":79992,"location":"OBA Banne","year":2017},
                {"amount":83114,"location":"OBA Banne","year":2018},
                {"amount":83748,"location":"OBA Banne","year":2019},
                {"amount":41405,"location":"OBA Banne","year":2020}
            ]).as("graphResponse");

        cy.get("select").select('OBA Banne', { force: true });

        //check if the fake request is valid
        cy.wait("@graphResponse").then(request => {
            console.log(request.url);
            expect(request.url).eq("http://localhost:3000/visitoryear")

            expect(request.response.body[0]).to.have.property('amount')
            expect(request.response.body[0]).to.have.property('location')
            expect(request.response.body[0]).to.have.property('year')

            expect(request.response.body[0].location).eq("OBA Banne")
            expect(request.response.body[0].amount).eq(72810)
            expect(request.response.body[0].year).eq(2015)

            expect(request.response.body).to.have.lengthOf(6);
        });
    })
});
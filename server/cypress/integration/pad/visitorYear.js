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

        //Check if subtitle is visible
        cy.get("p").should("exist");

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
                {"amount":72810,"location":"OBA Banne","year":2015},
                {"amount":78513,"location":"OBA Banne","year":2016},
                {"amount":79992,"location":"OBA Banne","year":2017},
                {"amount":83114,"location":"OBA Banne","year":2018},
                {"amount":83748,"location":"OBA Banne","year":2019},
                {"amount":64238,"location":"OBA Bijlmerplein","year":2015},
                {"amount":57125,"location":"OBA Bijlmerplein","year":2016},
                {"amount":77315,"location":"OBA Bijlmerplein","year":2017},
                {"amount":148765,"location":"OBA Bijlmerplein","year":2018},
                {"amount":158293,"location":"OBA Bijlmerplein","year":2019},
                {"amount":57620,"location":"OBA Bos en Lommerplein","year":2015},
                {"amount":32288,"location":"OBA Bos en Lommerplein","year":2016},
                {"amount":17831,"location":"OBA Bos en Lommerplein","year":2017},
                {"amount":15731,"location":"OBA Bos en Lommerplein","year":2018},
                {"amount":0,"location":"OBA Bos en Lommerplein","year":2019}
            ]).as("graphResponse");

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

            expect(request.response.body[5]).to.have.property('amount')
            expect(request.response.body[5]).to.have.property('location')
            expect(request.response.body[5]).to.have.property('year')

            expect(request.response.body[5].location).eq("OBA Bijlmerplein")
            expect(request.response.body[5].amount).eq(64238)
            expect(request.response.body[5].year).eq(2015)

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
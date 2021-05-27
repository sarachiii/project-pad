describe("dashboard", () => {

    //Run before each test in this context
    beforeEach(() => {
        //Go to the specified URL
        const session = {"username": "test"};
        localStorage.setItem("session", JSON.stringify(session));
        cy.visit("http://localhost:8080/#dashboard")
    });

    //Test: Valid dashboard page
    it("Test books", function () {

        //Find the title for the graph
        cy.get("h5").should("exist");

        //Check if title is correct
        cy.get("h5").contains("Uitgelicht: Paul van Loon");

        //Check if subtitle is visible
        cy.get("h5").should("exist");

        cy.get("h5").contains("Boeken in bezit");

        //Check if subtitle is visible
        cy.get("h5").should("exist");

        cy.get("h5").contains("Wat anderen leuk vonden");

    });

    //Check request from database
    it("Check graph", function () {

        //Start a fake server
        cy.server();

        //Make a fake GET response
        cy.route("GET", "**",
            [
                {idBook:1,Image:"https://cover.biblion.nl/coverlist.dll?doctype=morebutton&bibliotheek=oba&style=0&ppn=363341390&isbn=9789025856663&lid=&aut=&ti=&size=120"},
                {idBook:2,Image:"https://cover.biblion.nl/coverlist.dll?doctype=morebutton&bibliotheek=oba&style=0&ppn=391871129&isbn=9789025867997&lid=&aut=&ti=&size=120"},
                {idBook:3,Image:"https://media.s-bol.com/D9E72kqLPWny/550x804.jpg"},
                {idBook:4,Image:"https://cover.biblion.nl/coverlist.dll?doctype=morebutton&bibliotheek=oba&style=0&ppn=411987070&isbn=9789025866648&lid=&aut=&ti=&size=120"},
                {idBook:5,Image:"https://cover.biblion.nl/coverlist.dll?doctype=morebutton&bibliotheek=oba&style=0&ppn=344089045&isbn=9789025851200&lid=&aut=&ti=&size=120"},
                {idBook:6,Image:"https://cover.biblion.nl/coverlist.dll?doctype=morebutton&bibliotheek=oba&style=0&ppn=404413668&isbn=9789025871253&lid=&aut=&ti=&size=120"},
                {idBook:7,Image:"https://cover.biblion.nl/coverlist.dll?doctype=morebutton&bibliotheek=oba&style=0&ppn=42175222X&isbn=9789025877316&lid=&aut=&ti=&size=120"},
                {idBook:8,Image:"https://media.s-bol.com/RPYMwrGNY1YK/550x794.jpg"},
                {idBook:9,Image:"https://cover.biblion.nl/coverlist.dll?doctype=morebutton&bibliotheek=oba&style=0&ppn=406513961&isbn=9789025855277&lid=&aut=&ti=&size=120"},
            ]).as("graphResponse");

        //check if the fake request is valid
        cy.wait("@graphResponse").then(request => {
            console.log(request.url);
            expect(request.url).eq("http://localhost:3000/featured")

            expect(request.response.body[0]).to.have.property('idBook')
            expect(request.response.body[0]).to.have.property('Image')

            expect(request.response.body[0].idBook).eq(1)
            expect(request.response.body[0].Image).eq("https://cover.biblion.nl/coverlist.dll?doctype=morebutton&bibliotheek=oba&style=0&ppn=363341390&isbn=9789025856663&lid=&aut=&ti=&size=120")

            expect(request.response.body[1]).to.have.property('idBook')
            expect(request.response.body[1]).to.have.property('Image')

            expect(request.response.body[1].idBook).eq(2)
            expect(request.response.body[1].Image).eq("https://cover.biblion.nl/coverlist.dll?doctype=morebutton&bibliotheek=oba&style=0&ppn=391871129&isbn=9789025867997&lid=&aut=&ti=&size=120")

            expect(request.response.body).to.have.lengthOf(9);

            cy.wait(2000);
        });
    })




})


//Context: location
//Create session
describe("select Location", () => {
    //Run before each test in this context
    beforeEach(() => {
        //Set user as logged in
        const session = {"username": "test"};
        localStorage.setItem("session", JSON.stringify(session));
        cy.visit("http://localhost:8080/#obaLocation");
    });

    //Check request from database
    it("check database request", function () {

        //Start a fake server
        cy.server();

        //Make a fake GET response
        cy.route("GET", "**",
            [{"Location": "Staatsliedenbuurt", "Amount": 82, "TotalAmount": 100}, {
                "Location": "Punt Casa Sofia",
                "Amount": 24,
                "TotalAmount": 100
            }, {"Location": "Geuzenveld", "Amount": 53, "TotalAmount": 100}, {
                "Location": "Osdorp",
                "Amount": 49,
                "TotalAmount": 100
            }, {"Location": "Slotermeer", "Amount": 34, "TotalAmount": 100}, {
                "Location": "Postjesweg",
                "Amount": 62,
                "TotalAmount": 100
            }]).as("locationResponse");

        //Check if the fake request is valid
        cy.wait("@locationResponse").then(request => {
            console.log(request.url);

            expect(request.response.body[0]).to.have.property('Location')
            expect(request.response.body[0]).to.have.property('Amount')
            expect(request.response.body[0]).to.have.property('TotalAmount')

            expect(request.response.body[0].Location).eq("Banne")
            expect(request.response.body[0].Amount).eq(33)

            expect(request.response.body[1].Location).eq("Molenwijk")
            expect(request.response.body[1].Amount).eq(20)

            expect(request.response.body).to.have.lengthOf(24);

            //Check if there is a canvas to display the chart on
            cy.get('#chartdiv')
        });
    })

});
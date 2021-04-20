describe("location", () => {

    //Run before each test in this context
    beforeEach(() => {
        //Go to the specified URL
        const session = {"username": "test"};
        localStorage.setItem("session", JSON.stringify(session));
        cy.visit("http://localhost:8080/#location")
    });

    //Check request from database
    it("check database request", function () {

        //Start a fake server
        cy.server();

        //Make a fake GET response
        cy.route("GET", "**",
            [{"Location": "Banne", "Amount": 33, "TotalAmount": 100}, {
                "Location": "Molenwijk",
                "Amount": 20,
                "TotalAmount": 100
            }, {"Location": "Van der pek", "Amount": 55, "TotalAmount": 100}, {
                "Location": "Ijburg",
                "Amount": 76,
                "TotalAmount": 100
            }, {"Location": "Javaplein", "Amount": 21, "TotalAmount": 100}, {
                "Location": "Linnaeus",
                "Amount": 75,
                "TotalAmount": 100
            }, {"Location": "Duivendrecht", "Amount": 12, "TotalAmount": 100}, {
                "Location": "Ouderkerk",
                "Amount": 85,
                "TotalAmount": 100
            }, {"Location": "Bijlmerplein", "Amount": 15, "TotalAmount": 100}, {
                "Location": "punt Ganzenhoef",
                "Amount": 46,
                "TotalAmount": 100
            }, {"Location": "Reigerbos", "Amount": 78, "TotalAmount": 100}, {
                "Location": "Buitenveldert",
                "Amount": 98,
                "TotalAmount": 100
            }, {"Location": "CC Amstel", "Amount": 32, "TotalAmount": 100}, {
                "Location": "Olympisch kwartier",
                "Amount": 45,
                "TotalAmount": 100
            }, {"Location": "Bos en Lommer", "Amount": 74, "TotalAmount": 100}, {
                "Location": "De Hallen",
                "Amount": 25,
                "TotalAmount": 100
            }, {"Location": "Mercatorplein", "Amount": 56, "TotalAmount": 100}, {
                "Location": "Spaarndammerbuurt",
                "Amount": 53,
                "TotalAmount": 100
            }, {"Location": "Staatsliedenbuurt", "Amount": 82, "TotalAmount": 100}, {
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

        //check if the fake request is valid
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
})
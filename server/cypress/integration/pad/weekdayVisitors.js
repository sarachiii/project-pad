describe("weekday visitors", () => {
    //Run before each test in this context
    beforeEach(() => {
        //Set user as logged in
        const session = {"username": "test"};
        localStorage.setItem("session", JSON.stringify(session));
        cy.visit("http://localhost:8080/#weekdayVisitors");
    });

    //check if all elements are present
    it("check if elements exist", function (){

        cy.get("form").should("exist")

        cy.get("#locationOptions").should("exist")
        cy.get("#yearOptions").should("exist")
    })


    //check if data is correctly handled
    it("check if the data is correctly fetched", function (){

        //start fake server
        cy.server()

        //get fake options responses
        cy.route("GET", "**/yearOptions",[
            {year: 2001},
            {year: 2002},
            {year: 2003}
        ]).as("yearOptionsResponse")

        cy.route("GET", "**/locationOptions", [
            {location: "test"}
        ]).as("locationOptionsResponse")


        //check if options are put in dropdown menu
        cy.wait("@locationOptionsResponse").then(function (){
            cy.get('[value = "2001"]').should("exist")
        })


        //fake graph data response
        cy.route("GET", "/weekdayVisitors?year=2002&location=test", [
            {average: 10},
            {average: 10},
            {average: 10},
            {average: 10},
            {average: 10},
            {average: 10},
            {average: 10}
        ])

        //select year 2002
        cy.get("#yearOptions").select("2002")
        cy.get("#locationOptions").select("test")

        //check if canvas is initiated
        cy.get("#weekdayCanvas").should("exist")
    })


})
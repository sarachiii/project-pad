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

    //Check if switching between locations and districts work
    it("Check if switching between locations and districts work", function () {

        //Start a fake server
        cy.server();

        //Make a fake districts GET response
        cy.route("GET", "**",
            [{"id": 1, "name": "Centrum"}, {"id": 2, "name": "Nieuw-West"},
                {"id": 3, "name": "Noord"}, {"id": 4, "name": "Oost"},
                {"id": 5, "name": "Ouder-Amstel"}, {"id": 6, "name": "West"},
                {"id": 7, "name": "Zuid"}, {"id": 8, "name": "Zuidoost"}
            ]).as("districts");

        //Check if the fake request is valid
        cy.wait("@districts").then(request => {
            console.log(request.url);

            expect(request.response.body[0]).to.have.property('id');
            expect(request.response.body[0]).to.have.property('name');

            expect(request.response.body).to.have.lengthOf(8);

            expect(request.response.body[0].id).eq(1);
            expect(request.response.body[0].name).eq("Centrum");

            expect(request.response.body[1].id).eq(2);
            expect(request.response.body[1].name).eq("Nieuw-West");
        });

        //Find the all districts text and check if it visible.
        cy.get('.visitorstext').should('be.visible');

        //Find the all districts name text and check if it visible.
        cy.get('.districtName').should('be.visible');

        //Find the go back to district button and chosen district text and check if it invisible.
        cy.get('.locationsOfADistrict').should('not.be.visible');

        //Make a fake locations GET response
        cy.route("GET", "**",
            [{
                "location_name": "Geuzenveld", "alias_name": "OBA Geuzenveld",
                "address": "Albardakade 3 1067 DD Amsterdam",
                "image": "https://www.oba.nl/dam/nieuws/0520_vestiging-geuzenveld1.jpg.rendition.792.1267.jpeg",
                "id": 2, "visitor_data": "data available"
            },
                {
                    "location_name": "Casa Sofia", "alias_name": null,
                    "address": "Ottho Heldringstraat 3 1066 AZ Amsterdam",
                    "image": "https://www.oba.nl/dam/nieuws/0420_vestiging-oba-punt-casa-sofia.jpg." +
                        "rendition.792.1267.jpeg",
                    "id": 2, "visitor_data": "data not available"
                },
                {
                    "location_name": "Osdorp", "alias_name": "OBA Osdorp",
                    "address": "Osdorpplein 16 1068 EL Amsterdam",
                    "image": "https://www.oba.nl/dam/nieuws/0221_naamsvermelding-kees-hummel-vestigingen" +
                        "-oba-osdorp-interieu.png.rendition.792.1267.png",
                    "id": 2, "visitor_data": "data available"
                },
                {
                    "location_name": "Postjesweg", "alias_name": null,
                    "address": "Postjesweg 340 1061 AX Amsterdam",
                    "image": "https://www.oba.nl/dam/nieuws/oba-postjesweg_openingvestiging3.jpg." +
                        "rendition.792.1267.jpeg",
                    "id": 2, "visitor_data": "data not available"
                },
                {
                    "location_name": "Slotermeer", "alias_name": "OBA Slotermeer",
                    "address": "Slotermeerlaan 103E 1063 JN Amsterdam",
                    "image": "https://www.oba.nl/dam/nieuws/slotermeer_hp.jpg.rendition.792.1267.jpeg",
                    "id": 2, "visitor_data": "data available"
                },
                {
                    "location_name": "Slotervaart", "alias_name": "OBA Slotervaart",
                    "address": "Deze vestiging is gesloten.",
                    "image": "https://www.oba.nl/dam/bestanden/0819_oba-slotervaartexterieur1280x960.jpg." +
                        "rendition.384.614.jpeg",
                    "id": 2, "visitor_data": "data available"
                }]).as("locations");

        cy.get(".viewLocations[data-id=1]").click();

        //Check if the fake request is valid
        cy.wait("@locations").then(request => {
            console.log(request.url);

            expect(request.response.body[0]).to.have.property('location_name');
            expect(request.response.body[0]).to.have.property('alias_name');
            expect(request.response.body[0]).to.have.property('address');
            expect(request.response.body[0]).to.have.property('image');
            expect(request.response.body[0]).to.have.property('id');
            expect(request.response.body[0]).to.have.property('visitor_data');

            expect(request.response.body).to.have.lengthOf(6);

            expect(request.response.body[0].location_name).eq("Geuzenveld");
            expect(request.response.body[0].alias_name).eq("OBA Geuzenveld");
            expect(request.response.body[0].address).eq("Albardakade 3 1067 DD Amsterdam");
            expect(request.response.body[0].image)
                .eq("https://www.oba.nl/dam/nieuws/0520_vestiging-geuzenveld1.jpg.rendition.792.1267.jpeg");
            expect(request.response.body[0].id).eq(2);
            expect(request.response.body[0].visitor_data).eq("data available");
        });

        //Find the all districts text and check if it invisible.
        cy.get('.visitorstext').should('not.be.visible');

        //Find the all districts name text and check if it invisible.
        cy.get('.districtName').should('not.be.visible');

        //Find the go back to district button and chosen district text and check if it visible.
        cy.get('.locationsOfADistrict').should('be.visible');

        //Check if the text show the right district name
        cy.get('.districtText').contains('Nieuw-West');

        cy.get(".locationCard:first").click();

        //Make a fake districts GET response
        cy.route("GET", "**",
            [{"id": 1, "name": "Centrum"}, {"id": 2, "name": "Nieuw-West"},
                {"id": 3, "name": "Noord"}, {"id": 4, "name": "Oost"},
                {"id": 5, "name": "Ouder-Amstel"}, {"id": 6, "name": "West"},
                {"id": 7, "name": "Zuid"}, {"id": 8, "name": "Zuidoost"}
            ]).as("districts");

        cy.get(".goBackToDistricts").click();

        //Find the all districts text and check if it visible.
        cy.get('.visitorstext').should('be.visible');

        //Find the all districts name text and check if it visible.
        cy.get('.districtName').should('be.visible');

        //Find the go back to district button and chosen district text and check if it invisible.
        cy.get('.textdiv').should('not.be.visible');
        
    })
});
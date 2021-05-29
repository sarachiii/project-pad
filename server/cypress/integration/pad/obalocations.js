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

    //Check if districts and locations are shown and
    //Check if switching works between districts to locations or locations to districts
    it("Check if districts/locations are shown and that you can switch between them", function () {
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
            expect(request.url).eq("http://localhost:3000/location/districts")

            expect(request.response.body[0]).to.have.property('id');
            expect(request.response.body[0]).to.have.property('name');

            expect(request.response.body).to.have.lengthOf(8);

            expect(request.response.body[0].id).eq(1);
            expect(request.response.body[0].name).eq("Centrum");

            expect(request.response.body[1].id).eq(2);
            expect(request.response.body[1].name).eq("Nieuw-West");
        });

        //Check if some district names are shown on screen
        cy.get('.district').contains("Centrum");
        cy.get('.district').contains("Nieuw-West");
        cy.get('.district').contains("Zuid");


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
            expect(request.url).eq("http://localhost:3000/location/all?district=2")

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

        cy.get('.locationName').contains("Geuzenveld");
        cy.get('.locationAddress').contains("Albardakade 3 1067 DD Amsterdam");

        cy.get('.locationName').contains("Casa Sofia");
        cy.get('.locationAddress').contains("Ottho Heldringstraat 3 1066 AZ Amsterdam");
        cy.get('.dataAvailable').contains("Gegevens niet beschikbaar");

        cy.get('.locationName').contains("Osdorp");
        cy.get('.locationName').contains("Postjesweg");
        cy.get('.locationName').contains("Slotermeer");
        cy.get('.locationName').contains("Slotervaar");


        //Find the all districts text and check if it invisible.
        cy.get('.visitorstext').should('not.be.visible');

        //Find the all districts name text and check if it invisible.
        cy.get('.districtName').should('not.be.visible');

        //Find the go back to district button and chosen district text and check if it visible.
        cy.get('.locationsOfADistrict').should('be.visible');

        //Check if the text show the right district name
        cy.get('.districtText').contains('Nieuw-West');

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


    //Test: valid year data
    it("Check if month chart appends with the right dropdowns", function () {
        //Start a fake server
        cy.server();

        cy.route("GET", "**",
            [{"id": 2, "name": "Nieuw-West"}]).as("districts");

        //Check if the fake request is valid
        cy.wait("@districts");

        cy.wait(2000)
        cy.route("GET", "**",
            [{
                "location_name": "Geuzenveld", "alias_name": "OBA Geuzenveld",
                "address": "Albardakade 3 1067 DD Amsterdam",
                "image": "https://www.oba.nl/dam/nieuws/0520_vestiging-geuzenveld1.jpg.rendition.792.1267.jpeg",
                "id": 2, "visitor_data": "data available"
            }]).as("location")
        cy.get(".viewLocations[data-id=0]").click();
        cy.wait("@location");

        cy.get(".choseDateChart1").should("exist");
        cy.get(".chart1").should("exist");
        cy.get(".chartAndButtonsDiv1").should("exist");

        cy.wait(2000)

        cy.route("GET", "**",
            [{id: 1, name: "Week"},
                {id: 2, name: "Maand"},
                {id: 3, name: "Kwartaal"},
                {id: 4, name: "Jaar"}]).as("dateOptions")

        cy.wait(1000)

        cy.get(".locationCard:first").click();

        cy.get(".close").should("exist");
        cy.get(".chart1").should("exist");

        cy.route("GET", "**",
            [{year: 2015},
                {year: 2016},
                {year: 2017},
                {year: 2018},
                {year: 2019},
                {year: 2020}]).as("years")

        cy.wait(1000)

        cy.get(".dateDropdown").should("exist");
        //Click dropdown option: month
        cy.get(".dateDropdown-item[data-id=1]").click({force: true});

        cy.route("GET", "**",
            [{name: "Januari"},
                {name: "Februari"},
                {name: "Maart"},
                {name: "April"},
                {name: "Mei"},
                {name: "Juni"},
                {name: "Juli"},
                {name: "Augustus"},
                {name: "September"},
                {name: "Oktober"},
                {name: "November"},
                {name: "December"},
            ]).as("allMonthsOfAYear")

        cy.wait(1000)

        cy.get(".yearDropdown1").should("exist");
        //Click dropdown year option: 2019
        cy.get(".yearDropdown-item[data-id=4]").click({force: true});

        cy.wait(1000)

//Gets visitor data of a month (only 2 weeks)
        cy.route("GET", "**",
            [{
                date: "43647",
                day: 1,
                location: "OBA Geuzenveld",
                month: "juli",
                visitors: 162,
                week: 27,
                weekday: "maandag",
                year: 2019
            },
                {
                    date: "43648",
                    day: 2,
                    location: "OBA Geuzenveld",
                    month: "juli",
                    visitors: 141,
                    week: 27,
                    weekday: "dinsdag",
                    year: 2019
                },
                {
                    date: "43649",
                    day: 3,
                    location: "OBA Geuzenveld",
                    month: "juli",
                    visitors: 232,
                    week: 27,
                    weekday: "woensdag",
                    year: 2019
                },
                {
                    date: "43650",
                    day: 4,
                    location: "OBA Geuzenveld",
                    month: "juli",
                    visitors: 123,
                    week: 27,
                    weekday: "donderdag",
                    year: 2019
                },
                {
                    date: "43651",
                    day: 5,
                    location: "OBA Geuzenveld",
                    month: "juli",
                    visitors: 163,
                    week: 27,
                    weekday: "vrijdag",
                    year: 2019
                },
                {
                    date: "43652",
                    day: 6,
                    location: "OBA Geuzenveld",
                    month: "juli",
                    visitors: 99,
                    week: 27,
                    weekday: "zaterdag",
                    year: 2019
                },
                {
                    date: "43653",
                    day: 7,
                    location: "OBA Geuzenveld",
                    month: "juli",
                    visitors: 0,
                    week: 27,
                    weekday: "zondag",
                    year: 2019
                },
                {
                    date: "43654",
                    day: 8,
                    location: "OBA Geuzenveld",
                    month: "juli",
                    visitors: 168,
                    week: 28,
                    weekday: "maandag",
                    year: 2019
                },
                {
                    date: "43655",
                    day: 9,
                    location: "OBA Geuzenveld",
                    month: "juli",
                    visitors: 121,
                    week: 28,
                    weekday: "dinsdag",
                    year: 2019
                },
                {
                    date: "43656",
                    day: 10,
                    location: "OBA Geuzenveld",
                    month: "juli",
                    visitors: 172,
                    week: 28,
                    weekday: "woensdag",
                    year: 2019
                },
                {
                    date: "43657",
                    day: 11,
                    location: "OBA Geuzenveld",
                    month: "juli",
                    visitors: 23,
                    week: 28,
                    weekday: "donderdag",
                    year: 2019
                },
                {
                    date: "43658",
                    day: 12,
                    location: "OBA Geuzenveld",
                    month: "juli",
                    visitors: 163,
                    week: 27,
                    weekday: "vrijdag",
                    year: 2019
                },
                {
                    date: "43659",
                    day: 13,
                    location: "OBA Geuzenveld",
                    month: "juli",
                    visitors: 63,
                    week: 27,
                    weekday: "zaterdag",
                    year: 2019
                },
                {
                    date: "43660",
                    day: 14,
                    location: "OBA Geuzenveld",
                    month: "juli",
                    visitors: 3,
                    week: 27,
                    weekday: "zondag",
                    year: 2019
                },
            ]).as("visitorDataMonth")

        cy.wait(1000)

        cy.get(".weekOrMonthDropdown1").should("exist");
        cy.wait(1000)

        cy.get(".weekOrMonthDropdown-item[data-id=6]").contains("Juli");
        //Click dropdown month option: July (it only shows half a month)
        cy.get(".weekOrMonthDropdown-item[data-id=6]").click({force: true});

    });
});
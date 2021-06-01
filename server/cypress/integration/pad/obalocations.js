//Context: location
//Create session
describe("Select Location", () => {
    //Run before each test in this context
    beforeEach(() => {
        //Set user as logged in
        const session = {"username": "test"};
        localStorage.setItem("session", JSON.stringify(session));
        cy.visit("http://localhost:8080/#obaLocation");
        cy.viewport("macbook-13")

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

        cy.wait(1000)

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
            expect(request.url).eq("http://localhost:3000/location/all?district=2");

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

        cy.wait(1000);

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

        cy.wait(1000);

        //Find the all districts text and check if it visible.
        cy.get('.visitorstext').should('be.visible');

        //Find the all districts name text and check if it visible.
        cy.get('.districtName').should('be.visible');

        //Find the go back to district button and chosen district text and check if it invisible.
        cy.get('.textdiv').should('not.be.visible');

    })


    //Test: check if month chart appends with the right dropdowns
    it("Check if month chart appends with the right dropdowns", function () {
        //Start a fake server
        cy.server();

        cy.route("GET", "**",
            [{"id": 2, "name": "Nieuw-West"}]).as("districts");

        //Check if the fake request is valid
        cy.wait("@districts");

        cy.wait(1000)
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


        cy.route("GET", "**",
            [{id: 1, name: "Week"},
                {id: 2, name: "Maand"},
                {id: 3, name: "Kwartaal"},
                {id: 4, name: "Jaar"}]).as("dateOptions");

        cy.wait(1000);

        cy.get(".locationCard").eq(0).click();

        cy.get(".close").should("exist");
        cy.get(".chart1").should("exist");

        cy.route("GET", "**",
            [{year: 2015},
                {year: 2016},
                {year: 2017},
                {year: 2018},
                {year: 2019},
                {year: 2020}]).as("years");

        cy.wait(1000);

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

        cy.wait(1000);

        cy.get(".yearDropdown1").should("exist");
        //Click dropdown year option: 2019
        cy.get(".yearDropdown-item[data-id=4]").click({force: true});

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
            ]).as("visitorDataMonth");

        cy.wait(1000);

        cy.get(".weekOrMonthDropdown1").should("exist");
        cy.wait(1000)

        cy.get(".weekOrMonthDropdown-item[data-id=6]").contains("Juli");
        //Click dropdown month option: July (it only shows half a month)
        cy.get(".weekOrMonthDropdown-item[data-id=6]").click({force: true});
    });


    //Test: check if multiple charts correctly append
    it("Check if multiple charts correctly append", function () {
        //Start a fake server
        cy.server();

        cy.route("GET", "**",
            [{"id": 2, "name": "Nieuw-West"}]).as("districts");

        //Check if the fake request is valid
        cy.wait("@districts");

        cy.wait(1000)
        //Get locations
        cy.route("GET", "**",
            [{
                "location_name": "Geuzenveld", "alias_name": "OBA Geuzenveld",
                "address": "Albardakade 3 1067 DD Amsterdam",
                "image": "https://www.oba.nl/dam/nieuws/0520_vestiging-geuzenveld1.jpg.rendition.792.1267.jpeg",
                "id": 2, "visitor_data": "data available"
            }, {
                "location_name": "Osdorp", "alias_name": "OBA Osdorp",
                "address": "Osdorpplein 16 1068 EL Amsterdam",
                "image": "https://www.oba.nl/dam/nieuws/0221_naamsvermelding-kees-hummel-vestigingen" +
                    "-oba-osdorp-interieu.png.rendition.792.1267.png",
                "id": 2, "visitor_data": "data available"
            },
                {
                    "location_name": "Slotermeer", "alias_name": "OBA Slotermeer",
                    "address": "Slotermeerlaan 103E 1063 JN Amsterdam",
                    "image": "https://www.oba.nl/dam/nieuws/slotermeer_hp.jpg.rendition.792.1267.jpeg",
                    "id": 2, "visitor_data": "data available"
                }]).as("locations");
        cy.get(".viewLocations[data-id=0]").click();
        cy.wait("@locations");


        //Upper chart

        //Get data options
        cy.route("GET", "**",
            [{id: 1, name: "Week"},
                {id: 2, name: "Maand"},
                {id: 3, name: "Kwartaal"},
                {id: 4, name: "Jaar"}]).as("dateOptions")

        //Click location
        cy.get(".locationCard").eq(0).click();

        //Get labels
        cy.route("GET", "**",
            [{name: "januari", year: 2019},
                {name: "februari"},
                {name: "maart"}]).as("data")

        //Click data option: year
        cy.get(".dateDropdown-item[data-id=3]").click({force: true});
        //Gets visitor data of a year (only 3 months)
        cy.route("GET", "**",
            [{
                location: "OBA Geuzenveld",
                month: "januari",
                visitors: 18283,
                year: 2019
            },
                {
                    location: "OBA Geuzenveld",
                    month: "februari",
                    visitors: 9999,
                    year: 2019

                },
                {
                    location: "OBA Geuzenveld",
                    month: "maart",
                    visitors: 12345,
                    year: 2019
                },
            ]).as("visitorDataYear")

        //Click year 2019
        cy.get(".yearDropdown-item[data-id=0]").click({force: true});


        //Lower chart
        //Get date options
        cy.route("GET", "**",
            [{id: 1, name: "Week"},
                {id: 2, name: "Maand"},
                {id: 3, name: "Kwartaal"},
                {id: 4, name: "Jaar"}]).as("dateOptions")

        cy.get(".locationCard").eq(0).click();
        cy.get(".close").should("exist");
        cy.get(".chart1").should("exist");

        //Year options
        cy.route("GET", "**",
            [{year: 2015},
                {year: 2016},
                {year: 2017},
                {year: 2018},
                {year: 2019},
                {year: 2020}]).as("years")


        //Click dropdown option: month
        cy.get(".chartAndButtonsDiv2 .dateDropdown-item[data-id=1]").click({force: true});

        //Get all months
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


        //Click dropdown year option: 2019
        cy.get(".yearDropdown-item[data-id=4]").click({force: true});

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
                }
            ]).as("visitorDataMonth")

        cy.get(".weekOrMonthDropdown2").should("exist");
        cy.get(".weekOrMonthDropdown-item[data-id=6]").contains("Juli");
        //Click dropdown month option: July (it only shows half a month)
        cy.get(".weekOrMonthDropdown-item[data-id=6]").click({force: true});
        cy.wait(2000)
        cy.get(".locationCard").eq(1).click();
        cy.wait(2000);
        //Remove the lower chart
        cy.get(".chartAndButtonsDiv2 .close").click({multiple: true, force: true});
        cy.wait(1000);
        cy.get(".locationCard").eq(2).click();
    });


    //Test: failed to load districts
    it("Failed to load districts", function () {
        //Start a fake server
        cy.server();

        //Add a stub with the URL /location/districts as a GET
        //Respond with a JSON-object when requested and set the status-code tot 401.
        //Give the stub the alias: @districts
        cy.route({
            method: "GET",
            url: "/location/districts",
            response: {
                reason: "ERROR"
            },
            status: 401
        }).as("districts");

        cy.wait("@districts");

        //After a failed to load districts, an element containing our error-message should be shown.
        cy.get(".error").should("exist").should("contain",
            "ERROR: kan stadsdelen niet laden.");
        cy.wait(3000)
    });

    //Test: failed to load locations
    it("Failed to load locations", function () {
        //Start a fake server
        cy.server();

        //Make a fake districts GET response
        cy.route("GET", "**",
            [{"id": 1, "name": "Centrum"}, {"id": 2, "name": "Nieuw-West"},
                {"id": 3, "name": "Noord"}, {"id": 4, "name": "Oost"},
                {"id": 5, "name": "Ouder-Amstel"}, {"id": 6, "name": "West"},
                {"id": 7, "name": "Zuid"}, {"id": 8, "name": "Zuidoost"}
            ]).as("districts");

        //Add a stub with the URL /location/all as a GET
        //Respond with a JSON-object when requested and set the status-code tot 401.
        //Give the stub the alias: @locations
        cy.route({
            method: "GET",
            url: "/location/all?district=2",
            response: {
                reason: "ERROR"
            },
            status: 401
        }).as("locations");

        cy.get(".viewLocations[data-id=1]").click();
        cy.wait("@locations");
        //After a failed to load locations, an element containing our error-message should be shown.
        cy.get(".error").should("exist").should("contain", "ERROR: kan locaties niet laden.");
        cy.wait(3000)
    });

    //Test: failed to load date options
    it("Failed to load date options", function () {
        //Start a fake server
        cy.server();

        //Make a fake districts GET response
        cy.route("GET", "**",
            [{"id": 1, "name": "Centrum"}, {"id": 2, "name": "Nieuw-West"},
                {"id": 3, "name": "Noord"}, {"id": 4, "name": "Oost"},
                {"id": 5, "name": "Ouder-Amstel"}, {"id": 6, "name": "West"},
                {"id": 7, "name": "Zuid"}, {"id": 8, "name": "Zuidoost"}
            ]).as("districts");

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
                    "location_name": "Slotervaart", "alias_name": "OBA Slotervaart",
                    "address": "Deze vestiging is gesloten.",
                    "image": "https://www.oba.nl/dam/bestanden/0819_oba-slotervaartexterieur1280x960.jpg." +
                        "rendition.384.614.jpeg",
                    "id": 2, "visitor_data": "data available"
                }]).as("locations");

        cy.get(".viewLocations[data-id=1]").click();

        //Add a stub with the URL /location/allDate as a GET
        //Respond with a JSON-object when requested and set the status-code tot 401.
        //Give the stub the alias: @dateOptions
        cy.route({
            method: "GET",
            url: "/location/allDate",
            response: {
                reason: "ERROR"
            },
            status: 401
        }).as("dateOptions");

        cy.get(".locationCard").eq(2).click();
        cy.wait("@dateOptions");
        //After a failed to load date options, an element containing our error-message should be shown.
        cy.get(".error").should("exist").should("contain", "ERROR: kan periode opties niet laden.");
        cy.wait(3000)
    });

    //Test: failed to load year options
    it("Failed to load year options", function () {
        //Start a fake server
        cy.server();

        //Make a fake districts GET response
        cy.route("GET", "**",
            [{"id": 1, "name": "Centrum"}, {"id": 2, "name": "Nieuw-West"},
                {"id": 3, "name": "Noord"}, {"id": 4, "name": "Oost"},
                {"id": 5, "name": "Ouder-Amstel"}, {"id": 6, "name": "West"},
                {"id": 7, "name": "Zuid"}, {"id": 8, "name": "Zuidoost"}
            ]).as("districts");

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
                    "location_name": "Slotervaart", "alias_name": "OBA Slotervaart",
                    "address": "Deze vestiging is gesloten.",
                    "image": "https://www.oba.nl/dam/bestanden/0819_oba-slotervaartexterieur1280x960.jpg." +
                        "rendition.384.614.jpeg",
                    "id": 2, "visitor_data": "data available"
                }]).as("locations");

        cy.get(".viewLocations[data-id=1]").click();

        cy.route("GET", "**",
            [{id: 1, name: "Week"},
                {id: 2, name: "Maand"},
                {id: 3, name: "Kwartaal"},
                {id: 4, name: "Jaar"}]).as("dateOptions");

        cy.get(".locationCard").eq(2).click();

        //Add a stub with the URL /location/allYears?location=OBA Slotervaart as a GET
        //Respond with a JSON-object when requested and set the status-code tot 401.
        //Give the stub the alias: @yearOptions
        cy.route({
            method: "GET",
            url: "/location/allYears?location=OBA Slotervaart",
            response: {
                reason: "ERROR"
            },
            status: 401
        }).as("yearOptions");
        cy.get(".chartAndButtonsDiv1 .dateDropdown-item[data-id=1]").click({force: true});
        cy.wait("@yearOptions");

        //After a failed to load date options, an element containing our error-message should be shown.
        cy.get(".error").should("exist").should("contain", "ERROR: kan jaar opties niet laden.");
        cy.wait(3000)
    });

    //Test: failed to load week options, month and quarter errors works the same as this one.
    it("Failed to load week options", function () {
        //Start a fake server
        cy.server();

        //Make a fake districts GET response
        cy.route("GET", "**",
            [{"id": 1, "name": "Centrum"}, {"id": 2, "name": "Nieuw-West"},
                {"id": 3, "name": "Noord"}, {"id": 4, "name": "Oost"},
                {"id": 5, "name": "Ouder-Amstel"}, {"id": 6, "name": "West"},
                {"id": 7, "name": "Zuid"}, {"id": 8, "name": "Zuidoost"}
            ]).as("districts");

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
                    "location_name": "Slotervaart", "alias_name": "OBA Slotervaart",
                    "address": "Deze vestiging is gesloten.",
                    "image": "https://www.oba.nl/dam/bestanden/0819_oba-slotervaartexterieur1280x960.jpg." +
                        "rendition.384.614.jpeg",
                    "id": 2, "visitor_data": "data available"
                }]).as("locations");

        cy.get(".viewLocations[data-id=1]").click();

        cy.route("GET", "**",
            [{id: 1, name: "Week"},
                {id: 2, name: "Maand"},
                {id: 3, name: "Kwartaal"},
                {id: 4, name: "Jaar"}]).as("dateOptions");

        cy.get(".locationCard").eq(2).click();

        cy.route("GET", "**",
            [{year: 2015},
                {year: 2016},
                {year: 2017},
                {year: 2018},
                {year: 2019},
                {year: 2020}]).as("years");
        cy.get(".chartAndButtonsDiv1 .dateDropdown-item[data-id=0]").click({force: true});

        //Add a stub with the URL /location/allMonthsOfAYear as a GET
        //Respond with a JSON-object when requested and set the status-code tot 401.
        //Give the stub the alias: @monthOptions
        cy.route({
            method: "GET",
            url: "/location/allWeeksOfAYear?location=OBA Slotervaart&year=2015",
            response: {
                reason: "ERROR"
            },
            status: 401
        }).as("weekOptions");

        cy.get(".chartAndButtonsDiv1 .yearDropdown-item[data-id=0]").click({force: true});
        cy.wait("@weekOptions");

        //After a failed to load date options, an element containing our error-message should be shown.
        cy.get(".error").should("exist").should("contain", "ERROR: kan week opties niet laden.");
        cy.wait(3000)
    });
});
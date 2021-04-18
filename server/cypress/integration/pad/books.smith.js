//Context: books
//Create session
describe("Create Books Mark Smith", () => {
    //Run before each test in this context
    beforeEach(() => {
        const session = {"username": "test"};
        localStorage.setItem("session", JSON.stringify(session));
        cy.visit("http://localhost:8080/#books");
    });

    //Test: Successful search results for Reeve
    it("Successful search for Reeve", function () {
        cy.server();


        cy.route("GET", "**", {"metadata": "Dit is een test van Mark Smith", "results": [{
                "id": "|oba-catalogus|1227153",
                "coverimages": ["https://cover.biblion.nl/coverlist.dll?doctype=morebutton&bibliotheek=oba&style=0&ppn=42304057X&isbn=9789026147920&lid=&aut=&ti=&size=70",
                    "https://v112.nbc.bibliotheek.nl/thumbnail?uri=http://data.bibliotheek.nl/ggc/ppn/42304057X&token=c1322402"],
                "authors": ["Alex Reeve", "Noor Koch"],
                "titles": ["De schaker en het meisje", "De schaker en het meisje / Alex Reeve"],
                "description": ["318 pagina's", "318 pagina's: plattegrond ; 23 cm"],
                "languages": ["Nederlands", "Engels"],
                "summaries": ["Rond 1880 gaat in Londen de transgendere assistent-lijkschouwer Leo Stanhope op zoek naar de moordenaar van zijn geliefde, de prostituee Maria."],
                "genres": ["Historische roman", "Thriller"],
                "year": "2019",
                "publisher": ["De Fontein, Utrecht, december 2019"],
                "isbn": ["9789026147920"]
            }, {
                "id": "|oba-catalogus|123456",
                "coverimages": ["https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSdoTj8rO6uYTZbjJpC8blm3MzlS1zRx1BGFHEqGvY64a0VYsawLNJYGMK1xptcEvtMVHKarH0fSzc8csOYtUP7iRDCXsqiFb93ByYimJoI0f-lq6_d-bjhzpdNPWA&usqp=CAc",
                    "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSdoTj8rO6uYTZbjJpC8blm3MzlS1zRx1BGFHEqGvY64a0VYsawLNJYGMK1xptcEvtMVHKarH0fSzc8csOYtUP7iRDCXsqiFb93ByYimJoI0f-lq6_d-bjhzpdNPWA&usqp=CAc"],
                "authors": ["Heisenberg", "Feynman"],
                "titles": ["Quantum mechanics", "An introduction to Quantum mechanics"],
                "description": ["543 pagina's"],
                "languages": ["Engels"],
                "summaries": ["Firm introduction to the subject"],
                "genres": ["Science"],
                "year": "1965",
                "publisher": ["Oxford"],
                "isbn": ["43243"]
            }
            ]}).as("search");

        cy.get("#inputSearch").type("Reeve");

        //Find the button to search and click it.
        cy.get("#searchButton").click();

        //Wait for the @search-stub to be called by the click-event.
        cy.wait("@search")
            .then(request => {
                console.log(request.url);
                expect(request.url).eq("http://localhost:3000/books/searchNew?q=Reeve")

                expect(request.response.body["metadata"]).eq("Dit is een test van Mark Smith");

                expect(request.response.body["results"]).to.have.lengthOf(2);

                expect(request.response.body["results"][0].titles.length).eq(2);
                expect(request.response.body["results"][0].titles[0]).eq("De schaker en het meisje");
                expect(request.response.body["results"][0].titles[1]).eq("De schaker en het meisje / Alex Reeve");
                expect(request.response.body["results"][0].genres.length).eq(2);
                expect(request.response.body["results"][0].genres[0]).eq("Historische roman");
                expect(request.response.body["results"][0].genres[1]).eq("Thriller");

                expect(request.response.body["results"][1].titles.length).eq(2);
                expect(request.response.body["results"][1].titles[0]).eq("Quantum mechanics");
                expect(request.response.body["results"][1].titles[1]).eq("An introduction to Quantum mechanics");
                expect(request.response.body["results"][1].genres.length).eq(1);
                expect(request.response.body["results"][1].genres[0]).eq("Science");
            });

        //The @search is called, check the contents of the incoming request.

    });

})


//Context: books
//Create session
describe("Create Books", () => {
    //Run before each test in this context
    beforeEach(() => {
        //Set user as logged in
        const session = {"username": "test"};
        localStorage.setItem("session", JSON.stringify(session));
        cy.visit("http://localhost:8080/#books");
    });

    //Test: Valid search page
    it("Valid search results", function () {

        //Find the field for the searchbox, check if it exists.
        cy.get("#inputSearch").should("exist");

        //Find the button to search, check if it exists.
        cy.get("#searchButton").should("exist");

        //Find the table bar, check if it invisible.
        cy.get('#tableBar').should('not.be.visible');

        //Find the OBA search information text, check if it visible.
        cy.get('#searchText').should('be.visible');

        //Find the OBA search banner image, check if it visible.
        cy.get('#catalogImage').should('be.visible');
    });

    //Test: Successful search results
    it("Successful search results", function () {
        //Start a fake server
        cy.server();

        //Show the first 2 results of the search term: "pad"
        cy.route("GET", "**", {"metadata": "Search for pad", "results": [{
                "id": "|oba-catalogus|668032",
                "coverimages": ["https://cover.biblion.nl/coverlist.dll?doctype=morebutton&bibliotheek=oba&" +
                "style=0&ppn=302331697&isbn=9789055661404&lid=&aut=&ti=&size=70",
                    "https://v112.nbc.bibliotheek.nl/thumbnail?uri=http://data.bibliotheek.nl/ggc/ppn/302331697" +
                    "&token=c1322402"],
                "authors": ["Stephen Savage", "T. Dijkhof"],
                "titles": ["Pad", "Pad / Stephen Savage"],
                "description": ["32 p", "32 p: ill ; 28 cm"],
                "languages": ["Nederlands", "Engels"],
                "summaries": ["Informatie over de pad wat betreft zijn voedsel, waar hij voorkomt, levenscyclus " +
                "en bedreigingen. Met veel kleurenfoto's. Vanaf ca. 8 t/m 10 jaar."],
                "year": "2007",
                "publisher": ["Corona, Etten-Leur, cop. 2007"],
                "isbn": ["9789055661404"]
            }, {
                "id": "|oba-catalogus|1151097",
                "coverimages": ["https://cover.biblion.nl/coverlist.dll?doctype=morebutton&bibliotheek=oba&style=0" +
                "&ppn=398125236&isbn=9789022575970&lid=&aut=&ti=&size=70",
                    "https://v112.nbc.bibliotheek.nl/thumbnail?uri=http://data.bibliotheek.nl/ggc/ppn/398125236&" +
                    "token=c1322402"],
                "authors": ["Robert Galbraith", "Sabine Mutsaers"],
                "titles": ["Het slechte pad", "Het slechte pad / Robert Galbraith"],
                "description": ["575 pagina's", "575 pagina's ; 23 cm"],
                "languages": ["Nederlands", "Engels"],
                "summaries": ["Privédetective Cormoran Strike en zijn assistente gaan op onderzoek uit als zij op " +
                "hun kantoor een afgehakt vrouwenbeen krijgen toegestuurd."],
                "genres": ["Detectiveroman"],
                "year": "2016",
                "publisher": ["Boekerij, Amsterdam, [2016]"],
                "isbn": ["=9789022575970", "=9789402305524"]
            }
            ]}).as("search");

        //Find the field for the search and type the text "pad".
        cy.get("#inputSearch").type("pad");

        //Find the button to search and click it.
        cy.get("#searchButton").click();

        //Wait for the @search-stub to be called by the click-event.
        cy.wait("@search")
            .then(request => {
                console.log(request.url);
                expect(request.url).eq("http://localhost:3000/books/searchNew?q=pad")

                expect(request.response.body["metadata"]).eq("Search for pad");

                expect(request.response.body["results"]).to.have.lengthOf(2);

                expect(request.response.body["results"][0].titles.length).eq(2);
                expect(request.response.body["results"][0].titles[0]).eq("Pad");
                expect(request.response.body["results"][0].titles[1]).eq("Pad / Stephen Savage");

                expect(request.response.body["results"][1].titles.length).eq(2);
                expect(request.response.body["results"][1].titles[0]).eq("Het slechte pad");
                expect(request.response.body["results"][1].titles[1]).eq("Het slechte pad / Robert Galbraith");
                expect(request.response.body["results"][1].genres.length).eq(1);
                expect(request.response.body["results"][1].genres[0]).eq("Detectiveroman");
            });

        //Find the table bar, check if it visible.
        cy.get('#tableBar').should('be.visible');

        //Find the OBA search information text, check if it invisible.
        cy.get('#searchText').should('not.be.visible');

        //Find the OBA search banner image, check if it invisible.
        cy.get('#catalogImage').should('not.be.visible');

        //Wait to see the search results before going to next test
        cy.wait(2000);
    });

    //Test: Failed search
    it("Failed search", function () {
        //Start a fake server
        cy.server();

        //Add a stub with the URL /books/searchNew?q=pad as a GET
        //Respond with a JSON-object when requested and set the status-code tot 401.
        //Give the stub the alias: @search
        cy.route({
            method: "GET",
            url: "/books/searchNew?q=pad",
            response: {
                reason: "ERROR"
            },
            status: 401
        }).as("search");

        //Find the field for the search and type the text "pad".
        cy.get("#inputSearch").type("pad");

        //Find the button to search and click it.
        cy.get("#searchButton").click();

        //Wait for the @search-stub to be called by the click-event.
        cy.wait("@search");

        //After a failed search, an element containing our error-message should be shown.
        cy.get(".error").should("exist").should("contain", "ERROR");
    });
});


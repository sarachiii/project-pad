/**
 * Controller responsible for all events in view and setting data
 *
 * @author Pim Meijer
 */
class BooksController {

    constructor() {
        this.booksRepository = new BooksRepository();

        $.get("views/books.html")
            .done((data) => this.setup(data))
            .fail(() => this.error());
    }

    //Called when the login.html has been loaded
    setup(data) {
        //Load the login-content into memory
        this.booksView = $(data);

        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.booksView);

        this.booksView.find("#searchButton").on("click", (event) => this.onSearchBook(event));
    }

    /**
     * Async function that does a login request via repository
     * @param event
     */
    // async getAllBooks(event) {
    //
    //     try{
    //         //await keyword 'stops' code until data is returned - can only be used in async function
    //         const BOOKS = await this.booksRepository.getAll();
    //
    //         app.loadController(BOOKS);
    //
    //     } catch(e) {
    //         //if unauthorized error show error to user
    //         if(e.code === 401) {
    //             this.loginView
    //                 .find(".error")
    //                 .html(e.reason);
    //         } else {
    //             console.log(e);
    //         }
    //     }
    // }

    //Called when the login.html failed to load
    error() {
        $(".content").html("Failed to load content!");
    }

    async onSearchBook(event) {
        event.preventDefault();
        const searchterm = this.booksView.find("#inputSearch").val();

        try {
            let promise = await this.booksRepository.searchNew(searchterm);
            let results = promise["results"];
            console.log(promise);
            console.log(results);

            let booksTable = $("#books");
            booksTable.empty();
            for (let i = 0; i < results.length; i++) {
                // de nodige html code ophalen uit een extern html bestand
                $.get("views/booksTable.html", function (tabel) {
                    booksTable.append(tabel)
                    booksTable.find('.id.d-none').text(results[i]['id']);
                    booksTable.find('.id').removeClass("d-none");
                    booksTable.find('.title.d-none').text(results[i]['titles']);
                    booksTable.find('.title').removeClass("d-none");
                    booksTable.find('.auteur.d-none').text(results[i]['authors']);
                    booksTable.find('.auteur').removeClass("d-none");
                    booksTable.find('.genre.d-none').text(results[i]['genres']);
                    booksTable.find('.genre').removeClass("d-none");
                });
            }
        } catch (e) {
            //if unauthorized error show error to user
            if (e.code === 401) {
                this.booksView
                    .find(".error")
                    .html(e.reason);
            } else {
                console.log(e);
            }
        }
    }
}

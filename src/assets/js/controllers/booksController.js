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
                    const rij = $(tabel);
                    //booksTable.append(tabel)

                    /* BOOK COVER IMAGE */

                    //Retrieve image URL from OBA API
                    let book = results[i]['coverimages'];
                    let firstLink = book[0];

                    //Create the image
                    var img = new Image();
                    img.src = firstLink;

                    let height;
                    let width;

                    //When the image is loaded, read the size properties
                    img.onload = function() {
                        height = img.height;
                        width = img.width;

                        $(`#coverImage`).attr("id", "coverImage" + i); //increase ID by i to make it unique every loop

                        if(height == 1 || width == 1){
                            $(`#coverImage` + i).attr('src', "https://v112.nbc.bibliotheek.nl/thumbnail?uri=" +
                                "//http://data.bibliotheek.nl/ggc/ppn/820177083&token=c1322402");
                        } else {
                            $(`#coverImage` + i).attr('src', firstLink);
                        }
                    };

                    $(`.image`).removeClass("d-none");
                    $('.title.d-none').text(results[i]['titles']);
                    $('.title').removeClass("d-none");
                    $('.auteur.d-none').text(results[i]['authors']);
                    $('.auteur').removeClass("d-none");

                    let genre = results[i]['genres'];

                    if(genre == null){
                        $('.genre.d-none').text("-");
                    }
                    $('.genre.d-none').text(genre);
                    $('.genre').removeClass("d-none");
                    $(".infoButton .d-none").on('click', function (e) {
                        // prevent default submit van button
                        e.preventDefault();
                    });
                    rij.find(`.infoButton`).attr(`data-id`, i);
                    rij.find('.infoButton').removeClass("d-none");
                    $("#books").on('click', '.infoButton', function () {
                        console.log(i);
                        let book = results[i]['coverimages'];
                        let firstLink = book[0];
                        const bookInfo = $("#bookInfo");
                        bookInfo.find(".img-thumbnail").attr("src", firstLink);
                        bookInfo.find(".information .authors span").text(results[i]['authors']);
                        bookInfo.find(".information .description span").text(results[i]['description']);
                        bookInfo.find(".information .genre span").text(results[i]['genres']);
                        bookInfo.find(".information .languages span").text(results[i]['languages']);
                        bookInfo.find(".information .isbn span").text(results[i]['isbn']);
                        bookInfo.find(".information .publisher span").text(results[i]['publisher']);
                        bookInfo.find(".information .year span").text(results[i]['year']);
                    });
                    booksTable.append(rij);
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
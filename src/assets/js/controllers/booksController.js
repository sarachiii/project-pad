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

    //Called when the books.html has been loaded
    setup(data) {
        //Load the books-content into memory
        this.booksView = $(data);

        //Empty the content-div and add the resulting view to the page
        $(".submenu").empty();
        $(".content").empty().append(this.booksView);

        //Change colour of navbar item
        $(".nav-item").removeClass("active");
        $(".booksItem").addClass("active");

        //Prevent the page from refreshing after pressing enter
        $("#searchForm").submit(function() {
            return false;
        });

        //When enter is pressed, the search function is performed
        $("#inputSearch").keyup(function (event){
            if(event.code === "Enter"){
                $("#searchButton").click();
            }
        });

        this.booksView.find("#searchButton").on("click",
            (event) => this.onSearchBook(event));
    }

    //Called when the books.html failed to load
    error() {
        $(".content").html("Failed to load content!");
    }

    /**
     * Async function that does a search request via repository
     * @param event
     */
    async onSearchBook(event) {
        event.preventDefault();
        const searchterm = this.booksView.find("#inputSearch").val();

        try {
            let promise = await this.booksRepository.searchNew(searchterm);

            let results = promise["results"];

            //Change some elements to visible or invisible
            this.booksView.find("#tableBar").removeClass("d-none");
            this.booksView.find("#searchText").addClass("d-none");
            this.booksView.find("#catalogImage").addClass("d-none");

            let booksTable = $("#books");
            booksTable.empty();
            for (let i = 0; i < results.length; i++) {
                //Get code from external html file
                $.get("views/booksTable.html", function (table) {
                    const row = $(table);

                    $('#tableRow').attr("id", "tableRow" + i); //increase ID by i to make all the rows unique

                    /* BOOK COVER IMAGE */

                    //Retrieve image URL from OBA API
                    let book = results[i]['coverimages'];
                    let firstLink = book[0];

                    //Retrieve title with author from OBA API
                    let title = results[i]['titles'];
                    let firstTitle = title[0];

                    //Create the image
                    var img = new Image();
                    img.src = firstLink;

                    let height;
                    let width;

                    //When the image is loaded, read the size properties
                    img.onload = function () {
                        height = img.height;
                        width = img.width;

                        row.find('#coverImage').attr("id", "coverImage" + i); //increase ID by i to make it unique every loop

                        if (height == 1 || width == 1) {
                            row.find(`#coverImage` + i).attr('src', "https://v112.nbc.bibliotheek.nl/thumbnail?uri=" +
                                "//http://data.bibliotheek.nl/ggc/ppn/820177083&token=c1322402");
                        } else {
                            row.find(`#coverImage` + i).attr('src', firstLink);
                        }
                    };
                    row.find('.image').removeClass("d-none");
                    row.find('.title.d-none').text(firstTitle);
                    row.find('.title').removeClass("d-none");
                    row.find('.auteur.d-none').text(results[i]['authors']);
                    row.find('.auteur').removeClass("d-none");

                    let genre = results[i]['genres'];
                    if (genre == null) {
                        row.find('.genre.d-none').text("-");
                    } else {
                        row.find('.genre.d-none').text(genre);
                    }
                    row.find('.genre').removeClass("d-none");

                    $(".infoButton .d-none").on('click', function (e) {
                        // prevent default submit van button
                        e.preventDefault();
                    });
                    row.find('.infoButton').attr(`data-id`, i);
                    row.find('.infoButton').removeClass("d-none");

                    /* Pop-up info screen*/
                    $("#books").on('click', '.infoButton[data-id="' + i + '"]', function () {
                        console.log(results[i]);
                        let description = results[i]['description'];
                        let lastDescription = description[1];

                        const bookInfo = $("#bookInfo");

                        if (height == 1 || width == 1) {
                            bookInfo.find(".img-fluid").attr('src', "https://v112.nbc.bibliotheek.nl/thumbnail?uri=" +
                                "//http://data.bibliotheek.nl/ggc/ppn/820177083&token=c1322402");
                        } else {
                            bookInfo.find(".img-fluid").attr('src', firstLink);
                        }
                        bookInfo.find(".title span").text(firstTitle);
                        bookInfo.find(".summaries span").text(results[i]['summaries']);
                        bookInfo.find(".information .authors span").text(results[i]['authors']);
                        bookInfo.find(".information .description span").text(lastDescription);
                        bookInfo.find(".information .genre span").text(results[i]['genres']);
                        bookInfo.find(".information .languages span").text(results[i]['languages']);
                        bookInfo.find(".information .isbn span").text(results[i]['isbn']);
                        bookInfo.find(".information .publisher span").text(results[i]['publisher']);
                        bookInfo.find(".information .siso span").text(results[i]['siso']);
                    });
                    booksTable.append(row);

                    document.getElementById("addBook").addEventListener("click", function () {
                            document.getElementById("addBook").innerHTML = "Boek geleend!"
                            $("#addBook").prop("disabled", true);
                    });
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

    onBorrowBook(event, id, title, author, genre, image, recap) {
        event.preventDefault();
        this.booksRepository.addBook(id, title, author, genre, image, recap);
    }
}

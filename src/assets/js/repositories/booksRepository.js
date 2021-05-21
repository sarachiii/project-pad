/**
 *
 * @author Sarah Chrzanowska-Buth & Nazlıcan Eren
 */
class BooksRepository {

    constructor() {
        this.route = "/books"
    }

    async searchNew(searchterm) {
        return await networkManager
            .doRequest(`${this.route}/searchNew?q=${searchterm}`, null, "GET");
    }

    async addBook(id, title, author, genre, image, recap) {
        return await networkManager
            .doRequest(`${this.route}/addBook`, {"idBook" : id, "Title" : title, "Author" : author,
                "Genre" : genre, "Image" : image, "Recap" : recap}, "POST");
    }
}

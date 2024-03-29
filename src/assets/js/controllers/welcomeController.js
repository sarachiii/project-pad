/**
 * Responsible for handling the actions happening on welcome view
 */
class WelcomeController {
    constructor() {

        $.get("views/welcome.html")
            .done((data) => this.setup(data))
            .fail(() => this.error());
    }

    //Called when the welcome.html has been loaded
    setup(data) {
        //Load the welcome-content into memory
        this.welcomeView = $(data);

        //Set the name in the view from the session
        this.welcomeView.find(".name").html(sessionManager.get("username"));

        //Make navbar items visible
        $(".dashboardItem").removeClass("hide-navigation-item");
        $(".booksItem").removeClass("hide-navigation-item");
        $(".uploadItem").removeClass("hide-navigation-item");
        $(".obaLocationItem").removeClass("hide-navigation-item");
        $(".logout").removeClass("hide-navigation-item");

        //Change colour of navbar item
        $(".dashboardItem").find("a").css("color", "black");
        $(".booksItem").find("a").css("color", "black");
        $(".uploadItem").find("a").css("color", "black");
        $(".obaLocationItem").find("a").css("color", "black");

        //Hide logout button
        $(".logout").removeClass("hide-navigation-item");

        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.welcomeView);

    }

    /**
     * async function that retrieves a kamer by its id via repository
     * @param roomId the room id to retrieve
     */
    async fetchRooms(roomId) {
        const exampleResponse = this.welcomeView.find(".example-response");
        try {
            //await keyword 'stops' code until data is returned - can only be used in async function
            const roomData = await this.roomExampleRepository.get(roomId);

            exampleResponse.text(JSON.stringify(roomData, null, 4));
        } catch (e) {
            console.log("error while fetching rooms", e);

            //for now just show every error on page, normally not all errors are appropriate for user
            exampleResponse.text(e);
        }
    }

    //Called when the login.html fails to load
    error() {
        $(".content").html("Failed to load content!");
    }
}
/**
 * Responsible for handling the actions happening on submenu view
 */
class SubmenuController {
    constructor() {
        $.get("views/submenu.html")
            .done((data) => this.setup(data))
            .fail(() => this.error());
    }

    //Called when the navbar.html has been loaded
    setup(data) {
        //Load the sidebar-content into memory
        const submenuView = $(data);

        //Find all anchors and register the click-event
        submenuView.find(".btn").on("click", this.handleClickMenuItem);

        //Empty the submenu-div and add the resulting view to the page
        $(".submenu").empty().append(submenuView);
    }

    handleClickMenuItem() {
        //Get the data-controller from the clicked element (this)
        const controller = $(this).attr("data-controller");

        //Pass the action to a new function for further processing
        app.loadController(controller);

        //Return false to prevent reloading the page
        return false;
    }

    //Called when the submenu.html failed to load
    error() {
        $(".content").html("Failed to load the submenu!");
    }
}

/**
 * Responsible for handling the actions happening on sidebar view
 *
 * @author Lennard Fonteijn, Pim Meijer
 */
class DashboardController {
    constructor() {
        $.get("views/dashboard.html")
            .done((data) => this.setup(data))
            .fail(() => this.error());
    }

    //Called when the dashboard.html has been loaded
    setup(data) {
        //Load the dashboard-content into memory
        this.dashboardView = $(data);

        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.dashboardView);
    }

    //Called when the dashboard.html failed to load
    error() {
        $(".content").html("Failed to load the sidebar!");
    }



}


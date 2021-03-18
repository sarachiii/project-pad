class chartBusyLocationController {
    constructor() {
        $.get("views/busyLocations.html")
            .done((data) => this.setup(data))
            .fail(() => this.error());
    }

    //Called when the dashboard.html has been loaded
    setup(data) {
        //Load the dashboard-content into memory
        this.busyLocations = $(data);

        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.busyLocations);
    }

    //Called when the dashboard.html failed to load
    error() {
        $(".content").html("Failed to load the chart!");
    }

}
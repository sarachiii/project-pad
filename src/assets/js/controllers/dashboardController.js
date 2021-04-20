/**
 * Responsible for handling the actions happening on sidebar view
 *
 * @author Lennard Fonteijn, Pim Meijer
 */
class DashboardController {
    constructor() {
        this.dashboardRepository = new dashboardRepository();

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

//Adding 1st featured picture to the dashbord
let photoLink = "https://www.paagman.nl/autoimg/56505382/900x900/resize/w/weerwolfbende-dolfje-weerwolfje.jpg"

$("#book1").attr("src", photoLink.src);

//document.getElementById("book1").setAttribute("src", photoLink)








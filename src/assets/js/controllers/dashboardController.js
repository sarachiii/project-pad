/**
 * Responsible for handling the actions happening on sidebar view
 *
 * @author Lennard Fonteijn, Pim Meijer
 */
class DashboardController {
    constructor() {
        this.dashboardRepository = new DashboardRepository();

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
        this.loadBook();

    }

    //Called when the dashboard.html failed to load
    error() {
        $(".content").html("Failed to load the sidebar!");
    }

    //$("#book1").attr("src", photoLink.src);

    //document.getElementById("book1").setAttribute("src", photoLink)

    async loadBook() {

        try {
            //await keyword 'stops' code until data is returned - can only be used in async function

            let DASHBOARD = await this.dashboardRepository.getFeatured();

            console.log(DASHBOARD);



            app.loadController(DASHBOARD);

            //Load 1st book

            $("#book1").attr("src", DASHBOARD[0].Image);

            console.log(DASHBOARD[0])

            //Load 2nd book

            $("#book2").attr("src", DASHBOARD[1].Image);

            console.log(DASHBOARD[1])

            //Load 3th book

            $("#book3").attr("src", DASHBOARD[2].Image);

            console.log(DASHBOARD[2])

            //Load 4th book

            $("#book4").attr("src", DASHBOARD[3].Image);

            console.log(DASHBOARD[3])

            //Load 5th book

            $("#book5").attr("src", DASHBOARD[4].Image);

            console.log(DASHBOARD[4])

            //Load 6th book

            $("#book6").attr("src", DASHBOARD[5].Image);

            console.log(DASHBOARD[5])

            //Load 7th book

            $("#book7").attr("src", DASHBOARD[6].Image);

            console.log(DASHBOARD[6])

            //Load 8th book

            $("#book8").attr("src", DASHBOARD[7].Image);

            console.log(DASHBOARD[7])

            //Load 9th book

            $("#book9").attr("src", DASHBOARD[8].Image);

            console.log(DASHBOARD[8])













            //document.getElementById("book1").setAttribute("src", DASHBOARD[0])


        } catch (e) {
            //if unauthorized error show error to user
            if (e.code === 401) {
                this.dashboardView
                    .find(".error")
                    .html(e.reason);
            } else {
                console.log(e);
            }

        }
    }
}


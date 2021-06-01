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

        //Change colour of navbar item
        $(".obaLocationItem").find("a").css("color", "black");
        $(".booksItem").find("a").css("color", "black");
        $(".uploadItem").find("a").css("color", "black");
        $(".dashboardItem").find("a").css("color", "red");

        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.dashboardView);

        this.loadBook();
    }

    //Called when the dashboard.html failed to load
    error() {
        $(".content").html("Failed to load the sidebar!");
    }

    async loadBook() {

        try {
            //await keyword 'stops' code until data is returned - can only be used in async function

            let DASHBOARD = await this.dashboardRepository.getFeatured();

            app.loadController(DASHBOARD);

            //Load 1st book

            $("#book1").attr("src", DASHBOARD[0].Image);

            //Load 2nd book

            $("#book2").attr("src", DASHBOARD[1].Image);

            //Load 3th book

            $("#book3").attr("src", DASHBOARD[2].Image);


            //Load 4th book

            $("#book4").attr("src", DASHBOARD[3].Image);


            //Load 5th book

            $("#book5").attr("src", DASHBOARD[4].Image);


            //Load 6th book

            $("#book6").attr("src", DASHBOARD[5].Image);


            //Load 7th book

            $("#book7").attr("src", DASHBOARD[6].Image);


            //Load 8th book

            $("#book8").attr("src", DASHBOARD[7].Image);


            //Load 9th book

            $("#book9").attr("src", DASHBOARD[8].Image);


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


/**
 * Responsible for uploading files
 *
 * @author Lennard Fonteijn
 */
class UploadXMLController {
    constructor() {
        $.get("views/uploadXML.html")
            .done((data) => this.setup(data))
            .fail(() => this.error());
    }

    //Called when the upload.html has been loaded
    setup(data) {
        //Load the upload-content into memory
        this.welcomeView = $(data);

        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.welcomeView);

        //Change colour of navbar item
        $(".nav-item").removeClass("active");
        $(".uploadItem").addClass("active");

        //File upload
        this.welcomeView.find("#upload").on("click", function() {
            //Set the proper action url
            $(this).closest("form").attr("action", `${baseUrl}/upload`);

            //Submit the form
            $(this).submit();
        });
    }

    //Called when the login.html fails to load
    error() {
        $(".content").html("Failed to load content!");
    }
}
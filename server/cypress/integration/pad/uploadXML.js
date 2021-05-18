//Context: upload XML

//Create session
describe("XML upload", () => {
    //Run before each test in this context
    beforeEach(() => {
        //Set user as logged in
        const session = {"username": "test"};
        localStorage.setItem("session", JSON.stringify(session));
        cy.visit("http://localhost:8080/#uploadXML");
    });

    //checks if all html elements exist
    it("check existing elements", function () {

//        check form element
        cy.get("form").should("exist")

        //check first and second input
        cy.get("[type='file']")
        cy.get("[type='submit']")
    })

    it("test upload", function (){

        fileContent = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n" +
            "<oba-data-bezoekers xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n" +
            "    <record>\n" +
            "        <datum>41275</datum>\n" +
            "        <jaar>9999</jaar>\n" +
            "        <maand>januari</maand>\n" +
            "        <week>1</week>\n" +
            "        <dag>1</dag>\n" +
            "        <weekdag>dinsdag</weekdag>\n" +
            "        <vestiging>xmlUploadTest</vestiging>\n" +
            "        <bezoekers>30</bezoekers>\n" +
            "    </record>\n" +
            "    <record>\n" +
            "        <datum>41276</datum>\n" +
            "        <jaar>9999</jaar>\n" +
            "        <maand>januari</maand>\n" +
            "        <week>1</week>\n" +
            "        <dag>2</dag>\n" +
            "        <weekdag>woensdag</weekdag>\n" +
            "        <vestiging>xmlUploadTest</vestiging>\n" +
            "        <bezoekers>20</bezoekers>\n" +
            "    </record>\n" +
            "    <record>\n" +
            "        <datum>41277</datum>\n" +
            "        <jaar>9999</jaar>\n" +
            "        <maand>januari</maand>\n" +
            "        <week>1</week>\n" +
            "        <dag>3</dag>\n" +
            "        <weekdag>donderdag</weekdag>\n" +
            "        <vestiging>xmlUploadTest</vestiging>\n" +
            "        <bezoekers>10</bezoekers>\n" +
            "    </record>\n" +
            "</oba-data-bezoekers>"

        cy.server()

        cy.get('input[type="file"]').attachFile({
            fileContent: fileContent.toString(),
            fileName: 'testXML.xml',
            mimeType: 'xml/html'
        });

        cy.get("[type='submit']").click()

    })

});
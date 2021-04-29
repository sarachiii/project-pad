/**
 * Server application - contains all server config and api endpoints
 *
 * @author Pim Meijer
 */
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const db = require("./utils/databaseHelper");
const cryptoHelper = require("./utils/cryptoHelper");
const corsConfig = require("./utils/corsConfigHelper");
const app = express();
const fileUpload = require("express-fileupload");
var https = require('https');
const urlPrefix = "https://zoeken.oba.nl/api/v1/search/";
const obaPublicKey = "1e19898c87464e239192c8bfe422f280";
const obaSecret = "4289fec4e962a33118340c888699438d";

app.get("/books/searchNew", (req, res) => {
    // Note: The query string is '?q=<searchString>'
    const url = urlPrefix + `?q=${req.query.q}&authorization=${obaPublicKey}&refine=true&output=json`;
    const request = https.get(url, {
        timeout: 10000,
        headers: {
            "AquaBrowser": obaSecret,
            "User" : "Team-3",
            "Content-Type": "application/json; charset=utf-8;"
        },
    }, (obaResponse) => {
        let bodyChunks = [];
        obaResponse.on('data', (chunk) => {
            // process streamed parts here...
            bodyChunks.push(chunk);
        }).on("end", () => {
            const json = Buffer.concat(bodyChunks).toString();

            //send to the one who request this route(eg. front-end), it's already json so dont use .json(..)

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

            res.status(httpOkCode).send(json);
        })
    });

    request.on("error", err => {
        res.status(badRequestCode).json({reason: err})
    });

    request.end();
});

//logger lib  - 'short' is basic logging info
app.use(morgan("short"));

//init mysql connectionpool
const connectionPool = db.init();

//parsing request bodies from json to javascript objects
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//CORS config - Cross Origin Requests
app.use(corsConfig);

//File uploads
app.use(fileUpload());

// ------ ROUTES - add all api endpoints here ------
const httpOkCode = 200;
const badRequestCode = 400;
const authorizationErrCode = 401;

app.post("/user/login", (req, res) => {
    const username = req.body.username;

    //TODO: We shouldn't save a password unencrypted!! Improve this by using cryptoHelper :)
    const password = req.body.password;

    db.handleQuery(
        connectionPool, {
            query: "SELECT username, password FROM user WHERE username = ? AND password = ?",
            values: [username, password],
        },
        (data) => {
            if (data.length === 1) {
                //return just the username for now, never send password back!
                res.status(httpOkCode).json({ username: data[0].username });
            } else {
                //wrong username
                res
                    .status(authorizationErrCode)
                    .json({ reason: "Wrong username or password" });
            }
        },
        (err) => res.status(badRequestCode).json({ reason: err })
    );
});

//Request all books
app.get("/books/all", (req, res) => {
    db.handleQuery(
        connectionPool, {
            query: "SELECT * FROM book",
        },
        (data) => {
            //just give all data back as json
            res.status(httpOkCode).json(data);
        },
        (err) => res.status(badRequestCode).json({ reason: err })
    );
});

//Insert books into database
app.post("/books/addBook", (req, res) => {

    const id = req.body.id;
    const title = req.body.title;
    const author = req.body.author;
    const genre = req.body.genre;
    const image = req.body.image;
    const recap = req.body.recap;

    db.handleQuery(
        connectionPool, {
            query: "INSERT INTO `book` (`idBook`, `Title`, `Author`, `Genre`, `Image`, `Recap`) VALUES (?, ?, ?, ?, ?, ?)",
            values: [id, title, author, genre, image, recap],
        },
        (data) => {
            //just give all data back as json
            res.status(httpOkCode).json(data);
        },
        (err) => res.status(badRequestCode).json({reason: err})
    );
});

app.get("/location", (req, res) => {
    db.handleQuery(
        connectionPool, {
            query: "SELECT * FROM busyLocation"
        },
        (data) => {

            //just give all data back as json
            res.status(httpOkCode).json(data);
        },
        (err) => res.status(badRequestCode).json({reason: err})
    );
});

app.get("/visitoryear", (req, res) => {
    db.handleQuery(
        connectionPool, {
            query: "SELECT * FROM visitoryear"
        },
        (data) => {

            //just give all data back as json
            res.status(httpOkCode).json(data);
        },
        (err) => res.status(badRequestCode).json({reason: err})
    );
});

//Request featured books and Query featured, get books
app.get("/featured", (req, res) => {
    db.handleQuery(
        connectionPool, {
            query: "SELECT Image FROM featured"
        },
        (data) => {

            //just give all data back as json
            res.status(httpOkCode).json(data);
        },
        (err) => res.status(badRequestCode).json({reason: err})
    );
})

app.get("/visitors", (req, res) => {

    let date;
    let year;
    let month;
    let week;
    let day;
    let weekday;
    let location;
    let visitors;

    let getXMLFile = function (path) {
        let reader = new window.FileReader();
        reader.readAsText(path);
        return reader.result;
    }

    let xml = getXMLFile("./XMLData/OBA-data-bezoekers-2013-2020_xml_v1.xml");
    console.log(xml);
    processXML();

    let processXML = function (xml) {

        for (let i = 0; i < xml.getElementsByTagName("vestiging").length; i++) {

            if(xml.getElementsByTagName("year")[i] == 2013 || xml.getElementsByTagName("year")[i] == 2014) {

            } else {

                date = xml.getElementsByTagName("datum")[i].innerHTML;
                year = xml.getElementsByTagName("jaar")[i].innerHTML;
                month = xml.getElementsByTagName("maand")[i].innerHTML;
                week = xml.getElementsByTagName("week")[i].innerHTML;
                day = xml.getElementsByTagName("dag")[i].innerHTML;
                weekday = xml.getElementsByTagName("weekdag")[i].innerHTML;
                location = xml.getElementsByTagName("vestiging")[i].innerHTML;
                visitors = xml.getElementsByTagName("bezoekers")[i].innerHTML;

                db.handleQuery(
                    connectionPool, {
                        query: "INSERT INTO `visitordata` (`date`, `year`, `month`, `week`, `day`, `weekday`, `location`, `visitors`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                        values: [date, year, month, week, day, weekday, location, visitors],
                    },
                    (data) => {
                        //just give all data back as json
                        res.status(httpOkCode).json(data);
                    },
                    (err) => res.status(badRequestCode).json({reason: err})
                );
            }
        }
    }
});

//------- END ROUTES -------
module.exports = app;


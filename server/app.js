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

//dummy data example - rooms
app.post("/room_example", (req, res) => {
    db.handleQuery(
        connectionPool, {
            query: "SELECT id, surface FROM room_example WHERE id = ?",
            values: [req.body.id],
        },
        (data) => {
            //just give all data back as json
            res.status(httpOkCode).json(data);
        },
        (err) => res.status(badRequestCode).json({ reason: err })
    );
});

app.post("/upload", function(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res
            .status(badRequestCode)
            .json({ reason: "No files were uploaded." });
    }

    let sampleFile = req.files.sampleFile;

    sampleFile.mv(wwwrootPath + "/uploads/test.jpg", function(err) {
        if (err) {
            return res.status(badRequestCode).json({ reason: err });
        }

        return res.status(httpOkCode).json("OK");
    });
});

app.get("/books/all", (req, res) => {
    db.handleQuery(
        connectionPool, {
            query: "SELECT * FROM boek",
        },
        (data) => {
            //just give all data back as json
            res.status(httpOkCode).json(data);
        },
        (err) => res.status(badRequestCode).json({ reason: err })
    );
});

//------- END ROUTES -------

module.exports = app;

const https = require("https");
const obaPublicKey = "1e19898c87464e239192c8bfe422f280";
const obaSecret = "4289fec4e962a33118340c888699438d";

//example request: localhost:3000/search?q=mooi
app.get("/search", (req, res) => {
    const url = `https://zoeken.oba.nl/api/v1/search/?q=${req.query.q}&authorization=${obaPublicKey}&refine=true&output=json`;
    const request = https.get(
        url, {
            timeout: 10000,
            headers: {
                AquaBrowser: obaSecret,
                "Content-Type": "application/json; charset=utf-8;",
            },
        },
        (obaResponse) => {
            let bodyChunks = [];
            obaResponse
                .on("data", (chunk) => {
                    // process streamed parts here...
                    bodyChunks.push(chunk);
                })
                .on("end", () => {
                    const json = Buffer.concat(bodyChunks).toString();
                    //INFO: Sometimes no valid json comes back from OBA api
                    //because output=json is in beta :(

                    //send to the one who request this route(eg. front-end), it's already json so dont use .json(..)
                    res.status(httpOkCode).send(json);
                });
        }
    );

    request.on("error", (err) => {
        res.status(badRequestCode).json({ reason: err });
    });

    request.end();
});
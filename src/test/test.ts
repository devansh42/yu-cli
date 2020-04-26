#!/usr/bin/env node

//This file contains test server implimentation for testng purposes
import * as express from "express";
import * as tar from "tar";
import * as fs from "fs";
const app = express();
const testPort = 8080;

app.use(express.json()) //Middleware for parsing json object

app.post("/signup", (req, res) => {

    const { email, password } = req.body;
    if (email.toString().indexOf("@") == -1 || password.toString().length < 8) {
        res.status(400).send("Invalid Email/Password");
    }
    else if (email.toString() === "dev@gmail.com" && password.toString() === "12345678") {
        res.status(200).send("Please Login wiht given credentials");
    }
    else if (email.toString() === "dev@gmail.com" && password.toString() !== "12345678") {
        res.status(403).send("User already exists")
    }
    else {
        res.status(201).json({
            data: {
                access_token: "somesecretcode"

            }
        })
    }
})

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (email.toString().indexOf("@") == -1 || password.toString().length < 8) {
        res.status(400).send("Invalid Email/Password");
    }
    else if (email.toString() === "dev@gmail.com" && password.toString() === "12345678") {
        res.status(200).json({
            data: {
                access_token: "somesecretcode",
                email: "dev@gmail.com"
            }
        })
    }
    else if (email.toString() === "dev@gmail.com" && password.toString() !== "12345678") {
        res.status(403).send("Invalid Credentials")
    }

});

app.use((req, res, next) => { //For Login/Signup Validation
    const token = req.get("x-access-token");
    if (token === "somesecretcode") next();
    else res.status(403).send("Invalid Access Token, Please Login Again")
})


app.get("/list", (req, res) => {
    const od = req.query.only_deployed || false;
    const ans = [
        { hostname: "1.falcon.com", deployed: true },
        { hostname: "2.falcon.com", deployed: true },
        { hostname: "3.falcon.com", deployed: false },
        { hostname: "4.falcon.com", deployed: true },

    ]
    res.status(200).json({
        data: od ? ans.filter((v, i) => v.deployed == true) : ans
    });
})


app.get("/recommend", (req, res) => {
    const hostname = req.query.hostname;
    const domain = hostname.toString().split(".")[0];
    res.status(200)
        .json({
            data: { recommendings: ["s1", "s2", "s3"].map(v => domain.concat('-').concat(v)) }
        })
});

app.post("/down", (req, res) => {
    let { hostname } = req.body;
    hostname = hostname.toString();
    console.log(hostname);
    if (hostname === "deployed.site.com") {
        res.status(200);
    } else if (hostname === "another.site.com") {
        res.status(401);
    } else if (hostname === "undeployed.site.com") {
        res.status(404);
    } else {
        res.status(500);

    }
    res.send();

});
app.post("/up", (req, res) => {
    const { hostname, files } = req.body;
    console.log("Hostname:\t", hostname);
    console.log(files)

    fs.writeFileSync(".testfile.tar.gz", files, { encoding: "base64" });
    tar.t({ file: ".testfile.tar.gz" }).then(console.log);

    res.status(200).end();
});




app.listen(testPort, () => {
    console.log("Listening at 8080...")
})




const express = require("express");
const app = express();
const bodyprs = require("body-parser");
const ejs = require("ejs");
const route = express.Router();
const sqlp = require("mysql");
const port = 3000;

app.set("view engine", "ejs");

var conn = sqlp.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ims"
});

app.use(
    bodyprs.urlencoded({
        extended: true
    })
);

var datta2 = function(sq) {
    return new Promise((resolve, reject) => {
        conn.query(sq, (err, data, fields) => {
            return resolve(data);
        });
    });
};

app.post("/", (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var score = Number(req.body.score);
    var sts = req.body.sts;
    var clg = req.body.clg;
    conn.query(
        `INSERT INTO interns( name, email, score, sts, clg) VALUES('${name}','${email}',${score},'${sts}','${clg}');`
    );

    res.redirect("/");
});


// app.get("/delete", (req, res) => {
//     // var id = req.params.id;
//  res.json([{
//       name_recieved: req.body.name,
//       designation_recieved: req.body.designation
//    }])
//     // console.log("works!" + id);
//     res.redirect("/score");
// });
app.post("/request", (req, res) => {
    res.json([{
        name: req.body.name,
        did: req.body.designation
    }])
})


app.get('/ex', (req, res) => {

    res.render('ex');

});


app.get("/", (req, res) => {
    var sql = "SELECT * FROM INTERNS ;";

    conn.query(sql, (err, data, fields) => {
        res.render("index", {
            title: "lists",
            tbldata: data
        });
    });
});

app.get("/score", (req, res) => {
    var qry = "SELECT * FROM SCORES WHERE sid =28 ";
    res.render("score", {
        val: req.body.id,
        tbldata: data
    });
});

app.post("/score", async(req, res) => {
    var idval = null;

    if (req.body.id != undefined) {
        var id = req.body.id;
        var data1 = await new Promise(async(resolve, reject) => {
            var sql = "SELECT * FROM interns where id = " + id + " ;";
            idval = id;

            conn.query(sql, (err, data, fields) => {
                // console.log(data[0].name);
                resolve(data[0]);
            });
        });

        var sql = "SELECT * FROM scores where sid =" + id + " ;";
        console.log(sql);
        conn.query(sql, (err, data) => {
            if (err) throw err;

            res.render("score", {
                val: id,
                sd: data1,
                userData: data
            });
        });
    } else {
        var idvalu = idval;
        var week = req.body.week;
        var scor = req.body.score;
        var reviewer = req.body.reviewer;
        var issues = req.body.issues;
        var sugges = req.body.sugges;
        var datee = req.body.datee;
        console.log(datee + "val");
        var comment = req.body.comment;
        var valuesin = [week, scor, comment, datee];
        var sid = Number(req.body.idvu);
        console.log(valuesin);
        // var dta =document.getElementById("idv").innerHTML;
        var valq = `INSERT INTO scores(sid, week, comments, score,reviewer,issues,sugges,datee) VALUES(${sid},'${week}','${comment}',${scor},'${reviewer}','${issues}','${sugges}','${datee}');`;
        console.log(valq);
        conn.query(valq);

        conn.query(`UPDATE INTERNS SET score = ${scor} WHERE id = ${sid};`);
        console.log(sid);

        res.redirect("/");
    }
    //res.render('score',{val:id,tbldata :data[0]});}
});


app.listen(port, () => {
    console.log(`app is running at port http://localhost:${port}`);
});
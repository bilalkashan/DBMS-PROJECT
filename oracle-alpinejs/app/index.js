const express = require("express"),
    path = require("path"),
    oracledb = require("oracledb"),
    dbConfig = require("./dbconfig.js"),
    app = express();

const PORT = process.env.PORT || 5001;

app.use(express.static(path.join(__dirname, "public")))
    .use(async (req, res, next) => {
        req.conn = await oracledb.getConnection(dbConfig);
        next();
    })
    .set("views", path.join(__dirname, "views"))
    .engine("html", require("ejs").renderFile)
    .set("view engine", "html")
    .get("/", async (req, res) => {
        const result = await req.conn.execute(`SELECT * FROM student`);
        res.render("index");
    })
    .get("/data/:page", async (req, res) => {
        const page = req.params.page;
        console.log("page >> ", page);
        let sql = ``;
        switch (page) {
            case "1":
                sql = `SELECT DISTINCT(Faculty) FROM recap`;
                break;
            case "2":
                sql = `SELECT DISTINCT(Year) FROM recap ORDER BY year`;
                break;
            case "3":
                sql = `SELECT DISTINCT(Semester) FROM recap`;
                break;
            case "4":
                sql = `SELECT * FROM recap`;
                break;
        }
        console.log("sql >>", sql);
        const result = await req.conn.execute(sql);
        res.status(200).json(result);
    })
    .listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));

// // myscript.js
// // This example uses Node 8's async/await syntax.

// const oracledb = require('oracledb');

// oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// //const mypw = "hr"  // set mypw to the hr schema password

async function run() {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "hr",
            password: "hr",
            connectString: "localhost/XE",
        });

        const result = await connection.execute(
            `SELECT manager_id, department_id, department_name
       FROM departments
       WHERE manager_id = :id`,
            [103] // bind value for :id
        );
        console.log(result.rows);
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

//run();

/*
    let sql, binds, options, result;

    connection = await oracledb.getConnection(dbConfig);

    //
    // Create a table
    //

    const stmts = [
      `DROP TABLE no_example`,

      `CREATE TABLE no_example (id NUMBER, data VARCHAR2(20))`
    ];

    for (const s of stmts) {
      try {
        await connection.execute(s);
      } catch (e) {
        if (e.errorNum != 942)
          console.error(e);
      }
    }

    //
    // Insert three rows
    //

    sql = `INSERT INTO no_example VALUES (:1, :2)`;

    binds = [
      [101, "Alpha" ],
      [102, "Beta" ],
      [103, "Gamma" ]
    ];

    // For a complete list of options see the documentation.
    options = {
      autoCommit: true,
      // batchErrors: true,  // continue processing even if there are data errors
      bindDefs: [
        { type: oracledb.NUMBER },
        { type: oracledb.STRING, maxSize: 20 }
      ]
    };

    result = await connection.executeMany(sql, binds, options);

    console.log("Number of rows inserted:", result.rowsAffected);

    //
    // Query the data
    //

    sql = `SELECT * FROM no_example`;

    binds = {};

    // For a complete list of options see the documentation.
    options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
      // extendedMetaData: true,               // get extra metadata
      // prefetchRows:     100,                // internal buffer allocation size for tuning
      // fetchArraySize:   100                 // internal buffer allocation size for tuning
    };

    result = await connection.execute(sql, binds, options);

    console.log("Metadata: ");
    console.dir(result.metaData, { depth: null });
    console.log("Query results: ");
    console.dir(result.rows, { depth: null });
*/

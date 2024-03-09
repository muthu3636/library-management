const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const app = express();
const port = process.env.PORT || 5002;
app.use(bodyParser.json());
app.use(cors());
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "muthumysql",
  database: "libr",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to the MySql database");
});


app.get("/library-details", (req, res) => {
    db.query("SELECT * FROM book_details", (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal error");
      } else {
        res.status(200).json(results);
      }
    });
  });



app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      throw new Error("Username and password are required.");
    }

    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      throw new Error("Username already exists. Choose another one.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO user_detail (username, password) VALUES (?, ?)",
      [username, hashedPassword],
      (err, result) => {
        if (err) {
          throw err;
        }
        console.log("User registered:", username);
        res
          .status(200)
          .json({ success: true, message: "User registered successfully." });
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

function getUserByUsername(username) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM user_detail WHERE username = ?",
      [username],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      }
    );
  });
}

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      throw new Error("Username and password are required.");
    }

    const user = await getUserByUsername(username);
    if (!user) {
      throw new Error("Invalid username or password.");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid username or password.");
    }

    res.status(200).json({ success: true, message: "Login successful." });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(401).json({ success: false, message: error.message });
  }
});
app.post("/submit", (req, res) => {
  const { empname, empId, phonenumber, dop } = req.body;

  const sql =
    "INSERT INTO book_details (book_name, dop, author, subject) VALUES (?, ?, ?, ?)";
  db.query(sql, [empname, dop, empId, phonenumber], (err, result) => {
    if (err) {
      console.error("Error executing MySQL query: " + err.message);
      res
        .status(500)
        .json({ success: false, message: "Failed to submit form" });
      return;
    }
    console.log("Form data inserted:", result);
    res.json({ success: true, message: "Form submitted successfully" });
  });
});

app.listen(port, () => {
  console.log("Listening Port: " + port);
});




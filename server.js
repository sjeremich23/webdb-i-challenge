const express = require("express");
const db = require("./data/dbConfig.js");

const server = express();
server.use(express.json());

server.get("/", (req, res) => {
  db.select("*")
    .from("accounts")
    .limit(2)
    .then(accounts => {
      res.status(200).json({ accounts });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        err,
        Error: "Internal Error:  Cannot Retrieve Data from Database"
      });
    });
});

server.get("/:id", (req, res) => {
  const { id } = req.params;

  db.select("*")
    .from("accounts")
    .where({ id })
    .first()
    .then(account => {
      res.status(200).json(account);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        err,
        Error: "Internal Error:  Cannot Retrieve Data from Database"
      });
    });
});

server.post("/", (req, res) => {
  const accountData = req.body;

  db("accounts")
    .insert(accountData, "id")
    .then(ids => {
      const id = ids[0];

      db("accounts")
        .select("id", "name", "budget")
        .where({ id })
        .first()
        .then(account => {
          res
            .status(200)
            .json({ account, Message: "Successfully Added to Database" });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        err,
        Error: "Internal Error:  Cannot add Data to the Database"
      });
    });
});

server.put("/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  db("accounts")
    .where({ id })
    .update(changes)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ Message: `${count} record(s) updated` });
      } else {
        res.status(404).json({ Message: "Post Not Found" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        err,
        Error: "Internal Error:  Cannot update data to the database"
      });
    });
});

server.delete("/:id", (req, res) => {
  const { id } = req.params;

  db("accounts")
    .where({ id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(200).json({ Message: `${count} record(s) deleted` });
      } else {
        res.status(404).json({ Message: "Post Not Found" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        err,
        Error: "Internal Error:  Cannot remove data to the database"
      });
    });
});

module.exports = server;

const date = require(__dirname + '/date.js')
const express = require("express");
const bodyParser = require("body-parser");
const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", (req, res) => {
 
  let day = date.getDate();

  res.render("list", { listTitle: day, newListItem: items });
});
app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work List", newListItem: workItems });
});

app.post("/", (req, res) => {
  var item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  }else{
    items.push(item);
    res.redirect("/");
  }



});
app.listen(3000, () => {
  console.log("Server is up and runing");
});

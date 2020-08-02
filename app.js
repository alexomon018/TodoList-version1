const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const _ = require('lodash');

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemsSchema = new mongoose.Schema({
  name: {
    type: String,
  },
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Uci Mongo",
});
const item2 = new Item({
  name: "Hit the + button to add a new item",
});
const item3 = new Item({
  name: "Hit this to delete an item",
});

const defaultItems = [item1, item2, item3];
const listSchema = {
  name: String,
  items: [itemsSchema],
};
const List = mongoose.model("List", listSchema);
// Item.insertMany(defaultItems,err=> err ? console.log(err) : console.log('Sjajan si bratoo'))

app.get("/", (req, res) => {
  Item.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) =>
        err ? console.log(err) : console.log("Sjajan si bratoo")
      );
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItem: foundItems });
    }
  });
});

app.get("/:listName", (req, res) => {
  const listName = _.capitalize(req.params.listName);
  List.findOne({ name: listName }, (err, results) => {
    if (!err) {
      if (!results) {
        const list = new List({
          name: listName,
          items: defaultItems,
        });

        list.save();
        res.redirect("/" + listName);
      } else {
        //Show an existing list
        res.render("list", {
          listTitle: results.name,
          newListItem: results.items,
        });
      }
    }
  });
});

app.post("/", (req, res) => {
  const itemName = _req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName,
  });
  if (listName === "Today") {
    item.save();
    res.redirect("/");
  }else{
    List.findOne({name: listName},(err,foundList)=>{
      foundList.items.push(item);
      foundList.save();
      res.redirect('/' + listName);
    })
  }
});
app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today"){
    Item.findByIdAndDelete(checkedItemId, (err) =>
    err ? console.log(err) : console.log("Sjajan si bratoo")
  );
  res.redirect("/");
  }else{
    List.findOneAndUpdate({name:listName},{$pull:{items: {_id: checkedItemId}}},(err,foundList)=>{
      if(!err){
        res.redirect(`/${listName}`);
      }
    })
  }


});
app.listen(3000, () => {
  console.log("Server is up and runing");
});

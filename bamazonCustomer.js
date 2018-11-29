var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    afterConnection();
});
  
function afterConnection() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("\n");
        for (var i = 0; i < 10; i++) {
            console.log(res[i].id + " " + res[i].product_name + " " + res[i].department_name + " " +  "$" + res[i].price + " " + res[i].stock_quantity);
        }
        console.log("\n");
        whichItem();
    });
}

function whichItem() {
    inquirer.prompt([
        {
        type: "input",
        name: "item",
        message: "What is the ID of the item you would like to purchase?"
        },
    ]).then(function(user) {
        var userItem = parseInt(user.item);
        if ((Number.isInteger(userItem)) && (userItem < 11) &&  (userItem > -1)) {
            console.log("Awesome!");
            howMany(userItem);
        }
        else {
            console.log("Please enter a valid item ID.")
            whichItem();
        }
    });
}

function howMany(userItem) {
    inquirer.prompt([
        {
        type: "input",
        name: "item",
        message: "How many of the item you would like to purchase?"
        },
    ]).then(function(user) {
        var itemNumber = parseInt(user.item);
        if ((Number.isInteger(itemNumber)) && (itemNumber > 0)) {
            console.log("Awesome!");
            updateProduct(userItem, itemNumber);
        }
        else {
            console.log("Please enter a valid amount.")
            howMany();
        }
    });
}

function updateProduct(userItem, itemNumber) {
    console.log(userItem, itemNumber);
    var query = connection.query(
        "UPDATE products SET stock_quantity = stock_quantity - " + itemNumber + " WHERE id = " + userItem,
        function(err, res) {
            displayInfo();
            connection.end();
        }
    );
}

function displayInfo() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("\n");
        for (var i = 0; i < 10; i++) {
            console.log(res[i].id + " " + res[i].product_name + " " + res[i].department_name + " " +  "$" + res[i].price + " " + res[i].stock_quantity);
        }
        console.log("\n");
    });
}
var inquirer = require("inquirer");
var mysql = require("mysql");
const cTable = require('console.table');

var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId)
    santa();
    console.log("\nWELCOME TO FANCY SANTA'S CHRISTMAS SUPER STORE!\n");
    afterConnection();
});
  
function afterConnection() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("\n");
        var productTable = [];
        for (var i = 0; i < res.length; i++) {
                var tempTable = {
                    ID: res[i].id,
                    Product: res[i].product_name,
                    Department: res[i].department_name,
                    Price: res[i].price,
                    Quantity: res[i].stock_quantity
                }
                productTable.push(tempTable);
        }
        console.log(console.table(productTable));
        console.log("\n");
        whichItem();
    });
}

function whichItem() {
    inquirer.prompt([
        {
        type: "input",
        name: "item",
        message: "What is the ID of the item you would like to purchase? [Quit with Q]"
        },
    ]).then(function(user) {
        var userItem = parseInt(user.item);
        if ((Number.isInteger(userItem)) && (userItem < 11) &&  (userItem > -1)) {
            console.log("\nPurchasing item...\n");
            howMany(userItem);
        }
        else if (user.item === "q" || user.item === "Q") {
            console.log("\nEnding connection...\n")
            connection.end();
        }
        else {
            console.log("\nPlease enter a valid item ID.\n")
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
            updateProduct(userItem, itemNumber);
        }
        else {
            console.log("\nPlease enter a valid amount.\n")
            howMany();
        }
    });
}

function updateProduct(userItem, itemNumber) {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        var supply = res[userItem-1].stock_quantity;
        var price = res[userItem-1].price * itemNumber;
        if (itemNumber < supply) {
            var query = connection.query(
                "UPDATE products SET stock_quantity = stock_quantity - " + itemNumber + " WHERE id = " + userItem,
                function(err, res) {
                    console.log("\nThank you for your purchase! Your total is: $" + price + ".");
                    afterConnection();
                }
            );
        } else {
            console.log("\nInsufficient supply!\n");
            howMany(userItem);
        }
    });
}

function santa() {
console.log(
`
                                ,,,,,,,,,,,,,,,,.. 
                        ..,,;;;;;;;;;;;;;;;;;;;;;;;;;;,,. 
                    .,::::;;;;aaaaaaaaaaaaaaaaaaaaaaaaaaa;;,,. 
                .,;;,:::a@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@a, 
              ,;;;;.,a@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@a 
           ,;;;;%;.,@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@a, 
        ,;%;;;;%%;,@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 
     ,;;%%;;;;;%%;;@@@@@@@@@@@@@@'%v%v%v%v%v%v%v%v%v%v%v%v @@@@@@@@@ 
   ,;;%%;;;;:;;;%;;@@@@@@@@@'%vvvvvvvvvnnnnnnnnnnnnnnnnvvvvvv% @@@@' 
  ,;%%;;;;;:;;;;;;;;@@@@@'%vvva@@@@@@@@avvnnnnnnnnnnvva@@@@@@@OOov, 
 ,;%;;;;;;:::;;;;;;;@@'OO%vva@@@@@@@@@@@@vvnnnnnnnnvv@@@@@@@@@@@Oov 
 ;%;;;;;;;:::;;;;;;;;'oO%vvn@@%nvvvvvvvv%nnnnnnnnnnnnn%vvvvvvnn%@Ov 
 ;;;;;;;;;:::;;;;;;::;oO%vvnnnn>>nn.    nnnnnnnnnnnn>>nn.    nnnvv' 
 ;;;;;;;;;:::;;;;;;::;oO%vvnnvvmmmmmmmmmmvvvnnnnnn;%mmmmmmmmmmmmvv, 
 ;;;;;;;;;:::;;;;;;::;oO%vvmmmmmmmmmmmmmmmmmvvnnnv;%mmmmmmmmmmmmmmmv, 
 ;;;;;;;;;;:;;;;;;::;;oO%vmmmmnnnnnnnnnnnnmmvvnnnvmm;%vvnnnnnnnnnmmmv 
   ;%;;;;;;;:;;;;::;;o@@%vvmmnnnnnnnnnnnvnnnnnnnnnnmmm;%vvvnnnnnnmmmv 
    ;;%%;;;;;:;;;::;.oO@@%vmmnnnnnnnnnvv%;nnnnnnnnnmmm;%vvvnnnnnnmmv' 
      ;;;%%;;;:;;;::;.o@@%vvnnnnnnnnnnnvv%;nnnnnnnmm;%vvvnnnnnnnv%'@a. 
      a ;;;%%;;:;;;::;.o@@%vvvvvvvvvvvvvaa@@@@@@@@@@@@aa%%vvvvv%%@@@@o. 
     .@@o ;;;%;;;;;;::;,o@@@%vvvvvvva@@@@@@@@@@@@@@@@@@@@@avvvva@@@@@%O, 
    .@@@@@Oo ;;;;;;;;::;o@@@@@@@@@@@@@@@@@@@@"""""""@@@@@@@@@@@@@@@@@OO@a 
  .@@@@@@@@@OOo ;;;;;;:;o@@@@@@@@@@@@@@@@"           "@@@@@@@@@@@@@@oOO@@@, 
 .@@@@o@@@@@@@OOo ;;;;:;o,@@@@@@@@@@%vvvvvvvvvvvvvvvvvv%%@@@@@@@@@oOOO@@@@@, 
 @@@@o@@@@@@@@@OOo;::;'oOOooooooooOOOo%vvvvvvvvvvvvvv%oOOooooooooOOO@@@O@@@, 
 @@@oO@@@@@@@@@OOa@@@@@a,oOOOOOOOOOOOOOOoooooooooooooOOOOOOOOOOOOOO@@@@Oo@@@ 
 @@@oO@@@@@@@OOa@@@@@@@@Oo,oO@@@@@@@@@@OOOOOOOOOOOOOO@@@@@@@@@@@@@@@@@@Oo@@@ 
 @@@oO@@@@@@OO@@@@@@@@@@@OO,oO@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Oo@@@ 
 @@@@o@@@@@@OO@@@@@@@@@@OOO,oO@@@@@@@@@O@@@@@@@@@@@@@@@@@@@@@o@@@@@@@@@O@@@@ 
 @@@@@o@@@@@OOo@@@@@@@OOOO'oOO@@@@@@@@Oo@@@@@@@@@@@@O@@@@@@@@Oo@@@@@@@@@@@@a 
 @@@@@@@O@@@OOOo OOOOOOO'oOO@@@@@@@@@O@@@@@@@@@@@@@@@O@@@@@@@@Oo@@@@@@@@@@@@ 
  @@@@@OO@@@@@OOOooooooooOO@@@@@@@@@@@@@@@@@@@@@@@@@@Oo@@@@@@@Oo@@@@@@oO@@@@ 
    @@@OO@@@@@@@@@@@@@@@@@@@O@@@@@@@@@@@@@@@@@@@@@@@@Oo@@@@@@@O@@@@@@@oO@@@' 
       @@ O@@@@@@@@@@@@@@@@@@@Oo@@@@@@@@@@@@@@@@@@@@@@Oo@@@@@@@@@@@@@@@O@@@' 
         @ @@@@@@@@@@@@@@@@@@@OOo@@@@@@@@@@@@@@@@@@@@@O@@@@@@@@@@@@@@@'@@' 
            @@@@@@@@@@@@@@@@@@OOo@@@@@@@@@@@@@@@@@@@@O@@@@@@@@@@@@@@@ a' 
                @@@@@@@@@@@@@@OOo@@@@@@@@@@@@@@@@@@@@@@@@Oo@@@@@@@@' 
                   @@@@@@@@@@@Oo@@@@@@@@@@@@@@@@@@@@@@@@@Oo@@@@' 
                       @@@@@@Oo@@@@O@@@@@@@@@@@@@@@@@@@'o@@' 
                           @@@@@@@@oO@@@@@@@@@@@@@@@@@ a' 
                               @@@@@oO@@@@@@@@@@@@@@' ' 
                                   @@@o' @@@@@@@@' 
                                      @' .@@@@' 
                                         @@' 
`
    );
}
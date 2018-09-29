var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log('It Works!');
    showTable();
});

var showTable = function () {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity + "\n");
        }
        bamazon();
    })
}
function bamazon() {
    inquirer
        .prompt([
            {
                name: "item",
                type: "input",
                message: "Enter the ID of the product you would like to purchase."
            },
            {
                name: "units",
                type: "input",
                message: "how many units would you like?"
            }

        ])
        .then(function (calculate) {
            connection.query("SELECT * FROM bamazon.products WHERE item_id=" + calculate.item, function (err, res) {
                if (res === undefined || res.length == 0) {
                    console.log('\n error, please choose again!\n')
                    bamazon()


                } else if (res[0].stock_quantity < calculate.units) {
                    console.log('Insufficient quantity!')
                    bamazon()
                }
                else {

                    console.log('\n ' + res[0].product_name + " | " + 'x' + calculate.units + "\n");
                    amount = res[0].stock_quantity - calculate.units
                    totalCost = calculate.units * res[0].price
                    purchase(calculate.item, amount, totalCost)


                }


            })
        })
}

function purchase(ID, amount, total) {
    connection.query("UPDATE bamazon.products SET stock_quantity =" + amount + " WHERE item_id = " + ID, function (err, res) {
        console.log(' Total is $' + total);

    })
    connection.query("SELECT * FROM bamazon.products WHERE item_id=" + ID, function (err, res) {
        console.log('\n ' + res[0].item_id + " | " + res[0].product_name + " | " + res[0].department_name + " | " + res[0].price + " | " + res[0].stock_quantity + "\n");
    })

    connection.end()
}   
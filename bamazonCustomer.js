var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');


var connection = mysql.createConnection({
	host:"localhost",
	port: 3306,
	user: "root",
	password:"Bluemist1!",
	database:"bamazon_db"
});

connection.connect(function(err, res){
	if (err) throw err;

});

var display = function() {

	connection.query("SELECT * FROM products", function(err, res){

	if(err) throw err;

        var table = new Table({head: ['id', 'product_name', 'department_name', 'price', 'stock_quantity']
     });

	console.log("Welcome to Bamazon! Here is our selection:")
    for(var i=0;i<res.length;i++) {
          table.push([res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
      }
      console.log("----------------------------------");

     console.log(table.toString());

     inquirer.prompt([{
     	name: "item",
     	type: "input",
     	message: "Please select a product by choosing an ID # from the table above.",
     	validate: function(value) {
           if (isNaN(value) === false) {
          return true;
           }
          return false;
        }
     }, {
     	name: "units",
     	type: "input",
     	message: "How many would you like ?",
     	validate: function(value) {
           if (isNaN(value) === false) {
          return true;
           }
          return false;
        }
     }]).then(function(answer) {
     		
     	var chosenId =answer.item -1;
     	var chosenProduct = res[chosenId];
     	var amount = answer.units;
     	

     	if (chosenProduct.stock_quantity > amount) {

     		console.log("The price of this item is: " + chosenProduct.price);

     		connection.query("UPDATE products SET ? WHERE ?", [{
     			stock_quantity: chosenProduct.stock_quantity - amount
     		}, {
     			id: chosenProduct.id
     		}], function(error) {
     			if (error) throw err;
     			console.log("Item purchased successfully. Bamazon is not responsible for any lost or damaged items during shipping. NO REFUNDS!")
     			display();
     		});
     	}

     	else {
     		console.log("Sorry we our sold out of that product. Please select another item immediately")
     		display();
     	}
     	

     	});



});


}


display();
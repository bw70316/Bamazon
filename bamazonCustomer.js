// indlude node packages to use in the code

var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

//connects to my bazamon_db through mysql

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

// function that runs the code ti display the table
var display = function() {

//connect to the mysql server and database
	connection.query("SELECT * FROM products", function(err, res){


//using "cli-table", I label the columns
	if(err) throw err;

        var table = new Table({head: ['id', 'product_name', 'department_name', 'price', 'stock_quantity']
     });

//for loop pulls the data and displays the table of data from my csv file i imported. Also welcomes the user to my badass store. 
	console.log("Welcome to Bamazon! Here is our selection:")
    for(var i=0;i<res.length;i++) {
          table.push([res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
      }
      console.log("----------------------------------");

// this is part of cli-table, i guess its organizing the data from the for loop into a string to display the info?
     console.log(table.toString());
});


}
var runCommand = function() {

connection.query("SELECT * FROM products", function(err, res){
// calling on the inquirer package
     inquirer.prompt([{
     	name: "item",
     	type: "input",
     	message: "Please select a product by choosing an ID # from the table above.",
     	// this is from the greatbay, ensures the user inputs a number through the isNAN
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
     		//turn the answers into variables, the -1 thing def was messing me up when i tried to test 10
     	var chosenId =answer.item -1;
     	var chosenProduct = res[chosenId];
     	var amount = answer.units;
     	
//this took a minute too, but playing around with the console.logs of chosenproduct.XXXXX helped me wrap my mind around it 

//if statement using recursion to redisplay the table if the amount in stock is less than the amount requested by the user.
     	if (chosenProduct.stock_quantity < amount) {

console.log("Sorry we our sold out of that product. Please select another item immediately")
     		display();
     		runCommand();
     		
     	}
     	// displays the price if there are enough items in stock

     	else {
     		console.log("The price of this item is: " + chosenProduct.price);

     		connection.query("UPDATE products SET ? WHERE ?", [{
     			stock_quantity: chosenProduct.stock_quantity - amount
     		}, {
     			id: chosenProduct.id
     		}], function(error) {
     			if (error) throw err;
     			console.log("Item purchased successfully. Bamazon is not responsible for any lost or damaged items during shipping. NO REFUNDS!")
     			display();
     			runCommand();
     		});
     	}

     });
 });
}
     	

     	
// some snarky console.logs stating they purchased their item and redisplays the table



//runs the initial function


display();
runCommand();
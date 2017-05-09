
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
	id INT NOT null,
	product_name varchar(100) null,
	department_name varchar(100) null,
	price DECIMAL(10,2) null,
	stock_quantity int null,
	primary key (id)

);

 SELECT * FROM products


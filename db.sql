CREATE DATABASE Bamazon_DB;

USE Bamazon_DB;

CREATE TABLE products (
	position INT NOT NULL,
	item_id INT null,
	product_name varchar(100) null,
	department_name varchar(100) null,
	price decimal(10,2) null,
	stock_quantity int null,
	primary key (position)

);

select * from products;


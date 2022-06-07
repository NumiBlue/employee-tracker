INSERT -- Insert rows into table 'TableName'
INSERT INTO department (department_name)
VALUES
 ("Barista"),
 ("Manager"),
 ("Waitress"),
 ("Host");

 INSERT INTO roles (title, salary, department_id)
VALUES
("Barista", 25000, 1),
("Lead Manager", 35000, 2),
("Day Shift Leader", 26500, 3),
("Night Shift Leader", 27000, 3),
("Host", 13000, 4),
("Intern", 9000, 4);

 INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES 
("Laura", "Latte", 1, NULL),
("Esther", "Patience", 2, NULL),
("Chris", "Dolce", 3, 2),
("Lashawn", "Cider", 1, 3),
("Ophelia", "Autumn", 4, 3),
("Hayden", "Cardamom", 3, 2),
("Aiden", "Pepper", 4, 3);


),
( -- second row: values for the columns in the list above
 Column1_Value, Column2_Value, Column3_Value
)
-- add more rows here
GO
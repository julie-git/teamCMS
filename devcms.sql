DROP DATABASE IF EXISTS devteam_db;
CREATE DATABASE devteam_db;
USE devteam_db;


CREATE TABLE department(
  id INTEGER(11) AUTO_INCREMENT NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);
 
 
CREATE TABLE role(
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(13,2)NOT NULL,
  department_id INT,
 FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee(
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES role(department_id),
  manager_id INT,
 FOREIGN KEY(manager_id) REFERENCES employee(id)
);

SELECT * FROM role;
INSERT INTO department(name) values('sales'),('finance'),('legal'),('engineering');

INSERT INTO role(title,salary,department_id) VALUES("Engineering Manager",150000.00,4),("Sales Manager",125000.00,1),("Finance Manager",175000.00,2);
INSERT INTO role(title,salary,department_id) Values("Engineer",120000.00,4),("Sales Rep",80000.00,1),("Finance Analyst",75000.00,2);
SELECT * From employees;
INSERT INTO employee(first_name,last_name,role_id,manager_id) values('Joe','Smith',1);



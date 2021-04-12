DROP DATABASE IF EXISTS emp_trackerDB;
CREATE database emp_trackerDB;

USE emp_trackerDB;

CREATE TABLE department (
  id INT NOT NULL,
  name VARCHAR(30),
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL,
  title VARCHAR(30) NULL,
  salary DECIMAL(10,4) NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT department_id
    FOREIGN KEY (department_id) 
    REFERENCES department(id)
);

CREATE TABLE employee (
  id INT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  PRIMARY KEY (id),
  CONSTRAINT role_id 
	FOREIGN KEY (role_id)
    REFERENCES role(id),
  CONSTRAINT manager_id 
	FOREIGN KEY (manager_id)
    REFERENCES employee(id)
);


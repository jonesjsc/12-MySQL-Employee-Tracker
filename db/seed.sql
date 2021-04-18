USE emp_trackerdb;
INSERT INTO department (id, name)
VALUES (1, 'Sales'),
      (2, 'Engineering'),
      (3, 'Finance'),
      (4, 'Legal');
INSERT INTO role (id, title, salary, department_id)
VALUES (1, "Sales Lead",        250000, 1),
       (2, "Salesperson",       125000, 1),
       (3, "Lead Engineer",     185000, 2),
       (4, "Software Engineer", 115000, 2),
       (5, "Account Manager",   100000, 1),
       (6, "Accountant",        125000, 3),
       (7, "Legal Team Lead",   175000, 4),
       (8, "Lawyer",            125000, 4);
SET foreign_key_checks = 0;
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "John", "Doe", 1, 3),
       (2, "Mike", "Chan", 2, 1),
       (3, "Ashley", "Rodriguez", 3,NULL),
       (4, "Kevin", "Tupik", 4, 3),
       (6, "Malia", "Brown", 6, NULL),
       (7, "Sarah", "Lourd", 7, NULL),
       (8, "Tom", "Allen", 2, 7),
  	   (9, "Christian", "Eckenrode", 3,2);
SET foreign_key_checks = 1;
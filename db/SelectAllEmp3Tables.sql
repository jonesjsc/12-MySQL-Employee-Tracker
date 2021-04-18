SELECT e.id, e.first_name, e.last_name, r.title, d.name "department", r.salary, concat(m.first_name, ' ',m.last_name) 'Manager'
FROM employee e
LEFT JOIN employee m
ON (e.manager_id = m.id)
JOIN role r on e.role_id=r.id
JOIN department d on r.department_id=d.id
ORDER BY e.id;
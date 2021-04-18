SELECT DISTINCT e.id 'Employee ID', concat(e.first_name, ' ',e.last_name) 'Managers Name'
FROM employee e
JOIN employee m
ON (m.manager_id = e.id)
WHERE m.manager_id IS NOT NULL;

INSERT INTO departments (department_name)
VALUES
('General Manager'),
('Plant Manager'),
('Maintenance Manager'),
('Maintenance Team'),
('Production Manager'),
('Production Team'), 
('Human Resources'),
('Sales'),
('Technology');

INSERT INTO roles (ttile, salary, department_id)
VALUES
('President', 700000.00, 1),
('Facilitiy Manager', 100000.00, 2),
('Maintenance Supervisor', 200000.00, 3),
('Maintenance Technician', 150000.00, 4),
('Production Supervisor', 80000.00, 5),
('Production Operators', 50000.00, 6),
('HR Manager', 80000.00, 7),
('Sales Director', 150000.00, 8),
('IT Manager', 200000.00, 9);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Michael', 'Scott', 1, 1),
('Jacob', 'Dewberry', 2, 2),
('John', 'Savey', 3, 3),
('Dennis', 'Smith', 4, 4),
('David', 'Swineflu', 5, 5),
('Kevin', 'Johnson', 6, 6),
('Brittany', 'Mchammer', 7, 7),
('Nicole', 'Brown', 8, 8),
('Jennifer', 'White', 9, 9);
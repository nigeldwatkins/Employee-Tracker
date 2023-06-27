INSERT INTO departments (department_name)
VALUES
('general manager'),
('plant manager'),
('maintenance manager'),
('maintenance team'),
('production manager'),
('production team'), 
('human resources'),
('sales'),
('technology');

INSERT INTO roles (title, salary, department_id)
VALUES
('president', 700000.00, 1),
('facilitiy Manager', 100000.00, 2),
('maintenance supervisor', 200000.00, 3),
('maintenance technician', 150000.00, 4),
('production supervisor', 80000.00, 5),
('production operators', 50000.00, 6),
('hr manager', 80000.00, 7),
('sales director', 150000.00, 8),
('it manager', 200000.00, 9);

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
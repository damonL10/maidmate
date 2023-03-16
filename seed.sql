INSERT INTO service_category (category_name) VALUES
('Home Cleaning'),
('Cooking'),
('Pet Caring');

INSERT INTO service_region (region_name) VALUES
('Hong Kong Island'),
('Kowloon'),
('New Territories'),
('Islands District');


INSERT INTO weekdays (id, weekdays) VALUES 
('1', 'mon'), ('2', 'tue'), ('3', 'wed'), ('4', 'thu'), ('5', 'fri'), ('6', 'sat'), ('7', 'sun');

INSERT INTO time_section (id, time_section) VALUES 
('1', 'morning'), ('2', 'afternoon'), ('3', 'evening');

INSERT INTO service_plan (service_category_id, plan_hour, plan_price, plan_description) VALUES 
('1','2','120', 'Components are elements you can reuse across your designs. They help to create and manage consistent designs across projects.'),
('1','3','100', 'Components are elements you can reuse across your designs. They help to create and manage consistent designs across projects.'),
('1','4','90', 'Components are elements you can reuse across your designs. They help to create and manage consistent designs across projects.');

INSERT INTO service_plan (service_category_id, plan_hour, plan_price, plan_description) VALUES 
('2','2','100', 'Components are elements you can reuse across your designs. They help to create and manage consistent designs across projects.'),
('2','3','90', 'Components are elements you can reuse across your designs. They help to create and manage consistent designs across projects.'),
('2','4','85', 'Components are elements you can reuse across your designs. They help to create and manage consistent designs across projects.');

INSERT INTO service_plan (service_category_id, plan_hour, plan_price, plan_description) VALUES 
('3','2','90', 'Components are elements you can reuse across your designs. They help to create and manage consistent designs across projects.'),
('3','3','100', 'Components are elements you can reuse across your designs. They help to create and manage consistent designs across projects.'),
('3','4','120', 'Components are elements you can reuse across your designs. They help to create and manage consistent designs across projects.');



-- Insertion des cartes
INSERT INTO cards (card_number, balance, user_id, discount) VALUES
('M-358914', 75.0, 'user1', 15.0),
('M-496238', 120.0, 'user2', 10.0),
('M-237651', 45.5, 'user3', 20.0),
('M-789124', 200.0, 'user4', 5.0),
('M-123456', 500.0, 'admin', 25.0);

-- Insertion des voyages pour user1
INSERT INTO trips (from_location, to_location, line, price, time, user_id, type) VALUES
('Gueliz', 'Jamaa el-Fna', 'L3', 5.0, NOW() - INTERVAL '1 day', 'user1', 'bus'),
('Menara Mall', 'Majorelle Garden', 'L8', 4.0, NOW() - INTERVAL '2 day', 'user1', 'bus'),
('Marrakesh Train Station', 'Medina', 'L16', 5.0, NOW() - INTERVAL '3 day', 'user1', 'bus'),
('Marrakesh Station', 'Casablanca', 'M1', 90.0, NOW() - INTERVAL '4 day', 'user1', 'train'),
('Marrakesh Airport', 'City Center', 'L19', 30.0, NOW() - INTERVAL '5 day', 'user1', 'bus'),
('Palmeraie', 'Bahia Palace', 'L12', 5.0, NOW() - INTERVAL '6 day', 'user1', 'bus'),
('Royal Palace', 'Mellah', 'L25', 6.5, NOW() - INTERVAL '7 day', 'user1', 'bus'),
('City Center', 'Hivernage', 'L9', 4.5, NOW() - INTERVAL '8 day', 'user1', 'bus'),
('Agdal', 'Gueliz', 'L20', 5.5, NOW() - INTERVAL '9 day', 'user1', 'bus'),
('Ben Youssef Madrasa', 'Menara Mall', 'L3', 5.0, NOW() - INTERVAL '10 day', 'user1', 'bus');

-- Insertion des voyages pour user2
INSERT INTO trips (from_location, to_location, line, price, time, user_id, type) VALUES
('City Center', 'Agdal', 'L5', 4.5, NOW() - INTERVAL '1 day', 'user2', 'bus'),
('Marrakesh', 'Rabat', 'T2', 120.0, NOW() - INTERVAL '3 day', 'user2', 'train'),
('Jamaa el-Fna', 'Palmeraie', 'L19', 7.0, NOW() - INTERVAL '5 day', 'user2', 'bus'),
('Hivernage', 'Majorelle Garden', 'L16', 5.5, NOW() - INTERVAL '7 day', 'user2', 'bus'),
('Marrakesh Station', 'Fes', 'M2', 150.0, NOW() - INTERVAL '15 day', 'user2', 'train');

-- Insertion des voyages pour user3
INSERT INTO trips (from_location, to_location, line, price, time, user_id, type) VALUES
('Marrakesh Airport', 'Jamaa el-Fna', 'L19', 30.0, NOW() - INTERVAL '2 day', 'user3', 'bus'),
('Medina', 'Ben Youssef Madrasa', 'L1', 4.0, NOW() - INTERVAL '4 day', 'user3', 'bus'),
('City Center', 'Marrakesh Train Station', 'L8', 5.5, NOW() - INTERVAL '6 day', 'user3', 'bus');

-- Insertion des voyages pour user4
INSERT INTO trips (from_location, to_location, line, price, time, user_id, type) VALUES
('Gueliz', 'City Center', 'L3', 5.0, NOW() - INTERVAL '1 day', 'user4', 'bus'),
('City Center', 'Gueliz', 'L3', 5.0, NOW() - INTERVAL '1 day 4 hours', 'user4', 'bus'),
('Gueliz', 'Marrakesh Train Station', 'L8', 4.5, NOW() - INTERVAL '2 day', 'user4', 'bus'),
('Marrakesh Train Station', 'Gueliz', 'L8', 4.5, NOW() - INTERVAL '2 day 4 hours', 'user4', 'bus'),
('Marrakesh', 'Casablanca', 'T1', 90.0, NOW() - INTERVAL '10 day', 'user4', 'train'),
('Casablanca', 'Marrakesh', 'T1', 90.0, NOW() - INTERVAL '10 day 6 hours', 'user4', 'train'); 
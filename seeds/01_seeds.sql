INSERT INTO users (name, email, password)
VALUES ('Ines Gaitan', 'inesitaGaitan@libertadores.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Simon Bolivar', 'simonBolivar@libertadores.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Ramon Diaz', 'donRamon@elchavodel8.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES ('House', 'ugly house', 'no_photo_yet', 'no_photo_yet', 10, 1, 1, 1, 'England', '123 real street', 'London', 'London', 12345, true),
('Apartment', 'ugly apartment', 'no_photo_yet', 'no_photo_yet', 5, 1, 0, 3, 'US', '123 what street', 'New York', 'New York', 112346, true),
('Hut', 'ugly hut', 'no_photo_yet', 'no_photo_yet', 1, 0, 1, 5, 'Canada', '123 hut street', 'Vancouver', 'Vancouver', 112347, true);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2020-12-12', '2020-12-22', 1, 3), 
('2020-12-13', '2020-12-23', 2, 1), 
('2021-12-13', '2021-12-23', 3, 2); 


INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 2, 2, 1, 'the description was right its an ugly apartment'),
(2, 3, 3, 1, 'the description was right its an ugly hut'),
(3, 1, 1, 1, 'the description was right its an ugly house');

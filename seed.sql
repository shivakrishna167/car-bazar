-- Seed data for listings
INSERT INTO listings (type, make, model, year, price, mileage, image_url, description, fuel, transmission, district, location, status)
VALUES 
('car', 'Toyota', 'Camry', 2022, 2800000, 15000, '/images/camry.png', 'Well maintained Toyota Camry, single owner, excellent condition.', 'Petrol', 'Automatic', 'Hyderabad', 'Banjara Hills', 'available'),
('car', 'Honda', 'Civic', 2021, 2200000, 25000, '/images/civic.png', 'Sporty red Honda Civic, top-end variant with sunroof.', 'Petrol', 'Automatic', 'Hyderabad', 'Jubilee Hills', 'available'),
('bike', 'Royal Enfield', 'Classic 350', 2023, 210000, 5000, '/images/classic350.png', 'Classic black Royal Enfield, barely used, showroom condition.', 'Petrol', 'Manual', 'Hyderabad', 'Gachibowli', 'available'),
('bike', 'Yamaha', 'R15 V4', 2022, 185000, 8000, '/images/r15.png', 'Racing blue Yamaha R15, perfect for enthusiasts.', 'Petrol', 'Manual', 'Hyderabad', 'Kukatpally', 'available');

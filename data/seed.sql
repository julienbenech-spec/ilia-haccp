-- Restaurants ILIA
INSERT INTO restaurants (id, name) VALUES
  (3287, 'Mathurins'),
  (4240, 'Vernier'),
  (5523, 'Washington'),
  (5829, 'Casanova'),
  (5830, 'Rivière');

-- Frigos Mathurins
INSERT INTO fridges (restaurant_id, name, type, min_temp, max_temp) VALUES
  (3287, 'Frigo viandes', 'froid', 0, 4),
  (3287, 'Frigo légumes', 'froid', 0, 4),
  (3287, 'Congélateur', 'congelateur', -25, -18);

-- Frigos Vernier
INSERT INTO fridges (restaurant_id, name, type, min_temp, max_temp) VALUES
  (4240, 'Frigo 1', 'froid', 0, 4),
  (4240, 'Frigo 2', 'froid', 0, 4),
  (4240, 'Congélateur', 'congelateur', -25, -18);

-- Frigos Washington
INSERT INTO fridges (restaurant_id, name, type, min_temp, max_temp) VALUES
  (5523, 'Frigo viandes', 'froid', 0, 4),
  (5523, 'Frigo produits laitiers', 'froid', 0, 4),
  (5523, 'Frigo poissons', 'froid', 0, 4),
  (5523, 'Congélateur 1', 'congelateur', -25, -18),
  (5523, 'Congélateur 2', 'congelateur', -25, -18);

-- Frigos Casanova
INSERT INTO fridges (restaurant_id, name, type, min_temp, max_temp) VALUES
  (5829, 'Frigo 1', 'froid', 0, 4),
  (5829, 'Frigo 2', 'froid', 0, 4),
  (5829, 'Congélateur', 'congelateur', -25, -18);

-- Frigos Rivière
INSERT INTO fridges (restaurant_id, name, type, min_temp, max_temp) VALUES
  (5830, 'Frigo viandes', 'froid', 0, 4),
  (5830, 'Frigo légumes', 'froid', 0, 4),
  (5830, 'Congélateur', 'congelateur', -25, -18);

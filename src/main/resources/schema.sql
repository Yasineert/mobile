-- Suppression des tables si elles existent déjà
DROP TABLE IF EXISTS trips;
DROP TABLE IF EXISTS cards;

-- Création de la table cards
CREATE TABLE cards (
    card_number VARCHAR(20) PRIMARY KEY,
    balance DOUBLE PRECISION NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    discount DOUBLE PRECISION NOT NULL
);

-- Création de la table trips
CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    from_location VARCHAR(100) NOT NULL,
    to_location VARCHAR(100) NOT NULL,
    line VARCHAR(20) NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    time TIMESTAMP NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    type VARCHAR(20)
);

-- Création d'index pour les recherches fréquentes
CREATE INDEX idx_cards_user_id ON cards(user_id);
CREATE INDEX idx_trips_user_id ON trips(user_id); 
CREATE DATABASE referral;

USE referral;

CREATE TABLE referral (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(191),
    email VARCHAR(191),
    referredBy VARCHAR(191),
    createdAt  TIMESTAMP NOT NULL DEFAULT NOW()
);

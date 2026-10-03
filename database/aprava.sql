CREATE DATABASE IF NOT EXISTS aprava_global_tech
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE aprava_global_tech;

CREATE TABLE IF NOT EXISTS contacts (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(254) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_contacts_created_at (created_at),
    INDEX idx_contacts_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS enquiries (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(254) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    company VARCHAR(160) NULL,
    service VARCHAR(80) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('NEW','CONTACTED','IN_PROGRESS','COMPLETED','CLOSED') NOT NULL DEFAULT 'NEW',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_enquiries_status (status),
    INDEX idx_enquiries_created_at (created_at),
    INDEX idx_enquiries_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS admins (
    id BIGINT NOT NULL AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(40) NOT NULL DEFAULT 'ADMIN',
    PRIMARY KEY (id),
    UNIQUE KEY uk_admins_username (username)
) ENGINE=InnoDB;

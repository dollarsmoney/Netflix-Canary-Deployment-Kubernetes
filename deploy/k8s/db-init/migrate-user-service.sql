-- Seed for the User service database.
-- Idempotent: safe to run repeatedly and safe to run after the post seed (which
-- also runs at initdb time). The service connects as root (see secret.yaml), so no
-- extra DB user is created here. Schema mirrors the EF Core migrations under
-- src/Services/Instagram.Services.User/Domain/Data/Migrations.
CREATE DATABASE IF NOT EXISTS InstagramServicesUser;
USE InstagramServicesUser;

CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId` varchar(95) NOT NULL,
    `ProductVersion` varchar(32) NOT NULL,
    CONSTRAINT `PK___EFMigrationsHistory` PRIMARY KEY (`MigrationId`)
);

CREATE TABLE IF NOT EXISTS `Users` (
    `Id` char(36) NOT NULL,
    `UserName` longtext CHARACTER SET utf8mb4 NULL,
    `Email` longtext CHARACTER SET utf8mb4 NULL,
    `Password` longtext CHARACTER SET utf8mb4 NULL,
    `Salt` longtext CHARACTER SET utf8mb4 NULL,
    `CreatedAt` datetime(6) NOT NULL,
    CONSTRAINT `PK_Users` PRIMARY KEY (`Id`)
);

CREATE TABLE IF NOT EXISTS `UserBios` (
    `Id` char(36) NOT NULL,
    `UserId` char(36) NOT NULL,
    `Text` longtext CHARACTER SET utf8mb4 NULL,
    `Gender` longtext CHARACTER SET utf8mb4 NULL,
    `WebsiteUrl` longtext CHARACTER SET utf8mb4 NULL,
    `CreatedAt` datetime(6) NOT NULL,
    CONSTRAINT `PK_UserBios` PRIMARY KEY (`Id`)
);

CREATE TABLE IF NOT EXISTS `UserRelations` (
    `Id` char(36) NOT NULL,
    `UserId` char(36) NOT NULL,
    `FollowerId` char(36) NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    CONSTRAINT `PK_UserRelations` PRIMARY KEY (`Id`)
);

INSERT IGNORE INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`) VALUES
    ('20200708203541_InitialCreate', '3.1.5'),
    ('20200708203845_AddUser', '3.1.5'),
    ('20200714174331_AddUserBio', '3.1.5'),
    ('20201009215308_AddUserRelation', '3.1.5');

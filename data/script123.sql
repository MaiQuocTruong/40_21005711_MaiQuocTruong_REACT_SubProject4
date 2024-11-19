-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.36 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for ecommerce
CREATE DATABASE IF NOT EXISTS `ecommerce` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `ecommerce`;

-- Dumping structure for table ecommerce.account
CREATE TABLE IF NOT EXISTS `account` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` varchar(255) NOT NULL,
  `role` varchar(100) NOT NULL,
  `dateAdded` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastActive` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ecommerce.account: ~0 rows (approximately)
INSERT INTO `account` (`id`, `username`, `name`, `email`, `password`, `avatar`, `role`, `dateAdded`, `lastActive`) VALUES
	(1, 'maiqtruong', 'Mai Quốc Trưởng', 'maiqtruong2403@gmail.com', '123', '1731274229931.jpg', 'Admin', '2024-11-11 03:22:40', '2024-11-10 08:30:00'),
	(2, 'jane_smith123', 'Jane Smith', 'jane@example.com', '123', '1731272335572.jpg', 'User', '2024-11-11 12:48:40', '2024-11-11 12:48:40'),
	(3, 'truongmai', 'Mai Truong', 'maitruong2403@gmail.com', '123', '1731958635060.jpg', 'User', '2024-11-19 02:37:15', '2024-11-19 02:37:15');

-- Dumping structure for table ecommerce.bill
CREATE TABLE IF NOT EXISTS `bill` (
  `billID` int NOT NULL AUTO_INCREMENT,
  `address` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `accountID` int NOT NULL,
  `paymentID` int NOT NULL,
  PRIMARY KEY (`billID`),
  KEY `FK_bill_account` (`accountID`),
  KEY `FK_bill_paymentmethods` (`paymentID`),
  CONSTRAINT `FK_bill_account` FOREIGN KEY (`accountID`) REFERENCES `account` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_bill_paymentmethods` FOREIGN KEY (`paymentID`) REFERENCES `paymentmethods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ecommerce.bill: ~1 rows (approximately)
INSERT INTO `bill` (`billID`, `address`, `phone`, `accountID`, `paymentID`) VALUES
	(1, '12/25 Đông Hưng Thuận 31, HCM, Q12', '0398911257', 3, 2);

-- Dumping structure for table ecommerce.categoriesofelectronic
CREATE TABLE IF NOT EXISTS `categoriesofelectronic` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ecommerce.categoriesofelectronic: ~2 rows (approximately)
INSERT INTO `categoriesofelectronic` (`id`, `name`, `icon`) VALUES
	(1, 'Smartphone', 'https://i.imgur.com/jfNwyDe.png'),
	(2, 'Ipad', 'https://i.imgur.com/BGLmvO0.png'),
	(3, 'MacBook', 'https://i.imgur.com/WJRePm8.png');

-- Dumping structure for table ecommerce.categoriesofhome
CREATE TABLE IF NOT EXISTS `categoriesofhome` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `icon` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ecommerce.categoriesofhome: ~4 rows (approximately)
INSERT INTO `categoriesofhome` (`id`, `name`, `icon`) VALUES
	(1, 'Electronics', 'https://i.imgur.com/7P7Eftu.png'),
	(2, 'Fashion', 'https://i.imgur.com/CgnlOG2.png'),
	(3, 'Beauty', 'https://i.imgur.com/99odWDF.png'),
	(4, 'Fresh Fruits', 'https://i.imgur.com/YVOn8qL.png');

-- Dumping structure for table ecommerce.deals
CREATE TABLE IF NOT EXISTS `deals` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `discount` varchar(10) NOT NULL,
  `image` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ecommerce.deals: ~0 rows (approximately)
INSERT INTO `deals` (`id`, `name`, `discount`, `image`) VALUES
	(1, 'Shoes', '50%', 'https://i.imgur.com/iV6iuHf.png');

-- Dumping structure for table ecommerce.feedback
CREATE TABLE IF NOT EXISTS `feedback` (
  `idfb` int NOT NULL AUTO_INCREMENT,
  `comment` text NOT NULL,
  `days` date NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `accountID` int NOT NULL,
  PRIMARY KEY (`idfb`),
  KEY `FK_feedback_account` (`accountID`),
  CONSTRAINT `FK_feedback_account` FOREIGN KEY (`accountID`) REFERENCES `account` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ecommerce.feedback: ~0 rows (approximately)
INSERT INTO `feedback` (`idfb`, `comment`, `days`, `image`, `accountID`) VALUES
	(1, 'Goodddddddddd', '2024-11-18', '1731961057217.png', 3),
	(2, 'Ngon lam', '2024-11-18', '1731961146704.png', 2),
	(3, 'Tuyett', '2024-11-19', '1732021682449.png', 3),
	(4, 'Được lắm', '2024-11-19', '1732022272422.png', 3),
	(5, '10đ', '2024-11-19', '1732022448053.png', 2);

-- Dumping structure for table ecommerce.paymentmethods
CREATE TABLE IF NOT EXISTS `paymentmethods` (
  `id` int NOT NULL,
  `type` varchar(50) NOT NULL,
  `number` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `brand` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ecommerce.paymentmethods: ~4 rows (approximately)
INSERT INTO `paymentmethods` (`id`, `type`, `number`, `email`, `brand`) VALUES
	(1, 'Visa', '2334', NULL, 'visa'),
	(2, 'MasterCard', '3774', NULL, 'mastercard'),
	(3, 'PayPal', NULL, 'maiqtruong2403@gmail.com', 'paypal'),
	(4, 'MoMo', '1257', NULL, 'momo');

-- Dumping structure for table ecommerce.productsofelectronics
CREATE TABLE IF NOT EXISTS `productsofelectronics` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` varchar(50) NOT NULL,
  `rating` float NOT NULL,
  `image` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` varchar(50) NOT NULL,
  `category` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ecommerce.productsofelectronics: ~30 rows (approximately)
INSERT INTO `productsofelectronics` (`id`, `name`, `price`, `rating`, `image`, `description`, `status`, `category`) VALUES
	(1, 'Smartphone', '$899', 4, 'https://i.imgur.com/dSs05cL.png', 'Consequat ex eu', 'Best Sales', 'Electronics'),
	(2, 'Smartphone', '$500', 4, 'https://i.imgur.com/jX3QmQD.png', 'Consequat ex eu', 'Best Sales', 'Electronics'),
	(3, 'Smartphone', '$500', 4, 'https://i.imgur.com/pxUTAlZ.png', 'Consequat ex eu', 'Best Sales', 'Electronics'),
	(4, 'Smartphone', '$900', 4, 'https://i.imgur.com/yujpIYv.png', 'Consequat ex eu', 'Best Sales', 'Electronics'),
	(5, 'Smartphone', '$600', 4, 'https://i.imgur.com/jX3QmQD.png', 'Consequat ex eu', 'Best Sales', 'Electronics'),
	(6, 'Smartphone', '$678', 4, 'https://i.imgur.com/pxUTAlZ.png', 'Consequat ex eu', 'Best Matched', 'Electronics'),
	(7, 'Smartphone', '$780', 4, 'https://i.imgur.com/jX3QmQD.png', 'Consequat ex eu', 'Best Matched', 'Electronics'),
	(8, 'Smartphone', '$600', 4, 'https://i.imgur.com/yujpIYv.png', 'Consequat ex eu', 'Popular', 'Electronics'),
	(9, 'Smartphone', '$500', 4, 'https://i.imgur.com/yujpIYv.png', 'Consequat ex eu', 'Popular', 'Electronics'),
	(10, 'Smartphone', '$788', 4, 'https://i.imgur.com/yujpIYv.png', 'Consequat ex eu', 'Popular', 'Electronics'),
	(11, 'Ipad', '$899', 4, 'https://i.imgur.com/BGLmvO0.png', 'Consequat ex eu', 'Best Sales', 'Electronics'),
	(12, 'Ipad', '$899', 4, 'https://i.imgur.com/BGLmvO0.png', 'Consequat ex eu', 'Best Sales', 'Electronics'),
	(13, 'Ipad', '$879', 4, 'https://i.imgur.com/BGLmvO0.png', 'Consequat ex eu', 'Best Sales', 'Electronics'),
	(14, 'Ipad', '$900', 4, 'https://i.imgur.com/BGLmvO0.png', 'Consequat ex eu', 'Best Sales', 'Electronics'),
	(15, 'Ipad', '$909', 4, 'https://i.imgur.com/BGLmvO0.png', 'Consequat ex eu', 'Best Sales', 'Electronics'),
	(16, 'Ipad', '$789', 4, 'https://i.imgur.com/BGLmvO0.png', 'Consequat ex eu', 'Best Sales', 'Electronics'),
	(17, 'Ipad', '$799', 4, 'https://i.imgur.com/BGLmvO0.png', 'Consequat ex eu', 'Best Matched', 'Electronics'),
	(18, 'Ipad', '$786', 4, 'https://i.imgur.com/BGLmvO0.png', 'Consequat ex eu', 'Best Matched', 'Electronics'),
	(19, 'Ipad', '$500', 4, 'https://i.imgur.com/BGLmvO0.png', 'Consequat ex eu', 'Popular', 'Electronics'),
	(20, 'Ipad', '$500', 4, 'https://i.imgur.com/BGLmvO0.png', 'Consequat ex eu', 'Popular', 'Electronics'),
	(21, 'MacBook', '$678', 4, 'https://i.imgur.com/WJRePm8.png', 'Consequat ex eu', 'Best Sales', 'Electronics'),
	(22, 'MacBook', '$678', 4, 'https://i.imgur.com/WJRePm8.png', 'Consequat ex eu', 'Best Sales', 'Electronics'),
	(23, 'MacBook', '$678', 4, 'https://i.imgur.com/WJRePm8.png', 'Consequat ex eu', 'Best Sales', 'Electronics'),
	(24, 'MacBook', '$678', 4, 'https://i.imgur.com/WJRePm8.png', 'Consequat ex eu', 'Best Sales', 'Electronics'),
	(25, 'MacBook', '$678', 4, 'https://i.imgur.com/WJRePm8.png', 'Consequat ex eu', 'Best Matched', 'Electronics'),
	(26, 'MacBook', '$555', 4, 'https://i.imgur.com/WJRePm8.png', 'Consequat ex eu', 'Best Matched', 'Electronics'),
	(27, 'MacBook', '$603', 4, 'https://i.imgur.com/WJRePm8.png', 'Consequat ex eu', 'Popular', 'Electronics'),
	(28, 'MacBook', '$602', 4, 'https://i.imgur.com/WJRePm8.png', 'Consequat ex eu', 'Popular', 'Electronics'),
	(29, 'MacBook', '$601', 4, 'https://i.imgur.com/WJRePm8.png', 'Consequat ex eu', 'Popular', 'Electronics'),
	(30, 'MacBook', '$600', 4, 'https://i.imgur.com/WJRePm8.png', 'Consequat ex eu', 'Popular', 'Electronics');

-- Dumping structure for table ecommerce.productsoffresh
CREATE TABLE IF NOT EXISTS `productsoffresh` (
  `id` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `price` varchar(10) NOT NULL,
  `rating` int NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `category` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ecommerce.productsoffresh: ~16 rows (approximately)
INSERT INTO `productsoffresh` (`id`, `name`, `price`, `rating`, `image`, `description`, `category`) VALUES
	(1, 'Pear', '$12', 4, 'https://i.imgur.com/lEoPSTO.png', 'Consequat ex eu', 'Fresh'),
	(2, 'Avocado', '$11', 4, 'https://i.imgur.com/PJqgkB0.png', 'Consequat ex eu', 'Fresh'),
	(3, 'Cherry', '$5', 4, 'https://i.imgur.com/AAXeBY5.png', 'Consequat ex eu', 'Fresh'),
	(4, 'Orange', '$7', 4, 'https://i.imgur.com/oPAJrQy.png', 'Consequat ex eu', 'Fresh'),
	(5, 'Apple', '$8', 4, 'https://i.imgur.com/dFnDVca.png', 'Consequat ex eu', 'Fresh'),
	(6, 'Peach', '$4', 4, 'https://i.imgur.com/pVgz53X.png', 'Consequat ex eu', 'Fresh'),
	(7, 'Watermelon', '$3', 4, 'https://i.imgur.com/HnN7uxu.png', 'Consequat ex eu', 'Fresh'),
	(8, 'Banana', '$5', 4, 'https://i.imgur.com/LbdcSZJ.png', 'Consequat ex eu', 'Fresh'),
	(9, 'Grape', '$10', 4, 'https://i.imgur.com/zsiyybz.png', 'Consequat ex eu', 'Fresh'),
	(10, 'Lemon', '$11', 4, 'https://i.imgur.com/yk0udYc.png', 'Consequat ex eu', 'Fresh'),
	(11, 'Mango', '$12', 4, 'https://i.imgur.com/auYlv98.png', 'Consequat ex eu', 'Fresh'),
	(12, 'Kiwi', '$9', 4, 'https://i.imgur.com/oTJcXxl.png', 'Consequat ex eu', 'Fresh'),
	(13, 'Strawberry', '$6', 4, 'https://i.imgur.com/YoboK1o.png', 'Consequat ex eu', 'Fresh'),
	(14, 'Pineapple', '$4', 4, 'https://i.imgur.com/8DKn3J5.png', 'Consequat ex eu', 'Fresh'),
	(15, 'Pomegranate', '$6', 4, 'https://i.imgur.com/dTku1ls.png', 'Consequat ex eu', 'Fresh'),
	(16, 'Coconut', '$11', 4, 'https://i.imgur.com/GtQ80dt.png', 'Consequat ex eu', 'Fresh');

-- Dumping structure for table ecommerce.recommendations
CREATE TABLE IF NOT EXISTS `recommendations` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` varchar(50) NOT NULL,
  `rating` float NOT NULL,
  `image` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ecommerce.recommendations: ~2 rows (approximately)
INSERT INTO `recommendations` (`id`, `name`, `price`, `rating`, `image`) VALUES
	(1, 'Shoes', '$299', 4.5, 'https://i.imgur.com/AvHgary.png'),
	(2, 'Tablet', '$499', 4.5, 'https://i.imgur.com/LOCgJAL.png'),
	(3, 'Pear', '$299', 4.5, 'https://i.imgur.com/yh64E5q.png');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

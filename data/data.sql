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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ecommerce.account: ~7 rows (approximately)
INSERT INTO `account` (`id`, `username`, `name`, `email`, `password`, `avatar`, `role`, `dateAdded`, `lastActive`) VALUES
	(1, 'maiqtruong', 'Mai Quốc Trưởng', 'maiqtruong2403@gmail.com', '123', '1731274229931.jpg', 'Admin', '2024-11-11 03:22:40', '2024-11-10 08:30:00'),
	(2, 'jane_smith123', 'Jane Smith', 'jane@example.com', '123', '1732098048333.jpg', 'User', '2024-11-11 12:48:40', '2024-11-11 12:48:40'),
	(3, 'truongmai', 'Mai Truong', 'maitruong2403@gmail.com', '123', '1731958635060.jpg', 'User', '2024-11-19 02:37:15', '2024-11-19 02:37:15'),
	(4, 'vana', 'Văn A', 'vana@gmail.com', '123456', '1732385513516.jpeg', 'User', '2024-11-24 01:11:54', '2024-11-24 01:11:54');

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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ecommerce.bill: ~0 rows (approximately)
INSERT INTO `bill` (`billID`, `address`, `phone`, `accountID`, `paymentID`) VALUES
	(1, '12/25 Đông Hưng Thuận 3, HCM, Q12', '0398911257', 4, 2),
	(2, '12 Nguyen Trai', '123456789', 3, 4),
	(3, '30 Nguyen Van Bảo', '0123911257', 3, 5);

-- Dumping structure for table ecommerce.brandpayment
CREATE TABLE IF NOT EXISTS `brandpayment` (
  `brandID` int NOT NULL AUTO_INCREMENT,
  `brand` varchar(255) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`brandID`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ecommerce.brandpayment: ~15 rows (approximately)
INSERT INTO `brandpayment` (`brandID`, `brand`, `logo`) VALUES
	(1, 'Vietcombank', 'https://i.imgur.com/4Go2yFG.png'),
	(2, 'Techcombank', 'https://i.imgur.com/YIHZaUS.png'),
	(3, 'BIDV', 'https://i.imgur.com/xCYX7tz.png'),
	(4, 'Agribank', 'https://i.imgur.com/9hcrTYx.png'),
	(5, 'VPBank', 'https://i.imgur.com/lIEN5hK.png'),
	(6, 'Visa', 'https://i.imgur.com/d2St7d2.png'),
	(7, 'MasterCard', 'https://i.imgur.com/OuFcqrd.png'),
	(8, 'PayPal', 'https://i.imgur.com/SyJNg04.png'),
	(9, 'MoMo', 'https://i.imgur.com/7mTZBBO.png'),
	(10, 'MBBank', 'https://i.imgur.com/nEaXpW7.png'),
	(11, 'PVComBank', 'https://i.imgur.com/6ilV405.png'),
	(12, 'Sacombank', 'https://i.imgur.com/Z7bJYvD.png'),
	(13, 'TPBank', 'https://i.imgur.com/TZRyND0.png'),
	(14, 'VIB Bank', 'https://i.imgur.com/1S6ITN2.png'),
	(15, 'VietinBank', 'https://i.imgur.com/fQEBqOB.png'),
	(16, 'OCB', 'https://i.imgur.com/zwMq6tu.png'),
	(17, 'OCEAN BANK', 'https://i.imgur.com/B0Pt9n7.png');

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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ecommerce.feedback: ~0 rows (approximately)
INSERT INTO `feedback` (`idfb`, `comment`, `days`, `image`, `accountID`) VALUES
	(1, 'Cũng ok ', '2024-11-23', '1732387396847.png', 4),
	(2, 'Đượccc', '2024-11-23', '1732387505981.png', 3),
	(3, 'Tuytttt', '2024-11-23', '1732388131993.png', 3);

-- Dumping structure for table ecommerce.paymentmethods
CREATE TABLE IF NOT EXISTS `paymentmethods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(50) NOT NULL,
  `number` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `brand` varchar(50) NOT NULL,
  `accountID` int NOT NULL,
  `brandID` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_paymentmethods_account` (`accountID`),
  KEY `FK_paymentmethods_brand` (`brandID`),
  CONSTRAINT `FK_paymentmethods_account` FOREIGN KEY (`accountID`) REFERENCES `account` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_paymentmethods_brand` FOREIGN KEY (`brandID`) REFERENCES `brandpayment` (`brandID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ecommerce.paymentmethods: ~0 rows (approximately)
INSERT INTO `paymentmethods` (`id`, `type`, `number`, `email`, `brand`, `accountID`, `brandID`) VALUES
	(1, 'Vietcombank', '10398131', NULL, 'Vietcombank', 4, 1),
	(2, 'BIDV', '18012316', NULL, 'BIDV', 4, 3),
	(3, 'PayPal', NULL, 'vana@gmail.com', 'PayPal', 4, 8),
	(4, 'MoMo', '0398911257', NULL, 'MoMo', 3, 9),
	(5, 'VPBank', '151212316', NULL, 'VPBank', 3, 5);

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

-- Dumping data for table ecommerce.productsofelectronics: ~31 rows (approximately)
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
	(30, 'MacBook', '$600', 4, 'https://i.imgur.com/WJRePm8.png', 'Consequat ex eu', 'Popular', 'Electronics'),
	(31, 'MacBook', '$100', 4, 'http://localhost:3000/uploads/1732371707209.jpg', 'aaaaaa', 'Best Matched', 'Electronics');

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

-- Dumping data for table ecommerce.productsoffresh: ~0 rows (approximately)
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

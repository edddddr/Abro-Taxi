-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 23, 2023 at 11:04 AM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 7.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `abro_taxi_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `driver_table`
--

CREATE TABLE `driver_table` (
  `id` int(100) NOT NULL,
  `userId` varchar(20) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `middleName` varchar(20) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `field` varchar(30) NOT NULL,
  `serviceType` varchar(30) NOT NULL,
  `typeOfCar` varchar(30) NOT NULL,
  `modelOfCar` varchar(10) NOT NULL,
  `capacityOfCar` int(10) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `password` varchar(70) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `states` varchar(10) NOT NULL,
  `flag` int(2) NOT NULL,
  `regCode` varchar(40) NOT NULL,
  `userType` varchar(20) NOT NULL DEFAULT 'standard',
  `encryptedPassword` varchar(200) NOT NULL,
  `salt` varchar(50) NOT NULL,
  `updatedBy` varchar(60) NOT NULL,
  `availableVehicleSeat` varchar(5) NOT NULL,
  `plateNumber` varchar(100) NOT NULL,
  `updated` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `driver_table`
--

INSERT INTO `driver_table` (`id`, `userId`, `firstName`, `middleName`, `lastName`, `phone`, `email`, `field`, `serviceType`, `typeOfCar`, `modelOfCar`, `capacityOfCar`, `gender`, `password`, `createdAt`, `states`, `flag`, `regCode`, `userType`, `encryptedPassword`, `salt`, `updatedBy`, `availableVehicleSeat`, `plateNumber`, `updated`) VALUES
(6, '077cc773', 'Hajera', 'Hussen', 'Beshir', '+251919229551', 'haju1000@gmail.com', 'driver', '', 'vitz', '2016', 4, 'Female', 'qazxswedc', '2023-08-22 16:48:33', 'active', 0, '', 'standard', '', '', '', '', '7365356B', '2023-08-22 16:48:33');

-- --------------------------------------------------------

--
-- Table structure for table `driver_tasks`
--

CREATE TABLE `driver_tasks` (
  `id` int(255) NOT NULL,
  `name` varchar(50) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `taskType` varchar(50) NOT NULL,
  `startPoint` varchar(30) NOT NULL,
  `endPoint` varchar(30) NOT NULL,
  `monthlyPayment` varchar(100) NOT NULL,
  `serviceGroup` varchar(300) NOT NULL,
  `assignedBy` varchar(100) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `availableVehicleSeat` int(3) NOT NULL,
  `leftVehicleSeat` int(3) NOT NULL,
  `plateNumber` varchar(100) NOT NULL,
  `states` varchar(20) NOT NULL DEFAULT 'available'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `driver_tasks`
--

INSERT INTO `driver_tasks` (`id`, `name`, `phone`, `taskType`, `startPoint`, `endPoint`, `monthlyPayment`, `serviceGroup`, `assignedBy`, `createdAt`, `availableVehicleSeat`, `leftVehicleSeat`, `plateNumber`, `states`) VALUES
(27, 'Hajera Hussen', '+251919229551', 'regular', 'Addisu Sefer', 'Bambis', '20000', '7365356B-Hajera:-Addisu-Sefer=>Bambis', '+251919229547', '2023-12-23 12:44:58', 4, 4, '7365356B', 'available');

-- --------------------------------------------------------

--
-- Table structure for table `general_info`
--

CREATE TABLE `general_info` (
  `id` int(11) NOT NULL,
  `infoName` varchar(50) NOT NULL,
  `detail` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `general_info`
--

INSERT INTO `general_info` (`id`, `infoName`, `detail`) VALUES
(1, 'routPricePercentage', '20'),
(4, 'currentPaymentReceiptType', 'tot-20');

-- --------------------------------------------------------

--
-- Table structure for table `management_data`
--

CREATE TABLE `management_data` (
  `id` int(20) NOT NULL,
  `regCode` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `management_posts`
--

CREATE TABLE `management_posts` (
  `id` int(5) NOT NULL,
  `place` int(1) NOT NULL,
  `title` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
  `detail` varchar(1000) CHARACTER SET utf8mb4 NOT NULL,
  `imgName` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
  `uploadedBy` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `payment_data`
--

CREATE TABLE `payment_data` (
  `id` int(11) NOT NULL,
  `phone` varchar(22) NOT NULL,
  `name` varchar(22) NOT NULL,
  `payedForMonth` varchar(20) NOT NULL DEFAULT '',
  `paymentId` varchar(20) NOT NULL,
  `states` varchar(20) DEFAULT NULL,
  `paymentName` varchar(50) NOT NULL DEFAULT '',
  `paymentReason` varchar(100) NOT NULL DEFAULT '',
  `paymentAmount` int(6) NOT NULL DEFAULT 0,
  `taxAmount` decimal(15,4) NOT NULL,
  `netAmount` decimal(15,4) NOT NULL,
  `paymentDate` datetime NOT NULL DEFAULT current_timestamp(),
  `paymentUpdatedDate` datetime DEFAULT NULL,
  `payerDetail` varchar(40) DEFAULT NULL,
  `paymentDescription` varchar(100) DEFAULT NULL,
  `confirmedBy` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `payment_data`
--

INSERT INTO `payment_data` (`id`, `phone`, `name`, `payedForMonth`, `paymentId`, `states`, `paymentName`, `paymentReason`, `paymentAmount`, `taxAmount`, `netAmount`, `paymentDate`, `paymentUpdatedDate`, `payerDetail`, `paymentDescription`, `confirmedBy`) VALUES
(1, '+251952643332', 'mina', 'January', 'Pym-16-Jan-mina-9a7f', 'added', 'January-registration', 'registration', 2000, '0.0000', '0.0000', '2023-09-26 14:55:58', NULL, 'jaffar', 'payed for some one', 'req.session.phone'),
(2, '+251952643332', 'mina', 'April', 'Pym-16-Apr-mina-4b09', 'added', 'April-monthly_payment', 'monthly_payment', 3000, '0.0000', '0.0000', '2023-09-26 16:28:43', NULL, 'Jaffar hussen', 'To ja', '0919229547'),
(7, '+251952643332', 'mina', 'January', 'Pym-16-Jan-mina-a3f1', 'added', 'January-monthly_payment', 'monthly_payment', 12322, '2464.4000', '9857.6000', '2023-10-03 12:54:50', NULL, 'sdfadsfasdfa', 'fasdfadf', '0919229547'),
(8, '+251952643332', 'mina', 'March', 'Pym-16-Mar-mina-9955', 'added', 'March-monthly_payment', 'monthly_payment', 1000000, '200000.0000', '800000.0000', '2023-10-03 12:55:37', NULL, 'sdfadsfasdfa', 'fasdfadf', '0919229547'),
(9, '+251952643332', 'mina', 'May', 'Pym-16-May-mina-5632', 'added', 'May-monthly_payment', 'monthly_payment', 1123432, '224686.4000', '898745.6000', '2023-10-03 12:56:25', NULL, 'sdfadsfasdfa', 'fasdfadf', '0919229547'),
(10, '+251952643332', 'mina', 'June', 'Pym-16-Jun-mina-5fec', 'added', 'June-monthly_payment', 'monthly_payment', 1111111, '222222.2000', '888888.8000', '2023-10-03 12:57:19', NULL, 'sdfadsfasdfa', 'fasdfadf', '0919229547'),
(11, '+251952643332', 'mina', 'August', 'Pym-23-Aug-mina-c3a2', 'added', 'August-monthly_payment', 'monthly_payment', 2000, '400.0000', '1600.0000', '2023-12-23 12:51:19', NULL, 'asdfadf', 'adgfa', '+251919229547');

-- --------------------------------------------------------

--
-- Table structure for table `place_lists`
--

CREATE TABLE `place_lists` (
  `id` int(100) NOT NULL,
  `placeName` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `place_lists`
--

INSERT INTO `place_lists` (`id`, `placeName`) VALUES
(2, '22 mazoria'),
(3, '24 kebele'),
(4, '4 Kilo'),
(5, '58 kebele '),
(6, '6 Kilo '),
(7, 'Abnet Hotel '),
(8, 'Abuware  '),
(9, 'Addisalem '),
(10, 'Addisu Gebeya '),
(11, 'Addisu Sefer '),
(12, 'Adey Abeba '),
(13, 'Adwa Dildye '),
(14, 'Afincho Ber '),
(15, 'Africa Union '),
(16, 'Akaki'),
(17, 'Akaki korkoro Fabrica '),
(18, 'Aleltu'),
(19, 'Alem Bank '),
(20, 'Alemgena '),
(21, 'Amanuel  '),
(22, 'Ambassador Theater '),
(23, 'Amist Kilo '),
(24, 'Anbessa Gerag'),
(25, 'Anfo meda '),
(26, 'Arat Kilo'),
(27, 'Arogew Kera '),
(28, 'Asco Addisu Sefer '),
(29, 'Asko'),
(30, 'Asko Sansuzi '),
(31, 'Atana Tera '),
(32, 'Atikilt tera'),
(33, 'Atlas Hotel '),
(34, 'Autobus Tera '),
(35, 'Ayat  '),
(36, 'Ayat Condominium '),
(37, 'Ayer Tena '),
(38, 'Balcha Hospital'),
(39, 'Bambis  '),
(40, 'Bela 68 Jara Park'),
(41, 'Bete Mengist '),
(42, 'Betel Hosipital '),
(43, 'Bethel  '),
(44, 'Bherawi Mehandis '),
(45, 'Bherawi Theater '),
(46, 'Bherawi '),
(47, 'Birass Cilinic Bole School'),
(48, 'Birchiko Fabrica '),
(49, 'Bisrate Gebriel '),
(50, 'Bisrategebreil'),
(51, 'Bole'),
(52, 'Bole Airport '),
(53, 'Bole Bulbula '),
(54, 'Bole Legehare '),
(55, 'Bole Medhanealem '),
(56, 'Bole Michael '),
(57, 'Bole Mikhael Square '),
(58, 'Bole School Medhanialem '),
(59, 'Bole Tenatabia '),
(60, 'Bole '),
(61, 'Building College '),
(62, 'Bulgaria Mazoria '),
(63, 'Burayu '),
(64, 'C.M.C Michael '),
(65, 'C.M.C '),
(66, 'Chancho '),
(67, 'Chilot  '),
(68, 'CMC 82 Kotebe'),
(69, 'Coca Cola '),
(70, 'Crown Hotel '),
(71, 'Deber Zeit '),
(72, 'Dese Hotel '),
(73, 'Dil Ber '),
(74, 'Dire Sololia '),
(75, 'Dukem '),
(76, 'Enderase  '),
(77, 'Enkulal Fabrica '),
(78, 'Entoto Kidane Mhiret'),
(79, 'Entoto Mariam '),
(80, 'Ethio China College'),
(81, 'Eyesus Church '),
(82, 'Ferensay Embassy '),
(83, 'Fili Doro '),
(84, 'Filwuha  '),
(85, 'Gandi Hospital '),
(86, 'Gelan '),
(87, 'Genet Hotel '),
(88, 'Gergi'),
(89, 'Gerji (Mebrat Hail)'),
(90, 'Gerji (Roba DaboBet)'),
(91, 'Gerji (Russia Camp)'),
(92, 'Germen Square '),
(93, 'Gibi Gebriel '),
(94, 'Giorgis  '),
(95, 'Gofa Camp '),
(96, 'Gofa Condo '),
(97, 'Gofa Gebriel '),
(98, 'Gojjam Berenda '),
(99, 'Goro  '),
(100, 'Goro Sefera'),
(101, 'Gotera'),
(102, 'Gurara'),
(103, 'Gurd Shola'),
(104, 'Habte Giorgis '),
(105, 'Hamle  '),
(106, 'Hana Mariam (Kotebe)'),
(107, 'Hana Mariam (Lafto)'),
(108, 'Hana Mariyame Kotebe '),
(109, 'Hanamariam '),
(110, 'Haya Arat Kebele'),
(111, 'Haya Hulet Mazoria'),
(112, 'Hilton Hotel '),
(113, 'Holand Embasy '),
(114, 'Holeta '),
(115, 'Huletegna Polis Tabiya'),
(116, 'Imperial Hotel '),
(117, 'Italy Embassy'),
(118, 'Iyesus  '),
(119, 'Janmeda  '),
(120, 'Jemo Site '),
(121, 'Jemo '),
(122, 'Kaliti'),
(123, 'Kara'),
(124, 'Kara Alo '),
(125, 'Kara Kore '),
(126, 'Karakore '),
(127, 'Karalo '),
(128, 'Kasanchis '),
(129, 'Kasanchiz'),
(130, 'Kazanchees  '),
(131, 'Kazanchiz '),
(132, 'Kebena'),
(133, 'Kechene'),
(134, 'Kechene Medhanealem '),
(135, 'Kera'),
(136, 'keraniyo'),
(137, 'Ketena 2 '),
(138, 'Kidanemihret'),
(139, 'kidste Mariam'),
(140, 'Kira'),
(141, 'Kirkos  '),
(142, 'Kolfe'),
(143, 'kolfe Dildy'),
(144, 'Kolfe Gebeya '),
(145, 'Kolfe Polis Maseltegna'),
(146, 'Kore Mekanisa'),
(147, 'Korki Fabrica '),
(148, 'Korki Fabrica '),
(149, 'Kotebe'),
(150, 'Kotebe Breta Bret'),
(151, 'Kotebe College '),
(152, 'Kotebe Gebiriel '),
(153, 'Kotebe Teachers Collage'),
(154, 'kusquam'),
(155, 'Lafto (Mebrat Hail)'),
(156, 'Lafto Michael '),
(157, 'Lafto '),
(158, 'Lagehar '),
(159, 'Lamberet '),
(160, 'Lancha  '),
(161, 'Lebu Musica bet '),
(162, 'Legedadi '),
(163, 'Legehar'),
(164, 'Legetafo '),
(165, 'Leghar Through Kasanchis '),
(166, 'Lideta'),
(167, 'Lideta (Balcha Hospital)'),
(168, 'Lideta (Fird Bet)'),
(169, 'Luquanda  '),
(170, 'Magenagna '),
(171, 'Mazoria  '),
(172, 'Mebrat Hail '),
(173, 'Medhanealem School '),
(174, 'Megenagna Gorfe Aswegaj '),
(175, 'Mekanisa  '),
(176, 'Mekanisa Abo '),
(177, 'Mekanisa Jemo '),
(178, 'Mekililand Birchko Fabrica '),
(179, 'Menelik Hospital '),
(180, 'Menen  '),
(181, 'Meri  '),
(182, 'Merkato'),
(183, 'Merkato '),
(184, 'Mesalemiya  '),
(185, 'Meshualekia  '),
(186, 'Meskel square'),
(187, 'Mexico'),
(188, 'Michael '),
(189, 'Mickyliland Village '),
(190, 'Mikililand/Birechko fabrica '),
(191, 'Mililik Sqare '),
(192, 'Minilik Hospital'),
(193, 'Olompia  '),
(194, 'Ourael  '),
(195, 'Park  '),
(196, 'Paster  '),
(197, 'Pawlos'),
(198, 'Philpos Church '),
(199, 'Piassa  '),
(200, 'Qusquam  '),
(201, 'Ras Mekonnen Dildye'),
(202, 'Rufael  '),
(203, 'Ruwanda Embassy '),
(204, 'Saalite Mhirete '),
(205, 'Sar Bet '),
(206, 'Saris  '),
(207, 'Saris Abo'),
(208, 'Sebeta '),
(209, 'Sefera Goro'),
(210, 'Semen Addisu Gebeya'),
(211, 'Semen Gebeya '),
(212, 'Semen Hotel '),
(213, 'Semit  '),
(214, 'Sendafa '),
(215, 'Shebel'),
(216, 'Shegole  '),
(217, 'Shiromeda'),
(218, 'Shola  '),
(219, 'Shola Gebeya '),
(220, 'Sidist Kilo'),
(221, 'Signal '),
(222, 'Sinima Ethipia'),
(223, 'St. Gebriel Hospital'),
(224, 'Stadium  '),
(225, 'Sululta '),
(227, 'Summit/codominium/'),
(226, 'Summit '),
(228, 'Teji '),
(229, 'Teklehaimanot '),
(230, 'Tewodros Square '),
(231, 'Tikur Anbessa '),
(232, 'Tor Hailoch '),
(233, 'Total (3 qutr )'),
(234, 'Total (Tsion Holel)'),
(235, 'tulu dimtu '),
(236, 'Vatican Embassy '),
(237, 'wehalimat '),
(238, 'Welete '),
(239, 'Weyra Sefer '),
(240, 'Wingate  '),
(241, 'Wingate college '),
(242, 'Wingate School '),
(243, 'Wolo Sefer '),
(244, 'Worku Sefer '),
(245, 'Wuha Limat '),
(246, 'Yeka Ayat Con.1sq '),
(247, 'Yenegew Fire School '),
(248, 'Yerer Ber '),
(249, 'Yohannes'),
(250, 'Yosef  '),
(251, 'Zenebe Work '),
(252, 'Zerihun bulding ');

-- --------------------------------------------------------

--
-- Table structure for table `routs_with_km_and_price`
--

CREATE TABLE `routs_with_km_and_price` (
  `id` int(11) NOT NULL,
  `startPoint` varchar(20) DEFAULT NULL,
  `endPoint` varchar(20) DEFAULT NULL,
  `distanceInKm` int(5) NOT NULL,
  `estimatedPrice` int(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `routs_with_km_and_price`
--

INSERT INTO `routs_with_km_and_price` (`id`, `startPoint`, `endPoint`, `distanceInKm`, `estimatedPrice`) VALUES
(1, 'Addisu Sefer', 'Mebrat Hail', 12, 3000),
(2, 'Addisu Sefer', 'Betel Hosipital', 12, 15000),
(3, 'Addisu Sefer', 'Chilot', 10, 3600),
(4, 'Dukem', 'Megenagna Gorfe Aswe', 10, 3000),
(5, 'Addisu Sefer', 'Addisalem', 6, 3000),
(6, 'Wingate college', 'Kaliti', 6, 3000),
(8, 'Jemo', 'Yohannes', 6, 3000),
(10, 'Chilot', 'Bambis', 10, 900),
(11, 'Abuware', 'Zerihun bulding', 12, 3600),
(12, 'Abnet Hotel', 'Fili Doro', 13, 3000),
(13, 'Addisu Sefer', 'Bambis', 13, 6000);

-- --------------------------------------------------------

--
-- Table structure for table `staff_table`
--

CREATE TABLE `staff_table` (
  `id` int(100) NOT NULL,
  `userId` varchar(20) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `middleName` varchar(20) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `field` varchar(30) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `password` varchar(70) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `states` varchar(10) NOT NULL,
  `flag` int(2) NOT NULL,
  `regCode` varchar(40) NOT NULL,
  `userType` varchar(20) NOT NULL DEFAULT 'standard',
  `encryptedPassword` varchar(200) NOT NULL,
  `salt` varchar(50) NOT NULL,
  `updatedBy` varchar(60) NOT NULL,
  `updated` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `staff_table`
--

INSERT INTO `staff_table` (`id`, `userId`, `firstName`, `middleName`, `lastName`, `phone`, `email`, `field`, `gender`, `password`, `createdAt`, `states`, `flag`, `regCode`, `userType`, `encryptedPassword`, `salt`, `updatedBy`, `updated`) VALUES
(1, '341344', 'Jaffar', 'Hussen', 'Beshir', '+251919229547', 'jaffarhussen1000@gmail.com', 'management', 'male', 'zxcvbnm', '2023-08-22 10:08:18', 'active', 0, 'asdfghjkl', 'standard', '', '', '', '2023-08-22 10:08:18'),
(6, '077cc773', 'Hajera', 'Hussen', 'Beshir', '+251919229551', 'haju1000@gmail.com', 'driver', 'Female', 'qazxswedc', '2023-08-22 16:48:33', 'active', 0, '', 'standard', '', '', '', '2023-08-22 16:48:33'),
(10, 'bd154c6d', 'Mina', 'Hussen', 'Beshir', '+251952643332', 'mina1000@gmail.com', 'management', 'Female', 'edcvfrtg', '2023-08-24 12:25:13', 'inactive', 0, '', 'standard', '', '', '', '2023-08-24 12:25:13'),
(11, 'c32d4075', 'imam', 'unk', 'unk', '+251911255366', 'yimam@gmail.com', 'management', 'Male', 'qwertyuiop', '2023-09-19 14:27:17', 'inactive', 0, '', 'standard', '', '', '', '2023-09-19 14:27:17');

-- --------------------------------------------------------

--
-- Table structure for table `user_table`
--

CREATE TABLE `user_table` (
  `id` int(12) NOT NULL,
  `userId` varchar(30) NOT NULL,
  `username` varchar(100) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `firstName` varchar(30) NOT NULL,
  `middleName` varchar(30) NOT NULL,
  `lastName` varchar(30) NOT NULL,
  `extraPhone` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `organizationName` varchar(150) DEFAULT NULL,
  `livingAddress` varchar(50) DEFAULT NULL,
  `startPoint` varchar(30) NOT NULL,
  `endPoint` varchar(20) NOT NULL,
  `typeOfOrder` varchar(50) NOT NULL,
  `typeOfCar` varchar(100) NOT NULL,
  `orderDate` datetime DEFAULT current_timestamp(),
  `profileImg` varchar(100) DEFAULT NULL,
  `created` datetime NOT NULL,
  `userStates` varchar(12) NOT NULL DEFAULT 'inactive',
  `encryptedPassword` varchar(200) NOT NULL,
  `salt` varchar(50) NOT NULL,
  `regCode` varchar(40) NOT NULL,
  `userType` varchar(20) NOT NULL,
  `flag` int(5) NOT NULL,
  `updated` datetime NOT NULL DEFAULT current_timestamp(),
  `gender` varchar(10) NOT NULL,
  `updatedBy` varchar(60) NOT NULL,
  `paymentStates` varchar(100) NOT NULL DEFAULT 'unpaid',
  `serviceGroup` varchar(150) NOT NULL DEFAULT 'unassigned',
  `reorder` varchar(5) NOT NULL DEFAULT 'yes'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_table`
--

INSERT INTO `user_table` (`id`, `userId`, `username`, `phone`, `firstName`, `middleName`, `lastName`, `extraPhone`, `email`, `organizationName`, `livingAddress`, `startPoint`, `endPoint`, `typeOfOrder`, `typeOfCar`, `orderDate`, `profileImg`, `created`, `userStates`, `encryptedPassword`, `salt`, `regCode`, `userType`, `flag`, `updated`, `gender`, `updatedBy`, `paymentStates`, `serviceGroup`, `reorder`) VALUES
(4, '234125423', 'mina', '+251952643332', 'mina', 'hussen', 'beshir', NULL, 'mina1000@gmail.com', 'tofi', 'addis ababa', 'Addisu Sefer', 'Addisu Gebeya', '', 'vitz', '2023-08-31 15:03:39', NULL, '2023-08-31 14:57:29', 'active', '', '', '', '', 0, '2023-08-31 15:03:39', 'female', '', 'unpaid', '7365356B-Hajera:-Chilot=>Bambis', 'yes');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `driver_table`
--
ALTER TABLE `driver_table`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD UNIQUE KEY `userId` (`userId`);

--
-- Indexes for table `driver_tasks`
--
ALTER TABLE `driver_tasks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `general_info`
--
ALTER TABLE `general_info`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `infoName` (`infoName`);

--
-- Indexes for table `management_data`
--
ALTER TABLE `management_data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `management_posts`
--
ALTER TABLE `management_posts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payment_data`
--
ALTER TABLE `payment_data`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payment_id` (`paymentId`),
  ADD UNIQUE KEY `payed_for_stu_id` (`phone`,`payedForMonth`,`paymentReason`);

--
-- Indexes for table `place_lists`
--
ALTER TABLE `place_lists`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `street_name` (`placeName`);

--
-- Indexes for table `routs_with_km_and_price`
--
ALTER TABLE `routs_with_km_and_price`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `route` (`startPoint`,`endPoint`);

--
-- Indexes for table `staff_table`
--
ALTER TABLE `staff_table`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD UNIQUE KEY `userId` (`userId`);

--
-- Indexes for table `user_table`
--
ALTER TABLE `user_table`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `uniqueId` (`userId`) USING BTREE,
  ADD UNIQUE KEY `phone` (`phone`) USING BTREE,
  ADD UNIQUE KEY `username` (`username`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `driver_table`
--
ALTER TABLE `driver_table`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `driver_tasks`
--
ALTER TABLE `driver_tasks`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `general_info`
--
ALTER TABLE `general_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `management_data`
--
ALTER TABLE `management_data`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `management_posts`
--
ALTER TABLE `management_posts`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_data`
--
ALTER TABLE `payment_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `place_lists`
--
ALTER TABLE `place_lists`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=253;

--
-- AUTO_INCREMENT for table `routs_with_km_and_price`
--
ALTER TABLE `routs_with_km_and_price`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `staff_table`
--
ALTER TABLE `staff_table`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `user_table`
--
ALTER TABLE `user_table`
  MODIFY `id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

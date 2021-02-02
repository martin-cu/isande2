-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: itisdev_db
-- ------------------------------------------------------
-- Server version	8.0.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `customer_location_table`
--

DROP TABLE IF EXISTS `customer_location_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_location_table` (
  `location_id` int NOT NULL AUTO_INCREMENT,
  `location_name` varchar(45) NOT NULL,
  `customer_id` int NOT NULL,
  PRIMARY KEY (`location_id`),
  UNIQUE KEY `location_id_UNIQUE` (`location_id`),
  KEY `customer_location_ref_idx` (`customer_id`),
  CONSTRAINT `customer_location_ref` FOREIGN KEY (`customer_id`) REFERENCES `customer_table` (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_location_table`
--

LOCK TABLES `customer_location_table` WRITE;
/*!40000 ALTER TABLE `customer_location_table` DISABLE KEYS */;
INSERT INTO `customer_location_table` VALUES (1,'Gulod Labak, Batangas City',1),(2,'Gulod Taas, Batangas City',1),(3,'Central , Batangas City',2),(4,'Pallocan East, Batangas City',3),(5,'Pallocan West, Batangas City',3),(6,'Sampaga, Batangas City',3),(7,'Alanginan, Batangas City',4),(8,'Balagtas, Batangas City',5),(9,'Taysan, Batangas City',6),(10,'Pier, Batangas City',7),(11,'Cuta, Batangas City',8),(12,'Diversion, Batangas City',9),(13,'Governor Carpio Rd, Batangas City',10);
/*!40000 ALTER TABLE `customer_location_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_table`
--

DROP TABLE IF EXISTS `customer_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_table` (
  `customer_id` int NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(45) NOT NULL,
  PRIMARY KEY (`customer_id`),
  UNIQUE KEY `customer_id_UNIQUE` (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_table`
--

LOCK TABLES `customer_table` WRITE;
/*!40000 ALTER TABLE `customer_table` DISABLE KEYS */;
INSERT INTO `customer_table` VALUES (1,'Hipolito Hardware'),(2,'Marajaen'),(3,'La Sail'),(4,'Amorado'),(5,'Golden Libjo'),(6,'GJY'),(7,'Golden Coin'),(8,'CDL'),(9,'Tophock'),(10,'Vinseth');
/*!40000 ALTER TABLE `customer_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `damaged_inventory_table`
--

DROP TABLE IF EXISTS `damaged_inventory_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `damaged_inventory_table` (
  `damage_report_id` int NOT NULL AUTO_INCREMENT,
  `damaged_amt` int NOT NULL,
  `reported_by` varchar(60) NOT NULL,
  `date` date NOT NULL,
  `comments` varchar(45) DEFAULT NULL,
  `product_id` int NOT NULL,
  PRIMARY KEY (`damage_report_id`),
  UNIQUE KEY `damage_report_id_UNIQUE` (`damage_report_id`),
  KEY `damaged_product_ref_idx` (`product_id`),
  KEY `damage_reported_by_idx` (`reported_by`),
  CONSTRAINT `damage_reported_by` FOREIGN KEY (`reported_by`) REFERENCES `user_table` (`username`),
  CONSTRAINT `damaged_product_ref` FOREIGN KEY (`product_id`) REFERENCES `product_table` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `damaged_inventory_table`
--

LOCK TABLES `damaged_inventory_table` WRITE;
/*!40000 ALTER TABLE `damaged_inventory_table` DISABLE KEYS */;
/*!40000 ALTER TABLE `damaged_inventory_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delivery_detail_table`
--

DROP TABLE IF EXISTS `delivery_detail_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery_detail_table` (
  `delivery_detail_id` int NOT NULL AUTO_INCREMENT,
  `delivery_receipt` int NOT NULL,
  `driver` int DEFAULT NULL,
  `plate_no` varchar(12) DEFAULT NULL,
  `delivery_address` int NOT NULL,
  `status` enum('Pending','Processing','Completed') NOT NULL,
  `damaged_bags` int DEFAULT '0',
  `delivery_type` enum('Sell-in','Sell-out') DEFAULT 'Sell-in',
  `date_completed` date DEFAULT NULL,
  PRIMARY KEY (`delivery_detail_id`),
  UNIQUE KEY `delivery_detail_id_UNIQUE` (`delivery_detail_id`),
  KEY `delivery_ref_idx` (`delivery_receipt`),
  KEY `driver_idx` (`driver`),
  KEY `delivery_loc_ref_idx` (`delivery_address`),
  KEY `truck_ref_idx` (`plate_no`),
  CONSTRAINT `delivery_loc_ref` FOREIGN KEY (`delivery_address`) REFERENCES `customer_location_table` (`location_id`),
  CONSTRAINT `delivery_ref` FOREIGN KEY (`delivery_receipt`) REFERENCES `sales_history` (`delivery_receipt`),
  CONSTRAINT `driver_ref` FOREIGN KEY (`driver`) REFERENCES `employee_table` (`employee_id`),
  CONSTRAINT `truck_ref` FOREIGN KEY (`plate_no`) REFERENCES `trucks_table` (`plate_no`)
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_detail_table`
--

LOCK TABLES `delivery_detail_table` WRITE;
/*!40000 ALTER TABLE `delivery_detail_table` DISABLE KEYS */;
INSERT INTO `delivery_detail_table` VALUES (35,202102001,5,'PPT 921',13,'Completed',0,'Sell-in','2021-02-02'),(36,202102002,6,'QTY 952',7,'Completed',0,'Sell-in','2021-02-02'),(37,202102004,7,'UVB 123',1,'Completed',0,'Sell-in','2021-02-02'),(38,202102005,8,'UXQ 857',1,'Completed',0,'Sell-in','2021-02-02'),(39,202102006,9,'WHM 834',8,'Completed',0,'Sell-in','2021-02-02'),(40,202102007,10,'YEN 449',10,'Completed',0,'Sell-in','2021-02-02'),(41,202102008,9,'WHM 834',1,'Completed',2,'Sell-in','2021-02-02'),(42,202102009,10,'YEN 449',3,'Completed',0,'Sell-in','2021-02-02'),(43,202102010,5,'PPT 921',3,'Completed',0,'Sell-in','2021-02-02'),(44,202102012,6,'QTY 952',9,'Completed',0,'Sell-in','2021-02-02'),(45,202102014,7,'UVB 123',10,'Completed',0,'Sell-in','2021-02-02'),(46,202102015,5,'PPT 921',1,'Completed',0,'Sell-in','2021-02-02'),(47,202102016,6,'QTY 952',1,'Completed',0,'Sell-in','2021-02-02'),(48,202102018,7,'UVB 123',13,'Completed',0,'Sell-in','2021-02-02'),(49,202102019,8,'UXQ 857',3,'Completed',0,'Sell-in','2021-02-02'),(50,202102020,9,'WHM 834',7,'Completed',0,'Sell-in','2021-02-02'),(51,202102021,10,'YEN 449',9,'Completed',0,'Sell-in','2021-02-02'),(52,202102022,5,'PPT 921',8,'Completed',0,'Sell-in','2021-02-02'),(53,202102023,6,'QTY 952',10,'Completed',0,'Sell-in','2021-02-02'),(54,202102024,7,'UVB 123',8,'Completed',0,'Sell-in','2021-02-02'),(55,202102025,8,'UXQ 857',4,'Completed',0,'Sell-in','2021-02-02'),(56,202102026,5,'PPT 921',1,'Completed',0,'Sell-in','2021-02-02'),(57,202102027,6,'QTY 952',1,'Completed',0,'Sell-in','2021-02-02'),(58,202102028,7,'UVB 123',7,'Completed',0,'Sell-in','2021-02-02'),(59,202102029,8,'UXQ 857',11,'Completed',0,'Sell-in','2021-02-02'),(60,202102030,9,'WHM 834',4,'Completed',0,'Sell-in','2021-02-02'),(61,202102032,10,'YEN 449',8,'Completed',0,'Sell-in','2021-02-02'),(62,202102033,5,'PPT 921',10,'Completed',0,'Sell-in','2021-02-02'),(63,202102034,6,'QTY 952',13,'Completed',0,'Sell-in','2021-02-02'),(64,202102035,7,'UVB 123',12,'Completed',0,'Sell-in','2021-02-02'),(65,202102036,6,'QTY 952',3,'Completed',0,'Sell-in','2021-02-02'),(66,202102037,NULL,NULL,7,'Pending',0,'Sell-in',NULL),(67,202102038,7,'UVB 123',4,'Completed',0,'Sell-in','2021-02-02'),(68,202102039,8,'UXQ 857',1,'Completed',0,'Sell-in','2021-02-02'),(69,202102040,NULL,NULL,11,'Pending',0,'Sell-in',NULL),(70,202102041,NULL,NULL,11,'Pending',0,'Sell-in',NULL),(71,202102042,NULL,NULL,8,'Pending',0,'Sell-in',NULL),(72,202102043,NULL,NULL,4,'Pending',0,'Sell-in',NULL),(73,202102044,NULL,NULL,6,'Pending',0,'Sell-in',NULL),(74,202102045,NULL,NULL,7,'Pending',0,'Sell-in',NULL),(75,202102046,NULL,NULL,1,'Pending',0,'Sell-in',NULL),(76,202102048,NULL,NULL,13,'Pending',0,'Sell-in',NULL),(77,202102049,NULL,NULL,12,'Pending',0,'Sell-in',NULL),(78,202102050,NULL,NULL,11,'Pending',0,'Sell-in',NULL),(79,202102051,NULL,NULL,4,'Pending',0,'Sell-in',NULL),(80,202102052,NULL,NULL,1,'Pending',0,'Sell-in',NULL),(81,202102055,NULL,NULL,3,'Pending',0,'Sell-in',NULL),(82,202102056,NULL,NULL,7,'Pending',0,'Sell-in',NULL),(83,202102057,NULL,NULL,9,'Pending',0,'Sell-in',NULL),(84,202102058,NULL,NULL,8,'Pending',0,'Sell-in',NULL),(85,202102059,NULL,NULL,10,'Pending',0,'Sell-in',NULL),(86,202102061,NULL,NULL,1,'Pending',0,'Sell-in',NULL),(87,202102062,NULL,NULL,11,'Pending',0,'Sell-in',NULL),(88,202102063,NULL,NULL,7,'Pending',0,'Sell-in',NULL),(89,202102064,NULL,NULL,4,'Pending',0,'Sell-in',NULL),(90,202102065,NULL,NULL,12,'Pending',0,'Sell-in',NULL),(91,202102066,NULL,NULL,8,'Pending',0,'Sell-in',NULL),(92,202102067,NULL,NULL,1,'Pending',0,'Sell-in',NULL),(93,202102068,NULL,NULL,3,'Pending',0,'Sell-in',NULL),(94,202102069,NULL,NULL,11,'Pending',0,'Sell-in',NULL),(95,202102070,NULL,NULL,4,'Pending',0,'Sell-in',NULL);
/*!40000 ALTER TABLE `delivery_detail_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delivery_employees`
--

DROP TABLE IF EXISTS `delivery_employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery_employees` (
  `delivery_emp_id` int NOT NULL AUTO_INCREMENT,
  `carrier_id` int NOT NULL,
  `delivery_detail_id` int NOT NULL,
  PRIMARY KEY (`delivery_emp_id`),
  UNIQUE KEY `delivery_emp_id_UNIQUE` (`delivery_emp_id`),
  KEY `carrier_ref_idx` (`carrier_id`),
  KEY `delivery_deet_emp_ref_idx` (`delivery_detail_id`),
  CONSTRAINT `carrier_ref` FOREIGN KEY (`carrier_id`) REFERENCES `employee_table` (`employee_id`),
  CONSTRAINT `delivery_deet_emp_ref` FOREIGN KEY (`delivery_detail_id`) REFERENCES `delivery_detail_table` (`delivery_detail_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_employees`
--

LOCK TABLES `delivery_employees` WRITE;
/*!40000 ALTER TABLE `delivery_employees` DISABLE KEYS */;
INSERT INTO `delivery_employees` VALUES (15,11,19),(16,15,19);
/*!40000 ALTER TABLE `delivery_employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discrepancy_table`
--

DROP TABLE IF EXISTS `discrepancy_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discrepancy_table` (
  `discrepancy_id` int NOT NULL AUTO_INCREMENT,
  `system_count` int NOT NULL,
  `physical_count` int NOT NULL,
  `date_recorded` date NOT NULL,
  `comment` varchar(45) DEFAULT NULL,
  `product_id` int NOT NULL,
  `reported_by` varchar(60) NOT NULL,
  PRIMARY KEY (`discrepancy_id`),
  UNIQUE KEY `discrepancy_id_UNIQUE` (`discrepancy_id`),
  KEY `discrepancy_product_ref_idx` (`product_id`),
  KEY `discrepancy_reported_by_idx` (`reported_by`),
  CONSTRAINT `discrepancy_product_ref` FOREIGN KEY (`product_id`) REFERENCES `product_table` (`product_id`),
  CONSTRAINT `discrepancy_reported_by` FOREIGN KEY (`reported_by`) REFERENCES `user_table` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discrepancy_table`
--

LOCK TABLES `discrepancy_table` WRITE;
/*!40000 ALTER TABLE `discrepancy_table` DISABLE KEYS */;
/*!40000 ALTER TABLE `discrepancy_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_table`
--

DROP TABLE IF EXISTS `employee_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_table` (
  `employee_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `job` varchar(45) NOT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  PRIMARY KEY (`employee_id`),
  UNIQUE KEY `employee_Id_UNIQUE` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_table`
--

LOCK TABLES `employee_table` WRITE;
/*!40000 ALTER TABLE `employee_table` DISABLE KEYS */;
INSERT INTO `employee_table` VALUES (1,'Martin','Cu','Sales Employee','Active'),(2,'Loren','Anyayahan','Sales Employee','Active'),(3,'Y2','Aquino','Sales Employee','Active'),(4,'Martin','Murillo','Sales Employee','Inactive'),(5,'Allen','Dalangin','Driver','Active'),(6,'Adrian','Dasilva','Driver','Active'),(7,'JM','San Jose','Driver','Active'),(8,'Louis','Borja','Driver','Active'),(9,'Renz','Dela Rosa','Driver','Active'),(10,'Nathan','Bongon','Driver','Active'),(11,'Matthew','Estrella','Carrier','Active'),(12,'Mark','Elizon','Carrier','Active'),(13,'Luke','Martinez','Carrier','Active'),(14,'John','Jaen','Carrier','Active'),(15,'Romano','David','Carrier','Active'),(16,'Nestor','Cuevas','Carrier','Active'),(17,'Karding','Cube','Carrier','Active'),(18,'Cong','Cuison','Carrier','Active'),(19,'Junnie','Castaneda','Carrier','Active'),(20,'Christian','Ambrosio','Carrier','Active'),(21,'Yow','Alib','Carrier','Active'),(22,'Josh','Casaclang','Carrier','Active'),(23,'Angel','Jariel','Carrier','Active'),(24,'Bods','Santos','Carrier','Active'),(25,'Atoy','Hu','Carrier','Active');
/*!40000 ALTER TABLE `employee_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `notif_id` int NOT NULL AUTO_INCREMENT,
  `seen` int NOT NULL DEFAULT '0',
  `url` varchar(55) NOT NULL,
  `description` varchar(45) DEFAULT NULL,
  `time_created` datetime NOT NULL,
  `user` int NOT NULL,
  `creator` int NOT NULL,
  `contents` varchar(45) NOT NULL,
  PRIMARY KEY (`notif_id`),
  UNIQUE KEY `notif_id_UNIQUE` (`notif_id`),
  KEY `user_idx` (`user`),
  KEY `creator_idx` (`creator`),
  CONSTRAINT `creator` FOREIGN KEY (`creator`) REFERENCES `user_table` (`employee_id`),
  CONSTRAINT `user` FOREIGN KEY (`user`) REFERENCES `user_table` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=883 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (73,0,'/schedule_delivery?id=202102001&&type=Sell-in','Sale','2021-02-02 12:07:20',5,3,'New order for Vinseth'),(74,1,'/schedule_delivery?id=202102001&&type=Sell-in','Sale','2021-02-02 12:07:20',2,3,'New order for Vinseth'),(76,0,'/schedule_delivery?id=202102002&&type=Sell-in','Sale','2021-02-02 12:31:02',5,3,'New order for Amorado'),(77,1,'/schedule_delivery?id=202102002&&type=Sell-in','Sale','2021-02-02 12:31:02',2,3,'New order for Amorado'),(79,0,'/schedule_delivery?id=202102004&&type=Sell-in','Sale','2021-02-02 12:32:07',5,3,'New order for Hipolito Hardware'),(80,1,'/schedule_delivery?id=202102004&&type=Sell-in','Sale','2021-02-02 12:32:07',2,3,'New order for Hipolito Hardware'),(82,0,'/schedule_delivery?id=202102005&&type=Sell-in','Sale','2021-02-02 12:32:25',5,3,'New order for Hipolito Hardware'),(83,1,'/schedule_delivery?id=202102005&&type=Sell-in','Sale','2021-02-02 12:32:25',2,3,'New order for Hipolito Hardware'),(85,0,'/schedule_delivery?id=202102006&&type=Sell-in','Sale','2021-02-02 12:32:40',5,3,'New order for Golden Libjo'),(86,1,'/schedule_delivery?id=202102006&&type=Sell-in','Sale','2021-02-02 12:32:40',2,3,'New order for Golden Libjo'),(88,0,'/schedule_delivery?id=202102007&&type=Sell-in','Sale','2021-02-02 12:32:55',5,3,'New order for Golden Coin'),(89,1,'/schedule_delivery?id=202102007&&type=Sell-in','Sale','2021-02-02 12:32:55',2,3,'New order for Golden Coin'),(91,0,'/schedule_delivery?id=50068333&&type=Restock','Purchase','2021-02-02 12:37:08',5,1,'New purchase of FCC'),(92,1,'/schedule_delivery?id=50068333&&type=Restock','Purchase','2021-02-02 12:37:08',2,1,'New purchase of FCC'),(94,0,'/schedule_delivery?id=50068333&&type=Restock','Purchase','2021-02-02 12:37:45',5,1,'New purchase of FCC'),(95,1,'/schedule_delivery?id=50068333&&type=Restock','Purchase','2021-02-02 12:37:45',2,1,'New purchase of FCC'),(97,0,'/schedule_delivery?id=50068608&&type=Restock','Purchase','2021-02-02 12:38:23',5,1,'New purchase of FCC'),(98,1,'/schedule_delivery?id=50068608&&type=Restock','Purchase','2021-02-02 12:38:23',2,1,'New purchase of FCC'),(100,0,'/schedule_delivery?id=50068607&&type=Restock','Purchase','2021-02-02 12:38:44',5,1,'New purchase of FCC'),(101,1,'/schedule_delivery?id=50068607&&type=Restock','Purchase','2021-02-02 12:38:44',2,1,'New purchase of FCC'),(103,0,'/schedule_delivery?id=50068606&&type=Restock','Purchase','2021-02-02 12:39:03',5,1,'New purchase of RCC'),(104,1,'/schedule_delivery?id=50068606&&type=Restock','Purchase','2021-02-02 12:39:03',2,1,'New purchase of RCC'),(106,0,'/schedule_delivery?id=50068554&&type=Restock','Purchase','2021-02-02 12:39:19',5,1,'New purchase of FCC'),(107,1,'/schedule_delivery?id=50068554&&type=Restock','Purchase','2021-02-02 12:39:19',2,1,'New purchase of FCC'),(109,0,'/schedule_delivery?id=50068553&&type=Restock','Purchase','2021-02-02 12:39:42',5,1,'New purchase of FCC'),(110,1,'/schedule_delivery?id=50068553&&type=Restock','Purchase','2021-02-02 12:39:42',2,1,'New purchase of FCC'),(112,0,'/view_purchase_details/50068333','Delivery Processing','2021-02-02 12:40:25',5,2,'Purchase 50068333 is being processed'),(113,1,'/view_purchase_details/50068333','Delivery Processing','2021-02-02 12:40:25',1,2,'Purchase 50068333 is being processed'),(115,0,'/view_purchase_details/50068553','Delivery Processing','2021-02-02 12:44:06',5,2,'Purchase 50068553 is being processed'),(116,1,'/view_purchase_details/50068553','Delivery Processing','2021-02-02 12:44:06',1,2,'Purchase 50068553 is being processed'),(118,0,'/view_purchase_details/50068554','Delivery Processing','2021-02-02 12:44:12',5,2,'Purchase 50068554 is being processed'),(119,1,'/view_purchase_details/50068554','Delivery Processing','2021-02-02 12:44:12',1,2,'Purchase 50068554 is being processed'),(121,0,'/view_purchase_details/50068606','Delivery Processing','2021-02-02 12:44:16',5,2,'Purchase 50068606 is being processed'),(122,1,'/view_purchase_details/50068606','Delivery Processing','2021-02-02 12:44:16',1,2,'Purchase 50068606 is being processed'),(124,0,'/view_purchase_details/50068607','Delivery Processing','2021-02-02 12:44:21',5,2,'Purchase 50068607 is being processed'),(125,1,'/view_purchase_details/50068607','Delivery Processing','2021-02-02 12:44:21',1,2,'Purchase 50068607 is being processed'),(127,0,'/view_purchase_details/50068608','Delivery Processing','2021-02-02 12:44:24',5,2,'Purchase 50068608 is being processed'),(128,1,'/view_purchase_details/50068608','Delivery Processing','2021-02-02 12:44:24',1,2,'Purchase 50068608 is being processed'),(130,0,'/view_purchase_details/50068333','Delivery Done','2021-02-02 12:45:56',5,2,'Purchase 50068333 is completed'),(131,1,'/view_purchase_details/50068333','Delivery Done','2021-02-02 12:45:56',1,2,'Purchase 50068333 is completed'),(133,0,'/view_purchase_details/50068553','Delivery Done','2021-02-02 12:46:23',5,2,'Purchase 50068553 is completed'),(134,1,'/view_purchase_details/50068553','Delivery Done','2021-02-02 12:46:23',1,2,'Purchase 50068553 is completed'),(136,0,'/view_purchase_details/50068554','Delivery Done','2021-02-02 12:46:48',5,2,'Purchase 50068554 is completed'),(137,1,'/view_purchase_details/50068554','Delivery Done','2021-02-02 12:46:48',1,2,'Purchase 50068554 is completed'),(139,0,'/view_purchase_details/50068607','Delivery Done','2021-02-02 12:47:05',5,2,'Purchase 50068607 is completed'),(140,1,'/view_purchase_details/50068607','Delivery Done','2021-02-02 12:47:05',1,2,'Purchase 50068607 is completed'),(142,0,'/view_purchase_details/50068608','Delivery Done','2021-02-02 12:47:24',5,2,'Purchase 50068608 is completed'),(143,1,'/view_purchase_details/50068608','Delivery Done','2021-02-02 12:47:24',1,2,'Purchase 50068608 is completed'),(145,0,'/view_purchase_details/50068606','Delivery Done','2021-02-02 12:47:36',5,2,'Purchase 50068606 is completed'),(146,1,'/view_purchase_details/50068606','Delivery Done','2021-02-02 12:47:36',1,2,'Purchase 50068606 is completed'),(148,1,'/view_sales_details/202102001','Delivery Processing','2021-02-02 12:50:25',3,2,'Order 202102001 is being processed'),(149,0,'/view_sales_details/202102001','Delivery Processing','2021-02-02 12:50:25',5,2,'Order 202102001 is being processed'),(151,1,'/view_sales_details/202102002','Delivery Processing','2021-02-02 12:50:30',3,2,'Order 202102002 is being processed'),(152,0,'/view_sales_details/202102002','Delivery Processing','2021-02-02 12:50:30',5,2,'Order 202102002 is being processed'),(154,1,'/view_sales_details/202102004','Delivery Processing','2021-02-02 12:50:33',3,2,'Order 202102004 is being processed'),(155,0,'/view_sales_details/202102004','Delivery Processing','2021-02-02 12:50:33',5,2,'Order 202102004 is being processed'),(157,1,'/view_sales_details/202102005','Delivery Processing','2021-02-02 12:50:36',3,2,'Order 202102005 is being processed'),(158,0,'/view_sales_details/202102005','Delivery Processing','2021-02-02 12:50:36',5,2,'Order 202102005 is being processed'),(160,1,'/view_sales_details/202102006','Delivery Processing','2021-02-02 12:50:39',3,2,'Order 202102006 is being processed'),(161,0,'/view_sales_details/202102006','Delivery Processing','2021-02-02 12:50:39',5,2,'Order 202102006 is being processed'),(163,1,'/view_sales_details/202102007','Delivery Processing','2021-02-02 12:50:42',3,2,'Order 202102007 is being processed'),(164,0,'/view_sales_details/202102007','Delivery Processing','2021-02-02 12:50:42',5,2,'Order 202102007 is being processed'),(166,1,'/view_sales_details/202102002','Delivery Done','2021-02-02 12:50:49',3,2,'Order 202102002 is completed'),(167,0,'/view_sales_details/202102002','Delivery Done','2021-02-02 12:50:49',5,2,'Order 202102002 is completed'),(169,1,'/view_sales_details/202102004','Delivery Done','2021-02-02 12:50:52',3,2,'Order 202102004 is completed'),(170,0,'/view_sales_details/202102004','Delivery Done','2021-02-02 12:50:52',5,2,'Order 202102004 is completed'),(172,1,'/view_sales_details/202102006','Delivery Done','2021-02-02 12:50:55',3,2,'Order 202102006 is completed'),(173,0,'/view_sales_details/202102006','Delivery Done','2021-02-02 12:50:55',5,2,'Order 202102006 is completed'),(175,1,'/view_sales_details/202102001','Delivery Done','2021-02-02 12:50:58',3,2,'Order 202102001 is completed'),(176,0,'/view_sales_details/202102001','Delivery Done','2021-02-02 12:50:58',5,2,'Order 202102001 is completed'),(178,1,'/view_sales_details/202102005','Delivery Done','2021-02-02 12:51:00',3,2,'Order 202102005 is completed'),(179,0,'/view_sales_details/202102005','Delivery Done','2021-02-02 12:51:00',5,2,'Order 202102005 is completed'),(181,1,'/view_sales_details/202102007','Delivery Done','2021-02-02 12:51:03',3,2,'Order 202102007 is completed'),(182,0,'/view_sales_details/202102007','Delivery Done','2021-02-02 12:51:03',5,2,'Order 202102007 is completed'),(184,0,'/schedule_delivery?id=50068445&&type=Restock','Purchase','2021-02-02 13:08:32',5,1,'New purchase of FCC'),(185,1,'/schedule_delivery?id=50068445&&type=Restock','Purchase','2021-02-02 13:08:32',2,1,'New purchase of FCC'),(187,0,'/schedule_delivery?id=50068446&&type=Restock','Purchase','2021-02-02 13:09:10',5,1,'New purchase of FCC'),(188,1,'/schedule_delivery?id=50068446&&type=Restock','Purchase','2021-02-02 13:09:10',2,1,'New purchase of FCC'),(190,0,'/schedule_delivery?id=50068447&&type=Restock','Purchase','2021-02-02 13:09:33',5,1,'New purchase of FCC'),(191,1,'/schedule_delivery?id=50068447&&type=Restock','Purchase','2021-02-02 13:09:33',2,1,'New purchase of FCC'),(193,0,'/schedule_delivery?id=50068448&&type=Restock','Purchase','2021-02-02 13:11:12',5,1,'New purchase of FCC'),(194,1,'/schedule_delivery?id=50068448&&type=Restock','Purchase','2021-02-02 13:11:12',2,1,'New purchase of FCC'),(196,0,'/schedule_delivery?id=50068449&&type=Restock','Purchase','2021-02-02 13:11:24',5,1,'New purchase of FCC'),(197,1,'/schedule_delivery?id=50068449&&type=Restock','Purchase','2021-02-02 13:11:24',2,1,'New purchase of FCC'),(199,0,'/schedule_delivery?id=50068450&&type=Restock','Purchase','2021-02-02 13:11:37',5,1,'New purchase of FCC'),(200,1,'/schedule_delivery?id=50068450&&type=Restock','Purchase','2021-02-02 13:11:37',2,1,'New purchase of FCC'),(202,0,'/schedule_delivery?id=50068451&&type=Restock','Purchase','2021-02-02 13:11:55',5,1,'New purchase of RCC'),(203,1,'/schedule_delivery?id=50068451&&type=Restock','Purchase','2021-02-02 13:11:55',2,1,'New purchase of RCC'),(205,0,'/schedule_delivery?id=50068452&&type=Restock','Purchase','2021-02-02 13:12:13',5,1,'New purchase of FCC'),(206,1,'/schedule_delivery?id=50068452&&type=Restock','Purchase','2021-02-02 13:12:13',2,1,'New purchase of FCC'),(208,0,'/schedule_delivery?id=50068453&&type=Restock','Purchase','2021-02-02 13:12:28',5,1,'New purchase of FCC'),(209,1,'/schedule_delivery?id=50068453&&type=Restock','Purchase','2021-02-02 13:12:28',2,1,'New purchase of FCC'),(211,0,'/schedule_delivery?id=50068454&&type=Restock','Purchase','2021-02-02 13:12:44',5,1,'New purchase of FCC'),(212,1,'/schedule_delivery?id=50068454&&type=Restock','Purchase','2021-02-02 13:12:44',2,1,'New purchase of FCC'),(214,0,'/schedule_delivery?id=202102008&&type=Sell-in','Sale','2021-02-02 13:13:27',5,3,'New order for Hipolito Hardware'),(215,1,'/schedule_delivery?id=202102008&&type=Sell-in','Sale','2021-02-02 13:13:27',2,3,'New order for Hipolito Hardware'),(217,0,'/schedule_delivery?id=202102009&&type=Sell-in','Sale','2021-02-02 13:13:39',5,3,'New order for Marajaen'),(218,1,'/schedule_delivery?id=202102009&&type=Sell-in','Sale','2021-02-02 13:13:39',2,3,'New order for Marajaen'),(220,0,'/schedule_delivery?id=202102010&&type=Sell-in','Sale','2021-02-02 13:17:10',5,3,'New order for Marajaen'),(221,1,'/schedule_delivery?id=202102010&&type=Sell-in','Sale','2021-02-02 13:17:10',2,3,'New order for Marajaen'),(223,0,'/schedule_delivery?id=202102012&&type=Sell-in','Sale','2021-02-02 13:18:37',5,3,'New order for GJY'),(224,1,'/schedule_delivery?id=202102012&&type=Sell-in','Sale','2021-02-02 13:18:37',2,3,'New order for GJY'),(226,0,'/schedule_delivery?id=202102014&&type=Sell-in','Sale','2021-02-02 13:20:16',5,3,'New order for Golden Coin'),(227,1,'/schedule_delivery?id=202102014&&type=Sell-in','Sale','2021-02-02 13:20:16',2,3,'New order for Golden Coin'),(229,0,'/view_purchase_details/50068445','Delivery Processing','2021-02-02 13:21:33',5,2,'Purchase 50068445 is being processed'),(230,1,'/view_purchase_details/50068445','Delivery Processing','2021-02-02 13:21:33',1,2,'Purchase 50068445 is being processed'),(232,0,'/view_purchase_details/50068446','Delivery Processing','2021-02-02 13:21:37',5,2,'Purchase 50068446 is being processed'),(233,1,'/view_purchase_details/50068446','Delivery Processing','2021-02-02 13:21:37',1,2,'Purchase 50068446 is being processed'),(235,0,'/view_purchase_details/50068447','Delivery Processing','2021-02-02 13:21:40',5,2,'Purchase 50068447 is being processed'),(236,1,'/view_purchase_details/50068447','Delivery Processing','2021-02-02 13:21:40',1,2,'Purchase 50068447 is being processed'),(238,0,'/view_purchase_details/50068448','Delivery Processing','2021-02-02 13:21:49',5,2,'Purchase 50068448 is being processed'),(239,1,'/view_purchase_details/50068448','Delivery Processing','2021-02-02 13:21:49',1,2,'Purchase 50068448 is being processed'),(241,0,'/view_purchase_details/50068449','Delivery Processing','2021-02-02 13:21:53',5,2,'Purchase 50068449 is being processed'),(242,1,'/view_purchase_details/50068449','Delivery Processing','2021-02-02 13:21:53',1,2,'Purchase 50068449 is being processed'),(244,0,'/view_purchase_details/50068450','Delivery Processing','2021-02-02 13:21:57',5,2,'Purchase 50068450 is being processed'),(245,1,'/view_purchase_details/50068450','Delivery Processing','2021-02-02 13:21:57',1,2,'Purchase 50068450 is being processed'),(247,0,'/view_purchase_details/50068445','Delivery Done','2021-02-02 13:22:38',5,2,'Purchase 50068445 is completed'),(248,1,'/view_purchase_details/50068445','Delivery Done','2021-02-02 13:22:38',1,2,'Purchase 50068445 is completed'),(250,0,'/view_purchase_details/50068446','Delivery Done','2021-02-02 13:22:48',5,2,'Purchase 50068446 is completed'),(251,1,'/view_purchase_details/50068446','Delivery Done','2021-02-02 13:22:48',1,2,'Purchase 50068446 is completed'),(253,0,'/view_purchase_details/50068447','Delivery Done','2021-02-02 13:22:58',5,2,'Purchase 50068447 is completed'),(254,1,'/view_purchase_details/50068447','Delivery Done','2021-02-02 13:22:58',1,2,'Purchase 50068447 is completed'),(256,0,'/view_purchase_details/50068448','Delivery Done','2021-02-02 13:23:14',5,2,'Purchase 50068448 is completed'),(257,1,'/view_purchase_details/50068448','Delivery Done','2021-02-02 13:23:14',1,2,'Purchase 50068448 is completed'),(259,0,'/view_purchase_details/50068449','Delivery Done','2021-02-02 13:23:23',5,2,'Purchase 50068449 is completed'),(260,1,'/view_purchase_details/50068449','Delivery Done','2021-02-02 13:23:23',1,2,'Purchase 50068449 is completed'),(262,0,'/view_purchase_details/50068450','Delivery Done','2021-02-02 13:23:35',5,2,'Purchase 50068450 is completed'),(263,1,'/view_purchase_details/50068450','Delivery Done','2021-02-02 13:23:35',1,2,'Purchase 50068450 is completed'),(265,0,'/view_purchase_details/50068451','Delivery Processing','2021-02-02 13:25:43',5,2,'Purchase 50068451 is being processed'),(266,1,'/view_purchase_details/50068451','Delivery Processing','2021-02-02 13:25:43',1,2,'Purchase 50068451 is being processed'),(268,0,'/view_purchase_details/50068452','Delivery Processing','2021-02-02 13:25:47',5,2,'Purchase 50068452 is being processed'),(269,1,'/view_purchase_details/50068452','Delivery Processing','2021-02-02 13:25:47',1,2,'Purchase 50068452 is being processed'),(271,0,'/view_purchase_details/50068453','Delivery Processing','2021-02-02 13:25:50',5,2,'Purchase 50068453 is being processed'),(272,1,'/view_purchase_details/50068453','Delivery Processing','2021-02-02 13:25:50',1,2,'Purchase 50068453 is being processed'),(274,0,'/view_purchase_details/50068454','Delivery Processing','2021-02-02 13:25:53',5,2,'Purchase 50068454 is being processed'),(275,1,'/view_purchase_details/50068454','Delivery Processing','2021-02-02 13:25:53',1,2,'Purchase 50068454 is being processed'),(277,1,'/view_sales_details/202102008','Delivery Processing','2021-02-02 13:26:02',3,2,'Order 202102008 is being processed'),(278,0,'/view_sales_details/202102008','Delivery Processing','2021-02-02 13:26:02',5,2,'Order 202102008 is being processed'),(280,1,'/view_sales_details/202102009','Delivery Processing','2021-02-02 13:26:06',3,2,'Order 202102009 is being processed'),(281,0,'/view_sales_details/202102009','Delivery Processing','2021-02-02 13:26:06',5,2,'Order 202102009 is being processed'),(283,0,'/view_purchase_details/50068452','Delivery Done','2021-02-02 13:26:59',5,2,'Purchase 50068452 is completed'),(284,1,'/view_purchase_details/50068452','Delivery Done','2021-02-02 13:26:59',1,2,'Purchase 50068452 is completed'),(286,0,'/view_purchase_details/50068453','Delivery Done','2021-02-02 13:27:07',5,2,'Purchase 50068453 is completed'),(287,1,'/view_purchase_details/50068453','Delivery Done','2021-02-02 13:27:07',1,2,'Purchase 50068453 is completed'),(289,0,'/view_purchase_details/50068454','Delivery Done','2021-02-02 13:27:16',5,2,'Purchase 50068454 is completed'),(290,1,'/view_purchase_details/50068454','Delivery Done','2021-02-02 13:27:16',1,2,'Purchase 50068454 is completed'),(292,1,'/view_sales_details/202102008','Delivery Done','2021-02-02 13:27:22',3,2,'Order 202102008 is completed'),(293,0,'/view_sales_details/202102008','Delivery Done','2021-02-02 13:27:22',5,2,'Order 202102008 is completed'),(295,1,'/view_sales_details/202102009','Delivery Done','2021-02-02 13:27:26',3,2,'Order 202102009 is completed'),(296,0,'/view_sales_details/202102009','Delivery Done','2021-02-02 13:27:26',5,2,'Order 202102009 is completed'),(298,0,'/view_purchase_details/50068451','Delivery Done','2021-02-02 13:27:50',5,2,'Purchase 50068451 is completed'),(299,1,'/view_purchase_details/50068451','Delivery Done','2021-02-02 13:27:50',1,2,'Purchase 50068451 is completed'),(301,1,'/view_sales_details/202102010','Delivery Processing','2021-02-02 13:27:59',3,2,'Order 202102010 is being processed'),(302,0,'/view_sales_details/202102010','Delivery Processing','2021-02-02 13:27:59',5,2,'Order 202102010 is being processed'),(304,1,'/view_sales_details/202102012','Delivery Processing','2021-02-02 13:28:02',3,2,'Order 202102012 is being processed'),(305,0,'/view_sales_details/202102012','Delivery Processing','2021-02-02 13:28:02',5,2,'Order 202102012 is being processed'),(307,1,'/view_sales_details/202102014','Delivery Processing','2021-02-02 13:28:05',3,2,'Order 202102014 is being processed'),(308,0,'/view_sales_details/202102014','Delivery Processing','2021-02-02 13:28:05',5,2,'Order 202102014 is being processed'),(310,1,'/view_sales_details/202102010','Delivery Done','2021-02-02 13:28:11',3,2,'Order 202102010 is completed'),(311,0,'/view_sales_details/202102010','Delivery Done','2021-02-02 13:28:11',5,2,'Order 202102010 is completed'),(313,1,'/view_sales_details/202102012','Delivery Done','2021-02-02 13:28:15',3,2,'Order 202102012 is completed'),(314,0,'/view_sales_details/202102012','Delivery Done','2021-02-02 13:28:15',5,2,'Order 202102012 is completed'),(316,1,'/view_sales_details/202102014','Delivery Done','2021-02-02 13:28:17',3,2,'Order 202102014 is completed'),(317,0,'/view_sales_details/202102014','Delivery Done','2021-02-02 13:28:17',5,2,'Order 202102014 is completed'),(319,0,'/schedule_delivery?id=50068455&&type=Restock','Purchase','2021-02-02 13:29:19',5,1,'New purchase of FCC'),(320,1,'/schedule_delivery?id=50068455&&type=Restock','Purchase','2021-02-02 13:29:19',2,1,'New purchase of FCC'),(322,0,'/schedule_delivery?id=50068456&&type=Restock','Purchase','2021-02-02 13:30:02',5,1,'New purchase of FCC'),(323,1,'/schedule_delivery?id=50068456&&type=Restock','Purchase','2021-02-02 13:30:02',2,1,'New purchase of FCC'),(325,0,'/schedule_delivery?id=50068457&&type=Restock','Purchase','2021-02-02 13:30:17',5,1,'New purchase of FCC'),(326,1,'/schedule_delivery?id=50068457&&type=Restock','Purchase','2021-02-02 13:30:17',2,1,'New purchase of FCC'),(328,0,'/schedule_delivery?id=50068458&&type=Restock','Purchase','2021-02-02 13:30:51',5,1,'New purchase of RCC'),(329,1,'/schedule_delivery?id=50068458&&type=Restock','Purchase','2021-02-02 13:30:51',2,1,'New purchase of RCC'),(331,0,'/schedule_delivery?id=50068459&&type=Restock','Purchase','2021-02-02 13:31:03',5,1,'New purchase of FCC'),(332,1,'/schedule_delivery?id=50068459&&type=Restock','Purchase','2021-02-02 13:31:03',2,1,'New purchase of FCC'),(334,0,'/schedule_delivery?id=50068460&&type=Restock','Purchase','2021-02-02 13:31:22',5,1,'New purchase of FCC'),(335,1,'/schedule_delivery?id=50068460&&type=Restock','Purchase','2021-02-02 13:31:22',2,1,'New purchase of FCC'),(337,0,'/schedule_delivery?id=202102015&&type=Sell-in','Sale','2021-02-02 13:32:12',5,3,'New order for Hipolito Hardware'),(338,1,'/schedule_delivery?id=202102015&&type=Sell-in','Sale','2021-02-02 13:32:12',2,3,'New order for Hipolito Hardware'),(340,0,'/schedule_delivery?id=202102016&&type=Sell-in','Sale','2021-02-02 13:32:28',5,3,'New order for Hipolito Hardware'),(341,1,'/schedule_delivery?id=202102016&&type=Sell-in','Sale','2021-02-02 13:32:28',2,3,'New order for Hipolito Hardware'),(343,0,'/schedule_delivery?id=202102018&&type=Sell-in','Sale','2021-02-02 13:45:42',5,3,'New order for Vinseth'),(344,1,'/schedule_delivery?id=202102018&&type=Sell-in','Sale','2021-02-02 13:45:42',2,3,'New order for Vinseth'),(346,0,'/schedule_delivery?id=202102019&&type=Sell-in','Sale','2021-02-02 13:46:00',5,3,'New order for Marajaen'),(347,1,'/schedule_delivery?id=202102019&&type=Sell-in','Sale','2021-02-02 13:46:00',2,3,'New order for Marajaen'),(349,0,'/schedule_delivery?id=202102020&&type=Sell-in','Sale','2021-02-02 13:46:54',5,3,'New order for Amorado'),(350,1,'/schedule_delivery?id=202102020&&type=Sell-in','Sale','2021-02-02 13:46:54',2,3,'New order for Amorado'),(352,0,'/schedule_delivery?id=202102021&&type=Sell-in','Sale','2021-02-02 13:47:02',5,3,'New order for GJY'),(353,1,'/schedule_delivery?id=202102021&&type=Sell-in','Sale','2021-02-02 13:47:02',2,3,'New order for GJY'),(355,0,'/schedule_delivery?id=202102022&&type=Sell-in','Sale','2021-02-02 13:47:12',5,3,'New order for Golden Libjo'),(356,1,'/schedule_delivery?id=202102022&&type=Sell-in','Sale','2021-02-02 13:47:12',2,3,'New order for Golden Libjo'),(358,0,'/schedule_delivery?id=202102023&&type=Sell-in','Sale','2021-02-02 13:47:21',5,3,'New order for Golden Coin'),(359,1,'/schedule_delivery?id=202102023&&type=Sell-in','Sale','2021-02-02 13:47:21',2,3,'New order for Golden Coin'),(361,0,'/schedule_delivery?id=202102024&&type=Sell-in','Sale','2021-02-02 13:47:31',5,3,'New order for Golden Libjo'),(362,1,'/schedule_delivery?id=202102024&&type=Sell-in','Sale','2021-02-02 13:47:31',2,3,'New order for Golden Libjo'),(364,0,'/schedule_delivery?id=202102025&&type=Sell-in','Sale','2021-02-02 13:47:44',5,3,'New order for La Sail'),(365,1,'/schedule_delivery?id=202102025&&type=Sell-in','Sale','2021-02-02 13:47:44',2,3,'New order for La Sail'),(367,0,'/view_purchase_details/50068455','Delivery Processing','2021-02-02 13:49:27',5,2,'Purchase 50068455 is being processed'),(368,1,'/view_purchase_details/50068455','Delivery Processing','2021-02-02 13:49:27',1,2,'Purchase 50068455 is being processed'),(370,0,'/view_purchase_details/50068456','Delivery Processing','2021-02-02 13:49:33',5,2,'Purchase 50068456 is being processed'),(371,1,'/view_purchase_details/50068456','Delivery Processing','2021-02-02 13:49:33',1,2,'Purchase 50068456 is being processed'),(373,0,'/view_purchase_details/50068457','Delivery Processing','2021-02-02 13:49:36',5,2,'Purchase 50068457 is being processed'),(374,1,'/view_purchase_details/50068457','Delivery Processing','2021-02-02 13:49:36',1,2,'Purchase 50068457 is being processed'),(376,0,'/view_purchase_details/50068458','Delivery Processing','2021-02-02 13:49:40',5,2,'Purchase 50068458 is being processed'),(377,1,'/view_purchase_details/50068458','Delivery Processing','2021-02-02 13:49:40',1,2,'Purchase 50068458 is being processed'),(379,0,'/view_purchase_details/50068459','Delivery Processing','2021-02-02 13:49:43',5,2,'Purchase 50068459 is being processed'),(380,1,'/view_purchase_details/50068459','Delivery Processing','2021-02-02 13:49:43',1,2,'Purchase 50068459 is being processed'),(382,0,'/view_purchase_details/50068460','Delivery Processing','2021-02-02 13:49:46',5,2,'Purchase 50068460 is being processed'),(383,1,'/view_purchase_details/50068460','Delivery Processing','2021-02-02 13:49:46',1,2,'Purchase 50068460 is being processed'),(385,0,'/view_purchase_details/50068455','Delivery Done','2021-02-02 13:50:07',5,2,'Purchase 50068455 is completed'),(386,1,'/view_purchase_details/50068455','Delivery Done','2021-02-02 13:50:07',1,2,'Purchase 50068455 is completed'),(388,0,'/view_purchase_details/50068456','Delivery Done','2021-02-02 13:50:20',5,2,'Purchase 50068456 is completed'),(389,1,'/view_purchase_details/50068456','Delivery Done','2021-02-02 13:50:20',1,2,'Purchase 50068456 is completed'),(391,0,'/view_purchase_details/50068457','Delivery Done','2021-02-02 13:50:32',5,2,'Purchase 50068457 is completed'),(392,1,'/view_purchase_details/50068457','Delivery Done','2021-02-02 13:50:32',1,2,'Purchase 50068457 is completed'),(394,0,'/view_purchase_details/50068458','Delivery Done','2021-02-02 13:50:42',5,2,'Purchase 50068458 is completed'),(395,1,'/view_purchase_details/50068458','Delivery Done','2021-02-02 13:50:42',1,2,'Purchase 50068458 is completed'),(397,0,'/view_purchase_details/50068459','Delivery Done','2021-02-02 13:50:50',5,2,'Purchase 50068459 is completed'),(398,1,'/view_purchase_details/50068459','Delivery Done','2021-02-02 13:50:50',1,2,'Purchase 50068459 is completed'),(400,0,'/view_purchase_details/50068460','Delivery Done','2021-02-02 13:51:01',5,2,'Purchase 50068460 is completed'),(401,1,'/view_purchase_details/50068460','Delivery Done','2021-02-02 13:51:01',1,2,'Purchase 50068460 is completed'),(403,1,'/view_sales_details/202102015','Delivery Processing','2021-02-02 13:51:09',3,2,'Order 202102015 is being processed'),(404,0,'/view_sales_details/202102015','Delivery Processing','2021-02-02 13:51:09',5,2,'Order 202102015 is being processed'),(406,1,'/view_sales_details/202102016','Delivery Processing','2021-02-02 13:51:13',3,2,'Order 202102016 is being processed'),(407,0,'/view_sales_details/202102016','Delivery Processing','2021-02-02 13:51:13',5,2,'Order 202102016 is being processed'),(409,1,'/view_sales_details/202102018','Delivery Processing','2021-02-02 13:51:16',3,2,'Order 202102018 is being processed'),(410,0,'/view_sales_details/202102018','Delivery Processing','2021-02-02 13:51:16',5,2,'Order 202102018 is being processed'),(412,1,'/view_sales_details/202102019','Delivery Processing','2021-02-02 13:51:19',3,2,'Order 202102019 is being processed'),(413,0,'/view_sales_details/202102019','Delivery Processing','2021-02-02 13:51:19',5,2,'Order 202102019 is being processed'),(415,1,'/view_sales_details/202102020','Delivery Processing','2021-02-02 13:51:22',3,2,'Order 202102020 is being processed'),(416,0,'/view_sales_details/202102020','Delivery Processing','2021-02-02 13:51:22',5,2,'Order 202102020 is being processed'),(418,1,'/view_sales_details/202102021','Delivery Processing','2021-02-02 13:51:24',3,2,'Order 202102021 is being processed'),(419,0,'/view_sales_details/202102021','Delivery Processing','2021-02-02 13:51:24',5,2,'Order 202102021 is being processed'),(421,1,'/view_sales_details/202102016','Delivery Done','2021-02-02 13:51:43',3,2,'Order 202102016 is completed'),(422,0,'/view_sales_details/202102016','Delivery Done','2021-02-02 13:51:43',5,2,'Order 202102016 is completed'),(424,1,'/view_sales_details/202102018','Delivery Done','2021-02-02 13:51:46',3,2,'Order 202102018 is completed'),(425,0,'/view_sales_details/202102018','Delivery Done','2021-02-02 13:51:46',5,2,'Order 202102018 is completed'),(427,1,'/view_sales_details/202102019','Delivery Done','2021-02-02 13:51:48',3,2,'Order 202102019 is completed'),(428,0,'/view_sales_details/202102019','Delivery Done','2021-02-02 13:51:48',5,2,'Order 202102019 is completed'),(430,1,'/view_sales_details/202102020','Delivery Done','2021-02-02 13:51:51',3,2,'Order 202102020 is completed'),(431,0,'/view_sales_details/202102020','Delivery Done','2021-02-02 13:51:51',5,2,'Order 202102020 is completed'),(433,1,'/view_sales_details/202102021','Delivery Done','2021-02-02 13:51:54',3,2,'Order 202102021 is completed'),(434,0,'/view_sales_details/202102021','Delivery Done','2021-02-02 13:51:54',5,2,'Order 202102021 is completed'),(436,1,'/view_sales_details/202102015','Delivery Done','2021-02-02 13:51:57',3,2,'Order 202102015 is completed'),(437,0,'/view_sales_details/202102015','Delivery Done','2021-02-02 13:51:57',5,2,'Order 202102015 is completed'),(439,1,'/view_sales_details/202102022','Delivery Processing','2021-02-02 13:52:00',3,2,'Order 202102022 is being processed'),(440,0,'/view_sales_details/202102022','Delivery Processing','2021-02-02 13:52:00',5,2,'Order 202102022 is being processed'),(442,1,'/view_sales_details/202102023','Delivery Processing','2021-02-02 13:52:03',3,2,'Order 202102023 is being processed'),(443,0,'/view_sales_details/202102023','Delivery Processing','2021-02-02 13:52:03',5,2,'Order 202102023 is being processed'),(445,1,'/view_sales_details/202102024','Delivery Processing','2021-02-02 13:52:06',3,2,'Order 202102024 is being processed'),(446,0,'/view_sales_details/202102024','Delivery Processing','2021-02-02 13:52:06',5,2,'Order 202102024 is being processed'),(448,1,'/view_sales_details/202102025','Delivery Processing','2021-02-02 13:52:10',3,2,'Order 202102025 is being processed'),(449,0,'/view_sales_details/202102025','Delivery Processing','2021-02-02 13:52:10',5,2,'Order 202102025 is being processed'),(451,1,'/view_sales_details/202102022','Delivery Done','2021-02-02 13:52:14',3,2,'Order 202102022 is completed'),(452,0,'/view_sales_details/202102022','Delivery Done','2021-02-02 13:52:14',5,2,'Order 202102022 is completed'),(454,1,'/view_sales_details/202102023','Delivery Done','2021-02-02 13:52:17',3,2,'Order 202102023 is completed'),(455,0,'/view_sales_details/202102023','Delivery Done','2021-02-02 13:52:17',5,2,'Order 202102023 is completed'),(457,1,'/view_sales_details/202102024','Delivery Done','2021-02-02 13:52:19',3,2,'Order 202102024 is completed'),(458,0,'/view_sales_details/202102024','Delivery Done','2021-02-02 13:52:19',5,2,'Order 202102024 is completed'),(460,1,'/view_sales_details/202102025','Delivery Done','2021-02-02 13:52:22',3,2,'Order 202102025 is completed'),(461,0,'/view_sales_details/202102025','Delivery Done','2021-02-02 13:52:22',5,2,'Order 202102025 is completed'),(463,0,'/schedule_delivery?id=202102026&&type=Sell-in','Sale','2021-02-02 13:53:28',5,3,'New order for Hipolito Hardware'),(464,1,'/schedule_delivery?id=202102026&&type=Sell-in','Sale','2021-02-02 13:53:28',2,3,'New order for Hipolito Hardware'),(466,0,'/schedule_delivery?id=202102027&&type=Sell-in','Sale','2021-02-02 13:53:36',5,3,'New order for Hipolito Hardware'),(467,1,'/schedule_delivery?id=202102027&&type=Sell-in','Sale','2021-02-02 13:53:36',2,3,'New order for Hipolito Hardware'),(469,0,'/schedule_delivery?id=202102028&&type=Sell-in','Sale','2021-02-02 13:53:43',5,3,'New order for Amorado'),(470,1,'/schedule_delivery?id=202102028&&type=Sell-in','Sale','2021-02-02 13:53:43',2,3,'New order for Amorado'),(472,0,'/schedule_delivery?id=202102029&&type=Sell-in','Sale','2021-02-02 13:53:50',5,3,'New order for CDL'),(473,1,'/schedule_delivery?id=202102029&&type=Sell-in','Sale','2021-02-02 13:53:50',2,3,'New order for CDL'),(475,0,'/schedule_delivery?id=202102030&&type=Sell-in','Sale','2021-02-02 13:53:58',5,3,'New order for La Sail'),(476,1,'/schedule_delivery?id=202102030&&type=Sell-in','Sale','2021-02-02 13:53:58',2,3,'New order for La Sail'),(478,0,'/schedule_delivery?id=202102032&&type=Sell-in','Sale','2021-02-02 13:55:13',5,3,'New order for Golden Libjo'),(479,1,'/schedule_delivery?id=202102032&&type=Sell-in','Sale','2021-02-02 13:55:13',2,3,'New order for Golden Libjo'),(481,0,'/schedule_delivery?id=202102033&&type=Sell-in','Sale','2021-02-02 13:55:20',5,3,'New order for Golden Coin'),(482,1,'/schedule_delivery?id=202102033&&type=Sell-in','Sale','2021-02-02 13:55:20',2,3,'New order for Golden Coin'),(484,0,'/schedule_delivery?id=202102034&&type=Sell-in','Sale','2021-02-02 13:55:27',5,3,'New order for Vinseth'),(485,1,'/schedule_delivery?id=202102034&&type=Sell-in','Sale','2021-02-02 13:55:27',2,3,'New order for Vinseth'),(487,0,'/schedule_delivery?id=202102035&&type=Sell-in','Sale','2021-02-02 13:55:36',5,3,'New order for Tophock'),(488,1,'/schedule_delivery?id=202102035&&type=Sell-in','Sale','2021-02-02 13:55:36',2,3,'New order for Tophock'),(490,1,'/view_sales_details/202102026','Delivery Processing','2021-02-02 13:55:56',3,2,'Order 202102026 is being processed'),(491,0,'/view_sales_details/202102026','Delivery Processing','2021-02-02 13:55:56',5,2,'Order 202102026 is being processed'),(493,1,'/view_sales_details/202102027','Delivery Processing','2021-02-02 13:56:01',3,2,'Order 202102027 is being processed'),(494,0,'/view_sales_details/202102027','Delivery Processing','2021-02-02 13:56:01',5,2,'Order 202102027 is being processed'),(496,1,'/view_sales_details/202102028','Delivery Processing','2021-02-02 13:56:04',3,2,'Order 202102028 is being processed'),(497,0,'/view_sales_details/202102028','Delivery Processing','2021-02-02 13:56:04',5,2,'Order 202102028 is being processed'),(499,1,'/view_sales_details/202102029','Delivery Processing','2021-02-02 13:56:07',3,2,'Order 202102029 is being processed'),(500,0,'/view_sales_details/202102029','Delivery Processing','2021-02-02 13:56:07',5,2,'Order 202102029 is being processed'),(502,1,'/view_sales_details/202102030','Delivery Processing','2021-02-02 13:56:11',3,2,'Order 202102030 is being processed'),(503,0,'/view_sales_details/202102030','Delivery Processing','2021-02-02 13:56:11',5,2,'Order 202102030 is being processed'),(505,1,'/view_sales_details/202102032','Delivery Processing','2021-02-02 13:56:13',3,2,'Order 202102032 is being processed'),(506,0,'/view_sales_details/202102032','Delivery Processing','2021-02-02 13:56:13',5,2,'Order 202102032 is being processed'),(508,1,'/view_sales_details/202102027','Delivery Done','2021-02-02 13:56:17',3,2,'Order 202102027 is completed'),(509,0,'/view_sales_details/202102027','Delivery Done','2021-02-02 13:56:17',5,2,'Order 202102027 is completed'),(511,1,'/view_sales_details/202102030','Delivery Done','2021-02-02 13:56:20',3,2,'Order 202102030 is completed'),(512,0,'/view_sales_details/202102030','Delivery Done','2021-02-02 13:56:20',5,2,'Order 202102030 is completed'),(514,1,'/view_sales_details/202102028','Delivery Done','2021-02-02 13:56:25',3,2,'Order 202102028 is completed'),(515,0,'/view_sales_details/202102028','Delivery Done','2021-02-02 13:56:25',5,2,'Order 202102028 is completed'),(517,1,'/view_sales_details/202102029','Delivery Done','2021-02-02 13:56:28',3,2,'Order 202102029 is completed'),(518,0,'/view_sales_details/202102029','Delivery Done','2021-02-02 13:56:28',5,2,'Order 202102029 is completed'),(520,1,'/view_sales_details/202102026','Delivery Done','2021-02-02 13:56:34',3,2,'Order 202102026 is completed'),(521,0,'/view_sales_details/202102026','Delivery Done','2021-02-02 13:56:34',5,2,'Order 202102026 is completed'),(523,1,'/view_sales_details/202102032','Delivery Done','2021-02-02 13:56:40',3,2,'Order 202102032 is completed'),(524,0,'/view_sales_details/202102032','Delivery Done','2021-02-02 13:56:40',5,2,'Order 202102032 is completed'),(526,1,'/view_sales_details/202102033','Delivery Processing','2021-02-02 13:56:52',3,2,'Order 202102033 is being processed'),(527,0,'/view_sales_details/202102033','Delivery Processing','2021-02-02 13:56:52',5,2,'Order 202102033 is being processed'),(529,1,'/view_sales_details/202102034','Delivery Processing','2021-02-02 13:56:56',3,2,'Order 202102034 is being processed'),(530,0,'/view_sales_details/202102034','Delivery Processing','2021-02-02 13:56:56',5,2,'Order 202102034 is being processed'),(532,1,'/view_sales_details/202102035','Delivery Processing','2021-02-02 13:56:59',3,2,'Order 202102035 is being processed'),(533,0,'/view_sales_details/202102035','Delivery Processing','2021-02-02 13:56:59',5,2,'Order 202102035 is being processed'),(535,1,'/view_sales_details/202102033','Delivery Done','2021-02-02 13:57:02',3,2,'Order 202102033 is completed'),(536,0,'/view_sales_details/202102033','Delivery Done','2021-02-02 13:57:02',5,2,'Order 202102033 is completed'),(538,1,'/view_sales_details/202102035','Delivery Done','2021-02-02 13:57:09',3,2,'Order 202102035 is completed'),(539,0,'/view_sales_details/202102035','Delivery Done','2021-02-02 13:57:09',5,2,'Order 202102035 is completed'),(541,1,'/view_sales_details/202102034','Delivery Done','2021-02-02 13:57:12',3,2,'Order 202102034 is completed'),(542,0,'/view_sales_details/202102034','Delivery Done','2021-02-02 13:57:12',5,2,'Order 202102034 is completed'),(544,0,'/schedule_delivery?id=50068468&&type=Restock','Purchase','2021-02-02 13:57:40',5,1,'New purchase of FCC'),(545,1,'/schedule_delivery?id=50068468&&type=Restock','Purchase','2021-02-02 13:57:40',2,1,'New purchase of FCC'),(547,0,'/schedule_delivery?id=50068469&&type=Restock','Purchase','2021-02-02 13:57:49',5,1,'New purchase of FCC'),(548,1,'/schedule_delivery?id=50068469&&type=Restock','Purchase','2021-02-02 13:57:49',2,1,'New purchase of FCC'),(550,0,'/schedule_delivery?id=50068470&&type=Restock','Purchase','2021-02-02 13:58:01',5,1,'New purchase of FCC'),(551,1,'/schedule_delivery?id=50068470&&type=Restock','Purchase','2021-02-02 13:58:01',2,1,'New purchase of FCC'),(553,0,'/schedule_delivery?id=50068471&&type=Restock','Purchase','2021-02-02 13:58:12',5,1,'New purchase of FCC'),(554,1,'/schedule_delivery?id=50068471&&type=Restock','Purchase','2021-02-02 13:58:12',2,1,'New purchase of FCC'),(556,0,'/schedule_delivery?id=50068472&&type=Restock','Purchase','2021-02-02 13:58:23',5,1,'New purchase of FCC'),(557,1,'/schedule_delivery?id=50068472&&type=Restock','Purchase','2021-02-02 13:58:23',2,1,'New purchase of FCC'),(559,0,'/schedule_delivery?id=50068473&&type=Restock','Purchase','2021-02-02 13:58:34',5,1,'New purchase of RCC'),(560,1,'/schedule_delivery?id=50068473&&type=Restock','Purchase','2021-02-02 13:58:34',2,1,'New purchase of RCC'),(562,0,'/schedule_delivery?id=50068474&&type=Restock','Purchase','2021-02-02 13:58:48',5,1,'New purchase of RCC'),(563,1,'/schedule_delivery?id=50068474&&type=Restock','Purchase','2021-02-02 13:58:48',2,1,'New purchase of RCC'),(565,0,'/view_purchase_details/50068468','Delivery Processing','2021-02-02 13:59:08',5,2,'Purchase 50068468 is being processed'),(566,1,'/view_purchase_details/50068468','Delivery Processing','2021-02-02 13:59:08',1,2,'Purchase 50068468 is being processed'),(568,0,'/view_purchase_details/50068469','Delivery Processing','2021-02-02 13:59:15',5,2,'Purchase 50068469 is being processed'),(569,1,'/view_purchase_details/50068469','Delivery Processing','2021-02-02 13:59:15',1,2,'Purchase 50068469 is being processed'),(571,0,'/view_purchase_details/50068470','Delivery Processing','2021-02-02 13:59:19',5,2,'Purchase 50068470 is being processed'),(572,1,'/view_purchase_details/50068470','Delivery Processing','2021-02-02 13:59:19',1,2,'Purchase 50068470 is being processed'),(574,0,'/view_purchase_details/50068471','Delivery Processing','2021-02-02 13:59:22',5,2,'Purchase 50068471 is being processed'),(575,1,'/view_purchase_details/50068471','Delivery Processing','2021-02-02 13:59:22',1,2,'Purchase 50068471 is being processed'),(577,0,'/view_purchase_details/50068472','Delivery Processing','2021-02-02 13:59:25',5,2,'Purchase 50068472 is being processed'),(578,1,'/view_purchase_details/50068472','Delivery Processing','2021-02-02 13:59:25',1,2,'Purchase 50068472 is being processed'),(580,0,'/view_purchase_details/50068473','Delivery Processing','2021-02-02 13:59:29',5,2,'Purchase 50068473 is being processed'),(581,1,'/view_purchase_details/50068473','Delivery Processing','2021-02-02 13:59:29',1,2,'Purchase 50068473 is being processed'),(583,0,'/view_purchase_details/50068468','Delivery Done','2021-02-02 13:59:41',5,2,'Purchase 50068468 is completed'),(584,1,'/view_purchase_details/50068468','Delivery Done','2021-02-02 13:59:41',1,2,'Purchase 50068468 is completed'),(586,0,'/view_purchase_details/50068469','Delivery Done','2021-02-02 13:59:48',5,2,'Purchase 50068469 is completed'),(587,1,'/view_purchase_details/50068469','Delivery Done','2021-02-02 13:59:48',1,2,'Purchase 50068469 is completed'),(589,0,'/view_purchase_details/50068470','Delivery Done','2021-02-02 13:59:58',5,2,'Purchase 50068470 is completed'),(590,1,'/view_purchase_details/50068470','Delivery Done','2021-02-02 13:59:58',1,2,'Purchase 50068470 is completed'),(592,0,'/view_purchase_details/50068471','Delivery Done','2021-02-02 14:00:06',5,2,'Purchase 50068471 is completed'),(593,1,'/view_purchase_details/50068471','Delivery Done','2021-02-02 14:00:06',1,2,'Purchase 50068471 is completed'),(595,0,'/view_purchase_details/50068472','Delivery Done','2021-02-02 14:00:14',5,2,'Purchase 50068472 is completed'),(596,1,'/view_purchase_details/50068472','Delivery Done','2021-02-02 14:00:14',1,2,'Purchase 50068472 is completed'),(598,0,'/view_purchase_details/50068473','Delivery Done','2021-02-02 14:00:29',5,2,'Purchase 50068473 is completed'),(599,1,'/view_purchase_details/50068473','Delivery Done','2021-02-02 14:00:29',1,2,'Purchase 50068473 is completed'),(601,0,'/view_purchase_details/50068474','Delivery Processing','2021-02-02 14:00:35',5,2,'Purchase 50068474 is being processed'),(602,1,'/view_purchase_details/50068474','Delivery Processing','2021-02-02 14:00:35',1,2,'Purchase 50068474 is being processed'),(604,0,'/view_purchase_details/50068474','Delivery Done','2021-02-02 14:00:44',5,2,'Purchase 50068474 is completed'),(605,1,'/view_purchase_details/50068474','Delivery Done','2021-02-02 14:00:44',1,2,'Purchase 50068474 is completed'),(607,0,'/schedule_delivery?id=202102036&&type=Sell-in','Sale','2021-02-02 14:03:40',5,3,'New order for Marajaen'),(608,1,'/schedule_delivery?id=202102036&&type=Sell-in','Sale','2021-02-02 14:03:40',2,3,'New order for Marajaen'),(610,0,'/schedule_delivery?id=202102037&&type=Sell-in','Sale','2021-02-02 14:03:47',5,3,'New order for Amorado'),(611,1,'/schedule_delivery?id=202102037&&type=Sell-in','Sale','2021-02-02 14:03:47',2,3,'New order for Amorado'),(613,0,'/schedule_delivery?id=202102038&&type=Sell-in','Sale','2021-02-02 14:03:56',5,3,'New order for La Sail'),(614,1,'/schedule_delivery?id=202102038&&type=Sell-in','Sale','2021-02-02 14:03:56',2,3,'New order for La Sail'),(616,0,'/schedule_delivery?id=202102039&&type=Sell-in','Sale','2021-02-02 14:04:03',5,3,'New order for Hipolito Hardware'),(617,1,'/schedule_delivery?id=202102039&&type=Sell-in','Sale','2021-02-02 14:04:03',2,3,'New order for Hipolito Hardware'),(619,0,'/schedule_delivery?id=50068475&&type=Restock','Purchase','2021-02-02 14:05:04',5,1,'New purchase of FCC'),(620,1,'/schedule_delivery?id=50068475&&type=Restock','Purchase','2021-02-02 14:05:04',2,1,'New purchase of FCC'),(622,0,'/schedule_delivery?id=50068476&&type=Restock','Purchase','2021-02-02 14:05:12',5,1,'New purchase of FCC'),(623,1,'/schedule_delivery?id=50068476&&type=Restock','Purchase','2021-02-02 14:05:12',2,1,'New purchase of FCC'),(625,0,'/schedule_delivery?id=50068477&&type=Restock','Purchase','2021-02-02 14:05:20',5,1,'New purchase of FCC'),(626,1,'/schedule_delivery?id=50068477&&type=Restock','Purchase','2021-02-02 14:05:20',2,1,'New purchase of FCC'),(628,0,'/schedule_delivery?id=50068478&&type=Restock','Purchase','2021-02-02 14:05:30',5,1,'New purchase of FCC'),(629,1,'/schedule_delivery?id=50068478&&type=Restock','Purchase','2021-02-02 14:05:30',2,1,'New purchase of FCC'),(631,0,'/schedule_delivery?id=50068479&&type=Restock','Purchase','2021-02-02 14:05:41',5,1,'New purchase of FCC'),(632,1,'/schedule_delivery?id=50068479&&type=Restock','Purchase','2021-02-02 14:05:41',2,1,'New purchase of FCC'),(634,0,'/schedule_delivery?id=50068480&&type=Restock','Purchase','2021-02-02 14:05:51',5,1,'New purchase of RCC'),(635,1,'/schedule_delivery?id=50068480&&type=Restock','Purchase','2021-02-02 14:05:51',2,1,'New purchase of RCC'),(637,0,'/schedule_delivery?id=50068481&&type=Restock','Purchase','2021-02-02 14:06:01',5,1,'New purchase of RCC'),(638,1,'/schedule_delivery?id=50068481&&type=Restock','Purchase','2021-02-02 14:06:01',2,1,'New purchase of RCC'),(640,0,'/view_purchase_details/50068475','Delivery Processing','2021-02-02 14:06:44',5,2,'Purchase 50068475 is being processed'),(641,1,'/view_purchase_details/50068475','Delivery Processing','2021-02-02 14:06:44',1,2,'Purchase 50068475 is being processed'),(643,0,'/view_purchase_details/50068476','Delivery Processing','2021-02-02 14:06:48',5,2,'Purchase 50068476 is being processed'),(644,1,'/view_purchase_details/50068476','Delivery Processing','2021-02-02 14:06:48',1,2,'Purchase 50068476 is being processed'),(646,0,'/view_purchase_details/50068477','Delivery Processing','2021-02-02 14:06:50',5,2,'Purchase 50068477 is being processed'),(647,1,'/view_purchase_details/50068477','Delivery Processing','2021-02-02 14:06:50',1,2,'Purchase 50068477 is being processed'),(649,0,'/view_purchase_details/50068478','Delivery Processing','2021-02-02 14:06:53',5,2,'Purchase 50068478 is being processed'),(650,1,'/view_purchase_details/50068478','Delivery Processing','2021-02-02 14:06:53',1,2,'Purchase 50068478 is being processed'),(652,0,'/view_purchase_details/50068479','Delivery Processing','2021-02-02 14:06:56',5,2,'Purchase 50068479 is being processed'),(653,1,'/view_purchase_details/50068479','Delivery Processing','2021-02-02 14:06:56',1,2,'Purchase 50068479 is being processed'),(655,0,'/view_purchase_details/50068480','Delivery Processing','2021-02-02 14:06:59',5,2,'Purchase 50068480 is being processed'),(656,1,'/view_purchase_details/50068480','Delivery Processing','2021-02-02 14:06:59',1,2,'Purchase 50068480 is being processed'),(658,0,'/view_purchase_details/50068475','Delivery Done','2021-02-02 14:07:10',5,2,'Purchase 50068475 is completed'),(659,1,'/view_purchase_details/50068475','Delivery Done','2021-02-02 14:07:10',1,2,'Purchase 50068475 is completed'),(661,0,'/view_purchase_details/50068476','Delivery Done','2021-02-02 14:07:19',5,2,'Purchase 50068476 is completed'),(662,1,'/view_purchase_details/50068476','Delivery Done','2021-02-02 14:07:19',1,2,'Purchase 50068476 is completed'),(664,0,'/view_purchase_details/50068477','Delivery Done','2021-02-02 14:07:27',5,2,'Purchase 50068477 is completed'),(665,1,'/view_purchase_details/50068477','Delivery Done','2021-02-02 14:07:27',1,2,'Purchase 50068477 is completed'),(667,0,'/view_purchase_details/50068478','Delivery Done','2021-02-02 14:07:36',5,2,'Purchase 50068478 is completed'),(668,1,'/view_purchase_details/50068478','Delivery Done','2021-02-02 14:07:36',1,2,'Purchase 50068478 is completed'),(670,0,'/view_purchase_details/50068479','Delivery Done','2021-02-02 14:07:45',5,2,'Purchase 50068479 is completed'),(671,1,'/view_purchase_details/50068479','Delivery Done','2021-02-02 14:07:45',1,2,'Purchase 50068479 is completed'),(673,0,'/view_purchase_details/50068480','Delivery Done','2021-02-02 14:07:54',5,2,'Purchase 50068480 is completed'),(674,1,'/view_purchase_details/50068480','Delivery Done','2021-02-02 14:07:54',1,2,'Purchase 50068480 is completed'),(676,0,'/view_purchase_details/50068481','Delivery Processing','2021-02-02 14:07:59',5,2,'Purchase 50068481 is being processed'),(677,1,'/view_purchase_details/50068481','Delivery Processing','2021-02-02 14:07:59',1,2,'Purchase 50068481 is being processed'),(679,1,'/view_sales_details/202102036','Delivery Processing','2021-02-02 14:08:06',3,2,'Order 202102036 is being processed'),(680,0,'/view_sales_details/202102036','Delivery Processing','2021-02-02 14:08:06',5,2,'Order 202102036 is being processed'),(682,1,'/view_sales_details/202102038','Delivery Processing','2021-02-02 14:08:09',3,2,'Order 202102038 is being processed'),(683,0,'/view_sales_details/202102038','Delivery Processing','2021-02-02 14:08:09',5,2,'Order 202102038 is being processed'),(685,1,'/view_sales_details/202102039','Delivery Processing','2021-02-02 14:08:13',3,2,'Order 202102039 is being processed'),(686,0,'/view_sales_details/202102039','Delivery Processing','2021-02-02 14:08:13',5,2,'Order 202102039 is being processed'),(688,0,'/view_purchase_details/50068481','Delivery Done','2021-02-02 14:08:49',5,2,'Purchase 50068481 is completed'),(689,1,'/view_purchase_details/50068481','Delivery Done','2021-02-02 14:08:49',1,2,'Purchase 50068481 is completed'),(691,1,'/view_sales_details/202102039','Delivery Done','2021-02-02 14:08:58',3,2,'Order 202102039 is completed'),(692,0,'/view_sales_details/202102039','Delivery Done','2021-02-02 14:08:58',5,2,'Order 202102039 is completed'),(694,1,'/view_sales_details/202102036','Delivery Done','2021-02-02 14:09:03',3,2,'Order 202102036 is completed'),(695,0,'/view_sales_details/202102036','Delivery Done','2021-02-02 14:09:03',5,2,'Order 202102036 is completed'),(697,1,'/view_sales_details/202102038','Delivery Done','2021-02-02 14:09:06',3,2,'Order 202102038 is completed'),(698,0,'/view_sales_details/202102038','Delivery Done','2021-02-02 14:09:06',5,2,'Order 202102038 is completed'),(700,0,'/schedule_delivery?id=50068483&&type=Restock','Purchase','2021-02-02 14:12:14',5,1,'New purchase of FCC'),(701,1,'/schedule_delivery?id=50068483&&type=Restock','Purchase','2021-02-02 14:12:14',2,1,'New purchase of FCC'),(703,0,'/schedule_delivery?id=50068484&&type=Restock','Purchase','2021-02-02 14:12:24',5,1,'New purchase of FCC'),(704,1,'/schedule_delivery?id=50068484&&type=Restock','Purchase','2021-02-02 14:12:24',2,1,'New purchase of FCC'),(706,0,'/schedule_delivery?id=50068485&&type=Restock','Purchase','2021-02-02 14:12:33',5,1,'New purchase of FCC'),(707,1,'/schedule_delivery?id=50068485&&type=Restock','Purchase','2021-02-02 14:12:33',2,1,'New purchase of FCC'),(709,0,'/schedule_delivery?id=50068486&&type=Restock','Purchase','2021-02-02 14:12:43',5,1,'New purchase of FCC'),(710,1,'/schedule_delivery?id=50068486&&type=Restock','Purchase','2021-02-02 14:12:43',2,1,'New purchase of FCC'),(712,0,'/schedule_delivery?id=50068487&&type=Restock','Purchase','2021-02-02 14:12:52',5,1,'New purchase of FCC'),(713,1,'/schedule_delivery?id=50068487&&type=Restock','Purchase','2021-02-02 14:12:52',2,1,'New purchase of FCC'),(715,0,'/schedule_delivery?id=50068488&&type=Restock','Purchase','2021-02-02 14:13:03',5,1,'New purchase of FCC'),(716,1,'/schedule_delivery?id=50068488&&type=Restock','Purchase','2021-02-02 14:13:03',2,1,'New purchase of FCC'),(718,0,'/schedule_delivery?id=50068489&&type=Restock','Purchase','2021-02-02 14:13:26',5,1,'New purchase of RCC'),(719,1,'/schedule_delivery?id=50068489&&type=Restock','Purchase','2021-02-02 14:13:26',2,1,'New purchase of RCC'),(721,0,'/schedule_delivery?id=202102040&&type=Sell-in','Sale','2021-02-02 14:14:13',5,3,'New order for CDL'),(722,1,'/schedule_delivery?id=202102040&&type=Sell-in','Sale','2021-02-02 14:14:13',2,3,'New order for CDL'),(724,0,'/schedule_delivery?id=202102041&&type=Sell-in','Sale','2021-02-02 14:14:19',5,3,'New order for CDL'),(725,1,'/schedule_delivery?id=202102041&&type=Sell-in','Sale','2021-02-02 14:14:19',2,3,'New order for CDL'),(727,0,'/schedule_delivery?id=202102042&&type=Sell-in','Sale','2021-02-02 14:14:27',5,3,'New order for Golden Libjo'),(728,1,'/schedule_delivery?id=202102042&&type=Sell-in','Sale','2021-02-02 14:14:27',2,3,'New order for Golden Libjo'),(730,0,'/schedule_delivery?id=202102043&&type=Sell-in','Sale','2021-02-02 14:14:35',5,3,'New order for La Sail'),(731,1,'/schedule_delivery?id=202102043&&type=Sell-in','Sale','2021-02-02 14:14:35',2,3,'New order for La Sail'),(733,0,'/schedule_delivery?id=202102044&&type=Sell-in','Sale','2021-02-02 14:14:44',5,3,'New order for La Sail'),(734,1,'/schedule_delivery?id=202102044&&type=Sell-in','Sale','2021-02-02 14:14:44',2,3,'New order for La Sail'),(736,0,'/schedule_delivery?id=202102045&&type=Sell-in','Sale','2021-02-02 14:14:51',5,3,'New order for Amorado'),(737,1,'/schedule_delivery?id=202102045&&type=Sell-in','Sale','2021-02-02 14:14:51',2,3,'New order for Amorado'),(739,0,'/schedule_delivery?id=202102046&&type=Sell-in','Sale','2021-02-02 14:14:59',5,3,'New order for Hipolito Hardware'),(740,1,'/schedule_delivery?id=202102046&&type=Sell-in','Sale','2021-02-02 14:14:59',2,3,'New order for Hipolito Hardware'),(742,0,'/schedule_delivery?id=202102048&&type=Sell-in','Sale','2021-02-02 14:15:38',5,3,'New order for Vinseth'),(743,1,'/schedule_delivery?id=202102048&&type=Sell-in','Sale','2021-02-02 14:15:38',2,3,'New order for Vinseth'),(745,0,'/schedule_delivery?id=202102049&&type=Sell-in','Sale','2021-02-02 14:15:45',5,3,'New order for Tophock'),(746,1,'/schedule_delivery?id=202102049&&type=Sell-in','Sale','2021-02-02 14:15:45',2,3,'New order for Tophock'),(748,0,'/schedule_delivery?id=50068490&&type=Restock','Purchase','2021-02-02 14:19:35',5,1,'New purchase of FCC'),(749,1,'/schedule_delivery?id=50068490&&type=Restock','Purchase','2021-02-02 14:19:35',2,1,'New purchase of FCC'),(751,0,'/schedule_delivery?id=50068491&&type=Restock','Purchase','2021-02-02 14:19:45',5,1,'New purchase of FCC'),(752,1,'/schedule_delivery?id=50068491&&type=Restock','Purchase','2021-02-02 14:19:45',2,1,'New purchase of FCC'),(754,0,'/schedule_delivery?id=50068492&&type=Restock','Purchase','2021-02-02 14:19:55',5,1,'New purchase of FCC'),(755,1,'/schedule_delivery?id=50068492&&type=Restock','Purchase','2021-02-02 14:19:55',2,1,'New purchase of FCC'),(757,0,'/schedule_delivery?id=50068493&&type=Restock','Purchase','2021-02-02 14:20:05',5,1,'New purchase of FCC'),(758,1,'/schedule_delivery?id=50068493&&type=Restock','Purchase','2021-02-02 14:20:05',2,1,'New purchase of FCC'),(760,0,'/schedule_delivery?id=50068494&&type=Restock','Purchase','2021-02-02 14:20:15',5,1,'New purchase of FCC'),(761,1,'/schedule_delivery?id=50068494&&type=Restock','Purchase','2021-02-02 14:20:15',2,1,'New purchase of FCC'),(763,0,'/schedule_delivery?id=50068495&&type=Restock','Purchase','2021-02-02 14:20:28',5,1,'New purchase of RCC'),(764,1,'/schedule_delivery?id=50068495&&type=Restock','Purchase','2021-02-02 14:20:28',2,1,'New purchase of RCC'),(766,0,'/schedule_delivery?id=50068496&&type=Restock','Purchase','2021-02-02 14:20:47',5,1,'New purchase of RCC'),(767,1,'/schedule_delivery?id=50068496&&type=Restock','Purchase','2021-02-02 14:20:47',2,1,'New purchase of RCC'),(769,0,'/schedule_delivery?id=50068497&&type=Restock','Purchase','2021-02-02 14:20:58',5,1,'New purchase of FCC'),(770,1,'/schedule_delivery?id=50068497&&type=Restock','Purchase','2021-02-02 14:20:58',2,1,'New purchase of FCC'),(772,0,'/schedule_delivery?id=50068498&&type=Restock','Purchase','2021-02-02 14:21:08',5,1,'New purchase of FCC'),(773,1,'/schedule_delivery?id=50068498&&type=Restock','Purchase','2021-02-02 14:21:08',2,1,'New purchase of FCC'),(775,0,'/schedule_delivery?id=50068499&&type=Restock','Purchase','2021-02-02 14:21:19',5,1,'New purchase of FCC'),(776,1,'/schedule_delivery?id=50068499&&type=Restock','Purchase','2021-02-02 14:21:19',2,1,'New purchase of FCC'),(778,0,'/schedule_delivery?id=50068500&&type=Restock','Purchase','2021-02-02 14:21:30',5,1,'New purchase of FCC'),(779,1,'/schedule_delivery?id=50068500&&type=Restock','Purchase','2021-02-02 14:21:30',2,1,'New purchase of FCC'),(781,0,'/schedule_delivery?id=50068501&&type=Restock','Purchase','2021-02-02 14:21:40',5,1,'New purchase of FCC'),(782,1,'/schedule_delivery?id=50068501&&type=Restock','Purchase','2021-02-02 14:21:40',2,1,'New purchase of FCC'),(784,0,'/schedule_delivery?id=50068502&&type=Restock','Purchase','2021-02-02 14:22:15',5,1,'New purchase of FCC'),(785,1,'/schedule_delivery?id=50068502&&type=Restock','Purchase','2021-02-02 14:22:15',2,1,'New purchase of FCC'),(787,0,'/schedule_delivery?id=50068503&&type=Restock','Purchase','2021-02-02 14:22:24',5,1,'New purchase of FCC'),(788,1,'/schedule_delivery?id=50068503&&type=Restock','Purchase','2021-02-02 14:22:24',2,1,'New purchase of FCC'),(790,0,'/schedule_delivery?id=50068504&&type=Restock','Purchase','2021-02-02 14:22:32',5,1,'New purchase of FCC'),(791,1,'/schedule_delivery?id=50068504&&type=Restock','Purchase','2021-02-02 14:22:32',2,1,'New purchase of FCC'),(793,0,'/schedule_delivery?id=50068505&&type=Restock','Purchase','2021-02-02 14:22:41',5,1,'New purchase of FCC'),(794,1,'/schedule_delivery?id=50068505&&type=Restock','Purchase','2021-02-02 14:22:41',2,1,'New purchase of FCC'),(796,0,'/schedule_delivery?id=50068506&&type=Restock','Purchase','2021-02-02 14:22:53',5,1,'New purchase of FCC'),(797,1,'/schedule_delivery?id=50068506&&type=Restock','Purchase','2021-02-02 14:22:53',2,1,'New purchase of FCC'),(799,0,'/schedule_delivery?id=50068507&&type=Restock','Purchase','2021-02-02 14:23:04',5,1,'New purchase of RCC'),(800,1,'/schedule_delivery?id=50068507&&type=Restock','Purchase','2021-02-02 14:23:04',2,1,'New purchase of RCC'),(802,0,'/schedule_delivery?id=50068508&&type=Restock','Purchase','2021-02-02 14:23:16',5,1,'New purchase of RCC'),(803,1,'/schedule_delivery?id=50068508&&type=Restock','Purchase','2021-02-02 14:23:16',2,1,'New purchase of RCC'),(805,0,'/schedule_delivery?id=50068509&&type=Restock','Purchase','2021-02-02 14:23:29',5,1,'New purchase of FCC'),(806,1,'/schedule_delivery?id=50068509&&type=Restock','Purchase','2021-02-02 14:23:29',2,1,'New purchase of FCC'),(808,0,'/schedule_delivery?id=50068510&&type=Restock','Purchase','2021-02-02 14:23:40',5,1,'New purchase of FCC'),(809,1,'/schedule_delivery?id=50068510&&type=Restock','Purchase','2021-02-02 14:23:40',2,1,'New purchase of FCC'),(811,0,'/schedule_delivery?id=50068511&&type=Restock','Purchase','2021-02-02 14:23:49',5,1,'New purchase of FCC'),(812,1,'/schedule_delivery?id=50068511&&type=Restock','Purchase','2021-02-02 14:23:49',2,1,'New purchase of FCC'),(814,0,'/schedule_delivery?id=50068512&&type=Restock','Purchase','2021-02-02 14:23:59',5,1,'New purchase of FCC'),(815,1,'/schedule_delivery?id=50068512&&type=Restock','Purchase','2021-02-02 14:23:59',2,1,'New purchase of FCC'),(817,0,'/schedule_delivery?id=50068513&&type=Restock','Purchase','2021-02-02 14:24:07',5,1,'New purchase of FCC'),(818,1,'/schedule_delivery?id=50068513&&type=Restock','Purchase','2021-02-02 14:24:07',2,1,'New purchase of FCC'),(820,0,'/schedule_delivery?id=50068514&&type=Restock','Purchase','2021-02-02 14:24:16',5,1,'New purchase of FCC'),(821,1,'/schedule_delivery?id=50068514&&type=Restock','Purchase','2021-02-02 14:24:16',2,1,'New purchase of FCC'),(823,0,'/schedule_delivery?id=50068515&&type=Restock','Purchase','2021-02-02 14:24:25',5,1,'New purchase of FCC'),(824,1,'/schedule_delivery?id=50068515&&type=Restock','Purchase','2021-02-02 14:24:25',2,1,'New purchase of FCC'),(826,0,'/schedule_delivery?id=50068516&&type=Restock','Purchase','2021-02-02 14:24:57',5,1,'New purchase of RCC'),(827,1,'/schedule_delivery?id=50068516&&type=Restock','Purchase','2021-02-02 14:24:57',2,1,'New purchase of RCC'),(829,0,'/schedule_delivery?id=202102050&&type=Sell-in','Sale','2021-02-02 14:31:06',5,3,'New order for CDL'),(830,1,'/schedule_delivery?id=202102050&&type=Sell-in','Sale','2021-02-02 14:31:06',2,3,'New order for CDL'),(832,0,'/schedule_delivery?id=202102051&&type=Sell-in','Sale','2021-02-02 14:31:15',5,3,'New order for La Sail'),(833,1,'/schedule_delivery?id=202102051&&type=Sell-in','Sale','2021-02-02 14:31:15',2,3,'New order for La Sail'),(835,0,'/schedule_delivery?id=202102052&&type=Sell-in','Sale','2021-02-02 14:31:23',5,3,'New order for Hipolito Hardware'),(836,1,'/schedule_delivery?id=202102052&&type=Sell-in','Sale','2021-02-02 14:31:23',2,3,'New order for Hipolito Hardware'),(838,0,'/schedule_delivery?id=202102055&&type=Sell-in','Sale','2021-02-02 14:31:51',5,3,'New order for Marajaen'),(839,1,'/schedule_delivery?id=202102055&&type=Sell-in','Sale','2021-02-02 14:31:51',2,3,'New order for Marajaen'),(841,0,'/schedule_delivery?id=202102056&&type=Sell-in','Sale','2021-02-02 14:32:03',5,3,'New order for Amorado'),(842,1,'/schedule_delivery?id=202102056&&type=Sell-in','Sale','2021-02-02 14:32:03',2,3,'New order for Amorado'),(844,0,'/schedule_delivery?id=202102057&&type=Sell-in','Sale','2021-02-02 14:32:46',5,3,'New order for GJY'),(845,1,'/schedule_delivery?id=202102057&&type=Sell-in','Sale','2021-02-02 14:32:46',2,3,'New order for GJY'),(847,0,'/schedule_delivery?id=202102058&&type=Sell-in','Sale','2021-02-02 14:32:53',5,3,'New order for Golden Libjo'),(848,1,'/schedule_delivery?id=202102058&&type=Sell-in','Sale','2021-02-02 14:32:53',2,3,'New order for Golden Libjo'),(850,0,'/schedule_delivery?id=202102059&&type=Sell-in','Sale','2021-02-02 14:33:01',5,3,'New order for Golden Coin'),(851,1,'/schedule_delivery?id=202102059&&type=Sell-in','Sale','2021-02-02 14:33:01',2,3,'New order for Golden Coin'),(853,0,'/schedule_delivery?id=202102061&&type=Sell-in','Sale','2021-02-02 15:10:36',5,3,'New order for Hipolito Hardware'),(854,1,'/schedule_delivery?id=202102061&&type=Sell-in','Sale','2021-02-02 15:10:36',2,3,'New order for Hipolito Hardware'),(856,0,'/schedule_delivery?id=202102062&&type=Sell-in','Sale','2021-02-02 15:10:45',5,3,'New order for CDL'),(857,1,'/schedule_delivery?id=202102062&&type=Sell-in','Sale','2021-02-02 15:10:45',2,3,'New order for CDL'),(859,0,'/schedule_delivery?id=202102063&&type=Sell-in','Sale','2021-02-02 15:10:52',5,3,'New order for Amorado'),(860,1,'/schedule_delivery?id=202102063&&type=Sell-in','Sale','2021-02-02 15:10:52',2,3,'New order for Amorado'),(862,0,'/schedule_delivery?id=202102064&&type=Sell-in','Sale','2021-02-02 15:10:59',5,3,'New order for La Sail'),(863,1,'/schedule_delivery?id=202102064&&type=Sell-in','Sale','2021-02-02 15:10:59',2,3,'New order for La Sail'),(865,0,'/schedule_delivery?id=202102065&&type=Sell-in','Sale','2021-02-02 15:11:15',5,3,'New order for Tophock'),(866,1,'/schedule_delivery?id=202102065&&type=Sell-in','Sale','2021-02-02 15:11:15',2,3,'New order for Tophock'),(868,0,'/schedule_delivery?id=202102066&&type=Sell-in','Sale','2021-02-02 15:11:22',5,3,'New order for Golden Libjo'),(869,1,'/schedule_delivery?id=202102066&&type=Sell-in','Sale','2021-02-02 15:11:22',2,3,'New order for Golden Libjo'),(871,0,'/schedule_delivery?id=202102067&&type=Sell-in','Sale','2021-02-02 15:11:29',5,3,'New order for Hipolito Hardware'),(872,1,'/schedule_delivery?id=202102067&&type=Sell-in','Sale','2021-02-02 15:11:29',2,3,'New order for Hipolito Hardware'),(874,0,'/schedule_delivery?id=202102068&&type=Sell-in','Sale','2021-02-02 15:11:40',5,3,'New order for Marajaen'),(875,1,'/schedule_delivery?id=202102068&&type=Sell-in','Sale','2021-02-02 15:11:40',2,3,'New order for Marajaen'),(877,0,'/schedule_delivery?id=202102069&&type=Sell-in','Sale','2021-02-02 15:11:48',5,3,'New order for CDL'),(878,1,'/schedule_delivery?id=202102069&&type=Sell-in','Sale','2021-02-02 15:11:48',2,3,'New order for CDL'),(880,0,'/schedule_delivery?id=202102070&&type=Sell-in','Sale','2021-02-02 15:11:56',5,3,'New order for La Sail'),(881,1,'/schedule_delivery?id=202102070&&type=Sell-in','Sale','2021-02-02 15:11:56',2,3,'New order for La Sail');
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_details_table`
--

DROP TABLE IF EXISTS `payment_details_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_details_table` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `check_num` varchar(45) DEFAULT NULL,
  `amount` double NOT NULL,
  `date_paid` date NOT NULL,
  PRIMARY KEY (`payment_id`),
  UNIQUE KEY `payment_id_UNIQUE` (`payment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_details_table`
--

LOCK TABLES `payment_details_table` WRITE;
/*!40000 ALTER TABLE `payment_details_table` DISABLE KEYS */;
INSERT INTO `payment_details_table` VALUES (58,NULL,136080,'2021-02-02'),(59,NULL,272160,'2021-02-02'),(60,NULL,408240,'2021-02-02'),(61,NULL,408240,'2021-02-02'),(62,NULL,408240,'2021-02-02'),(63,NULL,136080,'2021-02-02'),(64,NULL,541080,'2021-02-02'),(65,NULL,408240,'2021-02-02'),(66,NULL,20500,'2021-02-02'),(67,NULL,719160,'2021-02-02'),(68,NULL,544320,'2021-02-02'),(69,NULL,136080,'2021-02-02'),(70,NULL,136080,'2021-02-02'),(71,NULL,132840,'2021-02-02');
/*!40000 ALTER TABLE `payment_details_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_catalogue_table`
--

DROP TABLE IF EXISTS `product_catalogue_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_catalogue_table` (
  `catalogue_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `purchase_price` float NOT NULL,
  `selling_price` float NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  PRIMARY KEY (`catalogue_id`),
  UNIQUE KEY `catalogue_id_UNIQUE` (`catalogue_id`),
  KEY `catalogue_ref_idx` (`product_id`),
  CONSTRAINT `catalogue_ref` FOREIGN KEY (`product_id`) REFERENCES `product_table` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_catalogue_table`
--

LOCK TABLES `product_catalogue_table` WRITE;
/*!40000 ALTER TABLE `product_catalogue_table` DISABLE KEYS */;
INSERT INTO `product_catalogue_table` VALUES (2,1,185,200,'2020-08-24','2020-08-31','Inactive'),(3,2,180,205,'2020-08-24',NULL,'Active'),(4,1,170,105,'2020-09-01','2020-09-01','Inactive'),(5,1,203,210,'2020-09-02','2020-09-02','Inactive'),(6,1,203,210,'2020-09-02','2020-09-02','Inactive'),(7,1,203,210,'2020-09-02',NULL,'Active');
/*!40000 ALTER TABLE `product_catalogue_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_table`
--

DROP TABLE IF EXISTS `product_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_table` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `product_name` varchar(45) NOT NULL,
  `qty` int DEFAULT '0',
  `safety_limit` int DEFAULT '0',
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `product_name_UNIQUE` (`product_name`),
  UNIQUE KEY `product_id_UNIQUE` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_table`
--

LOCK TABLES `product_table` WRITE;
/*!40000 ALTER TABLE `product_table` DISABLE KEYS */;
INSERT INTO `product_table` VALUES (1,'FCC',6152,1000),(2,'RCC',3884,1000);
/*!40000 ALTER TABLE `product_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_history`
--

DROP TABLE IF EXISTS `purchase_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_history` (
  `supplier_lo` int NOT NULL,
  `date` date NOT NULL,
  `time_out` time DEFAULT NULL,
  `supplier_dr` int DEFAULT NULL,
  `supplier_so` int DEFAULT NULL,
  `plate_num` varchar(12) DEFAULT NULL,
  `product_id` int NOT NULL,
  `qty` int NOT NULL,
  `amount` double NOT NULL,
  `status` enum('Pending','Processing','Completed') NOT NULL,
  `driver` int DEFAULT NULL,
  `void` int DEFAULT '0',
  PRIMARY KEY (`supplier_lo`),
  KEY `purchase_truck_ref_idx` (`plate_num`),
  KEY `purchase_product_ref_idx` (`product_id`),
  KEY `purchase_driver_idx` (`driver`),
  CONSTRAINT `purchase_driver` FOREIGN KEY (`driver`) REFERENCES `employee_table` (`employee_id`),
  CONSTRAINT `purchase_product_ref` FOREIGN KEY (`product_id`) REFERENCES `product_table` (`product_id`),
  CONSTRAINT `purchase_truck_ref` FOREIGN KEY (`plate_num`) REFERENCES `trucks_table` (`plate_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_history`
--

LOCK TABLES `purchase_history` WRITE;
/*!40000 ALTER TABLE `purchase_history` DISABLE KEYS */;
INSERT INTO `purchase_history` VALUES (50068333,'2021-01-29','11:58:00',14059857,13332321,'PPT 921',1,648,131544,'Completed',5,0),(50068445,'2021-01-30','17:22:00',14059769,13332960,'PPT 921',1,648,131544,'Completed',5,0),(50068446,'2021-01-30','19:24:00',14059771,13332961,'QTY 952',1,648,131544,'Completed',6,0),(50068447,'2021-01-30','15:39:00',14059772,13332963,'UVB 123',1,648,131544,'Completed',7,0),(50068448,'2021-01-30','14:28:00',14059773,13332961,'UXQ 857',1,648,131544,'Completed',8,0),(50068449,'2021-01-30','21:23:00',14059774,13332962,'WHM 834',1,648,131544,'Completed',9,0),(50068450,'2021-01-30','18:11:00',14059775,13332963,'YEN 449',1,648,131544,'Completed',10,0),(50068451,'2021-01-30','18:27:00',14059775,13332964,'PPT 921',2,648,116640,'Completed',5,0),(50068452,'2021-01-30','16:43:00',14059776,13332965,'QTY 952',1,648,131544,'Completed',6,0),(50068453,'2021-01-30','17:29:00',14059777,13332966,'UVB 123',1,648,131544,'Completed',7,0),(50068454,'2021-01-30','16:54:00',14059778,13332967,'UXQ 857',1,648,131544,'Completed',8,0),(50068455,'2021-01-31','16:50:00',14059779,13332968,'PPT 921',1,648,131544,'Completed',5,0),(50068456,'2021-01-31','17:54:00',14059780,13332969,'QTY 952',1,648,131544,'Completed',6,0),(50068457,'2021-01-31','15:50:00',14059781,13332970,'UVB 123',1,648,131544,'Completed',7,0),(50068458,'2021-01-31','17:50:00',14059782,13332971,'UXQ 857',2,648,116640,'Completed',8,0),(50068459,'2021-01-31','18:56:00',14059783,13332972,'WHM 834',1,648,131544,'Completed',9,0),(50068460,'2021-01-31','20:07:00',14059784,13332973,'YEN 449',1,648,131544,'Completed',10,0),(50068468,'2021-02-01','13:59:00',14059798,13332981,'UXQ 857',1,648,131544,'Completed',8,0),(50068469,'2021-02-01','17:04:00',14059797,13332982,'WHM 834',1,648,131544,'Completed',9,0),(50068470,'2021-02-01','19:46:00',14059796,13332983,'YEN 449',1,648,131544,'Completed',10,0),(50068471,'2021-02-01','13:04:00',14059795,13332984,'PPT 921',1,648,131544,'Completed',5,0),(50068472,'2021-02-01','18:51:00',14059794,13332985,'QTY 952',1,648,131544,'Completed',6,0),(50068473,'2021-02-01','20:20:00',14059793,13332986,'UVB 123',2,648,116640,'Completed',7,0),(50068474,'2021-02-01','17:34:00',14059792,13332987,'UXQ 857',2,648,116640,'Completed',8,0),(50068475,'2021-02-02','17:11:00',14059805,13332988,'UXQ 857',1,648,131544,'Completed',8,0),(50068476,'2021-02-02','16:54:00',14059804,13332989,'WHM 834',1,648,131544,'Completed',9,0),(50068477,'2021-02-02','14:23:00',14059803,13332990,'PPT 921',1,648,131544,'Completed',5,0),(50068478,'2021-02-02','18:42:00',14059802,13332991,'QTY 952',1,648,131544,'Completed',6,0),(50068479,'2021-02-02','17:53:00',14059801,13332992,'UVB 123',1,648,131544,'Completed',7,0),(50068480,'2021-02-02','17:34:00',14059800,13332993,'YEN 449',2,648,116640,'Completed',10,0),(50068481,'2021-02-02','18:48:00',14059799,13332994,'PPT 921',2,648,116640,'Completed',5,0),(50068483,'2021-02-03',NULL,NULL,13332996,NULL,1,648,131544,'Pending',NULL,0),(50068484,'2021-02-03',NULL,NULL,13332997,NULL,1,648,131544,'Pending',NULL,0),(50068485,'2021-02-03',NULL,NULL,13332998,NULL,1,648,131544,'Pending',NULL,0),(50068486,'2021-02-03',NULL,NULL,13332999,NULL,1,648,131544,'Pending',NULL,0),(50068487,'2021-02-03',NULL,NULL,13333000,NULL,1,648,131544,'Pending',NULL,0),(50068488,'2021-02-03',NULL,NULL,13333001,NULL,1,648,131544,'Pending',NULL,0),(50068489,'2021-02-03',NULL,NULL,13333002,NULL,2,648,116640,'Pending',NULL,0),(50068490,'2021-02-04',NULL,NULL,13333003,NULL,1,648,131544,'Pending',NULL,0),(50068491,'2021-02-04',NULL,NULL,13333004,NULL,1,648,131544,'Pending',NULL,0),(50068492,'2021-02-04',NULL,NULL,13333005,NULL,1,648,131544,'Pending',NULL,0),(50068493,'2021-02-04',NULL,NULL,13333006,NULL,1,648,131544,'Pending',NULL,0),(50068494,'2021-02-04',NULL,NULL,13333007,NULL,1,648,131544,'Pending',NULL,0),(50068495,'2021-02-04',NULL,NULL,13333008,NULL,2,648,116640,'Pending',NULL,0),(50068496,'2021-02-05',NULL,NULL,13333009,NULL,2,648,116640,'Pending',NULL,0),(50068497,'2021-02-05',NULL,NULL,13333010,NULL,1,648,131544,'Pending',NULL,0),(50068498,'2021-02-05',NULL,NULL,13333011,NULL,1,648,131544,'Pending',NULL,0),(50068499,'2021-02-05',NULL,NULL,13333012,NULL,1,648,131544,'Pending',NULL,0),(50068500,'2021-02-05',NULL,NULL,13333013,NULL,1,648,131544,'Pending',NULL,0),(50068501,'2021-02-05',NULL,NULL,13333014,NULL,1,648,131544,'Pending',NULL,0),(50068502,'2021-02-06',NULL,NULL,13333015,NULL,1,648,131544,'Pending',NULL,0),(50068503,'2021-02-06',NULL,NULL,13333016,NULL,1,648,131544,'Pending',NULL,0),(50068504,'2021-02-06',NULL,NULL,13333017,NULL,1,648,131544,'Pending',NULL,0),(50068505,'2021-02-06',NULL,NULL,13333018,NULL,1,648,131544,'Pending',NULL,0),(50068506,'2021-02-06',NULL,NULL,13333019,NULL,1,648,131544,'Pending',NULL,0),(50068507,'2021-02-06',NULL,NULL,13333020,NULL,2,648,116640,'Pending',NULL,0),(50068508,'2021-02-06',NULL,NULL,13333021,NULL,2,648,116640,'Pending',NULL,0),(50068509,'2021-02-07',NULL,NULL,13333022,NULL,1,648,131544,'Pending',NULL,0),(50068510,'2021-02-07',NULL,NULL,13333023,NULL,1,648,131544,'Pending',NULL,0),(50068511,'2021-02-07',NULL,NULL,13333024,NULL,1,648,131544,'Pending',NULL,0),(50068512,'2021-02-07',NULL,NULL,13333025,NULL,1,648,131544,'Pending',NULL,0),(50068513,'2021-02-07',NULL,NULL,13333026,NULL,1,648,131544,'Pending',NULL,0),(50068514,'2021-02-07',NULL,NULL,13333027,NULL,1,648,131544,'Pending',NULL,0),(50068515,'2021-02-07',NULL,NULL,13333028,NULL,1,648,131544,'Pending',NULL,0),(50068516,'2021-02-07',NULL,NULL,13333029,NULL,2,648,116640,'Pending',NULL,0),(50068553,'2021-01-29','19:18:00',14059811,13333631,'QTY 952',1,648,131544,'Completed',6,0),(50068554,'2021-01-29','20:00:00',14059812,13333631,'UVB 123',1,648,131544,'Completed',7,0),(50068606,'2021-01-29','21:42:00',14059832,13333804,'UXQ 857',2,648,116640,'Completed',8,0),(50068607,'2021-01-29','21:57:00',14059834,13333804,'WHM 834',1,648,131544,'Completed',9,0),(50068608,'2021-01-29','21:49:00',14059833,13333804,'YEN 449',1,648,131544,'Completed',10,0);
/*!40000 ALTER TABLE `purchase_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recommendation_algo`
--

DROP TABLE IF EXISTS `recommendation_algo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recommendation_algo` (
  `recom_id` int NOT NULL AUTO_INCREMENT,
  `status` enum('Active','Inactive') DEFAULT 'Inactive',
  `description` varchar(45) NOT NULL,
  PRIMARY KEY (`recom_id`),
  UNIQUE KEY `recom_id_UNIQUE` (`recom_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recommendation_algo`
--

LOCK TABLES `recommendation_algo` WRITE;
/*!40000 ALTER TABLE `recommendation_algo` DISABLE KEYS */;
INSERT INTO `recommendation_algo` VALUES (1,'Inactive','Algo 1'),(2,'Inactive','Algo 2'),(3,'Active','Algo 3');
/*!40000 ALTER TABLE `recommendation_algo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_history`
--

DROP TABLE IF EXISTS `sales_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_history` (
  `delivery_receipt` int NOT NULL,
  `scheduled_date` date NOT NULL,
  `customer_id` int NOT NULL,
  `purchase_lo` int DEFAULT NULL,
  `delivery_details` int DEFAULT NULL,
  `payment_status` enum('Unpaid','Paid','Overdue') DEFAULT 'Unpaid',
  `payment_id` int DEFAULT NULL,
  `product_id` int NOT NULL,
  `qty` int NOT NULL,
  `amount` double NOT NULL,
  `due_date` date NOT NULL,
  `pickup_plate` varchar(12) DEFAULT NULL,
  `time_recorded` datetime NOT NULL,
  `order_type` enum('Pick-up','Delivery') NOT NULL,
  `payment_terms` enum('Cash','NET 7','NET 15','NET 30') NOT NULL,
  `order_status` enum('Pending','Processing','Completed','Cancelled') DEFAULT 'Pending',
  `void` int DEFAULT '0',
  PRIMARY KEY (`delivery_receipt`),
  UNIQUE KEY `delivery_receipt_UNIQUE` (`delivery_receipt`),
  KEY `customer_ref_idx` (`customer_id`),
  KEY `product_ref_idx` (`product_id`),
  KEY `delivery_ref_idx` (`delivery_details`),
  KEY `payment_ref_idx` (`payment_id`),
  KEY `purchase_lo_ref_idx` (`purchase_lo`),
  CONSTRAINT `customer_ref` FOREIGN KEY (`customer_id`) REFERENCES `customer_table` (`customer_id`),
  CONSTRAINT `payment_ref` FOREIGN KEY (`payment_id`) REFERENCES `payment_details_table` (`payment_id`),
  CONSTRAINT `product_ref` FOREIGN KEY (`product_id`) REFERENCES `product_table` (`product_id`),
  CONSTRAINT `purchase_lo_ref` FOREIGN KEY (`purchase_lo`) REFERENCES `purchase_history` (`supplier_lo`),
  CONSTRAINT `sale_delivery_ref` FOREIGN KEY (`delivery_details`) REFERENCES `delivery_detail_table` (`delivery_detail_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_history`
--

LOCK TABLES `sales_history` WRITE;
/*!40000 ALTER TABLE `sales_history` DISABLE KEYS */;
INSERT INTO `sales_history` VALUES (202102001,'2021-01-29',10,NULL,35,'Paid',NULL,2,648,205,'2021-01-29','','2021-02-02 12:07:21','Delivery','Cash','Completed',0),(202102002,'2021-01-29',4,NULL,36,'Paid',NULL,1,648,210,'2021-01-29','','2021-02-02 12:31:03','Delivery','Cash','Completed',0),(202102003,'2021-01-29',2,NULL,NULL,'Paid',NULL,1,600,210,'2021-01-29','CIV 123','2021-02-02 12:31:41','Pick-up','Cash','Completed',0),(202102004,'2021-01-29',1,NULL,37,'Paid',NULL,1,648,210,'2021-01-29','','2021-02-02 12:32:07','Delivery','Cash','Completed',0),(202102005,'2021-01-29',1,NULL,38,'Paid',NULL,2,200,205,'2021-01-29','','2021-02-02 12:32:25','Delivery','Cash','Completed',0),(202102006,'2021-01-29',5,NULL,39,'Paid',NULL,1,648,210,'2021-01-29','','2021-02-02 12:32:40','Delivery','Cash','Completed',0),(202102007,'2021-01-29',7,NULL,40,'Paid',NULL,2,100,205,'2021-01-29','','2021-02-02 12:32:55','Delivery','Cash','Completed',0),(202102008,'2021-01-30',1,NULL,41,'Paid',NULL,1,648,210,'2021-01-30','','2021-02-02 13:13:27','Delivery','Cash','Completed',0),(202102009,'2021-01-30',2,NULL,42,'Paid',NULL,1,648,210,'2021-01-30','','2021-02-02 13:13:39','Delivery','Cash','Completed',0),(202102010,'2021-01-30',2,NULL,43,'Paid',NULL,1,648,210,'2021-01-30','','2021-02-02 13:17:11','Delivery','Cash','Completed',0),(202102011,'2021-01-30',9,NULL,NULL,'Paid',NULL,2,648,205,'2021-01-30','CSV 893','2021-02-02 13:18:01','Pick-up','Cash','Completed',0),(202102012,'2021-01-30',6,NULL,44,'Paid',NULL,1,648,210,'2021-01-30','','2021-02-02 13:18:37','Delivery','Cash','Completed',0),(202102013,'2021-01-30',3,NULL,NULL,'Paid',NULL,2,50,205,'2021-01-30','LMD 953','2021-02-02 13:19:04','Pick-up','Cash','Completed',0),(202102014,'2021-01-30',7,NULL,45,'Paid',NULL,1,648,210,'2021-01-30','','2021-02-02 13:20:16','Delivery','Cash','Completed',0),(202102015,'2021-01-31',1,NULL,46,'Paid',NULL,2,648,205,'2021-01-31','','2021-02-02 13:32:13','Delivery','Cash','Completed',0),(202102016,'2021-01-31',1,NULL,47,'Paid',NULL,1,648,210,'2021-01-31','','2021-02-02 13:32:28','Delivery','Cash','Completed',0),(202102017,'2021-01-31',4,NULL,NULL,'Paid',NULL,1,648,210,'2021-01-31','CIV 123','2021-02-02 13:32:54','Pick-up','Cash','Completed',0),(202102018,'2021-01-31',10,NULL,48,'Paid',NULL,1,648,210,'2021-01-31','','2021-02-02 13:45:43','Delivery','Cash','Completed',0),(202102019,'2021-01-31',2,NULL,49,'Paid',NULL,1,648,210,'2021-01-31','','2021-02-02 13:46:00','Delivery','Cash','Completed',0),(202102020,'2021-01-31',4,NULL,50,'Paid',NULL,1,648,210,'2021-01-31','','2021-02-02 13:46:54','Delivery','Cash','Completed',0),(202102021,'2021-01-31',6,NULL,51,'Paid',NULL,1,648,210,'2021-01-31','','2021-02-02 13:47:02','Delivery','Cash','Completed',0),(202102022,'2021-01-31',5,NULL,52,'Paid',NULL,1,648,210,'2021-01-31','','2021-02-02 13:47:13','Delivery','Cash','Completed',0),(202102023,'2021-01-31',7,NULL,53,'Paid',NULL,1,648,210,'2021-01-31','','2021-02-02 13:47:22','Delivery','Cash','Completed',0),(202102024,'2021-01-31',5,NULL,54,'Paid',NULL,1,200,210,'2021-01-31','','2021-02-02 13:47:32','Delivery','Cash','Completed',0),(202102025,'2021-01-31',3,NULL,55,'Paid',NULL,1,648,210,'2021-01-31','','2021-02-02 13:47:44','Delivery','Cash','Completed',0),(202102026,'2021-02-01',1,NULL,56,'Paid',NULL,2,648,205,'2021-02-01','','2021-02-02 13:53:28','Delivery','Cash','Completed',0),(202102027,'2021-02-01',1,NULL,57,'Paid',NULL,1,648,210,'2021-02-01','','2021-02-02 13:53:36','Delivery','Cash','Completed',0),(202102028,'2021-02-01',4,NULL,58,'Paid',NULL,1,648,210,'2021-02-01','','2021-02-02 13:53:43','Delivery','Cash','Completed',0),(202102029,'2021-02-01',8,NULL,59,'Paid',NULL,1,648,210,'2021-02-01','','2021-02-02 13:53:50','Delivery','Cash','Completed',0),(202102030,'2021-02-01',3,NULL,60,'Paid',NULL,1,648,210,'2021-02-01','','2021-02-02 13:53:59','Delivery','Cash','Completed',0),(202102031,'2021-02-01',5,NULL,NULL,'Paid',NULL,2,200,205,'2021-02-01','CIV 123','2021-02-02 13:54:10','Pick-up','Cash','Completed',0),(202102032,'2021-02-02',5,NULL,61,'Paid',NULL,2,648,205,'2021-02-02','','2021-02-02 13:55:13','Delivery','Cash','Completed',0),(202102033,'2021-02-02',7,NULL,62,'Paid',NULL,1,648,210,'2021-02-02','','2021-02-02 13:55:20','Delivery','Cash','Completed',0),(202102034,'2021-02-02',10,NULL,63,'Unpaid',NULL,1,648,210,'2021-02-02','','2021-02-02 13:55:28','Delivery','Cash','Completed',0),(202102035,'2021-02-02',9,NULL,64,'Paid',NULL,1,648,210,'2021-02-02','','2021-02-02 13:55:36','Delivery','Cash','Completed',0),(202102036,'2021-02-02',2,NULL,65,'Paid',NULL,1,648,210,'2021-02-02','','2021-02-02 14:03:40','Delivery','Cash','Completed',0),(202102037,'2021-02-03',4,NULL,66,'Paid',NULL,1,648,210,'2021-02-03','','2021-02-02 14:03:48','Delivery','Cash','Pending',0),(202102038,'2021-02-02',3,NULL,67,'Paid',NULL,1,648,210,'2021-02-02','','2021-02-02 14:03:57','Delivery','Cash','Completed',0),(202102039,'2021-02-02',1,NULL,68,'Paid',NULL,1,648,210,'2021-02-02','','2021-02-02 14:04:04','Delivery','Cash','Completed',0),(202102040,'2021-02-03',8,NULL,69,'Paid',NULL,2,648,205,'2021-02-03','','2021-02-02 14:14:13','Delivery','Cash','Pending',0),(202102041,'2021-02-03',8,NULL,70,'Paid',NULL,1,648,210,'2021-02-03','','2021-02-02 14:14:20','Delivery','Cash','Pending',0),(202102042,'2021-02-03',5,NULL,71,'Paid',NULL,1,648,210,'2021-02-03','','2021-02-02 14:14:28','Delivery','Cash','Pending',0),(202102043,'2021-02-03',3,NULL,72,'Paid',NULL,1,648,210,'2021-02-03','','2021-02-02 14:14:36','Delivery','Cash','Pending',0),(202102044,'2021-02-03',3,NULL,73,'Unpaid',NULL,2,648,205,'2021-02-03','','2021-02-02 14:14:45','Delivery','Cash','Pending',0),(202102045,'2021-02-03',4,NULL,74,'Paid',NULL,1,648,210,'2021-02-03','','2021-02-02 14:14:52','Delivery','Cash','Pending',0),(202102046,'2021-02-03',1,NULL,75,'Paid',NULL,1,648,210,'2021-02-03','','2021-02-02 14:15:00','Delivery','Cash','Pending',0),(202102047,'2021-02-03',1,NULL,NULL,'Paid',NULL,2,200,205,'2021-02-03','CIV 123','2021-02-02 14:15:13','Pick-up','Cash','Completed',0),(202102048,'2021-02-03',10,NULL,76,'Unpaid',NULL,1,648,210,'2021-02-03','','2021-02-02 14:15:39','Delivery','Cash','Pending',0),(202102049,'2021-02-03',9,NULL,77,'Unpaid',NULL,1,648,210,'2021-02-03','','2021-02-02 14:15:45','Delivery','Cash','Pending',0),(202102050,'2021-02-04',8,NULL,78,'Paid',NULL,1,648,210,'2021-02-04','','2021-02-02 14:31:06','Delivery','Cash','Pending',0),(202102051,'2021-02-04',3,NULL,79,'Unpaid',NULL,1,648,210,'2021-02-04','','2021-02-02 14:31:16','Delivery','Cash','Pending',0),(202102052,'2021-02-04',1,NULL,80,'Paid',NULL,1,648,210,'2021-02-04','','2021-02-02 14:31:23','Delivery','Cash','Pending',0),(202102053,'2021-02-04',9,NULL,NULL,'Paid',NULL,2,200,205,'2021-02-04','CIV 123','2021-02-02 14:31:32','Pick-up','Cash','Completed',0),(202102054,'2021-02-04',10,NULL,NULL,'Paid',NULL,2,150,205,'2021-02-04','LDM 897','2021-02-02 14:31:43','Pick-up','Cash','Completed',0),(202102055,'2021-02-04',2,NULL,81,'Unpaid',NULL,1,648,210,'2021-02-04','','2021-02-02 14:31:52','Delivery','Cash','Pending',0),(202102056,'2021-02-04',4,NULL,82,'Paid',NULL,1,648,210,'2021-02-04','','2021-02-02 14:32:03','Delivery','Cash','Pending',0),(202102057,'2021-02-04',6,NULL,83,'Paid',NULL,1,648,210,'2021-02-04','','2021-02-02 14:32:46','Delivery','Cash','Pending',0),(202102058,'2021-02-04',5,NULL,84,'Paid',NULL,1,648,210,'2021-02-04','','2021-02-02 14:32:53','Delivery','Cash','Pending',0),(202102059,'2021-02-04',7,NULL,85,'Paid',NULL,1,648,210,'2021-02-04','','2021-02-02 14:33:02','Delivery','Cash','Pending',0),(202102060,'2021-02-05',1,NULL,NULL,'Paid',NULL,2,200,205,'2021-02-05','LDM 213','2021-02-02 15:10:29','Pick-up','Cash','Completed',0),(202102061,'2021-02-05',1,NULL,86,'Unpaid',NULL,1,648,210,'2021-02-05','','2021-02-02 15:10:36','Delivery','Cash','Pending',0),(202102062,'2021-02-05',8,NULL,87,'Unpaid',NULL,2,648,205,'2021-02-05','','2021-02-02 15:10:46','Delivery','Cash','Pending',0),(202102063,'2021-02-05',4,NULL,88,'Unpaid',NULL,1,648,210,'2021-02-05','','2021-02-02 15:10:53','Delivery','Cash','Pending',0),(202102064,'2021-02-05',3,NULL,89,'Unpaid',NULL,1,648,210,'2021-02-05','','2021-02-02 15:10:59','Delivery','Cash','Pending',0),(202102065,'2021-02-05',9,NULL,90,'Unpaid',NULL,1,648,210,'2021-02-05','','2021-02-02 15:11:16','Delivery','Cash','Pending',0),(202102066,'2021-02-05',5,NULL,91,'Unpaid',NULL,1,648,210,'2021-02-05','','2021-02-02 15:11:23','Delivery','Cash','Pending',0),(202102067,'2021-02-06',1,NULL,92,'Unpaid',NULL,1,648,210,'2021-02-06','','2021-02-02 15:11:29','Delivery','Cash','Pending',0),(202102068,'2021-02-06',2,NULL,93,'Unpaid',NULL,1,648,210,'2021-02-06','','2021-02-02 15:11:41','Delivery','Cash','Pending',0),(202102069,'2021-02-06',8,NULL,94,'Unpaid',NULL,1,648,210,'2021-02-06','','2021-02-02 15:11:48','Delivery','Cash','Pending',0),(202102070,'2021-02-06',3,NULL,95,'Unpaid',NULL,1,648,210,'2021-02-06','','2021-02-02 15:11:57','Delivery','Cash','Pending',0),(202102071,'2021-02-06',8,NULL,NULL,'Paid',NULL,2,200,205,'2021-02-21','LDM 123','2021-02-02 15:24:49','Pick-up','NET 15','Completed',0);
/*!40000 ALTER TABLE `sales_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('KWjef9DSqbKJ7Y-H-EykkASX_DIT6_cG',1612361878,'{\"cookie\":{\"originalMaxAge\":108000000,\"expires\":\"2021-02-03T13:37:13.129Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"initials\":\"Y.A\",\"authority\":\"Sales Employee\",\"username\":\"admin\",\"employee_id\":3,\"tab\":true}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trucks_table`
--

DROP TABLE IF EXISTS `trucks_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trucks_table` (
  `plate_no` varchar(15) NOT NULL,
  `status` enum('Active','For Repair','Retired') DEFAULT 'Active',
  `assigned_driver` int DEFAULT NULL,
  PRIMARY KEY (`plate_no`),
  UNIQUE KEY `plate_no_UNIQUE` (`plate_no`),
  KEY `assigned_driver_idx` (`assigned_driver`),
  CONSTRAINT `assigned_driver` FOREIGN KEY (`assigned_driver`) REFERENCES `employee_table` (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trucks_table`
--

LOCK TABLES `trucks_table` WRITE;
/*!40000 ALTER TABLE `trucks_table` DISABLE KEYS */;
INSERT INTO `trucks_table` VALUES ('PPT 921','Active',5),('QTY 952','Active',6),('UVB 123','Active',7),('UXQ 857','Active',8),('WHM 834','Active',9),('YEN 449','Active',10);
/*!40000 ALTER TABLE `trucks_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_table`
--

DROP TABLE IF EXISTS `user_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_table` (
  `username` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(45) NOT NULL,
  `role_id` enum('System Admin','Sales Employee','Purchasing Employee','Logistics Employee') NOT NULL,
  `employee_id` int NOT NULL,
  PRIMARY KEY (`username`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  KEY `user_emp_ref_idx` (`employee_id`),
  CONSTRAINT `user_emp_ref` FOREIGN KEY (`employee_id`) REFERENCES `employee_table` (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_table`
--

LOCK TABLES `user_table` WRITE;
/*!40000 ALTER TABLE `user_table` DISABLE KEYS */;
INSERT INTO `user_table` VALUES ('admin','$2b$10$C5ar5ulhsyz6DB2i/cj3keJwzLh5t8iJhwk1gFekbW/awJ7GFwYzO','allen_dalangin@gmail.com','System Admin',5),('logistics','password','dummy3@gmail.com','Logistics Employee',2),('purchasing','password','dummy2@gmail.com','Purchasing Employee',1),('sales','password','dummy1@gmail.com','Sales Employee',3);
/*!40000 ALTER TABLE `user_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `week`
--

DROP TABLE IF EXISTS `week`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `week` (
  `week` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`week`),
  UNIQUE KEY `week_UNIQUE` (`week`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `week`
--

LOCK TABLES `week` WRITE;
/*!40000 ALTER TABLE `week` DISABLE KEYS */;
INSERT INTO `week` VALUES (1),(2),(3),(4);
/*!40000 ALTER TABLE `week` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-02-02 16:18:58

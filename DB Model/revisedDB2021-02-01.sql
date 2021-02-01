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
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_detail_table`
--

LOCK TABLES `delivery_detail_table` WRITE;
/*!40000 ALTER TABLE `delivery_detail_table` DISABLE KEYS */;
INSERT INTO `delivery_detail_table` VALUES (19,2030000,7,'QTY 952',2,'Completed',0,'Sell-in',NULL),(20,2030001,5,'PPT 921',3,'Completed',0,'Sell-in','2021-01-22'),(21,2030002,9,'WHM 834',7,'Pending',0,'Sell-in',NULL),(22,2030003,5,'PPT 921',4,'Completed',0,'Sell-in','2021-01-22'),(23,202101002,NULL,NULL,11,'Pending',0,'Sell-in',NULL),(24,202101003,9,'WHM 834',4,'Completed',5,'Sell-in','2021-01-22'),(25,202101004,NULL,NULL,4,'Pending',0,'Sell-in',NULL),(26,202101005,NULL,NULL,2,'Pending',0,'Sell-in',NULL),(27,202101006,NULL,'UXQ 857',11,'Completed',0,'Sell-in',NULL),(28,202102001,NULL,NULL,11,'Pending',0,'Sell-in',NULL),(29,202102003,NULL,NULL,4,'Pending',0,'Sell-in',NULL),(30,202102004,NULL,NULL,11,'Pending',0,'Sell-in',NULL),(31,202102005,NULL,NULL,11,'Pending',0,'Sell-in',NULL),(32,202102006,NULL,NULL,11,'Pending',0,'Sell-in',NULL),(33,202102007,NULL,NULL,11,'Pending',0,'Sell-in',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (1,1,'x','x','2021-01-15 18:59:24',3,3,''),(2,1,'/home','trial','2021-01-15 18:59:49',1,1,''),(3,1,'/home','trial','2021-01-15 18:59:49',2,2,''),(4,1,'/home','trial','2021-01-15 18:59:49',3,3,''),(5,0,'/home','trial','2021-01-15 18:59:49',5,5,''),(9,1,'url','desc','2021-01-15 19:18:49',3,3,''),(10,1,'url','desc','2021-01-15 19:18:49',1,3,''),(12,0,'url','desc','2021-01-15 19:19:20',5,3,''),(13,1,'url','desc','2021-01-15 20:07:49',3,3,''),(14,1,'url','desc','2021-01-15 20:07:49',2,3,''),(15,1,'url','desc','2021-01-15 20:07:49',1,3,''),(16,1,'url','desc','2021-01-15 20:07:58',3,3,''),(17,1,'url','desc','2021-01-15 20:07:58',2,3,''),(18,1,'url','desc','2021-01-15 20:07:58',1,3,''),(19,1,'url','desc','2021-01-15 21:03:23',3,3,'Insert message hersdasdsasddassadssadsde'),(20,1,'url','desc','2021-01-15 21:03:23',2,3,'Insert message here'),(21,1,'url','desc','2021-01-15 21:03:23',1,3,'Insert message here'),(22,0,'url','desc','2021-01-20 08:29:26',5,3,'Insert message here'),(23,1,'url','desc','2021-01-20 08:29:26',2,3,'Insert message here'),(25,0,'url','desc','2021-01-20 11:47:47',5,3,'Insert message here'),(26,1,'url','desc','2021-01-20 11:47:47',2,3,'Insert message here'),(28,0,'url','desc','2021-01-20 11:47:59',5,3,'Insert message here'),(29,1,'url','desc','2021-01-20 11:47:59',2,3,'Insert message here'),(31,0,'/schedule_delivery','New Purchase of FCC','2021-01-31 17:49:51',5,1,'New Purchase of FCC'),(32,0,'/schedule_delivery','New Purchase of FCC','2021-01-31 17:49:51',2,1,'New Purchase of FCC'),(34,0,'/schedule_delivery','New order for CDL','2021-02-01 10:07:48',5,3,'New order for CDL'),(35,0,'/schedule_delivery','New order for CDL','2021-02-01 10:07:48',2,3,'New order for CDL'),(37,0,'/schedule_delivery','New order for La Sail','2021-02-01 10:10:28',5,3,'New order for La Sail'),(38,0,'/schedule_delivery','New order for La Sail','2021-02-01 10:10:28',2,3,'New order for La Sail'),(40,0,'/schedule_delivery','New order for CDL','2021-02-01 10:11:55',5,3,'New order for CDL'),(41,0,'/schedule_delivery','New order for CDL','2021-02-01 10:11:55',2,3,'New order for CDL'),(43,0,'/schedule_delivery','New order for CDL','2021-02-01 10:14:15',5,3,'New order for CDL'),(44,0,'/schedule_delivery','New order for CDL','2021-02-01 10:14:15',2,3,'New order for CDL'),(46,0,'/schedule_delivery','New order for CDL','2021-02-01 10:14:51',5,3,'New order for CDL'),(47,0,'/schedule_delivery','New order for CDL','2021-02-01 10:14:51',2,3,'New order for CDL'),(49,0,'/schedule_delivery','New order for CDL','2021-02-01 10:28:18',5,3,'New order for CDL'),(50,0,'/schedule_delivery','New order for CDL','2021-02-01 10:28:18',2,3,'New order for CDL');
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
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_details_table`
--

LOCK TABLES `payment_details_table` WRITE;
/*!40000 ALTER TABLE `payment_details_table` DISABLE KEYS */;
INSERT INTO `payment_details_table` VALUES (54,'',0,'0000-00-00'),(55,NULL,5,'2021-01-15'),(56,NULL,5,'2021-01-15'),(57,'MTBundefined',10000,'2021-01-15');
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
INSERT INTO `product_table` VALUES (1,'FCC',3248,1000),(2,'RCC',796,1000);
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
INSERT INTO `purchase_history` VALUES (1312,'2021-01-31',NULL,NULL,500,NULL,1,500,101500,'Pending',NULL,1),(78998088,'2021-01-14',NULL,NULL,50087678,'PPT 921',1,648,131544,'Completed',5,0),(78998089,'2021-01-22',NULL,NULL,50087679,'QTY 952',2,648,116640,'Completed',7,0),(78998090,'2020-10-02',NULL,NULL,50087680,'UXQ 857',1,648,131544,'Completed',10,0),(78998091,'2020-10-02',NULL,NULL,50087691,'YEN 449',1,648,131544,'Completed',10,0),(78998092,'2020-10-02',NULL,NULL,50087692,'UXQ 857',2,648,116640,'Completed',7,0),(78998093,'2020-10-02',NULL,NULL,50087693,'PPT 921',1,648,131544,'Completed',6,0),(78998094,'2021-01-21',NULL,NULL,50087694,'UVB 123',1,648,131544,'Completed',8,0),(78998095,'2021-01-01','09:09:00',NULL,50087695,'QTY 952',1,648,116640,'Completed',9,0),(78998096,'2021-01-02',NULL,NULL,50087696,'UXQ 857',2,648,116640,'Processing',8,0),(78998097,'2021-01-02','08:59:00',NULL,50087697,'YEN 449',2,648,131544,'Completed',10,0),(78998099,'2021-01-02',NULL,NULL,50087699,'YEN 449',1,648,131544,'Processing',10,0);
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
INSERT INTO `sales_history` VALUES (2030000,'2020-10-02',1,NULL,19,'Paid',54,2,648,205,'2020-10-02',NULL,'2020-10-02 20:15:16','Delivery','Cash','Completed',0),(2030001,'2020-10-02',2,NULL,20,'Unpaid',NULL,1,640,210,'2020-10-09',NULL,'2020-10-02 20:25:11','Delivery','NET 7','Completed',0),(2030002,'2020-10-03',4,NULL,21,'Paid',NULL,1,640,210,'2020-10-03',NULL,'2020-10-02 20:33:53','Delivery','Cash','Pending',0),(2030003,'2020-10-03',3,NULL,22,'Paid',NULL,1,648,210,'2020-10-03',NULL,'2020-10-02 20:40:59','Delivery','Cash','Completed',0),(202101001,'2021-01-14',1,NULL,NULL,'Unpaid',NULL,2,648,205,'2021-01-14',NULL,'2021-01-14 19:27:02','Pick-up','Cash','Completed',0),(202101002,'2021-01-15',8,NULL,23,'Paid',NULL,1,450,210,'2021-01-15',NULL,'2021-01-15 10:51:33','Delivery','Cash','Pending',0),(202101003,'2021-01-19',3,NULL,24,'Paid',NULL,2,500,205,'2021-02-06',NULL,'2021-01-15 11:40:17','Delivery','Cash','Completed',0),(202101004,'2021-02-20',3,NULL,25,'Unpaid',NULL,2,500,205,'2021-01-20','','2021-01-20 08:29:27','Delivery','Cash','Pending',0),(202101005,'2021-01-15',1,NULL,26,'Unpaid',NULL,1,500,210,'2021-01-20','','2021-01-20 11:47:47','Delivery','Cash','Pending',0),(202101006,'2021-01-22',8,NULL,NULL,'Unpaid',NULL,2,500,205,'2021-01-22','','2021-01-20 11:47:59','Delivery','Cash','Pending',1),(202102001,'2021-02-01',8,NULL,28,'Unpaid',NULL,1,500,210,'2021-02-01','','2021-02-01 10:07:48','Delivery','Cash','Pending',0),(202102002,'2021-02-01',3,NULL,NULL,'Paid',NULL,2,648,205,'2021-02-01','','2021-02-01 10:09:40','Pick-up','Cash','Completed',0),(202102003,'2021-02-01',3,NULL,29,'Unpaid',NULL,2,548,205,'2021-02-01','','2021-02-01 10:10:29','Delivery','Cash','Pending',0),(202102004,'2021-02-01',8,NULL,30,'Unpaid',NULL,2,500,205,'2021-02-01','','2021-02-01 10:11:55','Delivery','Cash','Pending',0),(202102005,'2021-02-01',8,NULL,31,'Unpaid',NULL,2,600,205,'2021-02-01','','2021-02-01 10:14:15','Delivery','Cash','Pending',0),(202102006,'2021-02-01',8,NULL,32,'Unpaid',NULL,2,600,205,'2021-02-01','','2021-02-01 10:14:52','Delivery','Cash','Pending',0),(202102007,'2021-02-01',8,NULL,33,'Unpaid',NULL,2,500,205,'2021-02-01','','2021-02-01 10:28:18','Delivery','Cash','Pending',0);
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
INSERT INTO `sessions` VALUES ('vuPDQDlMC7XENnYKjnI1xTb41P1bxV9L',1612255111,'{\"cookie\":{\"originalMaxAge\":108000000,\"expires\":\"2021-02-02T08:38:26.524Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}');
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
INSERT INTO `user_table` VALUES ('admin','password','dummy1@gmail.com','Sales Employee',3),('allendalangin','$2b$10$C5ar5ulhsyz6DB2i/cj3keJwzLh5t8iJhwk1gFekbW/awJ7GFwYzO','allen_dalangin@gmail.com','System Admin',5),('purchases','password','dummy3@gmail.com','Logistics Employee',2),('sales1','password','dummy2@gmail.com','Purchasing Employee',1);
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

-- Dump completed on 2021-02-01 10:39:50

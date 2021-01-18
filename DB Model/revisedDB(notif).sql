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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_detail_table`
--

LOCK TABLES `delivery_detail_table` WRITE;
/*!40000 ALTER TABLE `delivery_detail_table` DISABLE KEYS */;
INSERT INTO `delivery_detail_table` VALUES (19,2030000,7,'QTY 952',2,'Completed',0,'Sell-in'),(20,2030001,NULL,NULL,3,'Pending',0,'Sell-in'),(21,2030002,NULL,NULL,7,'Pending',0,'Sell-in'),(22,2030003,NULL,NULL,4,'Pending',0,'Sell-in'),(23,202101002,NULL,NULL,11,'Pending',0,'Sell-in'),(24,202101003,NULL,NULL,4,'Pending',0,'Sell-in');
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
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (1,0,'x','x','2021-01-15 18:59:24',3,3,''),(2,0,'/home','trial','2021-01-15 18:59:49',1,1,''),(3,0,'/home','trial','2021-01-15 18:59:49',2,2,''),(4,0,'/home','trial','2021-01-15 18:59:49',3,3,''),(5,0,'/home','trial','2021-01-15 18:59:49',5,5,''),(9,0,'url','desc','2021-01-15 19:18:49',3,3,''),(10,0,'url','desc','2021-01-15 19:18:49',1,3,''),(12,0,'url','desc','2021-01-15 19:19:20',5,3,''),(13,0,'url','desc','2021-01-15 20:07:49',3,3,''),(14,0,'url','desc','2021-01-15 20:07:49',2,3,''),(15,0,'url','desc','2021-01-15 20:07:49',1,3,''),(16,0,'url','desc','2021-01-15 20:07:58',3,3,''),(17,0,'url','desc','2021-01-15 20:07:58',2,3,''),(18,0,'url','desc','2021-01-15 20:07:58',1,3,''),(19,0,'url','desc','2021-01-15 21:03:23',3,3,'Insert message here'),(20,0,'url','desc','2021-01-15 21:03:23',2,3,'Insert message here'),(21,0,'url','desc','2021-01-15 21:03:23',1,3,'Insert message here');
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
INSERT INTO `product_table` VALUES (1,'FCC',2592,1000),(2,'RCC',648,1000);
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
INSERT INTO `purchase_history` VALUES (78998088,'2020-10-02',NULL,NULL,50087678,'PPT 921',1,648,131544,'Completed',5),(78998089,'2020-10-02',NULL,NULL,50087679,'QTY 952',2,648,116640,'Completed',7),(78998090,'2020-10-02',NULL,NULL,50087680,'UXQ 857',1,648,131544,'Completed',10),(78998091,'2020-10-02',NULL,NULL,50087691,'YEN 449',1,648,131544,'Completed',10),(78998092,'2020-10-02',NULL,NULL,50087692,'UXQ 857',2,648,116640,'Completed',7),(78998093,'2020-10-02',NULL,NULL,50087693,'PPT 921',1,648,131544,'Completed',6),(78998094,'2020-10-02',NULL,NULL,50087694,'UVB 123',1,648,131544,'Processing',8),(78998095,'2020-10-02',NULL,NULL,50087695,'QTY 952',2,648,116640,'Processing',9),(78998096,'2020-10-02',NULL,20200101,50087696,NULL,2,648,116640,'Pending',NULL),(78998097,'2020-10-02',NULL,2030001,50087697,NULL,1,648,131544,'Pending',NULL),(78998099,'2020-10-02',NULL,NULL,50087699,NULL,1,648,131544,'Pending',NULL);
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
INSERT INTO `sales_history` VALUES (2030000,'2020-10-02',1,NULL,19,'Paid',54,2,648,205,'2020-10-02',NULL,'2020-10-02 20:15:16','Delivery','Cash','Completed'),(2030001,'2020-10-02',2,NULL,20,'Unpaid',NULL,1,640,210,'2020-10-09',NULL,'2020-10-02 20:25:11','Delivery','NET 7','Pending'),(2030002,'2020-10-03',4,NULL,21,'Paid',NULL,1,640,210,'2020-10-03',NULL,'2020-10-02 20:33:53','Delivery','Cash','Pending'),(2030003,'2020-10-03',3,NULL,22,'Paid',NULL,1,648,210,'2020-10-03',NULL,'2020-10-02 20:40:59','Delivery','Cash','Pending'),(202101001,'2021-01-14',1,NULL,NULL,'Unpaid',NULL,2,648,205,'2021-01-14',NULL,'2021-01-14 19:27:02','Pick-up','Cash','Completed'),(202101002,'2021-01-15',8,NULL,23,'Paid',NULL,1,450,210,'2021-01-15',NULL,'2021-01-15 10:51:33','Delivery','Cash','Pending'),(202101003,'2021-02-06',3,NULL,24,'Paid',NULL,2,500,205,'2021-02-06',NULL,'2021-01-15 11:40:17','Delivery','Cash','Pending');
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
INSERT INTO `sessions` VALUES ('xUk-7AFMwyJQheFOvDWfym9J54xPZdpj',1610863876,'{\"cookie\":{\"originalMaxAge\":108000000,\"expires\":\"2021-01-16T17:18:45.321Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"initials\":\"Y.A\",\"authority\":\"Sales Employee\",\"username\":\"admin\",\"employee_id\":3,\"tab\":true}');
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
  PRIMARY KEY (`plate_no`),
  UNIQUE KEY `plate_no_UNIQUE` (`plate_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trucks_table`
--

LOCK TABLES `trucks_table` WRITE;
/*!40000 ALTER TABLE `trucks_table` DISABLE KEYS */;
INSERT INTO `trucks_table` VALUES ('PPT 921','Active'),('QTY 952','Active'),('UVB 123','Active'),('UXQ 857','Active'),('WHM 834','Active'),('YEN 449','Active');
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
INSERT INTO `user_table` VALUES ('admin','password','dummy1@gmail.com','Sales Employee',3),('allendalangin','$2b$10$xCNVLW7RQaA0AQ1jSMFAKuhtg85HFKegrAwwn3cH5MDNGvXl.jtQW','allen_dalangin@gmail.com','Logistics Employee',5),('purchases','password','dummy3@gmail.com','Purchasing Employee',2),('sales1','password','dummy2@gmail.com','Sales Employee',1);
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

-- Dump completed on 2021-01-16  8:12:57

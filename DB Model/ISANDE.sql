-- MySQL dump 10.13  Distrib 8.0.20, for Win64 (x86_64)
--
-- Host: localhost    Database: itisdev_db
-- ------------------------------------------------------
-- Server version	8.0.17

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
-- Dumping data for table `customer_location_table`
--

LOCK TABLES `customer_location_table` WRITE;
/*!40000 ALTER TABLE `customer_location_table` DISABLE KEYS */;
INSERT INTO `customer_location_table` VALUES (1,'Gulod Labak, Batangas City',1),(2,'Gulod Taas, Batangas City',1),(3,'Central , Batangas City',2),(4,'Pallocan East, Batangas City',3),(5,'Pallocan West, Batangas City',3),(6,'Sampaga, Batangas City',3),(7,'Alanginan, Batangas City',4),(8,'Balagtas, Batangas City',5),(9,'Taysan, Batangas City',6),(10,'Pier, Batangas City',7),(11,'Cuta, Batangas City',8),(12,'Diversion, Batangas City',9),(13,'Governor Carpio Rd, Batangas City',10);
/*!40000 ALTER TABLE `customer_location_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `customer_table`
--

LOCK TABLES `customer_table` WRITE;
/*!40000 ALTER TABLE `customer_table` DISABLE KEYS */;
INSERT INTO `customer_table` VALUES (1,'Hipolito Hardware'),(2,'Marajaen'),(3,'La Sail'),(4,'Amorado'),(5,'Golden Libjo'),(6,'GJY'),(7,'Golden Coin'),(8,'CDL'),(9,'Tophock'),(10,'Vinseth');
/*!40000 ALTER TABLE `customer_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `damaged_inventory_table`
--

LOCK TABLES `damaged_inventory_table` WRITE;
/*!40000 ALTER TABLE `damaged_inventory_table` DISABLE KEYS */;
INSERT INTO `damaged_inventory_table` VALUES (13,10,'admin','2020-10-03',NULL,1),(14,2,'admin','2020-10-03','2 bags with holes',1),(15,3324,'admin','2020-10-03','comment',1);
/*!40000 ALTER TABLE `damaged_inventory_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `delivery_detail_table`
--

LOCK TABLES `delivery_detail_table` WRITE;
/*!40000 ALTER TABLE `delivery_detail_table` DISABLE KEYS */;
INSERT INTO `delivery_detail_table` VALUES (19,2030000,7,'QTY 952',2,'Completed',0,'Sell-in'),(20,2030001,8,'PPT 921',3,'Completed',0,'Sell-in'),(21,2030002,6,'PPT 921',7,'Completed',0,'Sell-out'),(22,2030003,7,'UVB 123',4,'Completed',0,'Sell-in'),(23,2030004,5,'PPT 921',11,'Completed',0,'Sell-in'),(24,2030005,6,'QTY 952',6,'Completed',0,'Sell-in'),(25,2030006,NULL,NULL,9,'Pending',0,'Sell-in');
/*!40000 ALTER TABLE `delivery_detail_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `delivery_employees`
--

LOCK TABLES `delivery_employees` WRITE;
/*!40000 ALTER TABLE `delivery_employees` DISABLE KEYS */;
INSERT INTO `delivery_employees` VALUES (15,11,19),(16,15,19),(21,11,22),(22,14,22),(23,22,22),(24,25,22),(45,11,23),(46,14,23),(47,16,23),(48,19,23),(52,11,24),(53,15,24),(54,18,24),(55,21,24),(56,17,21),(57,20,21),(58,23,21),(69,11,20),(70,13,20),(71,16,20),(72,20,20),(73,23,20);
/*!40000 ALTER TABLE `delivery_employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `discrepancy_table`
--

LOCK TABLES `discrepancy_table` WRITE;
/*!40000 ALTER TABLE `discrepancy_table` DISABLE KEYS */;
INSERT INTO `discrepancy_table` VALUES (9,3884,560,'2020-10-03','comment',1,'admin');
/*!40000 ALTER TABLE `discrepancy_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `employee_table`
--

LOCK TABLES `employee_table` WRITE;
/*!40000 ALTER TABLE `employee_table` DISABLE KEYS */;
INSERT INTO `employee_table` VALUES (1,'Martin','Cu','Sales Employee','Active'),(2,'Loren','Anyayahan','Sales Employee','Active'),(3,'Y2','Aquino','Sales Employee','Active'),(4,'Martin','Murillo','Sales Employee','Inactive'),(5,'Allen','Dalangin','Driver','Active'),(6,'Adrian','Dasilva','Driver','Active'),(7,'JM','San Jose','Driver','Active'),(8,'Louis','Borja','Driver','Active'),(9,'Renz','Dela Rosa','Driver','Active'),(10,'Nathan','Bongon','Driver','Active'),(11,'Matthew','Estrella','Carrier','Active'),(12,'Mark','Elizon','Carrier','Active'),(13,'Luke','Martinez','Carrier','Active'),(14,'John','Jaen','Carrier','Active'),(15,'Romano','David','Carrier','Active'),(16,'Nestor','Cuevas','Carrier','Active'),(17,'Karding','Cube','Carrier','Active'),(18,'Cong','Cuison','Carrier','Active'),(19,'Junnie','Castaneda','Carrier','Active'),(20,'Christian','Ambrosio','Carrier','Active'),(21,'Yow','Alib','Carrier','Active'),(22,'Josh','Casaclang','Carrier','Active'),(23,'Angel','Jariel','Carrier','Active'),(24,'Bods','Santos','Carrier','Active'),(25,'Atoy','Hu','Carrier','Active');
/*!40000 ALTER TABLE `employee_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `payment_details_table`
--

LOCK TABLES `payment_details_table` WRITE;
/*!40000 ALTER TABLE `payment_details_table` DISABLE KEYS */;
INSERT INTO `payment_details_table` VALUES (54,'');
/*!40000 ALTER TABLE `payment_details_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `product_catalogue_table`
--

LOCK TABLES `product_catalogue_table` WRITE;
/*!40000 ALTER TABLE `product_catalogue_table` DISABLE KEYS */;
INSERT INTO `product_catalogue_table` VALUES (2,1,185,200,'2020-08-24','2020-08-31','Inactive'),(3,2,180,205,'2020-08-24',NULL,'Active'),(4,1,170,105,'2020-09-01','2020-09-01','Inactive'),(5,1,203,210,'2020-09-02','2020-09-02','Inactive'),(6,1,203,210,'2020-09-02','2020-09-02','Inactive'),(7,1,203,210,'2020-09-02',NULL,'Active');
/*!40000 ALTER TABLE `product_catalogue_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `product_table`
--

LOCK TABLES `product_table` WRITE;
/*!40000 ALTER TABLE `product_table` DISABLE KEYS */;
INSERT INTO `product_table` VALUES (1,'FCC',560,1000),(2,'RCC',648,1000);
/*!40000 ALTER TABLE `product_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `purchase_history`
--

LOCK TABLES `purchase_history` WRITE;
/*!40000 ALTER TABLE `purchase_history` DISABLE KEYS */;
INSERT INTO `purchase_history` VALUES (342342,'2020-10-03',NULL,NULL,2131223,NULL,1,648,131544,'Pending',NULL),(2030001,'2020-10-03',NULL,NULL,5908011,NULL,2,648,116640,'Pending',NULL),(2034450,'2020-10-05',NULL,NULL,2030001,'UXQ 857',1,648,131544,'Cancelled',7),(2300131,'2020-10-05',NULL,NULL,4220031,'QTY 952',1,648,131544,'Completed',7),(2400101,'2020-10-03',NULL,NULL,3002401,'PPT 921',1,648,131544,'Completed',6),(35420001,'2020-10-06',NULL,NULL,20491021,'QTY 952',1,648,131544,'Completed',6),(50532011,'2020-10-03','01:02:00',1,23422201,NULL,1,648,131544,'Completed',NULL),(52300201,'2020-10-03',NULL,NULL,23800101,'PPT 921',2,648,116640,'Completed',5),(78998088,'2020-10-02','02:44:00',14411001,50087678,'PPT 921',1,648,131544,'Completed',5),(78998089,'2020-10-02','04:41:00',29000101,50087679,'QTY 952',2,648,116640,'Completed',7),(78998090,'2020-10-02','01:01:00',11211121,50087680,'UXQ 857',1,648,131544,'Completed',10),(78998091,'2020-10-02','03:41:00',10431141,50087691,'YEN 449',1,648,131544,'Cancelled',10),(78998092,'2020-10-02','01:11:00',20441101,50087692,'UXQ 857',2,648,116640,'Completed',7),(78998093,'2020-10-02','00:11:00',10020011,50087693,'PPT 921',1,648,131544,'Completed',6),(78998094,'2020-10-02','06:01:00',10401001,50087694,'UVB 123',1,648,131544,'Completed',8),(78998095,'2020-10-02','01:01:00',27311124,50087695,'QTY 952',2,648,116640,'Completed',9),(78998096,'2020-10-02','01:02:00',20200101,50087696,NULL,2,648,116640,'Completed',NULL),(78998097,'2020-10-02',NULL,2030001,50087697,'UVB 123',1,648,131544,'Completed',6),(78998099,'2020-10-02',NULL,NULL,50087699,'UVB 123',1,648,131544,'Completed',9);
/*!40000 ALTER TABLE `purchase_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `recommendation_algo`
--

LOCK TABLES `recommendation_algo` WRITE;
/*!40000 ALTER TABLE `recommendation_algo` DISABLE KEYS */;
INSERT INTO `recommendation_algo` VALUES (1,'Inactive','Algo 1'),(2,'Inactive','Algo 2'),(3,'Active','Algo 3');
/*!40000 ALTER TABLE `recommendation_algo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `sales_history`
--

LOCK TABLES `sales_history` WRITE;
/*!40000 ALTER TABLE `sales_history` DISABLE KEYS */;
INSERT INTO `sales_history` VALUES (2030000,'2020-10-02',1,NULL,19,'Paid',54,2,648,205,'2020-10-02',NULL,'2020-10-02 20:15:16','Delivery','Cash','Completed'),(2030001,'2020-10-02',2,NULL,20,'Unpaid',NULL,1,640,210,'2020-10-09',NULL,'2020-10-02 20:25:11','Delivery','NET 7','Completed'),(2030002,'2020-10-03',4,2400101,21,'Unpaid',NULL,1,640,210,'2020-10-03',NULL,'2020-10-02 20:33:53','Delivery','Cash','Completed'),(2030003,'2020-10-03',3,NULL,22,'Unpaid',NULL,1,648,210,'2020-10-03',NULL,'2020-10-02 20:40:59','Delivery','Cash','Completed'),(2030004,'2020-10-02',8,NULL,23,'Unpaid',NULL,2,648,205,'2020-10-02',NULL,'2020-10-02 21:56:05','Delivery','Cash','Completed'),(2030005,'2020-10-06',3,NULL,24,'Unpaid',NULL,2,648,205,'2020-10-06',NULL,'2020-10-03 03:29:04','Delivery','Cash','Completed'),(2030006,'2020-10-03',6,NULL,25,'Unpaid',NULL,2,648,205,'2020-10-03',NULL,'2020-10-03 03:29:30','Delivery','Cash','Pending');
/*!40000 ALTER TABLE `sales_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('GnYBc_WX1LD94jfwN6zSQUSeyMdhXpeN',1610638803,'{\"cookie\":{\"originalMaxAge\":108000000,\"expires\":\"2021-01-14T15:39:24.458Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{\"dialog_error_msg\":[\"Please login first!\",\"Please login first!\",\"Please login first!\",\"Please login first!\",\"Please login first!\"]},\"initials\":\"Y.A\",\"authority\":\"System Admin\",\"username\":\"admin\",\"tab\":true}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `trucks_table`
--

LOCK TABLES `trucks_table` WRITE;
/*!40000 ALTER TABLE `trucks_table` DISABLE KEYS */;
INSERT INTO `trucks_table` VALUES ('PPT 921','Active'),('QTY 952','Active'),('UVB 123','Active'),('UXQ 857','Active'),('WHM 834','Active'),('YEN 449','Active');
/*!40000 ALTER TABLE `trucks_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_table`
--

LOCK TABLES `user_table` WRITE;
/*!40000 ALTER TABLE `user_table` DISABLE KEYS */;
INSERT INTO `user_table` VALUES ('admin','password','dummy1@gmail.com','System Admin',3),('allendalangin','$2b$10$xCNVLW7RQaA0AQ1jSMFAKuhtg85HFKegrAwwn3cH5MDNGvXl.jtQW','allen_dalangin@gmail.com','Logistics Employee',5),('purchases','password','dummy3@gmail.com','Purchasing Employee',2),('sales1','password','dummy2@gmail.com','Sales Employee',1);
/*!40000 ALTER TABLE `user_table` ENABLE KEYS */;
UNLOCK TABLES;

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

-- Dump completed on 2021-01-13 17:48:46

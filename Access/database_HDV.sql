DROP DATABASE IF EXISTS `tourdlhdv`;
CREATE DATABASE tourdlhdv;
USE tourdlhdv;
DROP TABLE IF EXISTS `member`;
CREATE TABLE `member` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `bod` varchar(40) DEFAULT NULL,
  `role` int NOT NULL,
  `tour_order_id` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tourOrderID` (`tour_order_id`),
  CONSTRAINT `member_ibfk_1` FOREIGN KEY (`tour_order_id`) REFERENCES `tour_order` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
LOCK TABLES `member` WRITE;
UNLOCK TABLES;
DROP TABLE IF EXISTS `tour`;
CREATE TABLE `tour` (
  `id` varchar(30) NOT NULL,
  `name` text,
  `price` double DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `destination` varchar(255) DEFAULT NULL,
  `departure_point` varchar(255) DEFAULT NULL,
  `slot` int DEFAULT NULL,
  `transport_id` int unsigned DEFAULT NULL,
  `tour_type_id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `transportId` (`transport_id`),
  KEY `tourTypeId` (`tour_type_id`),
  CONSTRAINT `tour_ibfk_1` FOREIGN KEY (`transport_id`) REFERENCES `transport` (`id`),
  CONSTRAINT `tour_ibfk_2` FOREIGN KEY (`tour_type_id`) REFERENCES `tour_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
LOCK TABLES `tour` WRITE;
INSERT INTO `tour` VALUES ('NDHAN131','Mộc Châu - Sơn La - Điện Biên',4390000,'https://media.travel.com.vn/Tour/tfd_240112081758_526525_SONG%20DA.jpg','','Tây Bắc','Hà Nội',60,1,1),('NDSGN103','Hà Nội - Vịnh Hạ Long - Chùa Bái Đính - Tràng An - Tuyệt Tịnh Cốc',9190000,'https://media.travel.com.vn/Tour/tfd_240925021246_699305_TRANG%20AN%20(6).jpg',NULL,'Vịnh Hạ Long','TP.Hồ Chí Minh',80,1,3),('NDSGN155','Đông Bắc - Ngược dòng sông Gâm | Tuyên Quang - Lâm Bình - Bắc Mê - Mèo Vạc - Đồng Văn - Quản Bạ - Hà Giang',10990000,'https://media.travel.com.vn/TourFiles/3378/N%C3%BAi%20%C4%90%E1%BB%95,%20B%E1%BA%AFc%20M%C3%AA%20(2).jpg',NULL,'Hà Giang','TP.Hồ Chí Minh',30,1,1),('NDSGN1733','Tây Bắc: Hà Nội - Nghĩa Lộ - Tú Lệ - Mù Cang Chải - Sa Pa - Fansipan - Bản Cát Cát - Lai Châu - Điện Biên - Sơn La - Mộc Châu - Cầu kính Bạch Long',9990000,'https://media.travel.com.vn/Tour/tfd_240925112715_103994_LE%20HOI%20DEN%20HUNG.jpg',NULL,'Tây Bắc','TP.Hồ Chí Minh',50,1,1),('NDSGN307','Đà Nẵng - Phố Cổ Hội An - Bà Nà - Cầu Vàng - Vườn Tượng Apec - Cầu Tình Yêu',3590000,'https://media.travel.com.vn/TourFiles/4967/Hoi%20An%20Ve%20Dem%20(4).jpg',NULL,'Đà Nẵng','TP.Hồ Chí Minh',80,1,2),('NDSGN556','Phan Thiết - Đồi Cát Trinh Nữ - Làng Chài Xưa',3390000,'https://media.travel.com.vn/TourFiles/7780/Bau%20Trang%20lake.jpg',NULL,'Phan Thiết','TP.Hồ Chí Minh',45,2,2),('NDSGN818','Phú Quốc: Thành phố không ngủ Grand World - Chợ đêm Vui Phết - Kiss Bridge - Lưu trú tại Thị trấn Hoàng Hôn - Tặng vé cáp treo khứ hồi Sunworld Hòn Thơm Nature Park',3190000,'https://media.travel.com.vn/Tour/tfd_241008113206_355062_GRAND%20WORLD%20(28).jpg',NULL,'Phú Quốc','TP.Hồ Chí Minh',100,1,2),('NDSGN871','Phú Quốc - Sun World Hon Thom Nature Park Cáp Treo 3 Dây Vượt Biển Dài Nhất Thế Giới Công Viên Nước Aquatopia Thị Trấn Hoàng Hôn - Kiss Bridge - Bãi Sao',4990000,'https://media.travel.com.vn/Tour/tfd_240131095355_074901_SUN%20WORLD%20HON%20THOM%20(4).jpg',NULL,'Phú Quốc','TP.Hồ Chí Minh',150,1,1),('NDSGN879','Phú Quốc: Thiên đường giải trí Vinwonder - Safari World - Hòn Thơm Nature Park - Cáp Treo Vượt Biển - Công Viên Nước Aquatopia',5990000,'https://media.travel.com.vn/TourFiles/10459/Aquatopia%20(6).jpg',NULL,'Phú Quốc','TP.Hồ Chí Minh',150,1,1),('NDSGN880','Khám Phá Tây Ninh - Vùng Đất Địa Linh - Chinh Phục Đỉnh Thiêng',1390000,'https://media.travel.com.vn/TourFiles/6342/CHUA%20HANG.jpg',NULL,'Tây Ninh','TP.Hồ Chí Minh',80,2,1),('NDSGN91','Miền Bắc: Sapa - Ngỡ Lạc Giữa Trời Âu (Trải Nghiệm Đẳng Cấp 5 sao Hôtel de la Coupole - MGallery)',37990000,'https://media.travel.com.vn/Tour/tfd_230621060253_761592_restaurant.jpg',NULL,'Sapa','TP.Hồ Chí Minh',80,1,4),('NDSGN98','Miền Bắc: Hạ Long - Vịnh Lan Hạ - Cát Bà - Vũ Điệu biển khơi ( Trải nghiệm du thuyền đằng cấp Paradise Grand & M-Gallery Hotel Perle D’Orient )',39990000,'https://media.travel.com.vn/Tour/tfd_230719052427_625034_Paradise%20Grand.jpg',NULL,'Hạ Long','TP.Hồ Chí Minh',80,1,4),('NDSGN99','Miền Tây: Khám Phá Hành Trình Xuôi Dòng Mê Kông Ấn Tượng (Trải nghiêm dịch vụ đẳng cấp 5 sao Azerai Cần Thơ Resort)',19990000,'https://media.travel.com.vn/Tour/tfd_230914015810_104707_Pool%20(resize).jpg',NULL,'Miền Tây','TP.Hồ Chí Minh',50,1,4),('NNSGN100','Campuchia: Siem Reap - Phnom Penh (Khách Sạn 4*)',6490000,'https://media.travel.com.vn/Tour/tfd_240925050021_432655_Angkor%20Thom.jpg',NULL,'Campuchia','TP.Hồ Chí Minh',50,2,3),('NNSGN1362','Thái Lan: Pattaya - Bangkok (Khách Sạn 5 Sao, Vườn Lan Nong Nooch, Tham Quan Wat Arun, Chợ Nổi Damnoen Saduak, Thưởng Thức Buffet Tối Tại Baiyoke Sky)',10990000,'https://media.travel.com.vn/Tour/tfd_240925035227_181920_Wat%20Arun%20temple.jpg',NULL,'Thái Lan','TP.Hồ Chí Minh',200,1,3),('NNSGN138','Thái Lan: Vé Máy Bay Khứ Hồi Tp.HCM – Bangkok - Tp.HCM - Đã bao gồm 20kg ký gửi',2200000,'https://media.travel.com.vn/Tour/tfd_240927114330_659298_BKK%20shopping%20mall.jpg',NULL,'Thái Lan','TP.Hồ Chí Minh',200,1,2),('NNSGN193','Singapore (Tặng vé tham quan Cloud Forest và Supertree Observatory, tặng Khu vườn giác quan Sensory Scape)',14490000,'https://media.travel.com.vn/Tour/tfd_240925024218_698234_Bay%20South%20Garden.jpg',NULL,'Singapore','TP.Hồ Chí Minh',200,1,3),('NNSGN230','Indonesia - Bali: Đền suối thiêng Tampak Siring - Thác nước Blangsinga - Bali Bird Park',12990000,'https://media.travel.com.vn/Tour/tfd_240925032232_997335_Tanah%20Lot%20Temple.jpg',NULL,'Indonesia','TP.Hồ Chí Minh',200,1,3),('NNSGN392','Trung Quốc: Nghi Xương - Công viên Trương Gia Giới - Phượng Hoàng cổ trấn - Hồ Bảo Phong - Đập Tam Hiệp',15990000,'https://media.travel.com.vn/Tour/tfd_240222033852_573340_Phoenix%20Town.jpg',NULL,'Trung Quốc','TP.Hồ Chí Minh',200,1,2),('NNSGN94','Dubai: Du Thuyền Vịnh Marina Bay – Bữa tối trên không – Cafe bánh phủ vàng – Buffet tại khách sạn 5* - Tham quan vườn hoa Miracle',74990000,'https://media.travel.com.vn/Tour/tfd_240422104142_550582_dubai.jpg',NULL,'Dubai','TP.Hồ Chí Minh',200,1,4),('NNSGN99','Nhật Bản: Tokyo - Núi Phú Sĩ - Oshino Hakkai - Kyoto - Osaka ( Trải Nghiệm Trực Thăng, Ăn Tối Du Thuyền Vịnh Tokyo, Thưởng Thức Bò Kobe)',159990000,'https://media.travel.com.vn/Tour/tfd_230807112605_542410_Kiyomizu-dera%20Temple.JPG',NULL,'Nhật Bản','TP.Hồ Chí Minh',200,1,4);
UNLOCK TABLES;
DROP TABLE IF EXISTS `tour_calendar`;
CREATE TABLE `tour_calendar` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `start_date` date DEFAULT NULL,
  `voucher_Id` int unsigned DEFAULT NULL,
  `tour_Id` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `voucherId` (`voucher_Id`),
  KEY `tourId` (`tour_Id`),
  CONSTRAINT `tour_calendar_ibfk_1` FOREIGN KEY (`voucher_Id`) REFERENCES `voucher` (`id`),
  CONSTRAINT `tour_calendar_ibfk_2` FOREIGN KEY (`tour_Id`) REFERENCES `tour` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `tour_calendar` WRITE;
INSERT INTO `tour_calendar` VALUES (1,'2024-11-05',NULL,'NDSGN155'),(2,'2024-11-19',NULL,'NDSGN155'),(3,'2024-11-02',NULL,'NDSGN103'),(4,'2024-11-07',NULL,'NDSGN103'),(5,'2024-11-07',NULL,'NNSGN100'),(6,'2024-11-14',NULL,'NNSGN100'),(7,'2024-11-12',NULL,'NNSGN1362'),(8,'2024-11-16',NULL,'NNSGN1362'),(9,'2024-11-16',NULL,'NNSGN193'),(10,'2024-11-23',NULL,'NNSGN193'),(11,'2024-11-16',NULL,'NNSGN230'),(12,'2024-11-23',NULL,'NNSGN230'),(13,'2024-11-14',NULL,'NDSGN1733'),(14,'2024-11-21',NULL,'NDSGN1733'),(15,'2024-10-25',NULL,'NDSGN871'),(16,'2024-10-27',NULL,'NDSGN871'),(17,'2024-10-27',NULL,'NDSGN879'),(18,'2024-11-17',NULL,'NDSGN879'),(19,'2024-10-27',NULL,'NDSGN880'),(20,'2024-11-03',NULL,'NDSGN880'),(21,'2024-10-25',NULL,'NDSGN307'),(22,'2024-10-31',NULL,'NDSGN307'),(23,'2024-10-25',NULL,'NDSGN556'),(24,'2024-11-08',NULL,'NDSGN556'),(25,'2024-10-25',NULL,'NDSGN818'),(26,'2024-11-01',NULL,'NDSGN818'),(27,'2024-10-25',NULL,'NNSGN138'),(28,'2024-10-26',NULL,'NNSGN138'),(29,'2024-10-28',NULL,'NNSGN138'),(30,'2024-11-02',NULL,'NNSGN392'),(31,'2024-11-07',NULL,'NNSGN392'),(32,'2024-11-01',NULL,'NDSGN91'),(33,'2024-11-08',NULL,'NDSGN91'),(34,'2024-11-01',NULL,'NDSGN98'),(35,'2024-11-08',NULL,'NDSGN98'),(36,'2024-11-02',NULL,'NDSGN99'),(37,'2024-11-09',NULL,'NDSGN99'),(38,'2024-11-01',NULL,'NNSGN94'),(39,'2024-11-08',NULL,'NNSGN94'),(40,'2024-11-08',NULL,'NNSGN99'),(41,'2024-11-15',NULL,'NNSGN99');
UNLOCK TABLES;


DROP TABLE IF EXISTS `tour_detail`;
CREATE TABLE `tour_detail` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `sight_seeing` varchar(255) DEFAULT NULL,
  `cuisine` varchar(255) DEFAULT NULL,
  `suitable_people` varchar(255) DEFAULT NULL,
  `time_suiable` varchar(255) DEFAULT NULL,
  `transport` varchar(255) DEFAULT NULL,
  `sale_description` varchar(255) DEFAULT NULL,
  `tour_Id` varchar(30) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tourId` (`tour_Id`),
  CONSTRAINT `tour_detail_ibfk_1` FOREIGN KEY (`tour_Id`) REFERENCES `tour` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


LOCK TABLES `tour_detail` WRITE;
/*!40000 ALTER TABLE `tour_detail` DISABLE KEYS */;
INSERT INTO `tour_detail` VALUES (1,NULL,NULL,'Núi Phú Sĩ, Nhật Bản, Tokyo, Kyoto, Osaka','Buffet sáng, Theo thực đơn','Cặp đôi, Gia đình nhiều thế hệ, Thanh niên','Quanh năm','Máy bay, Xe du lịch','Đã bao gồm trong giá tour','NDSGN103'),(2,NULL,NULL,'Dubai','Buffet sáng, Theo thực đơn','Cặp đôi, Gia đình nhiều thế hệ, Thanh niên','Quanh năm','Máy bay, Xe du lịch','Đã bao gồm trong giá tour','NNSGN94'),(3,NULL,NULL,'Cầu Cần Thơ, Cái Bè Princess, Cái Bè, Đò Chèo Cái Bè','Buffet sáng, Theo thực đơn','Cặp đôi, Gia đình nhiều thế hệ, Thanh niên','Quanh năm','Xe du lịch','Đã bao gồm trong giá tour','NDSGN99'),(4,NULL,NULL,'Đảo Tuần Châu, Vịnh Hạ Long','Buffet sáng, Theo thực đơn','Cặp đôi, Gia đình nhiều thế hệ, Thanh niên','Quanh năm','Máy bay, Xe du lịch','Ưu đãi trực tiếp vào giá tour','NDSGN98'),(5,NULL,NULL,'Núi Fansipan, Sun World Fansipan Legend, Sapa','Buffet sáng, Theo thực đơn','Cặp đôi, Gia đình nhiều thế hệ, Thanh niên','Quanh năm','Máy bay, Xe du lịch','Đã bao gồm trong giá tour','NDSGN91'),(6,NULL,NULL,'Thành Cổ Phượng Hoàng, Trương Gia Giới','Buffet sáng, Theo thực đơn','Cặp đôi, Gia đình nhiều thế hệ, Thanh niên','Quanh năm','Máy bay, Xe du lịch','Đã bao gồm trong giá tour','NNSGN392'),(7,NULL,NULL,'Bangkok',NULL,NULL,'Quanh năm',NULL,'Đã bao gồm ưu đãi trong giá tour','NNSGN138'),(8,NULL,NULL,'Grand World Phú Quốc, Thiền Viện Trúc Lâm Hộ Quốc, Chợ Đêm Phú Quốc','Theo thực đơn, Đặc sản địa phương','Gia đình nhiều thế hệ','Quanh năm','Máy bay, Xe du lịch','Đã bao gồm ưu đãi trong giá tour','NDSGN818'),(9,NULL,NULL,'Bảo tàng Làng Chài Xưa, Bùn khoáng Mũi Né, Bàu Trắng','Buffet sáng, Theo thực đơn, Đặc sản địa phương','Gia đình nhiều thế hệ','Quanh năm','Máy bay, Xe du lịch','Đã bao gồm ưu đãi trong giá tour','NDSGN556'),(10,NULL,NULL,'Đà Nẵng, Bà Nà Hills, Phố cổ Hội An','Buffet sáng, Theo thực đơn, Đặc sản địa phương','Gia đình nhiều thế hệ','Quanh năm','Máy bay, Xe du lịch','Đã bao gồm ưu đãi trong giá tour','NDSGN307'),(11,NULL,NULL,'Núi Fansipan, Sun World Fansipan Legend, Sapa','Buffet sáng, Theo thực đơn, Đặc sản địa phương','Gia đình nhiều thế hệ','Quanh năm','Máy bay, Xe du lịch','Đã bao gồm ưu đãi trong giá tour','NDSGN155'),(12,NULL,NULL,'Sapa, Núi Fansipan, Mộc Châu, Mù Cang Chải, Đèo Khau Phạ, Nghĩa Lộ, Bảo Tàng Điện Biên Phủ, Ruộng bậc thang, Sun World Fansipan Legend, Đèo Pha Đin','Buffet sáng, Theo thực đơn','Cặp đôi, Gia đình nhiều thế hệ, Thanh niên','Quanh năm','Máy bay, Xe du lịch','Đã bao gồm trong giá tour','NDSGN1733'),(13,NULL,NULL,'Bãi Sao, Chợ Đêm Phú Quốc, Hòn Thơm - Cáp Treo, Hòn Thơm - Công Viên Nước Aquatopia, Sunset Town - Quảng Trường La Mã','Theo thực đơn','Cặp đôi, Gia đình nhiều thế hệ, Thanh niên','Quanh năm','Máy bay, Xe du lịch','Đã bao gồm trong giá tour','NDSGN871'),(14,NULL,NULL,'Hòn Thơm - Cáp Treo, Grand World Phú Quốc, Vinpearl Safari, Công Viên Chủ Đề VinWonders','Buffet sáng, Theo thực đơn, Đặc sản địa phương','Cặp đôi, Gia đình nhiều thế hệ, Thanh niên','Quanh năm','Máy bay, Xe du lịch','Đã bao gồm trong giá tour','NDSGN879'),(15,NULL,NULL,'Đại Tượng Phật Di Lặc Bằng Đá Sa Thạch, Tượng Phật Bà “Tây Bổ Đà Sơn”, Chùa Hang 1, Cột mốc 986m - Núi Bà Đen, Sun World Ba Den Mountain (tuyến cáp treo Vân Sơn), Chùa Hang','Theo thực đơn','Cặp đôi, Gia đình nhiều thế hệ, Thanh niên','Quanh năm','Máy bay, Xe du lịch','Đã bao gồm trong giá tour','NDSGN880'),(16,NULL,NULL,'Grand World Phú Quốc, Thiền Viện Trúc Lâm Hộ Quốc, Chợ Đêm Phú Quốc','Theo thực đơn, Đặc sản địa phương','Gia đình nhiều thế hệ','Quanh năm','Máy bay, Xe du lịch','Đã ưu đãi trực tiếp vào giá tour','NDSGN818'),(17,NULL,NULL,'Đà Nẵng, Bà Nà Hills, Phố cổ Hội An','Buffet sáng, Theo thực đơn, Đặc sản địa phương','Cặp đôi, Gia đình nhiều thế hệ, Thanh niên','Quanh năm','Máy bay, Xe du lịch','Đã ưu đãi trực tiếp vào giá tour','NDSGN307'),(18,NULL,NULL,'Bảo tàng Làng Chài Xưa, Bùn khoáng Mũi Né, Bàu Trắng','Buffet sáng, Theo thực đơn, Đặc sản địa phương','Cặp đôi, Gia đình nhiều thế hệ, Thanh niên','quanh năm','Xe du lịch','đã bao gồm ưu đãi trong giá tour','NDSGN556'),(19,NULL,NULL,'Bangkok',NULL,NULL,'quanh năm',NULL,'đã bao gồm ưu đãi trong giá tour','NNSGN138'),(20,NULL,NULL,'Thành Cổ Phượng Hoàng, Trương Gia Giới','Buffet sáng, Theo thực đơn','Cặp đôi, Gia đình nhiều thế hệ, Thanh niên','Quanh năm','Máy bay, Xe du lịch','Đã bao gồm trong giá tour','NNSGN392');
/*!40000 ALTER TABLE `tour_detail` ENABLE KEYS */;
UNLOCK TABLES;


DROP TABLE IF EXISTS `tour_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tour_order` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `total_price` double DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `order_date` datetime NOT NULL,
  `total_member` int DEFAULT NULL,
  `user_Id` int unsigned DEFAULT NULL,
  `tour_Id` varchar(30) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`user_Id`),
  KEY `tourId` (`tour_Id`),
  CONSTRAINT `tour_order_ibfk_1` FOREIGN KEY (`user_Id`) REFERENCES `user` (`id`),
  CONSTRAINT `tour_order_ibfk_2` FOREIGN KEY (`tour_Id`) REFERENCES `tour` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


LOCK TABLES `tour_order` WRITE;
/*!40000 ALTER TABLE `tour_order` DISABLE KEYS */;
/*!40000 ALTER TABLE `tour_order` ENABLE KEYS */;
UNLOCK TABLES;


DROP TABLE IF EXISTS `tour_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tour_type` (
  `id` int unsigned NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `tour_type` WRITE;
/*!40000 ALTER TABLE `tour_type` DISABLE KEYS */;
INSERT INTO `tour_type` VALUES (1,'Tiết Kiệm'),(2,'Giá tốt'),(3,'Tiêu chuẩn'),(4,'Cao cấp');
/*!40000 ALTER TABLE `tour_type` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `transport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transport` (
  `id` int unsigned NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


LOCK TABLES `transport` WRITE;
/*!40000 ALTER TABLE `transport` DISABLE KEYS */;
INSERT INTO `transport` VALUES (1,'Xe'),(2,'Máy bay');
/*!40000 ALTER TABLE `transport` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_name` varchar(60) NOT NULL,
  `pass_word` varchar(60) NOT NULL,
  `name` varchar(30) NOT NULL,
  `phone_number` varchar(11) DEFAULT NULL,
  `email` varchar(40) DEFAULT NULL,
  `address` varchar(60) DEFAULT NULL,
  `role` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'vinhne004','12345678','Vinh','0956463116','khanhvinh24@gmail.com','Da Nang',0),(2,'tungne004','01234567','Tung','0344509700','vantung24@gmail.com','Nam Dinh',0),(3,'tungpv','tungpv123','Tung','0344508700','tungpv140904@gmail.com','Hà Nội',0),(4,'tungpv','tung2004','Tung','0999999999','tungpham123@gmail.com','Ha Noi',0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_tour_order`
--

DROP TABLE IF EXISTS `user_tour_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_tour_order` (
  `user_Id` int unsigned NOT NULL,
  `tour_order_Id` int unsigned NOT NULL,
  `status` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`user_Id`,`tour_order_Id`),
  KEY `tourOrderId` (`tour_order_Id`),
  CONSTRAINT `user_tour_order_ibfk_1` FOREIGN KEY (`user_Id`) REFERENCES `user` (`id`),
  CONSTRAINT `user_tour_order_ibfk_2` FOREIGN KEY (`tour_order_Id`) REFERENCES `tour_order` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_tour_order`
--

LOCK TABLES `user_tour_order` WRITE;
/*!40000 ALTER TABLE `user_tour_order` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_tour_order` ENABLE KEYS */;
UNLOCK TABLES;



DROP TABLE IF EXISTS `voucher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `voucher` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `voucher_name` varchar(255) DEFAULT NULL,
  `value` int DEFAULT NULL,
  `type` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `voucher` WRITE;
/*!40000 ALTER TABLE `voucher` DISABLE KEYS */;
INSERT INTO `voucher` VALUES (1,'3TV1',10,0),(2,'3TV2',30,0),(3,'3TV3',500000,1);
/*!40000 ALTER TABLE `voucher` ENABLE KEYS */;
UNLOCK TABLES;


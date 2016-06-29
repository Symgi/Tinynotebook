-- MySQL dump 10.16  Distrib 10.1.14-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: tinynotebook
-- ------------------------------------------------------
-- Server version	10.1.14-MariaDB-1~trusty

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `category` varchar(255) NOT NULL,
  `cid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uid` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`cid`),
  UNIQUE KEY `category` (`category`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES ('test',1,NULL),('Colors',2,NULL),('Babynotes',3,NULL),('Testnotes2',4,NULL),('Linux',5,NULL);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notes`
--

DROP TABLE IF EXISTS `notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notes` (
  `nid` int(30) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `note` mediumtext NOT NULL,
  `uid` varchar(255) DEFAULT NULL,
  `cid` int(10) unsigned DEFAULT NULL,
  `time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`nid`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notes`
--

LOCK TABLES `notes` WRITE;
/*!40000 ALTER TABLE `notes` DISABLE KEYS */;
INSERT INTO `notes` VALUES (1,'Something','<p><ins class=\"ice-ins ice-cts\" data-changedata=\"\" data-cid=\"2\" data-last-change-time=\"1463306184432\" data-time=\"1463306184432\" data-userid=\"\" data-username=\"\"><img alt=\"\" src=\"/nn/fileman/Uploads/1914883_885686101544070_50640156.jpg\" style=\"width: 720px; height: 960px;\" /></ins>testtext</p>\r\n',NULL,1,'2016-05-22 11:19:42'),(2,'uncat2','<p>testtextsdfdf</p>',NULL,NULL,'2016-05-22 11:19:42'),(3,'for blue','<p>testtext for<span style=\"background-color: #993300;\"> some</span> <span style=\"background-color: #99cc00;\">blue</span> color</p>',NULL,2,'2016-05-22 11:19:42'),(4,'Uncat1','<p>testtext</p>',NULL,NULL,'2016-05-22 11:19:42'),(5,'thisisthetitle','<p><ins class=\"ice-ins ice-cts\" data-changedata=\"\" data-cid=\"50\" data-last-change-time=\"1463344076262\" data-time=\"1463344070359\" data-userid=\"\" data-username=\"\">You can write some note</ins></p>\r\n\r\n<p>insert <span style=\"color: #008000;\">images☑</span>,<span style=\"color: #800080;\">tables☑</span>, <span style=\"color: #008080;\">checklists</span>☑,...</p>\r\n\r\n<p><img height=\"217\" src=\"http://i.imgur.com/gTDnUiY.jpg\" width=\"385\" /></p>\r\n\r\n<ul>\r\n	<li>it<ins class=\"ice-ins ice-cts\" data-changedata=\"\" data-cid=\"2\" data-last-change-time=\"1467239180211\" data-time=\"1467239180211\" data-userid=\"\" data-username=\"\"><input checked=\"checked\" name=\"test\" onclick=\"gtest()\" type=\"checkbox\" /></ins></li>\r\n	<li>works</li>\r\n</ul>\r\n\r\n<table border=\"1\">\r\n	<tbody>\r\n		<tr style=\"height: 13.6667px;\">\r\n			<td style=\"height: 13.6667px;\">Tables</td>\r\n			<td style=\"height: 13.6667px; background-color: #fc8f28;\">&nbsp;</td>\r\n			<td style=\"height: 13.6667px; background-color: #d3d968;\">&nbsp;</td>\r\n		</tr>\r\n		<tr style=\"height: 13px;\">\r\n			<td style=\"height: 13px; background-color: #5e8c49;\">&nbsp;</td>\r\n			<td style=\"height: 13px;\">Works</td>\r\n			<td style=\"height: 13px; background-color: #71d658;\">&nbsp;</td>\r\n		</tr>\r\n		<tr style=\"height: 13px;\">\r\n			<td style=\"height: 13px; background-color: #8fa8eb;\">&nbsp;</td>\r\n			<td style=\"height: 13px; background-color: #b55959;\">&nbsp;</td>\r\n			<td style=\"height: 13px;\">Too</td>\r\n		</tr>\r\n	</tbody>\r\n</table>\r\n',NULL,4,'2016-06-29 22:26:41'),(6,'Newtitle','<p>New test showing difference</p>',NULL,1,'2016-05-22 11:19:42'),(7,'Terminal','<pre style=\"background-color: #dda0dd;\"> <strong>7z a basic.7z basic</strong></pre><br><pre style=\"background-color: #dda0dd;\"><code><span class=\"pln\">mysqldump </span><span class=\"pun\">-</span><span class=\"pln\">u</span><span class=\"pun\">...</span><span class=\"pln\"> </span><span class=\"pun\">-</span><span class=\"pln\">p</span><span class=\"pun\">...</span><span class=\"pln\"> mydb t1 t2 t3 </span><span class=\"pun\">&gt;</span><span class=\"pln\"> mydb_tables</span><span class=\"pun\">.</span><span class=\"pln\">sql</span></code></pre><pre style=\"\" class=\"lang-sql prettyprint prettyprinted\"><code><span class=\"pln\"><br></span><span class=\"pln\"></span></code></pre>test<strong>save2<br></strong>',NULL,5,'2016-06-29 23:18:23');
/*!40000 ALTER TABLE `notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `uid` int(10) unsigned NOT NULL,
  `sid` varchar(64) NOT NULL,
  `hostname` varchar(128) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `cache` int(11) DEFAULT NULL,
  `session` varchar(90) DEFAULT NULL,
  `useragent` varchar(255) DEFAULT NULL,
  `sd` int(40) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`sd`)
) ENGINE=MyISAM AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES (1,'cidlo0c3oee353p42poib2mui7','127.0.0.1','2016-05-22 22:13:54',NULL,NULL,NULL,17),(1,'8c5ob3h4vb6dt1iuj41a3t7ld1','217.170.199.154','2016-05-23 22:26:35',NULL,NULL,NULL,18),(1,'8c5ob3h4vb6dt1iuj41a3t7ld1','217.170.199.154','2016-05-23 22:27:13',NULL,NULL,NULL,19),(1,'ek93rufo3n0u63uerfmtvfpcs4','217.170.199.241','2016-06-29 23:12:44',NULL,NULL,NULL,24),(1,'3q5ng0dkslc13ompipdof5qke6','217.170.199.241','2016-06-29 21:42:57',NULL,NULL,NULL,23);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `uds` varchar(255) NOT NULL,
  `uid` int(20) unsigned NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `active` varchar(255) DEFAULT NULL,
  `quota` int(20) unsigned NOT NULL,
  `lastactive` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `activationcode` varchar(255) DEFAULT NULL,
  KEY `Index 1` (`uds`(191),`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('admintest123',1,'admin@bibleway.us','9305eb350dfcf28a288c60c92e6ddf7f802c4c649dc39cb75ca50268354a4b08f6187c066d73686863bbfe0676d30c39d4640c6bd7bc07f7523b559be87eca2d','1',2000,'2016-05-22 16:01:29','testact');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-06-30  1:20:56

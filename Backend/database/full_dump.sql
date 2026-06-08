
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `learn_x_change` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `learn_x_change`;
DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `calendar_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calendar_events` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` enum('session','course','meeting','deadline','reminder','event') COLLATE utf8mb4_unicode_ci NOT NULL,
  `starts_at` datetime NOT NULL,
  `ends_at` datetime DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `color` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'scheduled',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `calendar_events_user_id_foreign` (`user_id`),
  CONSTRAINT `calendar_events_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `calendar_events` WRITE;
/*!40000 ALTER TABLE `calendar_events` DISABLE KEYS */;
INSERT INTO `calendar_events` VALUES (1,2,'Course Deadline','Data Analysis','deadline','2026-06-14 23:59:44','2026-06-15 01:59:44',NULL,'yellow','scheduled','2026-06-07 18:45:44','2026-06-07 18:45:44'),(2,2,'Meeting with Karim','Group discussion','meeting','2026-06-12 19:00:44','2026-06-12 21:00:44',NULL,'blue','scheduled','2026-06-07 18:45:44','2026-06-07 18:45:44'),(3,2,'Feedback Meeting','Group Session','meeting','2026-06-23 18:30:44','2026-06-23 20:30:44',NULL,'pink','scheduled','2026-06-07 18:45:44','2026-06-07 18:45:44'),(4,2,'Photoshop Class','With Ahmed','course','2026-06-28 16:00:44','2026-06-28 18:00:44',NULL,'green','scheduled','2026-06-07 18:45:44','2026-06-07 18:45:44');
/*!40000 ALTER TABLE `calendar_events` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `calendar_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calendar_sessions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `instructor_id` bigint unsigned NOT NULL,
  `student_id` bigint unsigned NOT NULL,
  `partner_id` bigint unsigned DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'session',
  `starts_at` datetime NOT NULL,
  `ends_at` datetime DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'scheduled',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `calendar_sessions_student_id_foreign` (`student_id`),
  KEY `calendar_sessions_partner_id_foreign` (`partner_id`),
  KEY `calendar_sessions_instructor_id_student_id_starts_at_index` (`instructor_id`,`student_id`,`starts_at`),
  CONSTRAINT `calendar_sessions_instructor_id_foreign` FOREIGN KEY (`instructor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `calendar_sessions_partner_id_foreign` FOREIGN KEY (`partner_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `calendar_sessions_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `calendar_sessions` WRITE;
/*!40000 ALTER TABLE `calendar_sessions` DISABLE KEYS */;
INSERT INTO `calendar_sessions` VALUES (1,4,2,NULL,'UI/UX Feedback Session','session','2026-06-17 18:00:44','2026-06-17 19:00:44','scheduled','2026-06-07 18:45:44','2026-06-07 18:45:44'),(2,4,2,NULL,'English Speaking Practice','session','2026-06-19 20:00:44','2026-06-19 21:00:44','scheduled','2026-06-07 18:45:44','2026-06-07 18:45:44'),(3,4,2,NULL,'Python Q&A Session','session','2026-06-21 19:00:44','2026-06-21 20:00:44','scheduled','2026-06-07 18:45:44','2026-06-07 18:45:44'),(4,4,2,NULL,'Data Science Workshop','session','2026-06-27 17:00:44','2026-06-27 18:00:44','scheduled','2026-06-07 18:45:44','2026-06-07 18:45:44');
/*!40000 ALTER TABLE `calendar_sessions` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `course_lessons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_lessons` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `section_id` bigint unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('video','article','quiz') COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'published',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `course_lessons_section_id_foreign` (`section_id`),
  CONSTRAINT `course_lessons_section_id_foreign` FOREIGN KEY (`section_id`) REFERENCES `course_sections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `course_lessons` WRITE;
/*!40000 ALTER TABLE `course_lessons` DISABLE KEYS */;
/*!40000 ALTER TABLE `course_lessons` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `course_outcomes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_outcomes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `course_id` bigint unsigned NOT NULL,
  `outcome` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `course_outcomes_course_id_foreign` (`course_id`),
  CONSTRAINT `course_outcomes_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `course_outcomes` WRITE;
/*!40000 ALTER TABLE `course_outcomes` DISABLE KEYS */;
/*!40000 ALTER TABLE `course_outcomes` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `course_sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_sections` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `course_id` bigint unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `course_sections_course_id_foreign` (`course_id`),
  CONSTRAINT `course_sections_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `course_sections` WRITE;
/*!40000 ALTER TABLE `course_sections` DISABLE KEYS */;
/*!40000 ALTER TABLE `course_sections` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `teacher_id` bigint unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `capacity` int DEFAULT NULL,
  `duration` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_date` date DEFAULT NULL,
  `ended_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `courses_teacher_id_foreign` (`teacher_id`),
  CONSTRAINT `courses_teacher_id_foreign` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,4,'Complete Python Bootcamp','Programming','Learn Python from scratch. Covers basics, OOP, file handling, APIs, and data science foundations. Perfect for absolute beginners.',0.00,50,'8 weeks','2026-05-01','2026-06-30','2026-06-07 17:38:38','2026-06-07 17:38:38'),(2,4,'Web Development with React & Next.js','Programming','Master modern frontend development using React 18 and Next.js 14. Build real-world projects with TypeScript and Tailwind CSS.',299.00,30,'10 weeks','2026-05-10','2026-07-20','2026-06-07 17:38:38','2026-06-07 17:38:38'),(3,4,'UI/UX Design Fundamentals','Design','Learn design thinking, wireframing, prototyping in Figma, and usability principles. Create stunning user interfaces from scratch.',199.00,25,'6 weeks','2026-05-15','2026-06-25','2026-06-07 17:38:38','2026-06-07 17:38:38'),(4,4,'Digital Marketing Mastery','Marketing','SEO, social media marketing, email campaigns, Google Ads, and analytics. Grow any business online with proven strategies.',149.00,40,'5 weeks','2026-05-20','2026-06-24','2026-06-07 17:38:38','2026-06-07 17:38:38'),(5,4,'Arabic Language for Beginners','Languages','Start speaking Arabic from day one. Covers Modern Standard Arabic (MSA) and conversational Egyptian dialect with native speaker recordings.',0.00,60,'12 weeks','2026-06-01','2026-08-24','2026-06-07 17:38:38','2026-06-07 17:38:38'),(6,4,'Data Science with Python & Pandas','Data Science','Analyze real datasets using Python, Pandas, NumPy, Matplotlib and Seaborn. Includes 5 hands-on projects with real-world data.',349.00,20,'8 weeks','2026-05-25','2026-07-20','2026-06-07 17:38:38','2026-06-07 17:38:38'),(7,4,'Photography: From Auto to Manual','Photography','Master your DSLR or mirrorless camera. Learn composition, lighting, exposure triangle, portrait and landscape photography.',99.00,30,'4 weeks','2026-06-01','2026-06-29','2026-06-07 17:38:38','2026-06-07 17:38:38'),(8,4,'English Speaking & Pronunciation','Languages','Improve your English fluency, reduce your accent and gain confidence in professional and casual conversations.',0.00,50,'6 weeks','2026-06-05','2026-07-17','2026-06-07 17:38:38','2026-06-07 17:38:38'),(9,4,'Machine Learning A-Z','Data Science','Supervised and unsupervised learning, neural networks, and model evaluation. Hands-on with scikit-learn and TensorFlow.',499.00,15,'14 weeks','2026-05-01','2026-08-07','2026-06-07 17:38:38','2026-06-07 17:38:38'),(10,4,'Graphic Design with Adobe Illustrator','Design','Learn vector design, logo creation, brand identity, and print design. Build a professional design portfolio by the end.',179.00,25,'7 weeks','2026-05-18','2026-07-06','2026-06-07 17:38:38','2026-06-07 17:38:38');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enrollments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `course_id` bigint unsigned NOT NULL,
  `status` enum('enrolled','completed','wishlist') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'enrolled',
  `progress` tinyint unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `enrollments_user_id_course_id_unique` (`user_id`,`course_id`),
  KEY `enrollments_course_id_foreign` (`course_id`),
  CONSTRAINT `enrollments_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `enrollments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `enrollments` WRITE;
/*!40000 ALTER TABLE `enrollments` DISABLE KEYS */;
INSERT INTO `enrollments` VALUES (1,3,1,'wishlist',0,'2026-06-07 18:03:23','2026-06-07 18:26:48'),(2,3,3,'enrolled',0,'2026-06-07 18:04:16','2026-06-07 18:04:16'),(3,3,7,'enrolled',0,'2026-06-07 18:28:18','2026-06-07 18:28:18'),(4,3,9,'enrolled',0,'2026-06-07 18:39:32','2026-06-07 18:39:32'),(5,2,1,'enrolled',45,'2026-06-07 18:53:42','2026-06-07 18:53:42'),(6,2,3,'enrolled',70,'2026-06-07 18:53:42','2026-06-07 18:53:42'),(7,2,5,'enrolled',20,'2026-06-07 18:53:42','2026-06-07 18:53:42'),(18,10,2,'enrolled',0,'2026-06-07 23:02:42','2026-06-07 23:02:42');
/*!40000 ALTER TABLE `enrollments` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `exchanges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exchanges` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `requester_id` bigint unsigned NOT NULL,
  `partner_id` bigint unsigned NOT NULL,
  `requester_skill_id` bigint unsigned NOT NULL,
  `partner_skill_id` bigint unsigned NOT NULL,
  `status` enum('pending','accepted','rejected','completed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `message` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exchanges_requester_id_foreign` (`requester_id`),
  KEY `exchanges_partner_id_foreign` (`partner_id`),
  KEY `exchanges_requester_skill_id_foreign` (`requester_skill_id`),
  KEY `exchanges_partner_skill_id_foreign` (`partner_skill_id`),
  CONSTRAINT `exchanges_partner_id_foreign` FOREIGN KEY (`partner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `exchanges_partner_skill_id_foreign` FOREIGN KEY (`partner_skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE,
  CONSTRAINT `exchanges_requester_id_foreign` FOREIGN KEY (`requester_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `exchanges_requester_skill_id_foreign` FOREIGN KEY (`requester_skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `exchanges` WRITE;
/*!40000 ALTER TABLE `exchanges` DISABLE KEYS */;
INSERT INTO `exchanges` VALUES (1,6,2,4,1,'pending','Hi! I can teach you English, can you teach me Python?','2026-06-07 20:33:33','2026-06-07 22:33:33'),(2,3,2,12,1,'pending','Let us exchange Figma for Python!','2026-06-07 17:33:33','2026-06-07 22:33:33'),(3,2,4,1,3,'pending','I can teach Python in exchange for UI/UX lessons!','2026-06-06 22:33:33','2026-06-07 22:33:33'),(4,2,6,1,14,'accepted','Lets do it!','2026-06-05 22:33:33','2026-06-07 22:33:33'),(5,9,8,8,1,'accepted','Hello','2026-06-07 22:46:32','2026-06-07 22:47:13'),(6,11,10,11,4,'accepted','Hello','2026-06-07 23:00:39','2026-06-07 23:01:03');
/*!40000 ALTER TABLE `exchanges` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sender_id` bigint unsigned NOT NULL,
  `receiver_id` bigint unsigned NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `messages_sender_id_foreign` (`sender_id`),
  KEY `messages_receiver_id_foreign` (`receiver_id`),
  CONSTRAINT `messages_receiver_id_foreign` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `messages_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_05_28_183423_add_role_to_users_table',1),(5,'2026_05_28_191115_add_fields_to_users_table',1),(6,'2026_05_28_191636_add_learning_goal_to_users_table',1),(7,'2026_05_29_013720_create_teacher_verifications_table',1),(8,'2026_05_29_013728_create_teacher_profiles_table',1),(9,'2026_05_29_025355_make_teacher_fields_nullable_in_users_table',1),(10,'2026_05_29_104549_make_date_of_birth_nullable_in_users_table',1),(11,'2026_05_29_141444_create_courses_table',1),(12,'2026_05_29_144436_create_reviews_table',1),(13,'2026_05_29_144910_create_payments_table',1),(14,'2026_05_29_152641_create_reports_table',1),(15,'2026_05_30_115248_create_personal_access_tokens_table',1),(16,'2026_05_30_190125_create_enrollments_table',1),(17,'2026_05_30_210730_add_category_to_courses_table',1),(18,'2026_05_31_002807_create_skills_table',1),(19,'2026_05_31_002829_create_user_skills_table',1),(20,'2026_05_31_010235_create_verifications_table',1),(21,'2026_05_31_010823_create_payment_methods_table',1),(22,'2026_05_31_035336_create_messages_table',1),(23,'2026_05_31_035451_create_user_notifications_table',1),(24,'2026_05_31_043057_create_exchanges_table',1),(25,'2026_06_02_000002_create_points_ledger_table',1),(26,'2026_06_02_000003_create_reward_redemptions_table',1),(27,'2026_06_03_020143_create_calendar_events_table',1),(28,'2026_06_03_020606_create_sessions_table',1),(29,'2026_06_03_023734_create_calendar_sessions_table',1),(30,'2026_06_06_102005_create_course_sections_table',1),(31,'2026_06_06_102038_create_course_lessons_table',1),(32,'2026_06_06_102113_create_course_outcomes_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `payment_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_methods` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `method` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `iban` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payment_methods_user_id_unique` (`user_id`),
  CONSTRAINT `payment_methods_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `payment_methods` WRITE;
/*!40000 ALTER TABLE `payment_methods` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment_methods` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `currency` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'EGP',
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `service_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `service_id` bigint unsigned NOT NULL,
  `date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `payments_user_id_foreign` (`user_id`),
  KEY `payments_service_type_service_id_index` (`service_type`,`service_id`),
  CONSTRAINT `payments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,4,179.00,'card','EGP','completed','course',10,'2026-06-07','2026-06-07 18:35:46','2026-06-07 18:35:46'),(2,3,499.00,'card','EGP','completed','course',9,'2026-06-07','2026-06-07 18:39:31','2026-06-07 18:39:31'),(7,10,299.00,'card','EGP','completed','course',2,'2026-06-08','2026-06-07 23:02:40','2026-06-07 23:02:40');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\User',1,'auth_token','966869db2455d6971f37db7f19a7005d307d71498c109239753ec2acb949ac7b','[\"*\"]',NULL,NULL,'2026-06-07 17:32:10','2026-06-07 17:32:10'),(2,'App\\Models\\User',1,'auth_token','7fb33fc076e5b8654bb05ca40f59e5022ece3b211b6c92a2bfb874c22a377d4f','[\"*\"]',NULL,NULL,'2026-06-07 17:32:22','2026-06-07 17:32:22'),(3,'App\\Models\\User',2,'auth_token','c5343504bb8d01eb554fcde88567878b4b0791abad8de9b8496156077fb7e1a9','[\"*\"]',NULL,NULL,'2026-06-07 17:33:32','2026-06-07 17:33:32'),(4,'App\\Models\\User',3,'auth_token','7fbf228bf83e14deaf86a5b84226d253250428ff31c2c79b05ffbe394d61aa04','[\"*\"]','2026-06-07 18:51:40',NULL,'2026-06-07 17:36:40','2026-06-07 18:51:40'),(5,'App\\Models\\User',4,'auth_token','ea144e3b84d64fde96ec0d986f45214bb2569fade7f7064e0f7027bed1bfb4b8','[\"*\"]','2026-06-07 17:41:09',NULL,'2026-06-07 17:40:54','2026-06-07 17:41:09'),(6,'App\\Models\\User',4,'auth_token','b88e05774353d78c365bdda428171759fa03855c7100cc542af6e06cd0440976','[\"*\"]','2026-06-07 18:35:46',NULL,'2026-06-07 18:35:33','2026-06-07 18:35:46'),(7,'App\\Models\\User',7,'auth_token','dc0feeb354d8dafeb78ca2b5bcfeeb1ed1ffc7828692d13a3c6d799f24070990','[\"*\"]','2026-06-07 22:11:08',NULL,'2026-06-07 18:57:26','2026-06-07 22:11:08'),(8,'App\\Models\\User',7,'auth_token','c696aaa3606ae734a5303e6dc990c0481d6ea526f1971e847adb8825bed1851f','[\"*\"]','2026-06-07 21:15:41',NULL,'2026-06-07 19:49:03','2026-06-07 21:15:41'),(9,'App\\Models\\User',5,'auth_token','04861d4db030db0c297cac7408afeceac979efc1531641ed5ec5ce58c9091b26','[\"*\"]','2026-06-07 22:15:11',NULL,'2026-06-07 22:11:15','2026-06-07 22:15:11'),(10,'App\\Models\\User',5,'auth_token','52850b708e5f8fd197138978d18e778f7bf30a4990633b3d7086d2601f8c44b3','[\"*\"]','2026-06-07 22:27:36',NULL,'2026-06-07 22:15:23','2026-06-07 22:27:36'),(11,'App\\Models\\User',5,'auth_token','02905b8f32b9ca645ee3c732ea0a7693ac851bb6e651e681243b6f94e1d24521','[\"*\"]','2026-06-07 22:26:26',NULL,'2026-06-07 22:26:24','2026-06-07 22:26:26'),(12,'App\\Models\\User',5,'auth_token','7950c09fb13c128064e0ef6f58e4afb3d9c6c692a8b2bafbc08a732b1a923ca2','[\"*\"]','2026-06-07 22:27:44',NULL,'2026-06-07 22:27:42','2026-06-07 22:27:44'),(13,'App\\Models\\User',3,'auth_token','a8a89e22c9c0bea40663255d9d72da8f9b4b2a4a30a53e86dd4858efbb07d4c8','[\"*\"]','2026-06-07 22:28:29',NULL,'2026-06-07 22:28:25','2026-06-07 22:28:29'),(14,'App\\Models\\User',4,'auth_token','01c35aa8d9c9ec1ca1f7dc2f5eec0bcd7bdc52f4aa0e4fb23d17206d027c2a06','[\"*\"]','2026-06-07 22:29:21',NULL,'2026-06-07 22:28:52','2026-06-07 22:29:21'),(15,'App\\Models\\User',6,'auth_token','81e52e72f20377ed1b4fe5816fcc910e95879a93077c2b1877d428beb0da8aea','[\"*\"]','2026-06-07 22:29:50',NULL,'2026-06-07 22:29:45','2026-06-07 22:29:50'),(16,'App\\Models\\User',6,'auth_token','8a1550cf0484c6d334738ae75d4475fabb4f8606f2750e1e292c711e2fb72e43','[\"*\"]','2026-06-07 22:30:59',NULL,'2026-06-07 22:29:47','2026-06-07 22:30:59'),(17,'App\\Models\\User',5,'auth_token','be19a5d34c79d6a08a0d0e728b1f06ea400a451604c9103d4a583313eb053eba','[\"*\"]','2026-06-07 22:37:05',NULL,'2026-06-07 22:31:07','2026-06-07 22:37:05'),(18,'App\\Models\\User',3,'auth_token','82ae5911313ad8f05672fd55ebd4f34befa7296054fd57a73421d7a05a6532ac','[\"*\"]','2026-06-07 22:37:24',NULL,'2026-06-07 22:37:08','2026-06-07 22:37:24'),(19,'App\\Models\\User',3,'auth_token','f19c599d292ecf213be820a12a6ebcbe7cd21068e8fa7a4943518a4abf0517b3','[\"*\"]','2026-06-07 22:42:04',NULL,'2026-06-07 22:37:37','2026-06-07 22:42:04'),(20,'App\\Models\\User',8,'auth_token','38161dba162b063aa782506cdc778a2256640321eb0cc6ec5bb160bd12fee9ef','[\"*\"]','2026-06-07 22:47:23',NULL,'2026-06-07 22:42:46','2026-06-07 22:47:23'),(21,'App\\Models\\User',9,'auth_token','74d00585ae8a142f76094c90a21292798d8868a8662953c3e6b566465883996b','[\"*\"]','2026-06-07 22:48:47',NULL,'2026-06-07 22:43:53','2026-06-07 22:48:47'),(22,'App\\Models\\User',10,'auth_token','4a4d6619b6257635c9542824be74911a50b5261cd9c691c6c2f6879c63a8a70c','[\"*\"]','2026-06-07 22:55:07',NULL,'2026-06-07 22:54:19','2026-06-07 22:55:07'),(23,'App\\Models\\User',11,'auth_token','d93015860371759d76e05137d2dab55ac7ab0e087271833761cdf1943f6e4ab2','[\"*\"]','2026-06-07 23:04:13',NULL,'2026-06-07 22:56:07','2026-06-07 23:04:13'),(24,'App\\Models\\User',10,'auth_token','65b5b220f26e343d955a03d84efdf12ca51ade34198d88eab6172bd49cf2e0f1','[\"*\"]','2026-06-07 23:05:50',NULL,'2026-06-07 22:58:01','2026-06-07 23:05:50'),(25,'App\\Models\\User',5,'auth_token','a83c6f934278efa11ecb98464eab8975f8982279d342f5faba569fa44c49deae','[\"*\"]','2026-06-07 23:07:24',NULL,'2026-06-07 23:05:53','2026-06-07 23:07:24'),(26,'App\\Models\\User',4,'auth_token','6d2d01696dbe48a74468598622b2001cfa857c78ee22334845b8d4c499d4dd97','[\"*\"]','2026-06-07 23:16:22',NULL,'2026-06-07 23:07:47','2026-06-07 23:16:22');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `points_ledger`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `points_ledger` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `source_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source_id` bigint unsigned DEFAULT NULL,
  `points` int NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `points_ledger_user_id_created_at_index` (`user_id`,`created_at`),
  KEY `points_ledger_user_id_index` (`user_id`),
  KEY `points_ledger_source_type_index` (`source_type`),
  KEY `points_ledger_source_id_index` (`source_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `points_ledger` WRITE;
/*!40000 ALTER TABLE `points_ledger` DISABLE KEYS */;
INSERT INTO `points_ledger` VALUES (1,2,'enrollment',1,500,'Enrolled in first course',NULL,'2026-06-02 18:55:32','2026-06-07 18:55:32'),(2,2,'lesson',1,250,'Completed first lesson',NULL,'2026-06-04 18:55:32','2026-06-07 18:55:32'),(3,2,'activity',0,500,'Active this week bonus',NULL,'2026-06-06 18:55:32','2026-06-07 18:55:32'),(4,7,'enrollment',1,500,'Enrolled in first course',NULL,'2026-06-04 19:05:41','2026-06-07 19:05:41'),(5,7,'activity',0,250,'Active learner bonus',NULL,'2026-06-06 19:05:41','2026-06-07 19:05:41'),(6,7,'reward_redemption',NULL,-300,'Redeemed reward: 10% Course Discount','{\"reward_code\": \"STUDENT_DISCOUNT_10\"}','2026-06-07 19:21:54','2026-06-07 19:21:54'),(7,7,'reward_redemption',NULL,-300,'Redeemed reward: 10% Course Discount','{\"reward_code\": \"STUDENT_DISCOUNT_10\"}','2026-06-07 19:49:34','2026-06-07 19:49:34'),(8,7,'test',0,1000,'Test points added (+1000)',NULL,'2026-06-07 19:53:19','2026-06-07 19:53:19'),(9,7,'reward_redemption',NULL,-750,'Redeemed reward: 25% Course Discount','{\"reward_code\": \"STUDENT_DISCOUNT_25\"}','2026-06-07 19:53:20','2026-06-07 19:53:20'),(10,7,'test',0,1000,'Test points added (+1000)',NULL,'2026-06-07 19:57:14','2026-06-07 19:57:14'),(11,7,'reward_redemption',NULL,-300,'Redeemed reward: 10% Course Discount','{\"reward_code\": \"STUDENT_DISCOUNT_10\"}','2026-06-07 19:57:51','2026-06-07 19:57:51'),(12,7,'reward_redemption',NULL,-750,'Redeemed reward: 25% Course Discount','{\"reward_code\": \"STUDENT_DISCOUNT_25\"}','2026-06-07 19:57:55','2026-06-07 19:57:55'),(13,7,'test',0,2000,'Test points added (+2000)',NULL,'2026-06-07 21:15:21','2026-06-07 21:15:21'),(14,7,'reward_redemption',NULL,-300,'Redeemed reward: 10% Course Discount','{\"reward_code\": \"STUDENT_DISCOUNT_10\"}','2026-06-07 21:15:22','2026-06-07 21:15:22'),(15,7,'test',0,1000,'Test points added (+1000)',NULL,'2026-06-07 21:16:35','2026-06-07 21:16:35'),(16,7,'reward_redemption',NULL,-300,'Redeemed reward: 10% Course Discount','{\"reward_code\": \"STUDENT_DISCOUNT_10\"}','2026-06-07 21:16:46','2026-06-07 21:16:46');
/*!40000 ALTER TABLE `points_ledger` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `course_id` bigint unsigned NOT NULL,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reports_user_id_foreign` (`user_id`),
  KEY `reports_course_id_foreign` (`course_id`),
  CONSTRAINT `reports_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reports_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `course_id` bigint unsigned NOT NULL,
  `rating` tinyint unsigned NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reviews_user_id_foreign` (`user_id`),
  KEY `reviews_course_id_foreign` (`course_id`),
  CONSTRAINT `reviews_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `reward_redemptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reward_redemptions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `reward_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `points` int NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'approved',
  `metadata` json DEFAULT NULL,
  `redeemed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reward_redemptions_user_id_created_at_index` (`user_id`,`created_at`),
  KEY `reward_redemptions_user_id_index` (`user_id`),
  KEY `reward_redemptions_reward_code_index` (`reward_code`),
  KEY `reward_redemptions_status_index` (`status`),
  KEY `reward_redemptions_redeemed_at_index` (`redeemed_at`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `reward_redemptions` WRITE;
/*!40000 ALTER TABLE `reward_redemptions` DISABLE KEYS */;
INSERT INTO `reward_redemptions` VALUES (1,7,'STUDENT_DISCOUNT_10','10% Course Discount',300,'approved','{\"description\": \"Get 10% off any paid course\"}','2026-06-07 19:21:54','2026-06-07 19:21:54','2026-06-07 19:21:54'),(2,7,'STUDENT_DISCOUNT_10','10% Course Discount',300,'approved','{\"description\": \"Get 10% off any paid course\"}','2026-06-07 19:49:34','2026-06-07 19:49:34','2026-06-07 19:49:34'),(3,7,'STUDENT_DISCOUNT_25','25% Course Discount',750,'approved','{\"description\": \"Get 25% off any paid course\"}','2026-06-07 19:53:20','2026-06-07 19:53:20','2026-06-07 19:53:20'),(4,7,'STUDENT_DISCOUNT_10','10% Course Discount',300,'approved','{\"description\": \"Get 10% off any paid course\"}','2026-06-07 19:57:51','2026-06-07 19:57:51','2026-06-07 19:57:51'),(5,7,'STUDENT_DISCOUNT_25','25% Course Discount',750,'approved','{\"description\": \"Get 25% off any paid course\"}','2026-06-07 19:57:55','2026-06-07 19:57:55','2026-06-07 19:57:55'),(6,7,'STUDENT_DISCOUNT_10','10% Course Discount',300,'used','{\"description\": \"Get 10% off any paid course\"}','2026-06-07 21:15:22','2026-06-07 21:15:22','2026-06-07 21:15:40'),(7,7,'STUDENT_DISCOUNT_10','10% Course Discount',300,'approved','{\"description\": \"Get 10% off any paid course\"}','2026-06-07 21:16:46','2026-06-07 21:16:46','2026-06-07 21:16:46');
/*!40000 ALTER TABLE `reward_redemptions` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skills` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `skills_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `skills` WRITE;
/*!40000 ALTER TABLE `skills` DISABLE KEYS */;
INSERT INTO `skills` VALUES (1,'Python','2026-06-07 21:25:48','2026-06-07 21:25:48'),(2,'JavaScript','2026-06-07 21:25:48','2026-06-07 21:25:48'),(3,'UI/UX Design','2026-06-07 21:25:48','2026-06-07 21:25:48'),(4,'English','2026-06-07 21:25:48','2026-06-07 21:25:48'),(5,'Arabic','2026-06-07 21:25:48','2026-06-07 21:25:48'),(6,'Data Science','2026-06-07 21:25:48','2026-06-07 21:25:48'),(7,'Photoshop','2026-06-07 21:25:48','2026-06-07 21:25:48'),(8,'Graphic Design','2026-06-07 21:25:48','2026-06-07 21:25:48'),(9,'Excel','2026-06-07 21:25:48','2026-06-07 21:25:48'),(10,'Machine Learning','2026-06-07 21:25:48','2026-06-07 21:25:48'),(11,'React','2026-06-07 21:25:48','2026-06-07 21:25:48'),(12,'Figma','2026-06-07 21:25:48','2026-06-07 21:25:48'),(13,'Statistics','2026-06-07 21:25:48','2026-06-07 21:25:48'),(14,'Marketing','2026-06-07 21:25:48','2026-06-07 21:25:48'),(15,'Photography','2026-06-07 21:25:48','2026-06-07 21:25:48');
/*!40000 ALTER TABLE `skills` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `teacher_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher_profiles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `experience` text COLLATE utf8mb4_unicode_ci,
  `qualifications` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `teacher_profiles_user_id_foreign` (`user_id`),
  CONSTRAINT `teacher_profiles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `teacher_profiles` WRITE;
/*!40000 ALTER TABLE `teacher_profiles` DISABLE KEYS */;
/*!40000 ALTER TABLE `teacher_profiles` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `teacher_verifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher_verifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `id_document` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `certificates` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `iban` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `teacher_verifications_user_id_foreign` (`user_id`),
  CONSTRAINT `teacher_verifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `teacher_verifications` WRITE;
/*!40000 ALTER TABLE `teacher_verifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `teacher_verifications` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `teaching_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teaching_sessions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `instructor_id` bigint unsigned NOT NULL,
  `student_id` bigint unsigned NOT NULL,
  `partner_id` bigint unsigned DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'session',
  `starts_at` datetime NOT NULL,
  `ends_at` datetime DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'scheduled',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `teaching_sessions_student_id_foreign` (`student_id`),
  KEY `teaching_sessions_partner_id_foreign` (`partner_id`),
  KEY `teaching_sessions_instructor_id_student_id_starts_at_index` (`instructor_id`,`student_id`,`starts_at`),
  CONSTRAINT `teaching_sessions_instructor_id_foreign` FOREIGN KEY (`instructor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `teaching_sessions_partner_id_foreign` FOREIGN KEY (`partner_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `teaching_sessions_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `teaching_sessions` WRITE;
/*!40000 ALTER TABLE `teaching_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `teaching_sessions` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `user_notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_notifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `body` text COLLATE utf8mb4_unicode_ci,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_notifications_user_id_foreign` (`user_id`),
  CONSTRAINT `user_notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `user_notifications` WRITE;
/*!40000 ALTER TABLE `user_notifications` DISABLE KEYS */;
INSERT INTO `user_notifications` VALUES (1,2,'New Exchange Match','Ahmed Hassan wants to exchange Python for UI/UX Design',0,'2026-06-07 18:44:47','2026-06-07 18:54:47'),(2,2,'Session Reminder','UI/UX Feedback Session starts in 1 hour',0,'2026-06-07 16:54:47','2026-06-07 18:54:47'),(3,2,'New Message','Ahmed Hassan sent you a message',1,'2026-06-07 15:54:47','2026-06-07 18:54:47'),(4,2,'New Exchange Match','Ahmed Hassan wants to exchange Python for UI/UX Design',0,'2026-06-07 18:45:32','2026-06-07 18:55:32'),(5,2,'Session Reminder','UI/UX Feedback Session starts in 1 hour',0,'2026-06-07 16:55:32','2026-06-07 18:55:32'),(6,2,'New Message','Ahmed Hassan sent you a message',1,'2026-06-07 15:55:32','2026-06-07 18:55:32');
/*!40000 ALTER TABLE `user_notifications` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `user_skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_skills` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `skill_id` bigint unsigned NOT NULL,
  `type` enum('teach','learn') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_skills_user_id_skill_id_type_unique` (`user_id`,`skill_id`,`type`),
  KEY `user_skills_skill_id_foreign` (`skill_id`),
  CONSTRAINT `user_skills_skill_id_foreign` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_skills_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `user_skills` WRITE;
/*!40000 ALTER TABLE `user_skills` DISABLE KEYS */;
INSERT INTO `user_skills` VALUES (1,2,1,'teach','2026-06-07 21:25:48','2026-06-07 21:25:48'),(2,2,3,'learn','2026-06-07 21:25:48','2026-06-07 21:25:48'),(3,4,3,'teach','2026-06-07 21:25:48','2026-06-07 21:25:48'),(4,4,4,'teach','2026-06-07 21:25:48','2026-06-07 21:25:48'),(5,4,1,'learn','2026-06-07 21:25:48','2026-06-07 21:25:48'),(6,4,9,'learn','2026-06-07 21:25:48','2026-06-07 21:25:48'),(7,6,4,'teach','2026-06-07 21:25:48','2026-06-07 21:25:48'),(8,6,8,'teach','2026-06-07 21:25:48','2026-06-07 21:25:48'),(9,6,1,'learn','2026-06-07 21:25:48','2026-06-07 21:25:48'),(10,6,3,'learn','2026-06-07 21:25:48','2026-06-07 21:25:48'),(19,6,9,'learn','2026-06-07 22:33:33','2026-06-07 22:33:33'),(20,6,14,'teach','2026-06-07 22:33:33','2026-06-07 22:33:33'),(21,3,12,'teach','2026-06-07 22:33:33','2026-06-07 22:33:33'),(22,3,1,'learn','2026-06-07 22:33:33','2026-06-07 22:33:33'),(23,8,1,'teach','2026-06-07 22:44:26','2026-06-07 22:44:26'),(24,8,2,'teach','2026-06-07 22:44:26','2026-06-07 22:44:26'),(25,8,12,'learn','2026-06-07 22:44:36','2026-06-07 22:44:36'),(26,8,8,'learn','2026-06-07 22:44:36','2026-06-07 22:44:36'),(27,9,12,'teach','2026-06-07 22:45:51','2026-06-07 22:45:51'),(28,9,8,'teach','2026-06-07 22:45:51','2026-06-07 22:45:51'),(29,9,2,'learn','2026-06-07 22:45:56','2026-06-07 22:45:56'),(30,9,1,'learn','2026-06-07 22:45:56','2026-06-07 22:45:56'),(31,10,13,'teach','2026-06-07 22:54:47','2026-06-07 22:54:47'),(32,10,9,'teach','2026-06-07 22:54:47','2026-06-07 22:54:47'),(33,10,4,'teach','2026-06-07 22:54:47','2026-06-07 22:54:47'),(34,10,11,'learn','2026-06-07 22:55:03','2026-06-07 22:55:03'),(35,11,11,'teach','2026-06-07 22:56:25','2026-06-07 22:56:25'),(36,11,14,'learn','2026-06-07 22:56:30','2026-06-07 22:56:30'),(37,11,13,'learn','2026-06-07 22:59:28','2026-06-07 22:59:28'),(38,11,4,'learn','2026-06-07 22:59:48','2026-06-07 22:59:48');
/*!40000 ALTER TABLE `user_skills` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_phone_unique` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Abdelrahman Emad','Abdelrahman@gmail.com',NULL,'$2y$12$mfSDWpA5cyFO/xJ6nZfa4ehqv6xxQHN9tdj/h0DDf2Yz9Gz1PhRhq',NULL,'2026-06-07 17:32:10','2026-06-07 17:32:10','learner','01000220869','male','2002-12-31'),(2,'Ahmed yehia','ahmedheyia@gmail.com',NULL,'$2y$12$L0M34mU/oAXUJbhhMyKFHuV4OzxXaQqW.HOD2popxIEiCxsQ1BrQ6',NULL,'2026-06-07 17:33:32','2026-06-07 17:33:32','learner','01232208691','male','2026-06-04'),(3,'Ahmed yehia','ahmedheyia1@gmail.com',NULL,'$2y$12$Zbv4Dc4i60HFR9kHwG30peS0Ikkh/b6UZFi8KgHZiW4QX.k3z8qR2',NULL,'2026-06-07 17:36:40','2026-06-07 17:36:40','learner','01232208692','male','2026-06-04'),(4,'Ahmed Hassan','teacher@learnxchange.com',NULL,'$2y$12$jnPn.ViPzX6mW4iqhHBb7eAMZlkzoDldorKYDOcs.3QsLGdNjGDDW',NULL,'2026-06-07 17:38:38','2026-06-07 17:38:38','teacher','01100000001','male','1990-05-15'),(5,'Admin','admin@learnxchange.com',NULL,'$2y$12$TLGtk9mBWfBqbtzraVMq5e4uXGlNDtz62YxYrmtjUsNLSgV7tqMqe',NULL,'2026-06-07 17:38:38','2026-06-07 17:38:38','admin','01100000002','male','1985-01-01'),(6,'Sara Exchange','exchange@learnxchange.com',NULL,'$2y$12$UJg8G.svcBk1s.UaaK2g8ueI49LqI/34htmhDT3OM9GIbRCBIQFya',NULL,'2026-06-07 18:53:18','2026-06-07 18:53:18','both','01100000003','female','1995-03-20'),(8,'Ali Programmer','ali@test.com',NULL,'$2y$12$MuA56VeqZDS7HxdTC0t/QOtJJpA8GMTwxWBGma9hSJ1KKalSCTarO',NULL,'2026-06-07 22:42:46','2026-06-07 22:42:46','learner','01200000001','male','2026-06-10'),(9,'Sara Designer','sara@test.com',NULL,'$2y$12$4XPHeVX4rXDRi6HJlUAIGujRp8ceRFyhtTEqyrwlZRfp5GKg1k3Oy',NULL,'2026-06-07 22:43:53','2026-06-07 22:43:53','learner','01200000002','female','2026-06-09'),(10,'essam marketing','essam@test.com',NULL,'$2y$12$JCSopSgbaxkiCduhbSugreMnEOm1gVWA2VFnYYDuXumN3FODB1JF2',NULL,'2026-06-07 22:54:19','2026-06-07 22:54:19','learner','01200000003','male','2026-06-09'),(11,'basmalla front','basmalla@test.com',NULL,'$2y$12$cHM8HvWhdxBOxJ0ex2NGyums1ZTpDRk.hpCBoGOxMOBevVd5NnwXK',NULL,'2026-06-07 22:56:07','2026-06-07 22:56:07','learner','01200000004','female','2026-06-25');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `verifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `verifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `id_document` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `certificates` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `iban` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `verifications_user_id_unique` (`user_id`),
  CONSTRAINT `verifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `verifications` WRITE;
/*!40000 ALTER TABLE `verifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `verifications` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;


-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 09, 2021 at 06:20 PM
-- Server version: 8.0.23-0ubuntu0.20.04.1
-- PHP Version: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vote`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `allow_login` tinyint(1) NOT NULL,
  `test_mode` tinyint(1) NOT NULL DEFAULT '1',
  `vote_complete` tinyint(1) NOT NULL,
  `vote_close_uid` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`allow_login`, `test_mode`, `vote_complete`, `vote_close_uid`) VALUES
(1, 1, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `ukey` bigint UNSIGNED NOT NULL,
  `c` int UNSIGNED NOT NULL,
  `l` int UNSIGNED NOT NULL,
  `status` int NOT NULL,
  `password` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fname` varbinary(60) NOT NULL,
  `lname` varbinary(60) NOT NULL,
  `email` varbinary(255) NOT NULL,
  `parent` bigint NOT NULL DEFAULT '0',
  `user_last_ip` char(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rsakey` blob,
  `seckey` varbinary(255) DEFAULT NULL,
  `apikey` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `watchurl` varbinary(255) DEFAULT NULL,
  `party` varbinary(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users_create_hold`
--

CREATE TABLE `users_create_hold` (
  `h_key` bigint UNSIGNED NOT NULL,
  `c` int UNSIGNED NOT NULL,
  `h_user_data` blob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `voter_ip_list`
--

CREATE TABLE `voter_ip_list` (
  `ip_id` char(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip_used` bigint UNSIGNED NOT NULL,
  `ip_valid` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vote_choice`
--

CREATE TABLE `vote_choice` (
  `vc_vid` char(65) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vc_choice` blob
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vote_choice_queue`
--

CREATE TABLE `vote_choice_queue` (
  `vc_vid` char(65) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `vc_choice` blob
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vote_csrf_tokens`
--

CREATE TABLE `vote_csrf_tokens` (
  `vcsrf_id` char(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `vcsrf_c` bigint UNSIGNED NOT NULL,
  `vcsrf_uid` bigint UNSIGNED NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vote_meta`
--

CREATE TABLE `vote_meta` (
  `v_key` bigint UNSIGNED NOT NULL,
  `l` int UNSIGNED NOT NULL,
  `v_uid` bigint UNSIGNED NOT NULL,
  `v_start_time_utc` int UNSIGNED NOT NULL,
  `v_stop_time_utc` int UNSIGNED NOT NULL,
  `v_ballot` text COLLATE utf8mb4_unicode_ci,
  `v_vu_count` int UNSIGNED NOT NULL,
  `v_vu_totals` text COLLATE utf8mb4_unicode_ci,
  `v_receipt_urls` text COLLATE utf8mb4_unicode_ci,
  `v_ck_country` char(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `v_ck_city` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `v_ck_state` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `v_ck_zip` char(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `v_ck_age` tinyint(1) NOT NULL,
  `v_ck_photo` tinyint(1) NOT NULL,
  `v_rq_tag` varbinary(255) DEFAULT NULL,
  `v_rq_voter_id` tinyint(1) NOT NULL,
  `v_rq_extra` char(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `v_show_fname` tinyint(1) NOT NULL,
  `v_show_lname` tinyint(1) NOT NULL,
  `v_show_mname` tinyint(1) NOT NULL,
  `v_show_bdate` tinyint(1) NOT NULL,
  `v_show_street` tinyint(1) NOT NULL,
  `v_show_street2` tinyint(1) NOT NULL,
  `v_show_city` tinyint(1) NOT NULL,
  `v_show_state` tinyint(1) NOT NULL,
  `v_show_zip` tinyint(1) NOT NULL,
  `v_show_country` tinyint(1) NOT NULL,
  `v_show_email` tinyint(1) NOT NULL,
  `v_show_phone` tinyint(1) NOT NULL,
  `v_open_vote` tinyint(1) NOT NULL,
  `v_running_total` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vote_party`
--

CREATE TABLE `vote_party` (
  `party_key` char(60) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vote_user_approve`
--

CREATE TABLE `vote_user_approve` (
  `vua_key` bigint UNSIGNED NOT NULL,
  `c` bigint NOT NULL,
  `l` bigint NOT NULL,
  `vua_ip` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vua_approve` char(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vua_approved` tinyint NOT NULL,
  `vua_vid` char(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vua_user` blob NOT NULL,
  `vua_ballot` blob,
  `vua_photo` mediumblob
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ukey`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `apikey` (`apikey`);

--
-- Indexes for table `users_create_hold`
--
ALTER TABLE `users_create_hold`
  ADD PRIMARY KEY (`h_key`);

--
-- Indexes for table `voter_ip_list`
--
ALTER TABLE `voter_ip_list`
  ADD PRIMARY KEY (`ip_id`);

--
-- Indexes for table `vote_choice`
--
ALTER TABLE `vote_choice`
  ADD PRIMARY KEY (`vc_vid`);

--
-- Indexes for table `vote_choice_queue`
--
ALTER TABLE `vote_choice_queue`
  ADD PRIMARY KEY (`vc_vid`);

--
-- Indexes for table `vote_csrf_tokens`
--
ALTER TABLE `vote_csrf_tokens`
  ADD PRIMARY KEY (`vcsrf_id`);

--
-- Indexes for table `vote_meta`
--
ALTER TABLE `vote_meta`
  ADD PRIMARY KEY (`v_key`);

--
-- Indexes for table `vote_party`
--
ALTER TABLE `vote_party`
  ADD PRIMARY KEY (`party_key`);

--
-- Indexes for table `vote_user_approve`
--
ALTER TABLE `vote_user_approve`
  ADD PRIMARY KEY (`vua_key`),
  ADD UNIQUE KEY `vua_vid` (`vua_vid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `ukey` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users_create_hold`
--
ALTER TABLE `users_create_hold`
  MODIFY `h_key` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vote_meta`
--
ALTER TABLE `vote_meta`
  MODIFY `v_key` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vote_user_approve`
--
ALTER TABLE `vote_user_approve`
  MODIFY `vua_key` bigint UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

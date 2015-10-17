-- phpMyAdmin SQL Dump
-- version 4.3.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jul 15, 2015 at 06:40 AM
-- Server version: 5.6.24
-- PHP Version: 5.5.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `brokersumo`
--
CREATE DATABASE IF NOT EXISTS `brokersumo` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `brokersumo`;

-- --------------------------------------------------------

--
-- Table structure for table `address`
--

CREATE TABLE IF NOT EXISTS `address` (
  `address_id` int(11) NOT NULL,
  `address` varchar(50) NOT NULL,
  `city` varchar(20) NOT NULL,
  `zip_code` varchar(10) NOT NULL,
  `country` varchar(20) NOT NULL,
  `state_prov` varchar(20) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `address`
--

INSERT INTO `address` (`address_id`, `address`, `city`, `zip_code`, `country`, `state_prov`) VALUES
(1, 'null', 'null', 'null', 'null', 'null');

-- --------------------------------------------------------

--
-- Table structure for table `agent`
--

CREATE TABLE IF NOT EXISTS `agent` (
  `agent_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `first_name` varchar(20) NOT NULL,
  `last_name` varchar(20) NOT NULL,
  `start_date` date NOT NULL,
  `office_location` varchar(20) NOT NULL,
  `social_sec_no` varchar(20) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `website` varchar(50) NOT NULL,
  `photo` blob NOT NULL,
  `address_id` int(11) NOT NULL,
  `credit_card_id` int(11) NOT NULL,
  `bank_account_id` int(11) NOT NULL,
  `onboarding_plan_id` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `bank_account`
--

CREATE TABLE IF NOT EXISTS `bank_account` (
  `bank_account_id` int(11) NOT NULL,
  `account_number` varchar(20) NOT NULL,
  `bank_name` varchar(20) NOT NULL,
  `branch_name` varchar(20) NOT NULL,
  `ifsc_code` varchar(20) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bank_account`
--

INSERT INTO `bank_account` (`bank_account_id`, `account_number`, `bank_name`, `branch_name`, `ifsc_code`) VALUES
(1, '', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `broker`
--

CREATE TABLE IF NOT EXISTS `broker` (
  `broker_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `first_name` varchar(20) NOT NULL,
  `last_name` varchar(20) NOT NULL,
  `license_no` varchar(20) NOT NULL,
  `billing_address_id` int(11) NOT NULL,
  `credit_card_id` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE IF NOT EXISTS `company` (
  `company_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `address_id` int(11) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `fax` varchar(15) NOT NULL,
  `website` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `tax_id` varchar(20) NOT NULL,
  `logo` blob NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `credit_card`
--

CREATE TABLE IF NOT EXISTS `credit_card` (
  `credit_card_id` int(11) NOT NULL,
  `last_digits` int(11) NOT NULL,
  `itransact_req_id` varchar(50) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `credit_card`
--

INSERT INTO `credit_card` (`credit_card_id`, `last_digits`, `itransact_req_id`) VALUES
(1, 0, 'null');

-- --------------------------------------------------------

--
-- Table structure for table `onboarding_component`
--

CREATE TABLE IF NOT EXISTS `onboarding_component` (
  `component_id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `description` varchar(100) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `onboarding_component`
--

INSERT INTO `onboarding_component` (`component_id`, `name`, `description`) VALUES
(1, '', '');

-- --------------------------------------------------------

--
-- Table structure for table `onboarding_plan`
--

CREATE TABLE IF NOT EXISTS `onboarding_plan` (
  `plan_id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `is_template` tinyint(1) NOT NULL,
  `component_id` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `onboarding_plan`
--

INSERT INTO `onboarding_plan` (`plan_id`, `name`, `is_template`, `component_id`) VALUES
(1, '0', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(500) NOT NULL,
  `type` tinyint(4) NOT NULL,
  `reference_id` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`address_id`);

--
-- Indexes for table `agent`
--
ALTER TABLE `agent`
  ADD PRIMARY KEY (`agent_id`), ADD KEY `broker_id` (`company_id`), ADD KEY `onboarding_plan_id` (`onboarding_plan_id`), ADD KEY `address_id` (`address_id`), ADD KEY `credit_card_id` (`credit_card_id`), ADD KEY `bank_account_id` (`bank_account_id`), ADD KEY `onboarding_plan_id_2` (`onboarding_plan_id`), ADD KEY `broker_id_2` (`company_id`), ADD KEY `email` (`email`);

--
-- Indexes for table `bank_account`
--
ALTER TABLE `bank_account`
  ADD PRIMARY KEY (`bank_account_id`);

--
-- Indexes for table `broker`
--
ALTER TABLE `broker`
  ADD PRIMARY KEY (`broker_id`), ADD KEY `company_id` (`company_id`), ADD KEY `credit_card_id` (`credit_card_id`), ADD KEY `billing_address_id` (`billing_address_id`), ADD KEY `email` (`email`);

--
-- Indexes for table `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`company_id`), ADD KEY `address_id` (`address_id`);

--
-- Indexes for table `credit_card`
--
ALTER TABLE `credit_card`
  ADD PRIMARY KEY (`credit_card_id`);

--
-- Indexes for table `onboarding_component`
--
ALTER TABLE `onboarding_component`
  ADD PRIMARY KEY (`component_id`);

--
-- Indexes for table `onboarding_plan`
--
ALTER TABLE `onboarding_plan`
  ADD PRIMARY KEY (`plan_id`), ADD KEY `component_id` (`component_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`), ADD KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `address`
--
ALTER TABLE `address`
  MODIFY `address_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `agent`
--
ALTER TABLE `agent`
  MODIFY `agent_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `bank_account`
--
ALTER TABLE `bank_account`
  MODIFY `bank_account_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `broker`
--
ALTER TABLE `broker`
  MODIFY `broker_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=23;
--
-- AUTO_INCREMENT for table `company`
--
ALTER TABLE `company`
  MODIFY `company_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT for table `credit_card`
--
ALTER TABLE `credit_card`
  MODIFY `credit_card_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `onboarding_component`
--
ALTER TABLE `onboarding_component`
  MODIFY `component_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `onboarding_plan`
--
ALTER TABLE `onboarding_plan`
  MODIFY `plan_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=14;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `agent`
--
ALTER TABLE `agent`
ADD CONSTRAINT `agent_address` FOREIGN KEY (`address_id`) REFERENCES `address` (`address_id`),
ADD CONSTRAINT `agent_bankaccount` FOREIGN KEY (`bank_account_id`) REFERENCES `bank_account` (`bank_account_id`),
ADD CONSTRAINT `agent_company` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`),
ADD CONSTRAINT `agent_creditcard` FOREIGN KEY (`credit_card_id`) REFERENCES `credit_card` (`credit_card_id`),
ADD CONSTRAINT `agent_onboardingplan` FOREIGN KEY (`onboarding_plan_id`) REFERENCES `onboarding_plan` (`plan_id`);

--
-- Constraints for table `broker`
--
ALTER TABLE `broker`
ADD CONSTRAINT `broker_address` FOREIGN KEY (`billing_address_id`) REFERENCES `address` (`address_id`),
ADD CONSTRAINT `broker_company` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`),
ADD CONSTRAINT `broker_creditcard` FOREIGN KEY (`credit_card_id`) REFERENCES `credit_card` (`credit_card_id`);

--
-- Constraints for table `company`
--
ALTER TABLE `company`
ADD CONSTRAINT `company_addr` FOREIGN KEY (`address_id`) REFERENCES `address` (`address_id`);

--
-- Constraints for table `onboarding_plan`
--
ALTER TABLE `onboarding_plan`
ADD CONSTRAINT `plan_component` FOREIGN KEY (`component_id`) REFERENCES `onboarding_component` (`component_id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

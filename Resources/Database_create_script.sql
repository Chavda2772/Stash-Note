-- Generation Time: Dec 30, 2023 at 02:49 PM
-- Server version: 10.6.16-MariaDB

--
-- Database: `StashNote`
-- Note: Change Database name as need 
-- 
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Procedures
--

DELIMITER $$
CREATE PROCEDURE `usp_deleteUserNotes`(IN _UserId int)
BEGIN
	-- Delete 
	DELETE FROM Notes 
    where UserId = _UserId;
    
    -- Inactive userId
    UPDATE UserInfo 
	SET IsActive = 0
	where UserId = _UserId;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `usp_getNoteDetailByUserId`(in _UserId int)
BEGIN
	SELECT NoteDetail 
    FROM Notes 
    WHERE UserId = _UserId;
END$$
DELIMITER ;

-- Get log download pass key
DELIMITER $$
CREATE PROCEDURE `usp_getZipPassKey` ()   BEGIN
	SELECT ConfigValue FROM masterconfiguration where ConfigKey = 'ZipPassKey';
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `usp_InsertOrUpdateNotes`(IN _UserId int, IN _Note longtext)
BEGIN
IF EXISTS(SELECT UserId FROM Notes WHERE UserId=_UserId) 
	THEN
		UPDATE `Notes`
        SET `NoteDetail` = _Note,
			`LastUpdatedOn` = CURRENT_TIMESTAMP()
        WHERE `UserId` = _UserId;
    ELSE
		INSERT INTO `Notes` (`UserId`, `NoteDetail`)
		VALUES (_UserId, _Note);
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `usp_InsertUserInfo`(IN UniqueUUID nvarchar(250), IN PasswordHash nvarchar(250))
BEGIN
	INSERT INTO `UserInfo`(`UUID`, `Password`)
	VALUES (UniqueUUID, PasswordHash);
    
    SELECT LAST_INSERT_ID() AS UserId;
END$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `masterconfiguration`
--

CREATE TABLE `masterconfiguration` (
  `ConfigId` int(11) NOT NULL,
  `ConfigKey` varchar(200) NOT NULL,
  `ConfigValue` varchar(500) NOT NULL,
  `ConfigDescription` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `masterconfiguration`
--

INSERT INTO `masterconfiguration` (`ConfigId`, `ConfigKey`, `ConfigValue`, `ConfigDescription`) VALUES
(1, 'ZipPassKey', 'Secret@123@', 'This configuration is used for dowloading logs');

-- --------------------------------------------------------

--
-- Table structure for table `Notes`
--

CREATE TABLE `Notes` (
  `NoteId` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `NoteDetail` longtext DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `LastUpdatedOn` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `UserInfo`
--

CREATE TABLE `UserInfo` (
  `UUID` varchar(250) NOT NULL,
  `UserId` int(11) NOT NULL,
  `Password` varchar(250) NOT NULL,
  `IsActive` tinyint(4) NOT NULL DEFAULT 1,
  `CreatedOn` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `masterconfiguration`
--
ALTER TABLE `masterconfiguration`
  ADD PRIMARY KEY (`ConfigId`);

--
-- Indexes for table `notes`
--
ALTER TABLE `Notes`
  ADD PRIMARY KEY (`NoteId`),
  ADD UNIQUE KEY `UserId_UNIQUE` (`UserId`);

--
-- Indexes for table `UserInfo`
--
ALTER TABLE `UserInfo`
  ADD PRIMARY KEY (`UserId`),
  ADD UNIQUE KEY `UUID_UNIQUE` (`UUID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `masterconfiguration`
--
ALTER TABLE `masterconfiguration`
  MODIFY `ConfigId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `notes`
--
ALTER TABLE `Notes`
  MODIFY `NoteId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `UserInfo`
--
ALTER TABLE `UserInfo`
  MODIFY `UserId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

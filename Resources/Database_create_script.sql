-- Generation Time: Aug 07, 2024 at 08:02 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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
CREATE PROCEDURE `usp_deleteUserNotes` (IN `_UserId` INT)
BEGIN
	-- Delete 
	  DELETE FROM Notes 
    WHERE UserId = _UserId;
    
    DELETE FROM UserClientIpMapping 
    WHERE UserId = _UserId;
    
    -- Inactive userId
    UPDATE UserInfo 
	  SET IsActive = 0
	  WHERE UserId = _UserId;
END$$

CREATE PROCEDURE `usp_addUserIp` (IN `UserId` INT, IN `IpAddress` NVARCHAR(250))   
BEGIN
	  INSERT INTO userclientipmapping (`UserId`, `IpAddress`)
    VALUES (UserId, IpAddress);
END$$

CREATE PROCEDURE `usp_getNoteDetailByUserId` (IN `_UserId` INT)
BEGIN
	  SELECT NoteDetail 
    FROM Notes 
    WHERE UserId = _UserId;
END$$

CREATE PROCEDURE `usp_getUserDetailByUUID` (IN `UniqueUUID` NVARCHAR(250))   BEGIN
	SELECT UserId, Password FROM UserInfo where UUID = UniqueUUID and IsActive = 1;
    SELECT IpAddress FROM UserClientipMapping where UserId = getUserIdByUUID(UniqueUUID);
END$$

CREATE PROCEDURE `usp_getZipPassKey` ()   BEGIN
	SELECT ConfigValue FROM MasterConfiguration where ConfigKey = 'ZipPassKey';
END$$

CREATE PROCEDURE `usp_InsertOrUpdateNotes` (IN `_UserId` INT, IN `_Note` LONGTEXT)   BEGIN
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

CREATE PROCEDURE `usp_InsertUserInfo` (IN `UniqueUUID` NVARCHAR(250), IN `PasswordHash` NVARCHAR(250), IN `ClientIp` NVARCHAR(250))   BEGIN
	DECLARE _UserID int;
    
	  INSERT INTO `UserInfo`(`UUID`, `Password`)
	  VALUES (UniqueUUID, PasswordHash);
    
    SELECT LAST_INSERT_ID() into _UserID;
    
    INSERT INTO `UserClientipMapping` (`UserId`, `IpAddress`) 
    VALUES (_UserID, ClientIp);

    SELECT _UserID AS UserId;
END$$

--
-- Functions
--
CREATE FUNCTION `getUserIdByUUID` (`_UUID` NVARCHAR(250)) RETURNS INT(11)  BEGIN
DECLARE _UserID int;

SELECT UserId into _UserID FROM UserInfo where UUID = _UUID;
return _UserID;

END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `MasterConfiguration`
--

CREATE TABLE `MasterConfiguration` (
  `ConfigId` int(11) NOT NULL,
  `ConfigKey` varchar(200) NOT NULL,
  `ConfigValue` varchar(500) NOT NULL,
  `ConfigDescription` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `MasterConfiguration`
--

INSERT INTO `MasterConfiguration` (`ConfigId`, `ConfigKey`, `ConfigValue`, `ConfigDescription`) VALUES
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
-- Table structure for table `UserClientipMapping`
--

CREATE TABLE `UserClientipMapping` (
  `mappingId` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `IpAddress` varchar(45) NOT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- --------------------------------------------------------

--
-- Table structure for table `userinfo`
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
-- Indexes for table `MasterConfiguration`
--
ALTER TABLE `MasterConfiguration`
  ADD PRIMARY KEY (`ConfigId`);

--
-- Indexes for table `notes`
--
ALTER TABLE `Notes`
  ADD PRIMARY KEY (`NoteId`),
  ADD UNIQUE KEY `UserId_UNIQUE` (`UserId`);

--
-- Indexes for table `UserClientipMapping`
--
ALTER TABLE `UserClientipMapping`
  ADD PRIMARY KEY (`mappingId`);

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
-- AUTO_INCREMENT for table `MasterConfiguration`
--
ALTER TABLE `MasterConfiguration`
  MODIFY `ConfigId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `notes`
--
ALTER TABLE `Notes`
  MODIFY `NoteId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `UserClientipMapping`
--
ALTER TABLE `UserClientipMapping`
  MODIFY `mappingId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `userinfo`
--
ALTER TABLE `UserInfo`
  MODIFY `UserId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

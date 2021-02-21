CREATE TABLE `templates` (
  `id` int(11) NOT NULL,
  `timestamp` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `profileName` varchar(16) CHARACTER SET armscii8 NOT NULL,
  `imageName` varchar(16) CHARACTER SET armscii8 NOT NULL,
  `version` float NOT NULL,
  `profileDescription` varchar(200) CHARACTER SET utf8 NOT NULL,
  `imageDescription` varchar(200) CHARACTER SET armscii8 NOT NULL,
  `profilePath` varchar(64) CHARACTER SET armscii8 COLLATE armscii8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

ALTER TABLE `templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `profilePath` (`profilePath`);

ALTER TABLE `templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

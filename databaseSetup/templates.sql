CREATE TABLE `templates` (
  `id` int(11) NOT NULL,
  `timestamp` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `profile_name` varchar(16) CHARACTER SET armscii8 NOT NULL,
  `image_name` varchar(16) CHARACTER SET armscii8 NOT NULL,
  `version` float NOT NULL,
  `profile_description` varchar(200) CHARACTER SET utf8 NOT NULL,
  `image_description` varchar(200) CHARACTER SET armscii8 NOT NULL,
  `profile_path` varchar(64) CHARACTER SET armscii8 COLLATE armscii8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

ALTER TABLE `templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `profile_path` (`profile_path`);

ALTER TABLE `templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

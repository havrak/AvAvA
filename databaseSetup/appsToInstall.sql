CREATE TABLE `appsToInstall` (
  `id` int(11) NOT NULL,
  `name` varchar(64) COLLATE utf8_czech_ci NOT NULL,
  `description` text COLLATE utf8_czech_ci NOT NULL,
  `icon_path` varchar(128) COLLATE utf8_czech_ci NOT NULL,
  `package_name` varchar(32) COLLATE utf8_czech_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

ALTER TABLE `appsToInstall`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `appsToInstall`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

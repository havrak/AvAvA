CREATE TABLE `containersResourcesLogs` (
  `container_id` int(11) NOT NULL,
  `ram` text COLLATE utf8_czech_ci NOT NULL,
  `cpu` text COLLATE utf8_czech_ci NOT NULL,
  `number_of_processes` text COLLATE utf8_czech_ci NOT NULL,
  `up_speed` text COLLATE utf8_czech_ci NOT NULL,
  `down_speed` text COLLATE utf8_czech_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

ALTER TABLE `containersResourcesLogs`
  ADD PRIMARY KEY (`container_id`);

ALTER TABLE `containersResourcesLogs`
  ADD CONSTRAINT `containersResourcesLogs_ibfk_1` FOREIGN KEY (`container_id`) REFERENCES `containers` (`id`);
COMMIT;

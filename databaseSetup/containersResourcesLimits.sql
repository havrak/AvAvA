CREATE TABLE `containersResourcesLimits` (
  `container_id` int(11) NOT NULL,
  `ram` int(4) NOT NULL,
  `cpu` int(4) NOT NULL,
  `disk` int(4) NOT NULL,
  `upload` int(4) NOT NULL,
  `download` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

ALTER TABLE `containersResourcesLimits`
  ADD PRIMARY KEY (`container_id`);

ALTER TABLE `containersResourcesLimits`
  ADD CONSTRAINT `containersResourcesLimits_ibfk_1` FOREIGN KEY (`container_id`) REFERENCES `containers` (`id`);
COMMIT;

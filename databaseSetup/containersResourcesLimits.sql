CREATE TABLE `containersResourcesLimits` (
  `container_id` int(11) NOT NULL,
  `ram` double NOT NULL,
  `cpu` double NOT NULL,
  `disk` double NOT NULL,
  `upload` double NOT NULL,
  `download` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

ALTER TABLE `containersResourcesLimits`
  ADD PRIMARY KEY (`container_id`);

ALTER TABLE `containersResourcesLimits`
  ADD CONSTRAINT `containersResourcesLimits_ibfk_1` FOREIGN KEY (`container_id`) REFERENCES `containers` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

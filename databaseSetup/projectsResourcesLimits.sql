CREATE TABLE `projectsResourcesLimits` (
  `project_id` int(11) NOT NULL,
  `ram` double DEFAULT NULL,
  `cpu` double DEFAULT NULL,
  `disk` double DEFAULT NULL,
  `upload` double DEFAULT NULL,
  `download` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

ALTER TABLE `projectsResourcesLimits`
  ADD PRIMARY KEY (`project_id`);

ALTER TABLE `projectsResourcesLimits`
  ADD CONSTRAINT `projectsResourcesLimits_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

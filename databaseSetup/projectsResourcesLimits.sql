CREATE TABLE `projectsResourcesLimits` (
  `project_id` int(11) NOT NULL,
  `ram` int(4) NOT NULL,
  `cpu` int(4) NOT NULL,
  `disk` int(4) NOT NULL,
  `upload` int(4) NOT NULL,
  `download` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

ALTER TABLE `projectsResourcesLimits`
  ADD PRIMARY KEY (`project_id`);

ALTER TABLE `projectsResourcesLimits`
  ADD CONSTRAINT `projectsResourcesLimits_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`);
COMMIT;

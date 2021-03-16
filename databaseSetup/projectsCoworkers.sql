CREATE TABLE `projectsCoworkers` (
  `project_id` int(11) NOT NULL,
  `user_email` varchar(64) COLLATE utf8_czech_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

ALTER TABLE `projectsCoworkers`
  ADD PRIMARY KEY (`project_id`,`user_email`),
  ADD KEY `projectsCoworkers_ibfk_2` (`user_email`);

ALTER TABLE `projectsCoworkers`
  ADD CONSTRAINT `projectsCoworkers_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `projectsCoworkers_ibfk_2` FOREIGN KEY (`user_email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

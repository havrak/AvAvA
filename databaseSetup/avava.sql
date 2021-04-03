CREATE TABLE `appsToInstall` (
  `id` int(11) NOT NULL,
  `name` varchar(64) COLLATE utf8_czech_ci NOT NULL,
  `description` text COLLATE utf8_czech_ci NOT NULL,
  `icon_path` varchar(128) COLLATE utf8_czech_ci NOT NULL,
  `package_name` varchar(32) COLLATE utf8_czech_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

-- --------------------------------------------------------

--
-- Table structure for table `containers`
--

CREATE TABLE `containers` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `name` varchar(64) COLLATE utf8_czech_ci NOT NULL,
  `url` varchar(128) COLLATE utf8_czech_ci DEFAULT NULL,
  `template_id` int(11) NOT NULL,
  `state` int(4) NOT NULL,
  `timestamp` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `time_started` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

-- --------------------------------------------------------

--
-- Table structure for table `containersResourcesLimits`
--

CREATE TABLE `containersResourcesLimits` (
  `container_id` int(11) NOT NULL,
  `ram` double NOT NULL,
  `cpu` double NOT NULL,
  `disk` double NOT NULL,
  `upload` double NOT NULL,
  `download` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

-- --------------------------------------------------------

--
-- Table structure for table `containersResourcesLog`
--

CREATE TABLE `containersResourcesLog` (
  `container_id` int(11) NOT NULL,
  `ram` text COLLATE utf8_czech_ci NOT NULL,
  `cpu` text COLLATE utf8_czech_ci NOT NULL,
  `number_of_processes` text COLLATE utf8_czech_ci NOT NULL,
  `upload` text COLLATE utf8_czech_ci NOT NULL,
  `download` text COLLATE utf8_czech_ci NOT NULL,
  `timestamp` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `name` varchar(64) COLLATE utf8_czech_ci NOT NULL,
  `owner_email` varchar(64) COLLATE utf8_czech_ci NOT NULL,
  `timestamp` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

-- --------------------------------------------------------

--
-- Table structure for table `projectsCoworkers`
--

CREATE TABLE `projectsCoworkers` (
  `project_id` int(11) NOT NULL,
  `user_email` varchar(64) COLLATE utf8_czech_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

-- --------------------------------------------------------

--
-- Table structure for table `projectsResourcesLimits`
--

CREATE TABLE `projectsResourcesLimits` (
  `project_id` int(11) NOT NULL,
  `ram` double DEFAULT NULL,
  `cpu` double DEFAULT NULL,
  `disk` double DEFAULT NULL,
  `upload` double DEFAULT NULL,
  `download` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

-- --------------------------------------------------------

--
-- Table structure for table `templates`
--

CREATE TABLE `templates` (
  `id` int(11) NOT NULL,
  `timestamp` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `profile_name` varchar(16) CHARACTER SET armscii8 NOT NULL,
  `image_name` varchar(16) CHARACTER SET armscii8 NOT NULL,
  `version` float NOT NULL,
  `profile_description` varchar(200) CHARACTER SET utf8 NOT NULL,
  `image_description` varchar(200) CHARACTER SET armscii8 NOT NULL,
  `profile_path` varchar(64) CHARACTER SET armscii8 COLLATE armscii8_bin NOT NULL,
  `min_disk_size` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(64) COLLATE utf8_czech_ci NOT NULL,
  `given_name` varchar(16) COLLATE utf8_czech_ci NOT NULL,
  `family_name` varchar(16) COLLATE utf8_czech_ci NOT NULL,
  `icon` text COLLATE utf8_czech_ci,
  `role` int(11) NOT NULL,
  `coins` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

-- --------------------------------------------------------

--
-- Table structure for table `usersResourcesLimits`
--

CREATE TABLE `usersResourcesLimits` (
  `user_email` varchar(64) COLLATE utf8_czech_ci NOT NULL,
  `ram` double NOT NULL,
  `cpu` double NOT NULL,
  `disk` double NOT NULL,
  `upload` double NOT NULL,
  `download` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appsToInstall`
--
ALTER TABLE `appsToInstall`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `containers`
--
ALTER TABLE `containers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `url` (`url`),
  ADD UNIQUE KEY `url_2` (`url`),
  ADD KEY `containers_ibfk_1` (`project_id`),
  ADD KEY `containers_ibfk_2` (`template_id`);

--
-- Indexes for table `containersResourcesLimits`
--
ALTER TABLE `containersResourcesLimits`
  ADD PRIMARY KEY (`container_id`);

--
-- Indexes for table `containersResourcesLog`
--
ALTER TABLE `containersResourcesLog`
  ADD PRIMARY KEY (`container_id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `projects_ibfk_1` (`owner_email`);

--
-- Indexes for table `projectsCoworkers`
--
ALTER TABLE `projectsCoworkers`
  ADD PRIMARY KEY (`project_id`,`user_email`),
  ADD KEY `projectsCoworkers_ibfk_2` (`user_email`);

--
-- Indexes for table `projectsResourcesLimits`
--
ALTER TABLE `projectsResourcesLimits`
  ADD PRIMARY KEY (`project_id`);

--
-- Indexes for table `templates`
--
ALTER TABLE `templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `profile_path` (`profile_path`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`email`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `usersResourcesLimits`
--
ALTER TABLE `usersResourcesLimits`
  ADD PRIMARY KEY (`user_email`),
  ADD UNIQUE KEY `user_email` (`user_email`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appsToInstall`
--
ALTER TABLE `appsToInstall`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `containers`
--
ALTER TABLE `containers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `templates`
--
ALTER TABLE `templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `containers`
--
ALTER TABLE `containers`
  ADD CONSTRAINT `containers_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `containers_ibfk_2` FOREIGN KEY (`template_id`) REFERENCES `templates` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `containersResourcesLimits`
--
ALTER TABLE `containersResourcesLimits`
  ADD CONSTRAINT `containersResourcesLimits_ibfk_1` FOREIGN KEY (`container_id`) REFERENCES `containers` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `containersResourcesLog`
--
ALTER TABLE `containersResourcesLog`
  ADD CONSTRAINT `containersResourcesLog_ibfk_1` FOREIGN KEY (`container_id`) REFERENCES `containers` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`owner_email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `projectsCoworkers`
--
ALTER TABLE `projectsCoworkers`
  ADD CONSTRAINT `projectsCoworkers_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `projectsCoworkers_ibfk_2` FOREIGN KEY (`user_email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `projectsResourcesLimits`
--
ALTER TABLE `projectsResourcesLimits`
  ADD CONSTRAINT `projectsResourcesLimits_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `usersResourcesLimits`
--
ALTER TABLE `usersResourcesLimits`
  ADD CONSTRAINT `usersResourcesLimits_ibfk_1` FOREIGN KEY (`user_email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

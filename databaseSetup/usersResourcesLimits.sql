CREATE TABLE `usersResourcesLimits` (
  `user_email` varchar(64) COLLATE utf8_czech_ci NOT NULL,
  `ram` int(4) NOT NULL,
  `cpu` int(4) NOT NULL,
  `disk` int(4) NOT NULL,
  `upload` int(4) NOT NULL,
  `download` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

ALTER TABLE `usersResourcesLimits`
  ADD PRIMARY KEY (`user_email`),
  ADD UNIQUE KEY `user_email` (`user_email`) USING BTREE;

ALTER TABLE `usersResourcesLimits`
  ADD CONSTRAINT `usersResourcesLimits_ibfk_1` FOREIGN KEY (`user_email`) REFERENCES `users` (`email`);
COMMIT;

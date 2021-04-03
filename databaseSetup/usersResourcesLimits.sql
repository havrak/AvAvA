CREATE TABLE `usersResourcesLimits` (
  `user_email` varchar(64) COLLATE utf8_czech_ci NOT NULL,
  `ram` double NOT NULL,
  `cpu` double NOT NULL,
  `disk` double NOT NULL,
  `upload` double NOT NULL,
  `download` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

ALTER TABLE `usersResourcesLimits`
  ADD PRIMARY KEY (`user_email`),
  ADD UNIQUE KEY `user_email` (`user_email`) USING BTREE;

ALTER TABLE `usersResourcesLimits`
  ADD CONSTRAINT `usersResourcesLimits_ibfk_1` FOREIGN KEY (`user_email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

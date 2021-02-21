CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(64) COLLATE utf8_czech_ci NOT NULL,
  `given_name` varchar(16) COLLATE utf8_czech_ci NOT NULL,
  `family_name` varchar(16) COLLATE utf8_czech_ci NOT NULL,
  `role` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

ALTER TABLE `users`
  ADD PRIMARY KEY (`email`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `id` (`id`);

ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
COMMIT;


-- this is not final version of this table


CREATE TABLE `containersNetworkConfigurations` (
  `container_id` int(11) NOT NULL,
  `IPv4` varchar(64) COLLATE utf8_czech_ci NOT NULL,
  `IPv6` varchar(64) COLLATE utf8_czech_ci NOT NULL,
  `hwaddr` varchar(64) COLLATE utf8_czech_ci NOT NULL,
  `netmask` varchar(64) COLLATE utf8_czech_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

ALTER TABLE `containersNetworkConfigurations`
  ADD PRIMARY KEY (`container_id`);

ALTER TABLE `containersNetworkConfigurations`
  ADD CONSTRAINT `containersNetworkConfigurations_ibfk_1` FOREIGN KEY (`container_id`) REFERENCES `containers` (`id`);
COMMIT;

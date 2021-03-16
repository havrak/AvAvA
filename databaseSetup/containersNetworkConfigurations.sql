CREATE TABLE `containersNetworkConfigurations` (
  `container_id` int(11) NOT NULL,
  `interface_name` varchar(32) COLLATE utf8_czech_ci NOT NULL,
  `type` int(4) NOT NULL,
  `IPv4` varchar(64) COLLATE utf8_czech_ci NOT NULL,
  `IPv4_netmask` varchar(64) COLLATE utf8_czech_ci NOT NULL,
  `IPv4_scope` varchar(32) COLLATE utf8_czech_ci NOT NULL,
  `IPv6` varchar(64) COLLATE utf8_czech_ci NOT NULL,
  `IPv6_netmask` varchar(32) COLLATE utf8_czech_ci NOT NULL,
  `IPv6_scope` varchar(32) COLLATE utf8_czech_ci NOT NULL,
  `hwaddr` varchar(64) COLLATE utf8_czech_ci NOT NULL,
  `hostName` varchar(32) COLLATE utf8_czech_ci NOT NULL,
  `mtu` int(4) NOT NULL,
  `state` varchar(32) COLLATE utf8_czech_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

ALTER TABLE `containersNetworkConfigurations`
  ADD PRIMARY KEY (`container_id`,`interface_name`);

ALTER TABLE `containersNetworkConfigurations`
  ADD CONSTRAINT `containersNetworkConfigurations_ibfk_1` FOREIGN KEY (`container_id`) REFERENCES `containers` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

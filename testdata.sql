USE `pad_oba_3_dev`;

CREATE TABLE IF NOT EXISTS `user`
(
    `id`       INT          NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(45)  NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE UNIQUE INDEX `username_UNIQUE` ON `user`
    (`username` ASC);

INSERT INTO `user` (`username`, `password`) VALUES ('test', 'test');
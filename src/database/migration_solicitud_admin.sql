USE greekrang;

ALTER TABLE usuarios
    ADD COLUMN solicitud_admin ENUM('pendiente', 'aprobada', 'rechazada') DEFAULT NULL
    AFTER `role`;

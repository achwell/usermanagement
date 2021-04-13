drop table if exists role;
drop table if exists authority;
drop table if exists roles_authorities;
drop table if exists user;
drop sequence if exists hibernate_sequence;

create sequence hibernate_sequence start with 7 increment by 1;

create table role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    UNIQUE INDEX (name)
);
create table authority (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    UNIQUE INDEX (name)
);
create table roles_authorities (
    role_id INT NOT NULL,
    authority_id INT NOT NULL
);
create table user  (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    is_active BOOLEAN NULL DEFAULT NULL,
    is_not_locked BOOLEAN NOT NULL,
    join_date DATE NULL DEFAULT NULL,
    last_login_date TIMESTAMP NULL DEFAULT NULL,
    last_login_date_display TIMESTAMP NULL DEFAULT NULL,
    last_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255) NULL DEFAULT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    role_id INT NULL DEFAULT NULL,
    phone varchar(255) NOT NULL,
    UNIQUE INDEX (email),
    UNIQUE INDEX (username)
);

ALTER table roles_authorities ADD CONSTRAINT fk_roles_authorities_authority FOREIGN KEY (authority_id) REFERENCES authority(id) ON DELETE CASCADE;
ALTER table roles_authorities ADD CONSTRAINT fk_roles_authorities_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE;
ALTER table user ADD CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE RESTRICT ON UPDATE RESTRICT;



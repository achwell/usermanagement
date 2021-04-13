# usermanagement

# Users
| Username | Password | Role | Authorities |
| -------- | -------- | ---- | ----------- |
| roleuser | password | USER | user:read |
| managerauthorities | password | MANAGER_AUTHORITIES | user:read, user:update |
| adminauthorities | password | ROLE_ADMIN_AUTHORITIES | user:read, user:update, user:create, user:seelogintime, system:status |
| superadminauthorities | password | SUPER_ADMIN_AUTHORITIES | user:read, user:update, user:create, user:delete, user:seelogintime, system:status |

# Authorities
| Authority | Description |
| --------- | ----------- |
| user:read | Can list users |
| user:update | Can update users |
| user:create | Can create users |
| user:delete | Can delete users |
| user:seelogintime | Can see registration- and last logintime in users table |
| system:status | Can see backend system status in toolbar |

# Databaseconsole
[Databaseconsole](http://localhost:8081/h2-console)

Username	sa

Password	password

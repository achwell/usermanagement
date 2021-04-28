package net.axelwulff.usermanagement.testdata;

import net.axelwulff.usermanagement.domain.Role;

import static java.util.Arrays.asList;
import static net.axelwulff.usermanagement.testdata.AUTHORITY.*;

public enum ROLE {
    ROLE_USER {
        @Override
        public Role getRole() {
            Role role = new Role();
            role.setId(1L);
            role.setName("ROLE_USER");
            role.setAuthorities(asList(USER_READ.getAuthority(), ROLE_READ.getAuthority()));
            return role;
        }
    }, ROLE_MANAGER_AUTHORITIES {
        @Override
        public Role getRole() {
            Role role = new Role();
            role.setId(2L);
            role.setName("ROLE_MANAGER_AUTHORITIES");
            role.setAuthorities(asList(USER_READ.getAuthority(), USER_UPDATE.getAuthority(), ROLE_READ.getAuthority()));
            return role;
        }
    }, ROLE_ADMIN_AUTHORITIES {
        @Override
        public Role getRole() {
            Role role = new Role();
            role.setId(3L);
            role.setName("ROLE_ADMIN_AUTHORITIES");
            role.setAuthorities(asList(USER_READ.getAuthority(), USER_UPDATE.getAuthority(), USER_CREATE.getAuthority(), USER_SEELOGINTIME.getAuthority(), ROLE_READ.getAuthority(), SYSTEM_STATUS.getAuthority()));
            return role;
        }
    }, ROLE_SUPER_ADMIN_AUTHORITIES {
        @Override
        public Role getRole() {
            Role role = new Role();
            role.setId(4L);
            role.setName("ROLE_SUPER_ADMIN_AUTHORITIES");
            role.setAuthorities(asList(USER_READ.getAuthority(), USER_UPDATE.getAuthority(), USER_CREATE.getAuthority(), USER_SEELOGINTIME.getAuthority(), USER_DELETE.getAuthority(), ROLE_READ.getAuthority(), SYSTEM_STATUS.getAuthority()));
            return role;
        }
    };

    public abstract Role getRole();
}

package net.axelwulff.usermanagement.testdata;

import net.axelwulff.usermanagement.domain.Authority;

public enum AUTHORITY {
    USER_READ {
        @Override
        public Authority getAuthority() {
            Authority authority = new Authority();
            authority.setId(1L);
            authority.setName("user:read");
            return authority;
        }
    }, USER_UPDATE {
        @Override
        public Authority getAuthority() {
            Authority authority = new Authority();
            authority.setId(2L);
            authority.setName("user:update");
            return authority;
        }
    }, USER_CREATE {
        @Override
        public Authority getAuthority() {
            Authority authority = new Authority();
            authority.setId(3L);
            authority.setName("user:create");
            return authority;
        }
    }, USER_DELETE {
        @Override
        public Authority getAuthority() {
            Authority authority = new Authority();
            authority.setId(4L);
            authority.setName("user:delete");
            return authority;
        }
    }, USER_SEELOGINTIME {
        @Override
        public Authority getAuthority() {
            Authority authority = new Authority();
            authority.setId(5L);
            authority.setName("user:seelogintime");
            return authority;
        }
    }, SYSTEM_STATUS {
        @Override
        public Authority getAuthority() {
            Authority authority = new Authority();
            authority.setId(6L);
            authority.setName("system:status");
            return authority;
        }
    }, ROLE_READ {
        @Override
        public Authority getAuthority() {
            Authority authority = new Authority();
            authority.setId(7L);
            authority.setName("role:read");
            return authority;
        }
    };

    public abstract Authority getAuthority();
}

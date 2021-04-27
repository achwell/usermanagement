package net.axelwulff.usermanagement.service;

import net.axelwulff.usermanagement.domain.Authority;
import net.axelwulff.usermanagement.domain.Role;
import net.axelwulff.usermanagement.repository.RoleRepository;
import net.axelwulff.usermanagement.service.impl.RoleServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collection;
import java.util.List;

import static java.util.Arrays.asList;
import static java.util.Collections.singletonList;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.hamcrest.core.IsNull.notNullValue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RoleServiceTest {

    @Mock
    private RoleRepository roleRepository;

    @InjectMocks
    private RoleServiceImpl testSubject;

    @Test
    void testFindByName() {
        Authority authority = new Authority();
        authority.setId(1L);
        authority.setName("user:read");
        Collection<Authority> authorities = singletonList(authority);
        Role role = new Role();
        role.setId(1L);
        role.setName("ROLE_USER");
        role.setAuthorities(authorities);

        when(roleRepository.findByName(role.getName())).thenReturn(role);

        Role result = testSubject.findByName(role.getName());

        assertThat(result, equalTo(role));
    }

    @Test
    void getRoles() {
        Authority authorityRead = new Authority();
        authorityRead.setId(1L);
        authorityRead.setName("user:read");
        Authority authorityUpdate = new Authority();
        authorityUpdate.setId(2L);
        authorityUpdate.setName("user:update");
        Role roleUser = new Role();
        roleUser.setId(1L);
        roleUser.setName("ROLE_USER");
        roleUser.setAuthorities(singletonList(authorityRead));
        Role roleManager = new Role();
        roleManager.setId(2L);
        roleManager.setName("ROLE_MANAGER_AUTHORITIES");
        roleManager.setAuthorities(asList(authorityRead, authorityUpdate));

        when(roleRepository.findAll()).thenReturn(asList(roleUser, roleManager));

        List<Role> result = testSubject.getRoles();

        assertThat(result, notNullValue());
        assertThat(result.size(), equalTo(2));
    }
}
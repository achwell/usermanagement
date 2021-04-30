package net.axelwulff.usermanagement.service;

import net.axelwulff.usermanagement.domain.Role;
import net.axelwulff.usermanagement.repository.RoleRepository;
import net.axelwulff.usermanagement.service.impl.RoleServiceImpl;
import net.axelwulff.usermanagement.testdata.ROLE;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static java.util.Arrays.stream;
import static java.util.stream.Collectors.toList;
import static net.axelwulff.usermanagement.testdata.ROLE.ROLE_USER;
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
        Role role = ROLE_USER.getRole();

        when(roleRepository.findByName(role.getName())).thenReturn(role);

        Role result = testSubject.findByName(role.getName());

        assertThat(result, equalTo(role));
    }

    @Test
    void getRoles() {
        when(roleRepository.findAll()).thenReturn(stream(ROLE.values()).map(ROLE::getRole).collect(toList()));

        List<Role> result = testSubject.getRoles();

        assertThat(result, notNullValue());
        assertThat(result.size(), equalTo(4));
    }
}
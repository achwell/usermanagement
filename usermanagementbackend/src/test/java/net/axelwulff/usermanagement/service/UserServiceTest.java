package net.axelwulff.usermanagement.service;

import net.axelwulff.usermanagement.domain.Authority;
import net.axelwulff.usermanagement.domain.Role;
import net.axelwulff.usermanagement.domain.User;
import net.axelwulff.usermanagement.exception.EmailExistException;
import net.axelwulff.usermanagement.exception.UserNotFoundException;
import net.axelwulff.usermanagement.exception.UsernameExistException;
import net.axelwulff.usermanagement.repository.RoleRepository;
import net.axelwulff.usermanagement.repository.UserRepository;
import net.axelwulff.usermanagement.service.impl.UserServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

import static java.util.Arrays.asList;
import static java.util.Collections.singletonList;
import static net.axelwulff.usermanagement.utility.Utils.createUserDetails;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.hamcrest.core.IsNull.notNullValue;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    PasswordEncoder passwordEncoder;

    @Mock
    LoginAttemptService loginAttemptService;

    @Mock
    EmailService emailService;

    @InjectMocks
    private UserServiceImpl testSubject;

    @Test
    void testLoadUserByUsername() {
        Role role = getRole();
        User user = getUser(1L, role);

        UserDetails expected = createUserDetails(user);

        when(userRepository.findUserByUsername(user.getUsername())).thenReturn(user);
        when(loginAttemptService.hasExceededMaxAttempts(user.getUsername())).thenReturn(true);
        when(userRepository.save(any())).thenReturn(user);

        UserDetails result = testSubject.loadUserByUsername(user.getUsername());

        assertThat(result.getUsername(), equalTo(expected.getUsername()));

    }

    @Test
    void testFindUserByEmail() {
        Role role = getRole();
        User user = getUser(1L, role);

        when(userRepository.findUserByEmail(user.getEmail())).thenReturn(user);

        User result = testSubject.findUserByEmail(user.getEmail());

        assertThat(result.getUsername(), equalTo(user.getUsername()));

    }

    @Test
    void testGetUsers() {
        Role role = getRole();
        User user1 = getUser(1L, role);
        User user2 = getUser(2L, role);
        User user3 = getUser(3L, role);
        when(userRepository.findAll()).thenReturn(asList(user1, user2, user3));

        List<User> result = testSubject.getUsers();
        assertThat(result, notNullValue());
        assertThat(result.size(), equalTo(3));
    }

    @Test
    void testRegister() throws UserNotFoundException, EmailExistException, UsernameExistException {
        Role role = getRole();
        User user = getUser(null, role);

        when(userRepository.findUserByUsername(user.getUsername())).thenReturn(null);
        when(userRepository.findUserByEmail(user.getEmail())).thenReturn(null);
        when(passwordEncoder.encode(any())).thenReturn("encodedpassword");
        when(roleRepository.findByName("ROLE_USER")).thenReturn(role);
        when(userRepository.save(any())).thenReturn(user);
        when(emailService.sendNewPasswordEmail(anyString(), anyString(), anyString())).thenReturn(1);

        User result = testSubject.register(user.getFirstName(), user.getMiddleName(), user.getLastName(), user.getUsername(), user.getEmail(), user.getPhone());

        assertThat(result, equalTo(user));
    }

    @Test
    void testAddNewUser() throws UserNotFoundException, EmailExistException, UsernameExistException {
        Role role = getRole();
        User user = getUser(null, role);

        when(userRepository.findUserByUsername(user.getUsername())).thenReturn(null);
        when(userRepository.findUserByEmail(user.getEmail())).thenReturn(null);
        when(passwordEncoder.encode(any())).thenReturn("encodedpassword");
        when(userRepository.save(any())).thenReturn(user);
        when(emailService.sendNewPasswordEmail(anyString(), anyString(), anyString())).thenReturn(1);

        User result = testSubject.addNewUser(user);

        assertThat(result, equalTo(user));
    }

    @Test
    void testUpdateUser() throws UserNotFoundException, EmailExistException, UsernameExistException {
        Role role = getRole();
        User user = getUser(null, role);
        user.setOldUsername(user.getUsername());
        when(userRepository.findUserByUsername(user.getOldUsername())).thenReturn(user);
        when(userRepository.findUserByEmail(user.getEmail())).thenReturn(user);
        when(userRepository.save(any())).thenReturn(user);

        User result = testSubject.updateUser(user.getOldUsername(), user);

        assertThat(result, equalTo(user));
    }

    @Test
    void testResetPassword() {
        Role role = getRole();
        User user = getUser(1L, role);

        when(userRepository.findUserByEmail(user.getEmail())).thenReturn(user);
        when(userRepository.save(any())).thenReturn(user);
        when(emailService.sendNewPasswordEmail(anyString(), anyString(), anyString())).thenReturn(1);

        try {
            testSubject.resetPassword(user.getEmail());
        } catch (Exception e) {
            fail("Did not expect Exception, but got " + e.getClass().getName());
        }
    }

    @Test
    void testDeleteUser() {
        Role role = getRole();
        User user = getUser(1L, role);

        when(userRepository.findUserByUsername(user.getUsername())).thenReturn(null);
        testSubject.deleteUser(user.getUsername());
    }

    private User getUser(Long id, Role role) {
        User user = new User();
        user.setId(id);
        user.setUsername("username");
        user.setEmail("email@email.com");
        user.setPassword("password");
        user.setFirstName("firstName");
        user.setLastName("lastName");
        user.setPhone("phone");
        user.setJoinDate(LocalDate.now());
        user.setActive(false);
        user.setNotLocked(true);
        user.setRole(role);
        return user;
    }

    private Role getRole() {
        Authority authority = new Authority();
        authority.setId(1L);
        authority.setName("user:read");
        Collection<Authority> authorities = singletonList(authority);
        Role role = new Role();
        role.setId(1L);
        role.setName("ROLE_USER");
        role.setAuthorities(authorities);
        return role;
    }
}
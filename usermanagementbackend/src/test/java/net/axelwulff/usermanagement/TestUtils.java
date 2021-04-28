package net.axelwulff.usermanagement;

import net.axelwulff.usermanagement.domain.Role;
import net.axelwulff.usermanagement.domain.User;

import java.time.LocalDate;

public class TestUtils {

    public static User getUser(Long id, Role role) {
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

}

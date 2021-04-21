package net.axelwulff.usermanagement.utility;

import net.axelwulff.usermanagement.domain.Role;
import net.axelwulff.usermanagement.domain.User;
import net.axelwulff.usermanagement.domain.UserPrincipal;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.HashSet;
import java.util.Set;

import static java.util.stream.Collectors.toSet;

public class Utils {

    public static UserDetails createUserDetails(User user) {
        Set<SimpleGrantedAuthority> authorities;
        Role role = user.getRole();
        if(role == null) {
            authorities = new HashSet<>();
        } else {
            authorities = role.getAuthorities().stream()
                    .map(p -> new SimpleGrantedAuthority(p.getName()))
                    .collect(toSet());
            authorities.add(new SimpleGrantedAuthority(role.getName()));
        }
        return new UserPrincipal(user.getUsername(), user.getPassword(), authorities, true, user.isNotLocked(), true, user.isActive());
    }

}

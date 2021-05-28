package net.axelwulff.usermanagement.domain;

import net.axelwulff.usermanagement.converter.BooleanConverter;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.time.LocalDate;
import java.time.LocalDateTime;

import static javax.persistence.FetchType.EAGER;
import static javax.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "user_account")
public class User extends BaseDomainObject {

    @Id
    @GeneratedValue(strategy = IDENTITY, generator = "native")
    @Column(nullable = false, updatable = false, unique = true)
    private Long id;

    @Column(nullable = false)
    @NotEmpty
    @Length(min = 1, max = 255)
    private String firstName;

    @Column()
    private String middleName;

    @Column(nullable = false)
    @NotEmpty
    @Length(min = 1, max = 255)
    private String lastName;

    @Column(nullable = false, unique = true)
    @Pattern(regexp = "[a-zA-Z0-9]{7,}")
    private String username;

    @Transient
    private String oldUsername;

    @Column(nullable = false)
    @NotEmpty
    private String password;

    @Transient
    private String newPassword;

    @Column(nullable = false, unique = true)
    @Email
    @NotEmpty
    @Length(min = 1, max = 255)
    private String email;

    @Column(nullable = false)
    @NotEmpty
    @Length(min = 1, max = 15)
    private String phone;

    @Column()
    private LocalDateTime lastLoginDate;

    @Column()
    private LocalDateTime lastLoginDateDisplay;

    @Column(nullable = false)
    private LocalDate joinDate;

    @ManyToOne(fetch = EAGER)
    @NotNull
    private Role role;

    @Column()
    @Convert(converter = BooleanConverter.class)
    private boolean isActive;

    @Column()
    @Convert(converter = BooleanConverter.class)
    private boolean isNotLocked;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getOldUsername() {
        return oldUsername;
    }

    public void setOldUsername(String oldUsername) {
        this.oldUsername = oldUsername;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public LocalDateTime getLastLoginDate() {
        return lastLoginDate;
    }

    public void setLastLoginDate(LocalDateTime lastLoginDate) {
        this.lastLoginDate = lastLoginDate;
    }

    public LocalDateTime getLastLoginDateDisplay() {
        return lastLoginDateDisplay;
    }

    public void setLastLoginDateDisplay(LocalDateTime lastLoginDateDisplay) {
        this.lastLoginDateDisplay = lastLoginDateDisplay;
    }

    public LocalDate getJoinDate() {
        return joinDate;
    }

    public void setJoinDate(LocalDate joinDate) {
        this.joinDate = joinDate;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public boolean isNotLocked() {
        return isNotLocked;
    }

    public void setNotLocked(boolean notLocked) {
        isNotLocked = notLocked;
    }
}

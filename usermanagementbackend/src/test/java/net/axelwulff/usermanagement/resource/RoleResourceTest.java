package net.axelwulff.usermanagement.resource;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import net.axelwulff.usermanagement.domain.Role;
import net.axelwulff.usermanagement.domain.User;
import net.axelwulff.usermanagement.utility.JWTTokenProvider;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static net.axelwulff.usermanagement.TestUtils.getUser;
import static net.axelwulff.usermanagement.testdata.ROLE.ROLE_USER;
import static net.axelwulff.usermanagement.utility.Utils.createUserDetails;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
class RoleResourceTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private JWTTokenProvider jwtTokenProvider;

    @Test
    void testGetAllRolesForbidden() throws Exception {
        mvc.perform(MockMvcRequestBuilders.get("/role")).andExpect(status().isForbidden());
    }

    @Test
    void testGetAllRoles() throws Exception {
        Role role = ROLE_USER.getRole();
        User user = getUser(1L, role);
        UserDetails userDetails = createUserDetails(user);
        String token = jwtTokenProvider.generateJwtToken(userDetails);
        MockHttpServletResponse mockHttpServletResponse = mvc
                .perform(MockMvcRequestBuilders.get("/role").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andReturn()
                .getResponse();
        String content = mockHttpServletResponse.getContentAsString();
        ObjectMapper mapper = new ObjectMapper();
        JsonNode response = mapper.readTree(content);
        assertThat(response.size(), equalTo(4));
    }

    @Test
    void testGetRole() throws Exception {
        Role role = ROLE_USER.getRole();
        User user = getUser(1L, role);
        UserDetails userDetails = createUserDetails(user);
        String token = jwtTokenProvider.generateJwtToken(userDetails);
        MockHttpServletResponse mockHttpServletResponse = mvc
                .perform(MockMvcRequestBuilders.get("/role/" + role.getName()).header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andReturn()
                .getResponse();
        String content = mockHttpServletResponse.getContentAsString();
        ObjectMapper mapper = new ObjectMapper();
        JsonNode response = mapper.readTree(content);
        assertThat(response.get("id").intValue(), equalTo(role.getId().intValue()));
        assertThat(response.get("name").textValue(), equalTo(role.getName()));
        ArrayNode authorities = response.withArray("authorities");
        assertThat(authorities.size(), equalTo(role.getAuthorities().size()));
    }
}
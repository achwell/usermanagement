import jwt_decode from "jwt-decode";

import usermanagerapi from "../api/usermanagerapi";

//functions to make api calls
const authenticationService = {

    register: body => usermanagerapi.post('/user/register', body),

    login: body => usermanagerapi.post('/user/login', body),

    refreshToken: () => usermanagerapi.get('/token/refresh'),

    logout: () => localStorage.clear(),

    saveToken: token => localStorage.setItem('token', token),

    addUserToLocalCache: user => localStorage.setItem('user', JSON.stringify(user)),

    getUserFromLocalCache() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : {};
    },

    getToken: () => localStorage.getItem('token'),

    isLoggedIn() {
        let token = this.getToken();
        if (token != null && token !== '') {
            const decodedToken = jwt_decode(token);
            const subject = decodedToken.sub;
            if ((subject != null || '') && !decodedToken.exp * 1000 < new Date().getTime()) {
                return true;
            }
        }
        this.logout();
        return false;
    },

    getUsername() {
        const user = this.getUserFromLocalCache();
        return user && user.username;
    },

    hasAuthority(authority) {
        const user = this.getUserFromLocalCache();
        if (!user) {
            return false;
        }
        const role = user.role;
        if (!role || !role.authorities) {
            return false;
        }
        let hasAuthority = false;
        role.authorities.forEach(p => {
            if(p.name === authority) {
                hasAuthority = true;
            }
        })
        return hasAuthority;
    }
};
export default authenticationService;

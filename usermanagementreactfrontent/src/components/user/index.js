import React, {forwardRef, Fragment, useImperativeHandle, useRef, useState} from "react";
import {useHistory} from "react-router-dom";
import {withSnackbar} from "notistack";

import authenticationService from "../../service/autehentication.service";
import roleService from "../../service/role.service";
import userService from "../../service/user.service";

import {Modal} from "../modal/modal";
import UserForm from "./userform";
import ChangePasswordForm from "./changepasswordform";
import Usertable from "./userTable";

const UserComponent = forwardRef((props, ref) => {
    useImperativeHandle(
        ref,
        () => ({
            create() {
                initCreateUser();
            },
            userProfile() {
                initUserProfile();
            },
            changePassword() {
                initChangePassword();
            },
            reload() {
                reloadUsersAndRoles();
            }
        }),
    )

    const [users, setUsers] = useState(userService.getUsersFromLocalCache());
    const [validationErrors, setValidationErrors] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedUsername, setSelectedUsername] = useState(null);
    const [selectedName, setSelectedName] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const canCreate = authenticationService.hasAuthority("user:create");
    const canRead = authenticationService.hasAuthority("user:read");
    const canUpdate = authenticationService.hasAuthority("user:update");
    const canDelete = authenticationService.hasAuthority("user:delete");
    const canSeeLogintime = authenticationService.hasAuthority("user:seelogintime");

    const history = useHistory();

    if (!canRead) {
        authenticationService.logout();
    }
    if (!authenticationService.isLoggedIn()) {
        history.push("/login");
    }

    const userFormRef = useRef();
    const changePasswordFormRef = useRef();

    const username = authenticationService.getUsername();

    const readOnly = !(!(selectedUser && selectedUser.id) && canCreate) && selectedUsername !== username && !canUpdate;

    const loadData = showMessage => {
        userService.getUsers()
            .then(response => {
                userService.addUsersToLocalCache(response.data);
                roleService.loadRoles();
                const users = userService.getUsersFromLocalCache();
                if (showMessage) {
                    props.enqueueSnackbar(users.length + " users loaded.", {variant: 'success'});
                }
                setUsers(users);
            })
    }

    const reloadUsersAndRoles = () => {
        loadData(true);
    }

    const initCreateUser = () => {
        if (canCreate) {
            const selectedName = '';
            const role = roleService.getRoles().filter(r => r.name === 'ROLE_USER')[0];
            const user = {
                id: null,
                password: Math.random().toString(16).substr(2, 8),
                firstName: "",
                middleName: "",
                lastName: "",
                username: "",
                email: "",
                phone: "",
                isActive: false,
                isNonLocked: false,
                role,
                roleId: role.id
            };
            setSelectedUsername(user.username);
            setSelectedName(selectedName);
            setSelectedUser(user);
            setEditOpen(true);
        }
    }

    const initUpdateUser = user => {
        if (canRead || canUpdate) {
            const selectedName = getFullName(user);
            setSelectedUsername(user.username);
            setSelectedName(selectedName);
            user.roleId = user.role.id
            setSelectedUser(user);
            setEditOpen(true);
        }
    }

    const initUserProfile = () => {
        const user = authenticationService.getUserFromLocalCache();
        const selectedName = getFullName(user);
        setSelectedUsername(user.username);
        setSelectedName(selectedName);
        user.roleId = user.role.id
        setSelectedUser(user);
        setEditOpen(true);
    }

    const initChangePassword = () => {
        const user = authenticationService.getUserFromLocalCache();
        setSelectedUser(user);
        setSelectedUsername(user.username);
        setChangePasswordOpen(true);
    }

    const initDeleteUser = user => {
        if (canDelete) {
            const selectedName = getFullName(user);
            setSelectedUsername(user.username);
            setSelectedName(selectedName);
            setSelectedUser(user);
            setDeleteOpen(true);
        }
    }

    const doCreateUser = user => {
        userService.addUser(user)
            .then(response => handleResponseOk("updated"))
            .catch(e => handleError(e, () => setEditOpen(false)));
    }

    const doUpdateUser = (user) => {
        userService.updateUser(selectedUsername, user)
            .then(response => {
                //If edit profile
                if(user.username === authenticationService.getUsername()) {
                    authenticationService.addUserToLocalCache(user);
                }
                handleResponseOk("updated");
            })
            .catch(e => handleError(e, () => {
                setDeleteOpen(false);
                setEditOpen(false);
                setChangePasswordOpen(false);
            }));
    }

    const doChangePassword = newPassword => {
        const user = {...selectedUser, newPassword}
        doUpdateUser(user);
    }

    const doDeleteUser = () => {
        userService.deleteUser(selectedUsername)
            .then(response => handleResponseOk("deleted"))
            .catch(e => handleError(e, () => {
                setDeleteOpen(false);
                setEditOpen(false);
                setChangePasswordOpen(false);
            }));
    }

    const getFullName = user => {
        let selectedName = user.firstName;
        if (user.middleName) {
            selectedName += " " + user.middleName;
        }
        selectedName += " " + user.lastName;
        return selectedName;
    }

    const handleResponseOk = action => {
        props.enqueueSnackbar("User " + selectedName + " " + action + ".", {variant: 'success'});
        setDeleteOpen(false);
        setEditOpen(false);
        setChangePasswordOpen(false);
        setSelectedUser(null);
        setSelectedName(null);
        setSelectedUsername(null);
        loadData(false);
    }

    const handleError = (e, callback) => {
        let error = "";
        if (e.response) {
            error = e.response.data.message;
        } else if (e.message) {
            error = e.message;
        }
        setDeleteOpen(false);
        setEditOpen(false);
        setChangePasswordOpen(false);
        setSelectedUser(null);
        setSelectedName(null);
        setSelectedUsername(null);
        props.enqueueSnackbar(error, {variant: 'error'});
        if (callback) {
            callback();
        }
    }
    const update = selectedUser && (!!selectedUser.id);

    return (
        <Fragment>
            <Usertable rows={users}
                       edit={initUpdateUser}
                       delete={initDeleteUser}
                       canUpdate={canUpdate}
                       canDelete={canDelete}
                       canSeeLogintime={canSeeLogintime}
                       username={username}/>
            <Modal isOpen={deleteOpen}
                   handleClose={() => setDeleteOpen(false)}
                   title="Delete user"
                   handleSubmit={doDeleteUser}
                   submitTitle="Delete"
                   submitReadOnly={!canDelete}>
                <div>
                    Vil du slette {selectedUsername + ": " + selectedName}?
                </div>
            </Modal>
            <Modal isOpen={editOpen}
                   handleClose={() => setEditOpen(false)}
                   title={update ? "Update user" : "Create User"}
                   handleSubmit={() => userFormRef.current.save()}
                   submitTitle={update ? "Update" : "Create"}
                   submitReadOnly={!validationErrors}>
                <UserForm ref={userFormRef}
                          initialValues={selectedUser}
                          onSubmit={update ? doUpdateUser : doCreateUser}
                          readOnly={readOnly}
                          setValidationErrors={setValidationErrors}
                          currentUserId={authenticationService.getUserFromLocalCache().id}
                />
            </Modal>
            <Modal isOpen={changePasswordOpen}
                   handleClose={() => setChangePasswordOpen(false)}
                   title="Change Password"
                   handleSubmit={() => changePasswordFormRef.current.save()}
                   submitTitle={"Change Password"}
                   submitReadOnly={!validationErrors}>
                <ChangePasswordForm ref={changePasswordFormRef} existingPassword={selectedUser ? selectedUser.password : ''} onSubmit={doChangePassword} setValidationErrors={setValidationErrors} />
            </Modal>
        </Fragment>
    )
});


export default withSnackbar(UserComponent);
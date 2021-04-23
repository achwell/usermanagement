import React from 'react';
import PropTypes from 'prop-types';

import {format} from 'date-fns'
import {DataGrid, GridToolbar} from "@material-ui/data-grid";

function Usertable(props) {

    const renderEmailCell = params => <a href={`mailto:${params.value}`}>{params.value}</a>

    const renderDateCell = params => <span>{params.value ? format(new Date(params.value), 'yyyy-MM-dd') : ''}</span>

    const renderActiveCell = params => {
        const {active} = params.row;
        let activeIcon = active ? "check_circle_outline" : "highlight_off";
        let activeTitle = active ? "Active" : "Inactive";
        let activeClass = active ? "green" : "red";
        return (
            <i className={`material-icons icon-image-preview ${activeClass}`} title={activeTitle}>{activeIcon}</i>
        );
    }

    const renderUnlockedCell = params => {
        const {notLocked} = params.row;
        let lockIcon = notLocked ? "lock_open" : "lock";
        let title = notLocked ? "Unlocked" : "Locked";
        let lockClass = notLocked ? "green" : "red";

        return (
            <i className={`material-icons icon-image-preview ${lockClass}`} title={title}>{lockIcon}</i>
        );
    };

    const renderActionsCell = params => {
        const onClick = () => {
            return props.edit(params.row);
        };
        const onDelete = () => {
            return props.delete(params.row);
        };
        return <div>
            {props.canUpdate && <i className="material-icons icon-image-preview pointer" title="Edit user" onClick={onClick}>edit_note</i>}
            {props.canDelete && props.username !== params.row.username && <i className="material-icons icon-image-preview pointer" title="Delete user" onClick={onDelete}>delete</i>}
        </div>;
    };

    const columns = [
        {field: 'username', headerName: 'Username', flex: 1,},
        {field: 'firstName', headerName: 'First name', flex: 1.4,},
        {field: 'middleName', headerName: 'Middle name', flex: 1,},
        {field: 'lastName', headerName: 'Last name', flex: 1.4,},
        {field: 'email', headerName: 'Email', flex: 1.2, renderCell: params => renderEmailCell(params)},
        {field: 'phone', headerName: 'Phone', flex: 0.9,},
        {field: 'roleName', headerName: 'Role', flex: 1.5},
        props.canSeeLogintime && {
            field: 'joinDate',
            headerName: 'Join date',
            flex: 0.9,
            type: 'date',
            renderCell: params => renderDateCell(params)

        },
        props.canSeeLogintime && {
            field: 'lastLoginDateDisplay',
            headerName: 'Last login date',
            flex: 1,
            type: 'date',
            renderCell: params => renderDateCell(params)
        },
        {
            field: 'active',
            headerName: 'Active',
            flex: 0.9,
            renderCell: params => renderActiveCell(params)
        },
        {
            field: 'notLocked',
            headerName: 'Unlocked',
            flex: 0.9,
            renderCell: params => renderUnlockedCell(params)
        },
        (props.canUpdate || props.canDelete) &&
        {
            field: "id",
            sortable: false,
            filterable: false,
            headerName: "Actions",
            flex: 0.9,
            disableClickEventBubbling: true,
            renderCell: params => renderActionsCell(params)
        },
    ]

    const rows = props.rows.map(value => {
        const roleName = value.role.name;
        value.roleName = value.role ? roleName ? roleName.replace(/^(ROLE_)/, "") : "" : "";
        return value;
    });
    return (
        <div style={{height: '90vh', width: '100%'}}>
            <DataGrid rows={rows} columns={columns} pageSize={25} size="small" components={{Toolbar: GridToolbar,}} />
        </div>
    );
}

Usertable.propTypes = {
    rows: PropTypes.array.isRequired,
    edit: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
    canUpdate: PropTypes.bool.isRequired,
    canDelete: PropTypes.bool.isRequired,
    canSeeLogintime: PropTypes.bool.isRequired,
    username: PropTypes.string
}
export default Usertable;
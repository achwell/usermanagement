import React from 'react';
import {styled} from '@mui/material/styles';
import PropTypes from 'prop-types';

import {format} from 'date-fns'
import {DataGrid, GridToolbar} from '@mui/x-data-grid';
import {green, red} from "@mui/material/colors";
import {Check, Clear, Create, Delete, Lock, LockOpen} from "@mui/icons-material";
import {IconButton} from "@mui/material";

const PREFIX = 'Usertable';

const classes = {
    iconRed: `${PREFIX}-iconRed`,
    iconGreen: `${PREFIX}-iconGreen`,
    button: `${PREFIX}-button`
};

const red700 = red['700'];
const green600 = green['600'];


const Root = styled('div')((
    {
        theme
    }
) => ({
    [`& .${classes.iconRed}`]: {color: red700},
    [`& .${classes.iconGreen}`]: {color: green600},

    [`& .${classes.button}`]: {
        marginRight: theme.spacing(2),
    }
}));

function Usertable(props) {

    const renderEmailCell = params => <a href={`mailto:${params.value}`}>{params.value}</a>

    const renderDateCell = params => <span>{params.value ? format(new Date(params.value), 'yyyy-MM-dd') : ''}</span>

    const renderActiveCell = params => {
        return <Root>{params.row.active ? <Check className={classes.iconGreen} title="Active"/> :
            <Clear className={classes.iconRed} title="Inactive"/>}</Root>;
    }

    const renderUnlockedCell = params => {
        return <Root>{params.row.notLocked ? <LockOpen className={classes.iconGreen} title="Unlocked"/> :
            <Lock className={classes.iconRed} title="Locked"/>}</Root>;
    };

    const renderActionsCell = params => {
        const onEdit = () => {
            return props.edit(params.row);
        };
        const onDelete = () => {
            return props.delete(params.row);
        };
        return (
            <Root>
                {props.canUpdate &&
                <IconButton edge="start" className={classes.button} color="primary" aria-label="Edit user"
                            title="Edit user"
                            onClick={onEdit}><Create/></IconButton>}
                {props.canDelete && props.username !== params.row.username &&
                <IconButton edge="start" className={classes.button} color="primary" aria-label="Delete user"
                            title="Delete user" onClick={onDelete}><Delete/></IconButton>}
            </Root>
        );
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
            <DataGrid onRowClick={e => props.edit(e.row)} rows={rows} columns={columns} pageSize={25} size="small"
                      components={{Toolbar: GridToolbar,}}/>
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
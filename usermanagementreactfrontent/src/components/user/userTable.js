import React from 'react';
import PropTypes from 'prop-types';

import {format} from 'date-fns'
import {makeStyles} from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import {DataGrid, GridToolbar} from "@material-ui/data-grid";
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import IconButton from "@material-ui/core/IconButton";

const red700 = red['700'];
const green600 = green['600'];


const useStyles = makeStyles((theme) => ({
    iconRed: {color: red700},
    iconGreen: {color: green600},
    button: {
        marginRight: theme.spacing(2),
    },
}));

function Usertable(props) {

    const classes = useStyles();

    const renderEmailCell = params => <a href={`mailto:${params.value}`}>{params.value}</a>

    const renderDateCell = params => <span>{params.value ? format(new Date(params.value), 'yyyy-MM-dd') : ''}</span>

    const renderActiveCell = params => {
        return <>{params.row.active ? <CheckIcon className={classes.iconGreen} title="Active"/> :
            <ClearIcon className={classes.iconRed} title="Inactive"/>}</>;
    }

    const renderUnlockedCell = params => {
        return <>{params.row.notLocked ? <LockOpenIcon className={classes.iconGreen} title="Unlocked"/> :
            <LockIcon className={classes.iconRed} title="Locked"/>}</>;
    };

    const renderActionsCell = params => {
        const onEdit = () => {
            return props.edit(params.row);
        };
        const onDelete = () => {
            return props.delete(params.row);
        };
        return <div>
            {props.canUpdate &&
            <IconButton edge="start" className={classes.button} color="primary" aria-label="Edit user" title="Edit user"
                        onClick={onEdit}><CreateIcon/></IconButton>}
            {props.canDelete && props.username !== params.row.username &&
            <IconButton edge="start" className={classes.button} color="primary" aria-label="Delete user"
                        title="Delete user" onClick={onDelete}><DeleteIcon/></IconButton>}
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
            <DataGrid onRowClick={e => props.edit(e.row)}  rows={rows} columns={columns} pageSize={25} size="small" components={{Toolbar: GridToolbar,}} />
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
import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import PropTypes from 'prop-types';

export const Modal = ({isOpen, handleClose, title, subTitle, children, handleSubmit, submitTitle, submitReadOnly}) => {
    return (
        <Dialog
            open={isOpen}
            onClose={(event, reason) => {
                if(reason !== 'backdropClick') {
                    handleClose(event, reason);
                }
            }}
            aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContentText id="alert-dialog-subTitle">{subTitle}</DialogContentText>
            <DialogContent>{children}</DialogContent>
            <DialogActions>
                <Button onClick={handleClose} >Close</Button>
                {handleSubmit && submitTitle &&
                <Button onClick={handleSubmit} disabled={submitReadOnly}>{submitTitle}</Button>}
            </DialogActions>
        </Dialog>
    )
}
Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string,
    children: PropTypes.element.isRequired,
    handleSubmit: PropTypes.func,
    submitTitle: PropTypes.string,
    submitReadOnly: PropTypes.bool
}
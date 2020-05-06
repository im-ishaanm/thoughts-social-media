import React, { Component, Fragment } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';

// MUI
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';

import { connect } from 'react-redux';
import { deleteThought } from '../../redux/actions/dataActions';

const styles = {
    deleteButton: {
        top: '10%',
        right: 0,
        position: 'absolute'
    }
}

class DeleteThought extends Component {
    state = {
        open: false
    };

    handleOpen = () => {
        this.setState({ open: true });
    }

    handleClose = () => {
        this.setState({ open: false });
    }

    deleteThoughtFunc = () => {
        this.props.deleteThought(this.props.thoughtId);
        this.setState({ open: false });
    }

    render() {
        const { classes } = this.props
        return (
            <Fragment>
                <MyButton tip="Delete this thought" onClick={this.handleOpen} btnClassName={classes.deleteButton}>
                    <DeleteOutline color="secondary" />
                </MyButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle>
                        Are you sure you want to delete this thought?
                        </DialogTitle>
                    <DialogContent>
                        <Typography>
                            Thoughts will always come and go. If you choose to proceed,
                            this thought will be removed forever. No backsies.
                            </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                            </Button>
                        <Button onClick={this.deleteThoughtFunc} color="secondary">
                            Delete
                            </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

DeleteThought.propTypes = {
    deleteThought: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    thoughtId: PropTypes.string.isRequired
}

export default connect(null, { deleteThought })(withStyles(styles)(DeleteThought));

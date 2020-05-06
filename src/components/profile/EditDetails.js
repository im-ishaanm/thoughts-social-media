import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../../util/MyButton';


import { connect } from 'react-redux';
import { editDetails } from '../../redux/actions/userActions';

// MUI
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import EditIcon from '@material-ui/icons/Edit';

const styles = (theme) => ({
    ...theme.spreadThis,
    button: {
        float: 'right'
    }
})

class EditDetails extends Component {
    state = {
        bio: '',
        website: '',
        open: false
    }

    mapDetailsToState = credentials => {
        this.setState({
            bio: credentials.bio ? credentials.bio : '',
            website: credentials.website ? credentials.website : ''
        });
    }

    componentDidMount() {
        const { credentials } = this.props
        this.mapDetailsToState(credentials);
    }

    handleOpen = () => {
        this.setState({ open: true });
        this.mapDetailsToState(this.props.credentials);
    }

    handleClose = () => {
        this.setState({
            open: false
        });
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = () => {
        const userDetails = {
            bio: this.state.bio,
            website: this.state.website
        };
        this.props.editDetails(userDetails);
        this.handleClose();
    }

    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <MyButton tip="Edit profile details" onClick={this.handleOpen} btnClassName={classes.button}>
                    <EditIcon color="primary" />
                </MyButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm">
                    <DialogTitle>Edit details</DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField
                                name="bio"
                                type="text"
                                label="Bio"
                                multiline
                                rows="2"
                                placeholder="Enter something about yourself"
                                className={classes.textField}
                                value={this.state.bio}
                                onChange={this.handleChange}
                                fullWidth
                            />
                            <TextField
                                name="website"
                                type="text"
                                label="Website"
                                placeholder="A website you want to share"
                                className={classes.textField}
                                value={this.state.website}
                                onChange={this.handleChange}
                                fullWidth
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                            </Button>
                        <Button onClick={this.handleSubmit} color="primary">
                            Save Details
                            </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

EditDetails.propTypes = {
    editDetails: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    credentials: state.user.credentials
})

export default connect(mapStateToProps, { editDetails })(withStyles(styles)(EditDetails));

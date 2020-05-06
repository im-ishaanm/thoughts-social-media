import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../../util/MyButton';

// MUI
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
// Redux
import { connect } from 'react-redux';
import { postThought, clearErrors } from '../../redux/actions/dataActions';

const styles = theme => ({
    ...theme.spreadThis,
    submitButton: {
        position: 'relative',
        marginTop: '20px',
        marginBottom: '10px'
    },
    progressCircle: {
        position: 'absolute'
    },
    closeButton: {
        position: 'absolute',
        right: '0',
        top: '0'
    }
})

class PostThought extends Component {
    state = {
        open: false,
        body: '',
        errors: {}
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.UI.errors) {
            this.setState({
                errors: nextProps.UI.errors
            })
        };
        if (!nextProps.UI.errors && !nextProps.UI.loading) {
            this.setState({ body: '', open: false, errors: {} });
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit = event => {
        event.preventDefault();
        this.props.postThought({ body: this.state.body });
    }

    handleOpen = () => {
        this.setState({ open: true })
    }

    handleClose = () => {
        this.props.clearErrors();
    }

    render() {
        const { errors } = this.state;
        const { classes, UI: { loading } } = this.props;

        return (
            <Fragment>
                <MyButton onClick={this.handleOpen} tip="Post a thought">
                    <AddIcon />
                </MyButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm"
                >
                    <MyButton tip="Close" onClick={this.handleClose} tipClassName={classes.closeButton}>
                        <CloseIcon />
                    </MyButton>
                    <DialogTitle>Post a Thought</DialogTitle>
                    <DialogContent>
                        <form onSubmit={this.handleSubmit}>
                            <TextField
                                name="body"
                                type="text"
                                label="What are you thinking about?"
                                multiline
                                placeholder="Share your thought"
                                error={errors.body ? true : false}
                                helperText={errors.body}
                                className={classes.textField}
                                onChange={this.handleChange}
                                fullWidth
                            />
                            <Button type="submit" variant="contained" color="primary"
                                className={classes.submitButton} disabled={loading}>
                                Submit
                                {loading && (
                                    <CircularProgress size={30} className={classes.progressCircle} />
                                )}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }
}

PostThought.propTypes = {
    postThought: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
    clearThought: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    UI: state.UI
})

export default connect(mapStateToProps, { postThought, clearErrors })(withStyles(styles)(PostThought));
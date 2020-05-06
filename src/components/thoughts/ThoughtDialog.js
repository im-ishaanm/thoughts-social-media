import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../../util/MyButton';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import LikeButton from './LikeButton';
import Comments from './Comments';
import CommentForm from './CommentForm';
// MUI
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'

// Redux
import { connect } from 'react-redux';
import { getThought, clearErrors } from '../../redux/actions/dataActions';

// Icons
import CloseIcon from '@material-ui/icons/Close';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
import ChatIcon from '@material-ui/icons/Chat';

const styles = theme => ({
    ...theme.spreadThis,
    profileImage: {
        maxWidth: 200,
        height: 200,
        borderRadius: '50%',
        objectFit: 'cover'
    },
    dialogContent: {
        padding: 20
    },
    closeButton: {
        position: 'absolute',
        right: '0'
    },
    expandButton: {
        position: 'absolute',
        right: 0
    },
    loadingDiv: {
        textAlign: 'center',
        overflow: 'hidden'
    }
})

class ThoughtDialog extends Component {
    state = {
        open: false,
        oldPath: '',
        newPath: ''
    }

    componentDidMount() {
        if (this.props.openDialog) {
            this.handleOpen();
        }
    }


    handleOpen = () => {
        let oldPath = window.location.pathname;

        const { thoughtId } = this.props;
        const newPath = `/user/thought/${thoughtId}`;


        window.history.pushState(null, null, newPath);

        this.setState({ open: true, oldPath, newPath });
        this.props.getThought(this.props.thoughtId);
    }

    handleClose = () => {
        window.history.pushState(null, null, this.state.oldPath);
        this.setState({
            open: false
        })
        this.props.clearErrors();
    }

    render() {
        const { classes, thought: { thoughtId, body, createdAt, likeCount, commentCount, userImage, handle, comments }, UI: { loading } } = this.props;
        const dialogMarkup = loading ? (
            <div className={classes.loadingDiv}>
                <CircularProgress size={200} thickness={2} />
            </div>
        ) : (
                <Grid container spacing={10}>
                    <Grid item sm={5}>
                        <img src={userImage} className={classes.profileImage} alt="Profile" />
                    </Grid>
                    <Grid item sm={7}>
                        <Typography
                            component={Link}
                            color="primary"
                            variant="h5"
                            to={`/user/${handle}`}
                        >
                            {handle}
                        </Typography>
                        <hr className={classes.invisSep} />
                        <Typography variant="body2" color="textSecondary">
                            {handle} thought of this on {dayjs(createdAt).format('MMM DD YYYY @ h:mm a')}
                        </Typography>
                        <hr className={classes.invisSep} />
                        <Typography variant="body1">
                            {body}
                        </Typography>
                        <LikeButton thoughtId={thoughtId} />
                        <span>This thought has been liked {likeCount} time(s)</span>
                        <br />
                        <MyButton tip="Comments">
                            <ChatIcon color="primary" />
                        </MyButton>
                        <span>{commentCount} comment(s) have been made</span>
                    </Grid>
                    <hr className={classes.visSep} />
                    <CommentForm thoughtId={thoughtId} />
                    <Comments comments={comments} />
                </Grid>
            )

        return (
            <Fragment>
                <MyButton onClick={this.handleOpen} tip="Show More" tipClassName={classes.expandButton}>
                    <UnfoldMore color="primary" />
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
                    <DialogContent className={classes.dialogContent}>
                        {dialogMarkup}
                    </DialogContent>

                </Dialog>
            </Fragment>
        )
    }

}

ThoughtDialog.propTypes = {
    clearErrors: PropTypes.func.isRequired,
    getThought: PropTypes.func.isRequired,
    thoughtId: PropTypes.string.isRequired,
    handle: PropTypes.string.isRequired,
    thought: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    thought: state.data.thought,
    UI: state.UI
})

const mapActionsToProps = {
    getThought,
    clearErrors
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(ThoughtDialog));
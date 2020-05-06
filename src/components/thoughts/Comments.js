import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
// MUI
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    ...theme.spreadThis,
    commentImage: {
        maxWidth: '100%',
        height: 100,
        objectFit: 'cover',
        borderRadius: '5%'
    },
    commentData: {
        marginLeft: 20
    },
    commentDate: {
        marginLeft: 10
    }
});

class Comments extends Component {
    render() {
        const { classes, comments } = this.props;

        return (
            <Grid container>
                {comments.map((comment, index) => {
                    const { body, createdAt, userImage, userHandle } = comment;
                    return (
                        <Fragment key={createdAt}>
                            <Grid item sm={12}>
                                <Grid container>
                                    <Grid item sm={2}>
                                        <img src={userImage} alt="Comment" className={classes.commentImage} />
                                    </Grid>
                                    <Grid item sm={7}>
                                        <div className={classes.commentData}>
                                            <Typography
                                                variant="h5"
                                                component={Link}
                                                to={`/users/${userHandle}`}
                                                color="primary">
                                                {userHandle}
                                            </Typography>
                                            <Typography className={classes.commentDate} variant="body2" color="textSecondary">
                                                {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                                            </Typography>
                                            <hr className={classes.invisSep} />
                                            <Typography variant="body1">
                                                {body}
                                            </Typography>

                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                            {index !== comments.length - 1 && (
                                <hr className={classes.visSep} />
                            )}
                        </Fragment>
                    )
                })}
            </Grid>
        )

    }
}

Comments.propTypes = {
    comments: PropTypes.array.isRequired
}

export default withStyles(styles)(Comments);
import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';

import MyButton from '../../util/MyButton';
import DeleteThought from './DeleteThought';
import ThoughtDialog from './ThoughtDialog';
import LikeButton from './LikeButton';

// MUI stuff
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

// Icons
import ChatIcon from '@material-ui/icons/Chat';

// Redux
import { connect } from 'react-redux';

const styles = {
    card: {
        position: 'relative',
        display: 'flex',
        marginBottom: 20
    },
    image: {
        minWidth: 200,
        objectFit: 'cover'
    },
    content: {
        padding: 25
    }
}


class Thought extends Component {

    render() {
        dayjs.extend(relativeTime);

        const {
            classes,
            thought: {
                body,
                createdAt,
                userImage,
                handle,
                thoughtId,
                likeCount,
                commentCount
            },
            user: {
                authenticated,
                credentials: { userHandle }
            }
        } = this.props

        const deleteButton = authenticated && userHandle === handle ? (
            <DeleteThought thoughtId={thoughtId} />
        ) : null

        console.log(handle);

        return (
            <Card className={classes.card}>
                <CardMedia
                    className={classes.image}
                    image={userImage}
                    title="Profile Image"
                />
                <CardContent className={classes.content}>
                    <Typography variant="h5" component={Link} color='primary' to={`/user/${handle}`}>
                        {handle}
                    </Typography>
                    {deleteButton}
                    <Typography variant="body2" color="textSecondary">
                        {dayjs(createdAt).fromNow()}
                    </Typography>
                    <Typography variant="body1">{body}</Typography>
                    <LikeButton thoughtId={thoughtId} />
                    <span>Likes: {likeCount}</span>
                    <MyButton tip="Comments">
                        <ChatIcon color="primary" />
                    </MyButton>
                    <span>Comments: {commentCount}</span>
                    <ThoughtDialog openDialog={this.props.openDialog} thoughtId={thoughtId} />
                </CardContent>
            </Card>
        )
    }
}

Thought.propTypes = {
    user: PropTypes.object.isRequired,
    thought: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    openDialog: PropTypes.bool
}

const mapStateToProps = state => ({
    user: state.user
})

export default connect(mapStateToProps)(withStyles(styles)(Thought));

import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import dayjs from 'dayjs';
import EditDetails from './EditDetails'
import MyButton from '../../util/MyButton';
import ProfileSkeleton from '../../util/ProfileSkeleton';

// MUI
import Button from '@material-ui/core/Button';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
// Icons
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';

// Redux
import { logoutUser, uploadImage } from '../../redux/actions/userActions';

const styles = theme => ({
    ...theme.spreadThis
});

class Profile extends Component {

    handleImageChange = event => {
        const image = event.target.files[0];
        const formData = new FormData();
        formData.append('image', image, image.name);
        this.props.uploadImage(formData);
    }

    handleEditPicture = () => {
        const fileInput = document.getElementById('imageInput');
        fileInput.click();
    }

    handleLogout = () => {
        this.props.logoutUser();
    }

    render() {
        const {
            classes,
            user: {
                credentials: {
                    userHandle,
                    createdAt,
                    imageUrl,
                    bio,
                    website
                },
                loading,
                authenticated
            }
        } = this.props;

        let profileMarkup = !loading ? (authenticated ? (
            <Paper className={classes.paper}>
                <div className={classes.profile}>
                    <div className="image-wrapper">
                        <img className="profile-image" src={imageUrl} alt="profile" />
                        <input type="file" id="imageInput" hidden="hidden" onChange={this.handleImageChange} />
                        <MyButton tip="Edit profile picture" onClick={this.handleEditPicture} btnClassName="button">
                            <EditIcon color="primary" />
                        </MyButton>
                    </div>
                    <hr />
                    <div className="profile-details">
                        <MuiLink component={Link} to={`/users/${userHandle}`} color='primary' variant='h5'>
                            Hello, {userHandle}!
                        </MuiLink>
                        <hr />
                        {bio && <Typography variant="body2">{bio}</Typography>}
                        <hr />
                        {website && (
                            <Fragment>
                                <LinkIcon color="primary" />
                                <a href={`https://${website}`} target="_blank" rel="noopener noreferrer">
                                    {' '}{`https://${website}`}
                                    <hr />
                                </a>
                            </Fragment>
                        )}
                        <CalendarToday color="primary" />{' '}
                        <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
                    </div>
                    <MyButton tip="Logout" onClick={this.handleLogout}>
                        <KeyboardReturn color="primary" />
                    </MyButton>
                    <EditDetails />
                </div>
            </Paper>
        ) : (
                <Paper className={classes.paper}>
                    <Typography variant="body2" align="center">
                        Start posting your own thoughts by logging in
                        or signing up.
                    <div className={classes.buttons}>
                            <Button variant="contained" color="primary" component={Link} to="/login">
                                Login
                            </Button>
                            <Button variant="contained" color="secondary" component={Link} to="/signup">
                                Signup
                            </Button>
                        </div>
                    </Typography>
                </Paper>
            )) : (
                <div>
                    <ProfileSkeleton />
                </div>
            )

        return profileMarkup;
    }
}

const mapStateToProps = state => ({
    user: state.user
});

const mapActionsToProps = { logoutUser, uploadImage };

Profile.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Profile));

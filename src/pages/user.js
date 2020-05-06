import React, { Component } from 'react'
import PropTypes from 'prop-types';
import axios from 'axios';
import Thought from '../components/thoughts/Thought';
import StaticProfile from '../components/profile/StaticProfile';
import ThoughtSkeleton from '../util/ThoughtSkeleton';
import ProfileSkeleton from '../util/ProfileSkeleton';

// MUI
import Grid from '@material-ui/core/Grid';

// Redux
import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';

class user extends Component {

    state = {
        profile: null,
        thoughtIdParam: null
    }

    componentDidMount() {
        const handle = this.props.match.params.handle;
        const thoughtId = this.props.match.params.thoughtId;

        if(thoughtId) this.setState({ thoughtIdParam: thoughtId})



        this.props.getUserData(handle);
        axios.get(`/user/${handle}`)
            .then(res => {
                this.setState({
                    profile: res.data.user
                })
            })
            .catch(err => console.log(err));
    }


    render() {
        const { thoughts, loading } = this.props.data;
        const {thoughtIdParam} = this.state;
        const thoughtsMarkup = loading ? (
            <ThoughtSkeleton />
        ) : thoughts === null ? (
            <p>This user hasn't thought of anything yet.</p>
        ) : !thoughtIdParam ? (
            thoughts.map(thought => <Thought key={thought.thoughtId} thought={thought} />)
        ) : (
            thoughts.map(thought => {
                if(thought.thoughtId !== thoughtIdParam) {
                    return <Thought key={thought.thoughtId} thought={thought} />
                } else {
                    return <Thought key={thought.thoughtId} thought={thought} openDialog />
                }
            })
        )

        return (
            <Grid container spacing={3}>
                <Grid item sm={8} xs={12}>
                    {thoughtsMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    {this.state.profile === null ? (
                        <ProfileSkeleton />
                    ) : (
                       <StaticProfile profile={this.state.profile} />
                    )}
                </Grid>
            </Grid>
        )
    }
}

user.propTypes = {
    getUserData: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    data: state.data
})

export default connect(mapStateToProps, { getUserData })(user);

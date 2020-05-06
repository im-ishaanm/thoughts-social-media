import { SET_THOUGHTS, SET_THOUGHT, SUBMIT_COMMENT, STOP_LOADING_UI, LOADING_UI, LOADING_DATA, DELETE_THOUGHT, LIKE_THOUGHT, POST_THOUGHT, SET_ERRORS, CLEAR_ERRORS, UNLIKE_THOUGHT } from '../types';
import axios from 'axios';


export const getThoughts = () => dispatch => {
    dispatch({ type: LOADING_DATA });
    axios.get('/thoughts')
        .then(res => {
            dispatch({
                type: SET_THOUGHTS,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch({
                type: SET_THOUGHTS,
                payload: []
            })
        })
}

export const likeThought = (thoughtId) => dispatch => {
    axios.get(`/thought/${thoughtId}/like`)
        .then(res => {
            dispatch({
                type: LIKE_THOUGHT,
                payload: res.data
            })
        })
        .catch(err => console.log(err));
}

export const unlikeThought = (thoughtId) => dispatch => {
    axios.get(`/thought/${thoughtId}/unlike`)
        .then(res => {
            dispatch({
                type: UNLIKE_THOUGHT,
                payload: res.data
            })
        })
        .catch(err => console.log(err));
}

export const deleteThought = (thoughtId) => dispatch => {
    axios.delete(`/thought/${thoughtId}`)
        .then(() => {
            dispatch({ type: DELETE_THOUGHT, payload: thoughtId })
        })
        .catch(err => console.log(err));
}

export const postThought = newThought => dispatch => {
    dispatch({ type: LOADING_UI });
    axios.post('/postThought', newThought)
        .then(res => {
            dispatch({
                type: POST_THOUGHT,
                payload: res.data
            });
            dispatch({ type: CLEAR_ERRORS });
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })
        })
}

export const getThought = (thoughtId) => dispatch => {
    dispatch({ type: LOADING_UI });
    axios.get(`/thought/${thoughtId}`)
        .then(res => {
            dispatch({
                type: SET_THOUGHT,
                payload: res.data
            });
            dispatch({ type: STOP_LOADING_UI });
        })
        .catch(err => {
            console.log(err);
        })
}

export const submitComment = (thoughtId, commentData) => dispatch => {
    axios.post(`/thought/${thoughtId}/comment`, commentData)
        .then(res => {
            dispatch({
                type: SUBMIT_COMMENT,
                payload: res.data
            });
            dispatch(clearErrors());
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })
        })
}

export const getUserData = userHandle => dispatch => {
    dispatch({
        type: LOADING_DATA
    });
    axios.get(`/user/${userHandle}`)
        .then(res => {
            dispatch({
                type: SET_THOUGHTS,
                payload: res.data.thoughts
            });
        })
        .catch(() => {
            dispatch({
                type: SET_THOUGHTS,
                payload: null
            });
        });
}


export const clearErrors = () => dispatch => {
    dispatch({ type: CLEAR_ERRORS });
}
import { SET_USER, SET_AUTHENTICATED, SET_UNAUTHENTICATED, LOADING_USER, LIKE_THOUGHT, UNLIKE_THOUGHT, MARK_NOTIFICATIONS_READ } from '../types';

const initialState = {
    authenticated: false,
    credentials: {},
    loading: false,
    likes: [],
    notifications: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_AUTHENTICATED:
            return {
                ...state,
                authenticated: true
            };
        case SET_UNAUTHENTICATED:
            return initialState;
        case SET_USER:
            return {
                authenticated: true,
                loading: false,
                ...action.payload
            };
        case LOADING_USER:
            return {
                ...state,
                loading: true
            }
        case LIKE_THOUGHT:
            return {
                ...state,
                likes: [
                    ...state.likes,
                    {
                        userHandle: state.credentials.userHandle,
                        thoughtId: action.payload.thoughtId
                    }
                ]
            }
        case MARK_NOTIFICATIONS_READ:
            state.notifications.forEach(notif => notif.read = true);
            return {
                ...state
            }


        case UNLIKE_THOUGHT:
            return {
                ...state,
                likes: state.likes.filter(like => like.thoughtId !== action.payload.thoughtId)
            }
        default:
            return state;
    }
}
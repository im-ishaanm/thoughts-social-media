import { SUBMIT_COMMENT, SET_THOUGHTS, SET_THOUGHT, POST_THOUGHT, LIKE_THOUGHT, DELETE_THOUGHT, UNLIKE_THOUGHT, LOADING_DATA } from '../types';

const initialState = {
    thoughts: [],
    thought: {},
    loading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            }
        case SET_THOUGHTS:
            return {
                ...state,
                thoughts: action.payload,
                loading: false
            }
        case SET_THOUGHT:
            return {
                ...state,
                thought: action.payload
            }
        case LIKE_THOUGHT:
        case UNLIKE_THOUGHT:
            let index = state.thoughts.findIndex((thought) => thought.thoughtId === action.payload.thoughtId);
            state.thoughts[index] = action.payload;
            if (state.thought.thoughtId === action.payload.thoughtId) {
                state.thought = action.payload;
            }
            return {
                ...state
            };
        case DELETE_THOUGHT:
            let del_index = state.thoughts.findIndex(thought => thought.thoughtId === action.payload);
            state.thoughts.splice(del_index, 1);
            return {
                ...state
            };
        case POST_THOUGHT:
            return {
                ...state,
                thoughts: [
                    action.payload,
                    ...state.thoughts
                ]
            }
        case SUBMIT_COMMENT:
            return {
                ...state,
                thought: {
                    ...state.thought,
                    comments: [action.payload, ...state.thought.comments]
                }
            }
        default:
            return state;
    }
}
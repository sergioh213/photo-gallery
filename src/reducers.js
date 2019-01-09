export default function(state = {}, action) {
    if (action.type == 'USER_JOINED') {
        state = {
            ...state,
            users: [action.user, ...state.users]
        }
    }
    return state;
}

// dispatch // action // reducer

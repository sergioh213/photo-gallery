import axios from './axios'

export function userJoined(user) {
    return {
        type: 'USER_JOINED',
        user
    }
}

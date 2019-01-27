/**
 * Created by DeviD on 20.01.2019.
 */
export default {
    AUTHORIZATION: {
        SUCCESS: 'user-auth-success',
        FAILURE: 'user-auth-failure',
        COMPLETE: 'user-auth-complete',
        LOGOUT: 'user-auth-logout'
    },
    PLAYER: {
        PLAY: 'player-play',
        CAN_PLAY: 'player-can-play',
        SHUFFLE: 'player-shuffle'
    },
    PLAYLIST: {
        AUDIO_CHECK: 'audio-checked',
        AUDIO_UNCHECK: 'audio-unchecked',
    },
    SEARCH: {
        QUERY_CHANGE: 'search-query-change'
    },
    UPLOAD: {
        COMPLETE: 'upload-complete',
        ERROR: 'upload-error',
        FINISH: 'upload-finish',
        PROGRESS: 'upload-progress'
    }
};

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
        PAUSE: 'player-pause',
        ENDED: 'player-ended',
        CAN_PLAY: 'player-can-play',
        PLAY_NEXT: 'player-play-next',
        PLAY_PREV: 'player-play-prev',
    },
    PLAYLIST: {
        AUDIO_CHECK: 'audio-checked',
        AUDIO_UNCHECK: 'audio-unchecked',
        AUDIO_PAUSE: 'audio-paused',
        START_PLAY: 'audio-play',
        PLAY: 'playlist-play',
        FAV: 'playlist-fav',
    },
    SEARCH: {
        QUERY_CHANGE: 'search-query-change'
    },
    SORT: {
        SORT_CHANGED: 'sort-changed'
    },
    UPLOAD: {
        COMPLETE: 'upload-complete',
        ERROR: 'upload-error',
        FINISH: 'upload-finish',
        PROGRESS: 'upload-progress'
    }
};

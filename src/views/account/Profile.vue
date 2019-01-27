<template>
    <div class="profile">
        <Message v-if="profileError" :type="'error relative'">
            <div slot="body">
                There was an error while receiving profile data
                <p>
                    <button class="button" @click="loadUserData()">Try again</button>
                </p>
            </div>
        </Message>
        <div class="page-loading" v-if="!user && !profileError">
            <i class="fas fa-sync-alt fa-spin"></i>
        </div>
        <div class="profile-block" v-if="user && !profileError">
            <div class="profile-image">
                <img src="../../assets/userpic.jpg" alt="">
            </div>
            <div class="profile-info">
                <h1>{{ user.username }}</h1>
                <div class="profile-genres">
                    <a v-for="genre in user.genres" class="tag" href="#">{{ genre }}</a>
                </div>
                <div class="profile-artists">
                    <a v-for="artist in user.artists" class="tag" href="#">{{ artist }}</a>
                </div>
                <div class="profile-stats">
                    <a href="#">{{ user.audioCount }} tracks</a>
                    <!--<a href="#">{{ user.subscriptionsCount }} subscriptions</a> |-->
                    <!--<a href="#">{{ user.playlistsCount }} playlists</a>-->
                </div>
            </div>
            <div class="profile-controls">
                <a href="#" @click.prevent="logout()">Settings <i class="fa fa-cog"></i></a>
                <a href="#" class="profile-controls-logout" @click.prevent="logout()">Sign out</a>
            </div>
        </div>
        <Playlist :tracks="tracks" v-if="!empty && !tracksError"></Playlist>
        <div class="page-loading" v-if="tracksLoading && user">
            <i class="fas fa-sync-alt fa-spin"></i>
        </div>
        <Message v-if="tracksError && !tracksLoading" :type="'error relative'">
            <div slot="body">
                There was an error while receiving audio data
                <p>
                    <button class="button" @click="loadTracks()">Try again</button>
                </p>
            </div>
        </Message>
        <div class="row" v-if="empty">
            There are no any tracks uploaded :(
        </div>
    </div>
</template>

<style lang="less">
    @import "../../assets/less/tag.less";

    .profile {
        position: relative;

        &-image {
            img {
                width: 150px;
                height: 150px;
                border-radius: 2px;
            }
        }
        &-block {
            display: flex;
            padding: 0 10px;
            margin-bottom: 30px;
        }

        &-info {
            display: flex;
            flex-direction: column;
            margin-left: 20px;
            h1 {
                margin: 0 0 10px;
                line-height: 26px;
            }
        }

        &-controls {
            margin-left: auto;
            text-align: right;
            display: flex;
            align-items: flex-end;
            flex-direction: column;

            a {
                display: inline-block;
                margin-bottom: 10px;
            }

            &-logout {
                margin-top: auto;
            }
        }

        &-artists {
            margin-top: 20px;
        }

        &-stats {
            margin-top: auto;
            text-transform: uppercase;

            a {
                margin: 0 20px;
                color: #7d7d7d;

                &:hover {
                    color: #000;
                    text-decoration: none;
                }

                &:first-child {
                    margin-left: 0;
                }
            }
        }

        .page-loading {
            margin: 95px 0 92px;
        }
        .message.error {
            margin: 0 10px 30px;
            text-align: center;

        }
    }
</style>

<script>
    import events from "../../events";
    import client from "../../services/api-client";
    import Playlist from '@/components/Playlist.vue';
    import Message from '@/components/Message.vue';

    export default {
        name: "Profile",
        data: function () {
            return {
                empty: false,
                user: null,
                tracksError: false,
                tracksLoading: true,
                profileError: false,
                tracks: []
            };
        },
        mounted() {
            if (!this.$store.state.user) {
                return this.$router.push('/');
            }

            this.load();
        },
        methods: {
            load() {
                this.loadUserData();
            },
            logout() {
                this.$root.$emit(events.AUTHORIZATION.LOGOUT)
            },
            loadTracks() {
                this.tracksLoading = true;
                client.get('/audio/' + this.$store.state.user.username).then(
                    response => {
                        if (response.data.length === 0) {
                            this.empty = true;
                        }
                        this.tracks = response.data;
                        this.tracksLoading = false;
                        this.tracksError = false;
                    },
                    error => {
                        this.tracksLoading = false;
                        this.tracksError = true;
                    }
                );
            },
            loadUserData() {
                this.profileError = false;
                client.get('/user/' + this.$store.state.user.username).then(
                    response => {
                        this.user = response.body;
                        this.profileError = false;
                        this.loadTracks();
                    },
                    error => {
                        this.profileError = true;
                    });
            }
        },
        components: {Playlist, Message}
    };
</script>

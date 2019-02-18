<template>
    <div class="profile">
        <xhr-error message="profileError" v-if="profileError" @retry="loadUserData"></xhr-error>
        <page-header :image="image" :title="user.username" v-if="user && !profileError">
            <div slot="body">
                <div class="profile-genres">
                    <a v-for="genre in user.genres" class="tag" href="#">{{ genre }}</a>
                </div>
                <div class="profile-artists">
                    <a v-for="artist in user.artists" class="tag" href="#">{{ artist }}</a>
                </div>
            </div>
            <div slot="controls">
                <router-link to="/profile" class="button button-alt">{{ user.audio_count }} tracks</router-link>
                <router-link to="/profile/playlists" class="button button-alt">{{ user.audio_count }} playlists</router-link>
                <!--<a href="#">{{ user.subscriptionsCount }} subscriptions</a> |-->
                <a href="#" class="profile-controls-logout" @click.prevent="logout()">Sign out</a>
            </div>
        </page-header>
        <router-view></router-view>
    </div>
</template>

<style lang="less">
    @import "../../assets/less/tag.less";
    @import "../../assets/less/mixins";

    .profile {
        position: relative;

        &-image {
            img {
                width: 150px;
                height: 150px;
                border-radius: 2px;

                .responsive(450px, {
                    width: 50px;
                    height: 50px;
                });
            }
        }
        &-block {
            display: flex;
            padding: 0 10px;
            margin-bottom: 30px;

            .responsive(450px, {
                flex-direction: column;
            });
        }

        &-info {
            display: flex;
            flex-direction: column;
            margin-left: 20px;

            .responsive(450px, {
                margin-left: 0;
            });

            h1 {
                margin: 0 0 10px;
                line-height: 26px;

                .responsive(450px, {
                    position: absolute;
                    top: 0;
                    left: 75px;
                });
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
                position: absolute;
                top: 0;
                right: 0;

                .responsive(450px, {
                    top: 30px;
                    left: 75px;
                    right: auto;
                });
            }
        }

        &-artists {
            margin-top: 20px;
        }

        &-stats {
            margin-top: auto;
            text-transform: uppercase;
            .responsive(450px, {
                margin-top: 20px;
            });

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
    import client from "../../services/api/api-client";
    import xhrError from '../../components/xhr-error.vue';
    import pageHeader from '../_partials/page-header.vue';

    export default {
        name: "Profile",
        components: {xhrError, pageHeader},
        data: function () {
            return {
                empty: false,
                user: null,
                image: 'http://illegalcrew.net/data/avatars/l/0/200.jpg?1507446574',
                profileError: false,
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
            loadUserData() {
                this.profileError = false;
                client.get('/user/' + this.$store.state.user.username).then(
                    response => {
                        this.user = response.body;
                        this.profileError = false;
                    },
                    error => {
                        this.profileError = true;
                    });
            }
        }
    };
</script>

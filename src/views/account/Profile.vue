<template>
    <div class="profile">
        <div class="page-loading" v-if="!user">
            <i class="fas fa-sync-alt fa-spin"></i>
        </div>
        <div class="profile-block" v-if="user">
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
                    <a href="#">{{ user.audioCount }} tracks</a> |
                    <a href="#">{{ user.subscriptionsCount }} subscriptions</a> |
                    <a href="#">{{ user.playlistsCount }} playlists</a>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less">
    @import "../../assets/less/tag.less";

    .profile {
        padding: 0 10px;

        &-image {
            img {
                width: 150px;
                height: 150px;
                border-radius: 2px;
            }
        }
        &-block {
            display: flex;
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
                }

                &:first-child {
                    margin-left: 0;
                }
            }
        }
    }
</style>

<script>
    import Client from '../../client';

    export default {
        name: "Profile",
        data: function () {
            return {
                user: null
            };
        },
        mounted() {
            Client.get('/user/' + this.$store.state.user.username, (response) => {
                this.user = response.body;
            }, (error) => {
                console.log(error);
            })
        },
        methods: {

        },
    };
</script>
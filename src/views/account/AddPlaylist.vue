<template>
    <div class="playlist-add">
        <form class="playlist-form">
            <div class="playlist-image">
                <i class="fa fa-list"></i>
            </div>
            <div class="input-group">
                <label for="title">Title</label>
                <input type="text" class="input" id="title" name="title" v-model="playlist.title" ref="title">
                <label for="description">Description</label>
                <input type="text" class="input" id="description" name="description" v-model="playlist.description">
            </div>
            <button class="button save-playlist" @click.prevent="save()">Save</button>
            <hr class="clear">
            <a href="#" class="playlist-add-music" @click="showModal = true">
                <i class="fa fa-plus"></i> Add music
            </a>
            <Playlist
                    :tracks="playlist.audio"
                    :remove="true"
                    v-on:audioRemove="removeTrack"
                    v-if="playlist.audio">
            </Playlist>
        </form>
        <div class="page-loading page-loading-fixed" v-if="saving">
            <i class="fas fa-sync-alt fa-spin"></i>
        </div>
        <Modal v-if="showModal" v-on:close="showModal = false">
            <div slot="body">
                <Playlist :tracks="tracks" :checkboxes="true" v-on:audioAdd="addTracks"></Playlist>
            </div>
            <div slot="footer">
                <button class="button" @click="$root.$emit('add-to-playlist')">Add Selected</button>
            </div>
        </Modal>
    </div>
</template>

<style lang="less">
    .playlist-add {
        padding: 0 10px;
        position: relative;

        hr {
            padding: 10px 0;
        }

        .playlist-image {
            border-radius: 2px;
            width: 108px;
            height: 108px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 30px;
            background-color: #f4f9fc;
            color: #ddd;
            margin-right: 30px;
            float: left;

            img {
                width: 108px;
                height: 108px;
            }
        }

        .playlist-form {
            .input-group {
                float: left;
            }
            .playlist {
                margin: 0 -10px;
            }
            .save-playlist {
                float: right;
            }
        }

        .playlist-add-music {
            display: inline-block;
            margin-bottom: 20px;
        }
    }
</style>
<script>
    import Playlist from "@/components/Playlist.vue";
    import Modal from "@/components/Modal.vue";
    import Client from "../../client";
    import Events from "../../events";

    export default {
        name: "AddPlaylist",

        data: function () {
            return {
                showModal: false,
                saving: false,
                tracks: [],
                playlist: {
                    title: null,
                    description: null,
                    cover: null,
                    audio: null
                }
            };
        },
        watch: {
            'playlist.title': function (newVal, oldVal) {
                if (newVal !== null) {
                    this.$refs.title.classList.remove("input-error");
                }
            }
        },
        methods: {
            save() {
                this.saving = true;
                if (!this.playlist.title) {
                    this.saving = false;
                    this.$refs.title.focus();
                    this.$refs.title.placeholder = 'Please enter a title for this playlist';
                    this.$refs.title.classList.add("input-error");
                    return;
                }

                Client.post('/playlist', this.playlist,
                    response => {
                        this.saving = false;
                        this.$router.push('/profile/playlists');
                    },
                    error => {
                        this.saving = false;
                        console.error(error);
                    }
                );
            },
            addTracks(tracks) {
                this.showModal = false;
                if (tracks.length > 0) {
                    this.playlist.audio = tracks;
                }
            },
            removeTrack(track) {
                if (this.playlist.audio.indexOf(track) !== -1) {
                    this.playlist.audio = this.playlist.audio.filter(function (value, index, arr) {
                        return value !== track;
                    });
                    if (this.playlist.audio.length === 0) {
                        this.playlist.audio = null;
                    }
                }
            }
        },
        mounted() {
            Client.get("/audio/" + this.$store.state.user.username,
                response => {
                    this.tracks = response.data;
                },
                error => {
                    console.error(error);
                }
            );
        },
        components: {Playlist, Modal}
    };
</script>

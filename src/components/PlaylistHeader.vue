<template>
    <div class="playlist-header">
        <div class="playlist-image">
            <i class="fa fa-list"></i>
        </div>
        <div class="playlist-info" v-if="!edit">
            <h1>{{ playlist.title }}</h1>
            <div class="playlist-author">
                <a href="#">{{ playlist.user }}</a>
            </div>
            <div class="playlist-count">
                {{ playlist.audioCount }} tracks
            </div>
            <div class="playlist-description">
                {{ playlist.description }}
            </div>
        </div>
        <div class="input-group" v-if="edit">
            <label for="title">Title</label>
            <input type="text" class="input" id="title" name="title" v-model="playlist.title" ref="title">
            <label for="description">Description</label>
            <input type="text" class="input" id="description" name="description" v-model="playlist.description">
        </div>
        <div class="playlist-controls" v-if="playlist.user === $store.state.user.username && !edit">
            <a href="#" @click="edit = true"><i class="fa fa-edit"></i> Edit playlist</a>
            <p><a href="#"><i class="fa fa-plus"></i> Add music</a></p>
        </div>
        <button class="button save-playlist" @click.prevent="edit = false" v-if="edit">Save</button>
        <hr class="clear">
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
    .playlist-header {
        padding: 0 10px 15px;

        h1 {
            margin: 0;
            font-size: 20px;
        }

        hr {
            padding: 10px 0;
        }

        .playlist-controls {
            float: right;
            text-align: right;
        }

        .input-group {
            float: left;

            .input:last-child {
                margin-bottom: 0;
            }
        }

        .save-playlist {
            float: right;
        }

        .playlist-info {
            float: left;
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
    }
</style>

<script>
    import Playlist from "@/components/Playlist.vue";
    import Modal from "@/components/Modal.vue";
    import Client from "../services/api/api-client";
    import Events from "../events";

    export default {
        name: "PlaylistHeader",
        props: ["playlist"],
        watch: {
            'playlist.title': function (newVal, oldVal) {
                if (newVal !== null && this.$refs.title) {
                    this.$refs.title.classList.remove("input-error");
                }
            }
        },
        data: function () {
            return {
                edit: false,
                showModal: false,
                saving: false,
                tracks: [],
            };
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
    };
</script>
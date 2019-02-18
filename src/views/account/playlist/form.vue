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
        </form>
        <playlist
                v-if="playlist.audio.length > 0"
                :tracks="playlist.audio"
                :showRemove="true"
                @remove="onRemoveFromPlaylist">
        </playlist>
        <modal v-if="showModal" @close="showModal = false; tracks = [];">
            <div slot="header">Find and add some tracks</div>
            <div slot="body">
                <search :loading="searching" :autofocus="true" @change="onSearchValueChange"></search>
                <playlist
                        :tracks="tracks"
                        :showCheckboxes="true"
                        @add="onPlaylistAdd">
                </playlist>
            </div>
        </modal>
        <div class="page-loading page-loading-fixed" v-if="saving">
            <i class="fas fa-sync-alt fa-spin"></i>
        </div>
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
    import events from "../../../events";
    import search from '../../../components/search.vue';
    import modal from '../../../components/modal.vue';
    import playlist from '../../../components/playlist/playlist.vue';
    import audioService from '../../../services/api/audio';

    export default {
        name: "playlist-add",
        components: {search, playlist, modal},
        data: function () {
            return {
                saving: false,
                searching: false,
                showModal: false,
                tracks: [],
                playlist: {
                    title: null,
                    description: null,
                    cover: null,
                    audio: []
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
            onPlaylistAdd(track) {
                if (!this._inArray(track, this.playlist.audio)) {
                    this.playlist.audio.push(track);
                }
                track.added = true;
            },
            onRemoveFromPlaylist(track) {
                if (this._inArray(track, this.playlist.audio)) {
                    this.playlist.audio = this.playlist.audio.filter(function (value, index, arr) {
                        return value !== track;
                    });
                }
            },
            onSearchValueChange(query) {
                this.searching = true;
                audioService.get({query: query, limit: 999}).then(
                    data => {
                        this.searching = false;
                        let tracks = data._embedded.items;
                        tracks.forEach(track => {
                            track.added = this._inArray(track, this.playlist.audio);
                        });

                        this.tracks = tracks;
                    },
                    error => {
                        this.searching = false;
                    }
                )
            },
            save() {
                this.saving = true;
                if (!this.playlist.title) {
                    this.saving = false;
                    this.$refs.title.focus();
                    this.$refs.title.placeholder = 'Please enter a title for this playlist';
                    this.$refs.title.classList.add("input-error");
                    return;
                }

                console.log(this.playlist);
            },
            _inArray(item, array) {
                let inArray = false;
                array.forEach(value => {
                    if (value.id === item.id) {
                        inArray = true;
                    }
                });

                return inArray;
            }
        }
    };
</script>

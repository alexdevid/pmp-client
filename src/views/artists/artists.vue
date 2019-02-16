<template>
    <div class="artists-page">
        <artist-thumb v-for="artist in artists" :artist="artist"></artist-thumb>
    </div>
</template>

<script>
    import ArtistThumb from './artist-thumb.vue';

    export default {
        name: "artists",

        data () {
            return {
                artists: [
                    {id: 1, title: 'The Prodigy', genres: 'Techno', audioCount: 13},
                    {id: 2, title: 'Metallica', genres: 'Metall', audioCount: 43},
                    {id: 2, title: 'Lady Gaga', genres: 'Pop', audioCount: 23},
                    {id: 1, title: 'The Prodigy', genres: 'Techno', audioCount: 13},
                    {id: 2, title: 'Metallica', genres: 'Metall', audioCount: 43},
                    {id: 2, title: 'Lady Gaga', genres: 'Pop', audioCount: 23},
                    {id: 1, title: 'The Prodigy', genres: 'Techno', audioCount: 13},
                    {id: 2, title: 'Metallica', genres: 'Metall', audioCount: 43},
                    {id: 2, title: 'Lady Gaga', genres: 'Pop', audioCount: 23},
                    {id: 1, title: 'The Prodigy', genres: 'Techno', audioCount: 13},
                    {id: 2, title: 'Metallica', genres: 'Metall', audioCount: 43},
                    {id: 2, title: 'Lady Gaga', genres: 'Pop', audioCount: 23},
                    {id: 1, title: 'The Prodigy', genres: 'Techno', audioCount: 13},
                    {id: 2, title: 'Metallica', genres: 'Metall', audioCount: 43},
                    {id: 2, title: 'Lady Gaga', genres: 'Pop', audioCount: 23},
                ]
            };
        },
        components: {ArtistThumb}
    };
</script>

import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            name: "home",
            component: () => import("./views/Home.vue")
        },
        // {
        //     path: "/radio",
        //     name: "radio",
        //     component: () => import("./views/Radio.vue")
        // },
        {
            path: "/login",
            name: "login",
            component: () => import("./views/Login.vue")
        },
        {
            path: "/artist/:id",
            name: "artist",
            component: () => import("./views/artists/artist.vue")
        },
        // {
        //     path: "/about",
        //     name: "about",
        //     component: () => import("./views/standalone/About.vue")
        // },
        // {
        //     path: "/ads",
        //     name: "ads",
        //     component: () => import("./views/standalone/Ads.vue")
        // },
        // {
        //     path: "/contact",
        //     name: "contact",
        //     component: () => import("./views/standalone/Contact.vue")
        // },
        // {
        //     path: "/help",
        //     name: "help",
        //     component: () => import("./views/standalone/Help.vue")
        // },
        // {
        //     path: "/news",
        //     name: "news",
        //     component: () => import("./views/standalone/News.vue")
        // },
        // {
        //     path: "/privacy",
        //     name: "privacy",
        //     component: () => import("./views/standalone/Privacy.vue")
        // },
        {
            path: "/upload",
            name: "upload",
            component: () => import("./views/Upload.vue")
        },
        {
            path: "/profile",
            name: "profile",
            component: () => import("./views/account/profile.vue")
        },
        {
            path: "/profile/music",
            name: "profile-music",
            component: () => import("./views/account/Favorites.vue")
        },
        // {
        //     path: "/profile/playlists",
        //     name: "playlists",
        //     component: () => import("./views/account/Playlists.vue")
        // },
        // {
        //     path: "/profile/playlist/add",
        //     name: "playlist-add",
        //     component: () => import("./views/account/AddPlaylist.vue")
        // },
        // {
        //     path: "/playlist/:id",
        //     name: "playlist-page",
        //     component: () => import("./views/PlaylistPage.vue")
        // },
        // {
        //     path: "/profile/settings",
        //     name: "settings",
        //     component: () => import("./views/account/Settings.vue")
        // },
        // {
        //     path: "/profile/subscriptions",
        //     name: "subscriptions",
        //     component: () => import("./views/account/Follows.vue")
        // }
        {
            path: "*",
            component: () => import("./views/standalone/NotFound.vue")
        },
    ]
});

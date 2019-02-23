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
            component: () => import("./views/homepage.vue")
        },
        // {
        //     path: "/radio",
        //     name: "radio",
        //     component: () => import("./views/Radio.vue")
        // },
        {
            path: "/login",
            name: "login",
            component: () => import("./views/login.vue")
        },
        {
            path: "/artist/:id",
            name: "artist",
            component: () => import("./views/artist.vue")
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
            component: () => import("./views/upload/upload.vue")
        },
        {
            path: "/profile",
            name: "profile",
            component: () => import("./views/account/profile.vue"),
            children: [
                {
                    path: "",
                    name: "profile-music",
                    component: () => import("./views/account/favorites.vue")
                },
                {
                    path: "playlists",
                    name: "profile-playlists",
                    component: () => import("./views/account/playlist/list.vue")
                },
                {
                    path: "playlist/add",
                    name: "playlist-add",
                    component: () => import("./views/account/playlist/form.vue")
                },
            ]
        },
        // {
        //     path: "/profile/music",
        //     name: "profile-music",
        //     component: () => import("./views/account/Favorites.vue")
        // },
        {
            path: "/playlist/:id",
            name: "playlist-page",
            component: () => import("./views/playlist-page.vue")
        },
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

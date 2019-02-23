<template>
    <div class="top-nav">
        <router-link to="/" class="top-nav-item">
            Music
        </router-link>
        <router-link class="top-nav-item top-nav-item-user"
                     to="/login"
                     v-if="$store.state.user === null && authorized"
        >
            Login
        </router-link>
        <div class="user-menu" v-if="$store.state.user !== null">
            <a class="top-nav-item" href="#" ref="dropdownToggle" @click.default="showDropdown = !showDropdown">
                {{ $store.state.user.username }} <i class="fa fa-chevron-down"></i>
            </a>
            <div class="user-menu-dropdown" ref="dropdownMenu" v-show="showDropdown">
                <div class="dropdown-item" @click="goTo('/profile')">
                    Profile
                </div>
                <div class="dropdown-item" @click="goTo('/upload')">
                    Upload
                </div>
                <div class="dropdown-item" @click="goTo('/')">
                    Logout
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import events from '../events';

    export default {
        name: "TopNav",
        components: {},
        data: function () {
            return {
                authorized: false,
                showDropdown: false,
            };
        },
        mounted() {
            document.addEventListener('click', this.onDocumentClick);
            this.$root.$on(events.AUTHORIZATION.COMPLETE, user => {
                this.authorized = true;
            });
        },
        methods: {
            onDocumentClick(e) {
                if (this.$store.state.user === null) {
                    return;
                }

                let dropdown = this.$refs.dropdownMenu;
                let toggle = this.$refs.dropdownToggle;
                let target = e.target;
                if ((dropdown !== target && !dropdown.contains(target)) && (toggle !== target && !toggle.contains(target))) {
                    this.showDropdown = false;
                }
            },
            goTo(route) {
                this.showDropdown = false;

                return this.$router.push(route);
            }
        }
    };
</script>

<style lang="less">
    .top-nav {
        max-width: 960px;
        margin: 0 auto;
        display: flex;

        &-item {
            padding: 14px 10px;
            color: #fff;
            display: inline-block;

            &:hover,
            &.router-link-exact-active {
                color: #fff;
                text-decoration: none;
                background-color: lighten(#2f4f4f, 10);
            }
        }

        .user-menu {
            margin-left: auto;
            position: relative;

            &-dropdown {
                position: absolute;
                top: 100%;
                right: 0;
                width: 150px;
                cursor: pointer;
                padding: 5px 0;
                background-color: #2f4f4f;

                .dropdown-item {
                    padding: 10px 20px;
                    color: #fff;
                    text-align: right;

                    &:hover {
                        background-color: lighten(#2f4f4f, 10);
                    }
                }
            }
        }
    }
</style>

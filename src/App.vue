<template>
    <v-app>
        <div style="display: flex; flex-direction: row; position: relative; height: 100vh">
            <v-navigation-drawer mini-variant mini-variant-width="70px" expand-on-hover permanent dark height="100%" color="pink">
                <v-list dense nav class="py-0">
                    <v-list-item two-line class="px-0 mb-0">
                        <v-list-item-avatar>
                            <img src="../src/assets/logo.png">
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title>FastCart Dashboard</v-list-item-title>
                            <v-list-item-subtitle>{{username}}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider style="background-color: lightgray;margin-bottom: 5px"></v-divider>
                    <v-list-item @click.stop="logout">
                        <v-list-item-icon>
                            <v-icon>mdi-logout</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Sign Out</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

                    <v-divider style="background-color: lightgray;margin-bottom: 10px"></v-divider>

                    <v-list-item v-for="item in items" :key="item.title" link :to="item.link">
                        <v-list-item-icon>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>
            <router-view class="router"></router-view>
        </div>
    </v-app>
</template>

<script>
    import * as firebase from "firebase";

    export default {
        name: 'App',
        data: () => ({
            items: [
                { title: 'Products', icon: 'mdi-view-list', link:"/products" },
                { title: 'Users', icon: 'mdi-account-multiple', link:"/users", }
            ],
        }),
        computed: {
            username() {
                let self=this;
                if (self.$store.state.user.data!==null) {
                    return self.$store.state.user.data.email
                } else {
                    return "Not Signed In"
                }
            }
        },
        methods: {
            logout() {
                firebase.auth().signOut()
                    .then(() => {
                        this.$router.replace({
                            name: "login"
                        });
                    })
            }
        }
    }
</script>

<style>

    .router {
        height: 100vh;
        overflow-y: scroll;
        width: 100%;
    }
    /* Hide scrollbar for Chrome, Safari and Opera */
    .router::-webkit-scrollbar {
        display: none;
    }

    /* Hide scrollbar for IE and Edge */
    .router {
        -ms-overflow-style: none;
    }
</style>

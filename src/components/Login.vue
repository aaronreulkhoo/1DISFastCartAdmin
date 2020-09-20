<template>
    <v-layout align-center justify-center class="login">
        <v-snackbar
                v-model="snackbar"
                color="red darken-2"
                :timeout="3000"
        >
            {{ snackbarText }}
            <v-btn
                    text
                    color="white"
                    @click="snackbar = false"
            >
                CLOSE
            </v-btn>
        </v-snackbar>
        <v-flex xs12 sm8 md6 lg4>
            <v-img :src="require('../assets/login.svg')" contain aspect-ratio="2"/>
            <v-card class="elevation-0 pa-2" tile>
                <v-toolbar color="pink" dark flat>
                    <v-toolbar-title>FastCart Admin Dashboard</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-form>
                        <v-text-field
                                v-model="email"
                                label="Email"
                                name="email"
                                prepend-icon="person"
                                color="pink"
                                type="text"
                        ></v-text-field>
                        <v-text-field
                                v-model="password"
                                id="password"
                                label="Password"
                                name="password"
                                prepend-icon="lock"
                                color="pink"
                                type="password"
                        ></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="pink" outlined large block dark @click="login">Login</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    import * as firebase from "firebase";

    export default {
        name: 'Login',
        methods: {
            login: function () {
                let self=this;
                firebase.firestore().collection("admins").doc(self.email).get()
                    .then((docSnapshot) => {
                        if (docSnapshot.exists) {
                            firebase.auth().signInWithEmailAndPassword(self.email, self.password)
                                .then(() => {
                                    self.$router.replace({ name: "products" });
                                })
                                .catch(err => {
                                    self.snackbarText=err.message;
                                    self.snackbar=true;
                                });
                        } else {
                            self.snackbarText="This account does not belong to a valid administrator.";
                            self.snackbar=true;
                        }
                    });

            },
        },
        data () {
            return {
                email:"",
                password:"",
                snackbar:"",
                snackbarText:"",
            }
        }
    }
</script>

<style scoped>
    .login{
        position: fixed;
        height: 100vh;
        width: 100vw;
        background-color: #e91e63;
        z-index: 1;
        overflow: hidden;
    }
</style>

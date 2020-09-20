<template>
    <div class="users">
        <v-snackbar
                v-model="snackbar"
                color="#E91E63"
                :timeout="3000"
        >
            Work In Progress
            <v-btn
                    text
                    color="white"
                    @click="snackbar = false"
            >
                CLOSE
            </v-btn>
        </v-snackbar>
        <v-card-title>
            <h2 class="mr-5 mb-3" style="word-break: keep-all">User Database</h2>
            <v-progress-circular
                class="mb-3"
                v-if="loading"
                indeterminate
                color="green"
            ></v-progress-circular>
            <v-spacer></v-spacer>
            <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search For Users"
                    color="pink"
                    single-line
                    hide-details
            ></v-text-field>
        </v-card-title>
        <v-data-table :headers="headers" :items="items" :search="search" >
                <template v-slot:item.membership="{item}">
                    <v-chip :color="getStatusColor(item.membership)" dark>{{getStatus(item.membership)}}</v-chip>
                </template>
                <template v-slot:item.history="{item}">
                    <a style="cursor: pointer" @click="seeHistory(item.id)"><v-icon>mdi-receipt</v-icon></a>
                </template>
        </v-data-table>
    </div>
</template>

<script>
    import * as firebase from 'firebase/app';
    import "firebase/firestore";
    export default {
        name: "Products",
        methods: {
            getStatus(available){
                if (available) return "Yes";
                else return "No"
            },
            getStatusColor(available) {
                if (available) return 'pink';
                else return "#AAAAAA"
            },
            seeHistory(id){
                let self=this;
                self.snackbar=true;
                console.log(id)
                // this.$router.push(`/products/${id}`)
            },
        },
        created() {
            let self=this;
            firebase.firestore().collection("users")
                .onSnapshot(function(querySnapshot) {
                    let data = [];
                    querySnapshot.forEach(function(doc) {
                        data.push({
                            id:doc.id,
                            email:doc.data().email,
                            firstname:doc.data().firstname,
                            lastname:doc.data().lastname,
                            membership:doc.data().membership,
                        });
                    });
                   self.items=data;
                   self.loading=false;
                });
        },
        data () {
            return {
                search: '',
                loading: true,
                snackbar: false,
                headers: [
                    { text: 'Email Address', align: 'start', value: 'email'},
                    { text: 'First Name', value: 'firstname'},
                    { text: 'Last Name', value: 'lastname'},
                    { text: 'Value Member', value: 'membership'},
                    { text: 'Purchase History', value: 'history', sortable: false},
                ],
                items: [],
            }
        },
    }
</script>

<style scoped>
    .users{
        width: 95%;
        padding: 12px;
    }
    a {
        color: #4CAF50;
    }
</style>

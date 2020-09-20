<template>
    <div>
        <v-snackbar
                v-model="snackbar"
                color="success"
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
        <v-dialog v-model="addDialog" max-width="400">
            <v-card class="pa-5">
                <v-text-field
                        v-model="add"
                        class="text-field"
                        label="Stock (Units)"
                        outlined
                        flat
                        color="pink"
                        :rules="stockRules"
                ></v-text-field>
                <v-btn class="white--text"
                       v-if="!loading"
                       color="pink"
                       depressed
                       large
                       block
                       :disabled="addPassRule"
                       @click="addStock"
                > Add Stock </v-btn>
            </v-card>
        </v-dialog>

        <v-dialog v-model="removeDialog" max-width="400">
            <v-card class="pa-5">
                <v-text-field
                        v-model="remove"
                        class="text-field"
                        label="Stock (Units)"
                        outlined
                        flat
                        color="red darken-2"
                        :rules="stockRules"
                ></v-text-field>
                <v-btn class="white--text"
                       v-if="!loading"
                       color="red darken-2"
                       depressed
                       large
                       block
                       :disabled="removePassRule"
                       @click="removeStock"
                >Remove Stock </v-btn>
            </v-card>
        </v-dialog>

        <!--Buttons-->
        <div class="stock-bar">
            <v-text-field
                    v-model="stock"
                    class="text-field mt-2"
                    label="Stock (Units)"
                    outlined
                    flat
                    color="pink"
                    hint="You may only use discrete add/remove transactions on inventory."
                    readonly
            ></v-text-field>
            <div class="stock-button-container">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on}">
                        <v-btn class="stock-button"
                               v-bind="attrs" v-on="on"
                               color="pink"
                               depressed
                               dark
                               x-large
                               @click="addDialog=true"
                        ><v-icon x-large>mdi-plus</v-icon></v-btn>
                    </template>
                    <span>Add Inventory</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn class="stock-button"
                               v-bind="attrs" v-on="on"
                               color="red darken-2"
                               depressed
                               dark
                               x-large
                               @click="removeDialog=true"
                        ><v-icon x-large>mdi-minus</v-icon></v-btn>
                    </template>
                    <span>Remove Inventory</span>
                </v-tooltip>
            </div>
        </div>
    </div>
</template>

<script>
    import * as firebase from "firebase";

    export default {
        name: "StockInfo",
        props: {
            stock:Number,
            loading:Boolean,
            id:String
        },
        computed: {
            stockRules () {
                return [
                    value => !!value || 'Field is required',
                    value => /^[1-9]\d*$/.test(value) || 'Please only a positive non-zero integer.',
                ]
            },
            addPassRule() {
                let self=this;
                return !/^[1-9]\d*$/.test(self.add)
            },
            removePassRule() {
                let self=this;
                return !/^[1-9]\d*$/.test(self.remove) || self.stock<self.remove
            }
        },
        data () {
            return {
                attrs:"",
                add:1,
                remove:1,
                snackbar:false,
                snackbarText:"",
                addDialog:false,
                removeDialog:false
            }
        },
        methods: {
            addStock: async function() {
                let self=this;
                firebase.firestore().collection("products").doc(self.id).update({
                    stock: firebase.firestore.FieldValue.increment(Number(self.add))
                });
                self.snackbarText="Added "+self.add+" unit(s) to "+self.id;
                self.snackbar=true;
                self.addDialog=false;
                self.add=1;
            },
            removeStock: async function() {
                let self=this;
                firebase.firestore().collection("products").doc(self.id).update({
                    stock: firebase.firestore.FieldValue.increment(-1*Number(self.remove))
                });
                self.snackbarText="Removed "+self.remove+" unit(s) from "+self.id;
                self.snackbar=true;
                self.removeDialog=false;
                self.remove=1;
            }
        },
    }
</script>

<style scoped>
    .text-field{
        font-size: 1.5em;
    }
    .stock-bar {
        display: flex;
        flex-direction: row;
    }
    .stock-button-container{
        display: flex;
    }
    .stock-button {
        margin: 10px 0 0 10px;
    }
    /* Medium devices (landscape tablets, 768px and up) */
    @media only screen and (max-width: 600px) {
        .stock-bar {
            display: flex;
            flex-direction: column;
        }
        .stock-button-container{
            display: flex;
            margin-bottom: 25px;
            justify-content: space-between;
        }
        .stock-button {
            margin: 0;
            width: calc(50% - 5px)
        }
    }

</style>

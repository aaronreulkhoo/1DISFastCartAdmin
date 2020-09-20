<template>
    <div>
        <v-btn dark
           class="mb-3"
           v-if="!loading"
           color="pink"
           rounded depressed
           @click.stop="dialog = true"
        >Add Product</v-btn>
        <v-dialog v-model="dialog" max-width="800">
            <v-card class="pa-5">
                <h2 class="mb-5">Add A New Product</h2>
                <div class="add-product-row">
                    <v-text-field
                            v-model="id"
                            class="text-field font-weight-bold mr-4"
                            label="Product ID"
                            outlined
                            :disabled="lockId"
                            flat
                            color="pink"
                            hint="Product ID cannot be changed once set."
                    ></v-text-field>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn class="stock-button white--text"
                                   v-bind="attrs" v-on="on"
                                   :color="checkColor"
                                   depressed
                                   :disabled="id.length===0"
                                   x-large
                                   style="margin-top: 1px; height: 55px"
                                   @click="checkID"
                            ><v-icon large>{{checkIcon}}</v-icon></v-btn>
                        </template>
                        <span>{{checkText}}</span>
                    </v-tooltip>
                </div>
                <div class="add-product-row">
                    <v-text-field
                            v-model="name"
                            label="Product Name"
                            outlined
                            class="text-field mr-4"
                            flat
                            color="pink"
                            :rules="nameRules"
                    ></v-text-field>
                    <v-text-field
                            class="text-field ml-4"
                            v-model="price"
                            label="Price ($)"
                            outlined
                            flat
                            color="pink"
                            :rules="priceRules"
                    ></v-text-field>
                </div>
                <div class="add-product-row">
                    <v-text-field
                            v-model="stock"
                            class="text-field mr-4"
                            label="Stock (Units)"
                            outlined
                            flat
                            color="pink"
                            :rules="stockRules"
                    ></v-text-field>
                    <v-text-field
                            v-model="weight"
                            class="text-field ml-4"
                            label="Weight (g)"
                            outlined
                            flat
                            color="pink"
                            :rules="weightRules"
                    ></v-text-field>
                </div>
                <v-select
                    v-model="category"
                    class="text-field"
                    :items="categoriesName"
                    color="pink"
                    label="Select Product Category"
                    :menu-props="{top:true, maxHeight:350}"
                    outlined
                    hide-details
                ></v-select>
                <v-btn class="mt-10 white--text"
                       v-if="!loading"
                       color="pink"
                       depressed
                       x-large
                       block
                       :disabled="allRules"
                       @click="addData"
                >Add Product <v-icon right>mdi-upload</v-icon></v-btn>
<!--                <v-btn class="mt-5 white&#45;&#45;text"-->
<!--                       v-if="!loading"-->
<!--                       color="red darken-2"-->
<!--                       depressed-->
<!--                       x-large-->
<!--                       block-->
<!--                >Cancel <v-icon right>mdi-close</v-icon></v-btn>-->
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import * as firebase from 'firebase';
    import 'firebase/firestore';
    export default {
        name: "AddProduct",
        props:{
            loading:Boolean
        },
        methods: {
            addData: async function() {
                let self=this;
                firebase.firestore().collection("products").doc(self.id).set({
                    name: self.name,
                    price:self.price,
                    stock: self.stock,
                    weight: self.weight,
                    category: self.categoriesName.indexOf(self.category)
                }).then(function() {
                    console.log("Document successfully written!");
                    self.name;
                    self.id="";
                    self.lockId=false;
                    self.price="";
                    self.stock="";
                    self.weight="";
                    self.category="";
                    self.dialog=false;
                })
                    .catch(function(error) {
                        console.error("Error writing document: ", error);
                    });
            },
            checkID: async function() {
                let self=this;
                if (!self.lockId) {
                    firebase.firestore().collection("products").doc(self.id).get()
                    .then((docSnapshot) => {
                        if (docSnapshot.exists) {
                            self.checkText="This Product ID Is Already Being Used";
                            self.checkColor="red darken-2";
                            self.checkIcon="mdi-alert-circle-outline";
                        } else {
                            self.checkText="This Product ID Is Available";
                            self.checkColor="success";
                            self.checkIcon="mdi-checkbox-marked-circle-outline";
                            self.lockId=true;
                        }
                    });
                } else {
                    self.checkColor="#E91E63";
                    self.checkIcon="mdi-adjust";
                    self.checkText="Check Existing ID";
                    self.lockId=false;
                }
            }
        },
        computed: {
            nameRules () {
                return [
                    value => !!value || 'Field is required',
                    value => /^[a-zA-Z0-9 ]*$/.test(value) || 'Please only enter alphanumeric characters.',
                ]
            },
            priceRules () {
                return [
                    value => !!value || 'Field is required',
                    value => /^[0-9]*\.[0-9]{2}$/.test(value) || 'Please only enter a number with 2 decimal places.',
                ]
            },
            stockRules () {
                return [
                    value => !!value || 'Field is required',
                    value => /^[1-9]\d*$/.test(value) || 'Please only a positive non-zero integer.',
                ]
            },
            weightRules () {
                return [
                    value => !!value || 'Field is required',
                    value => /^[1-9]\d*$/.test(value) || 'Please only a positive non-zero integer.',
                ]
            },
            allRules() {
                let self=this;
                return !self.lockId || self.name==="" || !/^[a-zA-Z0-9 ]*$/.test(self.name) || self.price==="" || !/^[0-9]*\.[0-9]{2}$/.test(self.price) || self.stock==="" || !/^[1-9]\d*$/.test(self.stock) || self.weight==="" || !/^[1-9]\d*$/.test(self.weight) || self.category===""
            }
        },
        data () {
            return {
                name:"",
                price:"",
                stock: "",
                weight: "",
                category:"",
                id:"",
                lockId: false,
                checkColor:"#E91E63",
                checkIcon:"mdi-adjust",
                checkText:"Check Existing ID",
                dialog: false,
                categoriesName: [
                    "Beverages",
                    "Bread/Bakery",
                    "Canned/Jarred Goods",
                    "Milk & Dairy",
                    "Dry/Baking Goods",
                    "Frozen Foods",
                    "Meat & Poultry",
                    "Fresh Produce",
                    "Household Goods",
                    "Personal Care",
                    "Other"
                ],
            }
        }
    }
</script>

<style scoped>
    .add-product-row {
        display: flex;
        padding-bottom: 8px;
    }
    .text-field {
        font-size: 1.5em;
        width: 100%;
    }
    .v-select >>> .v-select__selections {
        line-height: 1.5em;
    }

</style>

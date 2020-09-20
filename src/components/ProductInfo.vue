<template>
    <div class="productInfo">
        <v-breadcrumbs :items="items" large>
            <template v-slot:divider>
                <v-icon>mdi-chevron-right</v-icon>
            </template>
        </v-breadcrumbs>
        <v-row class="mx-4 flex-column" no-gutters>
            <v-snackbar
                v-model="snackbar"
                :color="snackbarColor"
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
            <v-text-field
                    v-model="name"
                    v-if="!loading"
                    solo
                    label="Name"
                    filled
                    class="text-field font-weight-bold"
                    flat
                    hide-details
                    color="pink"
                    @change="edited=true"
            ></v-text-field>
            <h3 class="font-weight-regular ml-3">Product ID: {{this.id}}
                <span style="cursor:pointer" @click.stop="barcodeDialog = true" id="tooltip-target-1">
                    <v-tooltip right>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon large class="mb-1" color="black" v-bind="attrs" v-on="on">mdi-barcode</v-icon>
                        </template>
                        <span>Preview Barcode</span>
                    </v-tooltip>
                </span>
            </h3>

            <v-text-field
                    v-model="img"
                    v-if="!loading"
                    solo
                    flat
                    filled
                    hide-details
                    label="Add Image URL"
                    class="text-field-small mb-3"
                    color="pink"
                    append-outer-icon="mdi-image"
                    @click:append-outer="imageDialog=true"
                    @change="edited=true"
            ></v-text-field>
            <v-dialog v-model="imageDialog" max-width="400">
                <v-card class="pa-5">
                    <v-img
                        :src="img"
                        :lazy-src="require('../assets/placeholder.png')"
                        contain
                        class="lighten-2 mb-5"
                    >
                        <template v-slot:placeholder>
                            <v-row class="fill-height" align="center" justify="center">
                                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                            </v-row>
                        </template>
                    </v-img>
                    <v-card-text>
                        This is a preview of the product's image as seen by users in the FastCart mobile application.
                    </v-card-text>
                </v-card>
            </v-dialog>

            <v-dialog v-model="barcodeDialog" max-width="400">
                <v-card class="pa-5">
                    <barcode v-bind:value="id" width="1" class="barcode">
                        Barcode rendering failed :(
                    </barcode>
                    <v-card-text>
                        This is a preview of the product's barcode to be used in conjunction with the FastCart mobile application.
                    </v-card-text>
                </v-card>
            </v-dialog>
            <v-progress-circular
                    v-if="loading"
                    class="mb-3"
                    indeterminate
                    color="green"
            ></v-progress-circular>
            <v-divider/>
            <v-text-field
                class="text-field mt-5"
                v-model="price"
                label="Price ($)"
                outlined
                flat
                color="pink"
                :rules="priceRules"
                @change="edited=true"
            ></v-text-field>
            <StockInfo
                    style="width: 100%"
                    v-bind:stock="stock"
                    v-bind:loading="loading"
                    v-bind:id="id"
            />
            <v-text-field
                v-model="weight"
                class="text-field mt-2"
                label="Weight (g)"
                outlined
                flat
                color="pink"
                :rules="weightRules"
                @change="edited=true"
            ></v-text-field>
            <v-select
                v-model="category"
                class="text-field mt-2 mb-5"
                :items="categoriesName"
                color="pink"
                label="Category"
                :menu-props="{top:true}"
                outlined
                hide-details
                @change="edited=true"
            ></v-select>
            <v-btn class="mt-5 white--text"
                   style="width: 100%"
                   v-if="!loading"
                   color="pink"
                   depressed
                   :disabled="!edited"
                   x-large
                   @click="editData"
            >Save Changes <v-icon right>mdi-content-save</v-icon></v-btn>
            <v-btn class="mt-5 white--text"
                   style="width: 100%"
                   v-if="!loading"
                   color="red darken-2"
                   depressed
                   x-large
                   @click="deleteData"
            >Delete Product <v-icon right>mdi-delete</v-icon></v-btn>
        </v-row>
    </div>
</template>

<script>
    import * as firebase from "firebase";
    import VueBarcode from 'vue-barcode';
    import StockInfo from "./ProductInfo/StockInfo";

    export default {
        name: "ProductInfo",
        components: {
            'barcode': VueBarcode,
            StockInfo
        },
        methods: {
            editData: async function() {
                let self=this;
                firebase.firestore().collection("products").doc(self.id).set({
                    name:self.name,
                    img: self.img,
                    price:self.price,
                    stock: self.stock,
                    weight: self.weight,
                    category: self.categoriesName.indexOf(self.category)
                }).then(function() {
                    console.log("Document successfully edited!");
                    self.edited=false;
                    self.snackbarColor="#E91E63";
                    self.snackbarText="Product Successfully Updated";
                    self.snackbar=true;
                }).catch(function(error) {
                    console.error("Error editing document: ", error);
                    self.snackbarColor="#D32F2F";
                    self.snackbarText="Product Failed To Update";
                    self.snackbar=true;
                });
            },
            deleteData: async function() {
                let self=this;
                if (confirm('Are you sure you want to delete this product?')) {
                    firebase.firestore().collection("products").doc(self.id).delete()
                        .then(function() {
                            console.log("Document successfully deleted!");
                            self.$router.push("/products")
                        }).catch(function(error) {
                        console.error("Error deleting document: ", error);
                    });
                } else {
                    console.log('Delete operation cancelled');
                }
            }
        },
        computed: {
            priceRules () {
                return [
                    value => !!value || 'Field is required',
                    value => /^[0-9]*\.[0-9]{2}$/.test(value) || 'Please only enter a number to 2 decimal places.',
                ]
            },
            weightRules () {
                return [
                    value => !!value || 'Field is required',
                    value => /^[1-9]\d*$/.test(value) || 'Please only a positive non-zero integer.',
                ]
            }
        },
        mounted() {
            let self=this;
            firebase.firestore().collection("products").doc(self.$route.params.id)
                .onSnapshot(function(doc) {
                    self.id= doc.id;
                    self.img=doc.data().img;
                    self.name = doc.data().name;
                    self.price=doc.data().price;
                    self.stock=Number(doc.data().stock);
                    self.weight=doc.data().weight;
                    self.category=self.categoriesName[doc.data().category];
                    self.loading=false
                });
        },
        data () {
            return {
                id: "",
                img:"",
                name:"",
                price:"",
                stock: 0,
                weight: "",
                category:"",
                loading: true,
                imageDialog: false,
                barcodeDialog: false,
                snackbar:"",
                attrs:"",
                snackbarColor:"#E91E63",
                snackbarText:"",
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
                edited: false,
                items: [
                    { text:'Product Database',disabled:false, to:{name: 'products'}, exact: true },
                    { text:'Product Information',disabled:true}
                ],
            }
        },
    }
</script>

<style scoped>
    .productInfo{
        width: 95%;
        padding: 12px;
    }
    .text-field{
        font-size: 1.5em;
    }
    .text-field-small{
        font-size: 1.17em;
    }

    .barcode {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
    }
    .v-select >>> .v-select__selections {
        line-height: 1.5em;
    }
</style>

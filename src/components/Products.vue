<template>
    <div class="products">
        <v-card-title>
            <h2 class="mr-5 mb-3" style="word-break: keep-all">Product Database</h2>
            <v-progress-circular
                class="mb-3"
                v-if="loading"
                indeterminate
                color="pink"
            ></v-progress-circular>
            <AddProduct v-bind:loading="loading"/>
            <v-spacer></v-spacer>
            <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search For Products"
                    color="pink"
                    single-line
                    hide-details
            ></v-text-field>
        </v-card-title>
        <v-data-table :headers="headers" :items="items" :search="search" >
                <template v-slot:item.category="{item}">
                        <v-chip :color="getCategoryColor(item.category)" dark>{{getCategoryName(item.category)}}</v-chip>
                </template>
                <template v-slot:item.weight="{item}">
                    {{getWeight(item.weight)}}
                </template>
                <template v-slot:item.edit="{item}">
                    <a style="cursor: pointer" @click="seeProduct(item.id)"><v-icon>mdi-pencil</v-icon></a>
                </template>
        </v-data-table>
    </div>
</template>

<script>
    import * as firebase from 'firebase';
    import 'firebase/firestore';
    import AddProduct from "./ProductInfo/AddProduct";
    export default {
        name: "Products",
        components: {AddProduct},
        methods: {
            getAvailability(available){
                if (available) return "Available";
                else return "Unavailable"
            },
            getStatusColor(available) {
                if (available) return 'green';
                else return "red"
            },
            getCategoryName(category) {
                return this.categoriesName[category]
            },
            getCategoryColor(category) {
                return this.categoriesColor[category]
            },
            getWeight(weight) {
                if (weight>=1000) {
                    let w=weight/1000;
                    return w.toFixed(2)+"kg"
                }
                else return weight+"g"
            },
            seeProduct(id){
                this.$router.push(`/products/${id}`)
            },
            addData: async function() {
                firebase.firestore().collection("products").add({
                    name:"test",
                    price:"test",
                    stock: "test",
                    weight: "test",
                    category: "test",
                }).then(function() {
                    console.log("Document successfully written!");
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                });
            }
        },
        mounted() {
            let self=this;
            firebase.firestore().collection("products")
                .onSnapshot(function(querySnapshot) {
                    let data = [];
                    querySnapshot.forEach(function(doc) {
                        data.push({
                            id: doc.id,
                            name:doc.data().name,
                            price:"$"+doc.data().price,
                            stock:doc.data().stock,
                            weight:doc.data().weight,
                            category:doc.data().category,
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
                categoriesColor: [
                    "yellow",
                    "blue",
                    "red",
                    "green",
                    "brown",
                    "orange",
                    "purple",
                    "silver",
                    "black",
                    "magenta",
                    "cyan"
                ],
                headers: [
                    { text: 'Product Name', align: 'start', value: 'name'},
                    { text: 'Price', value: 'price'},
                    { text: 'Stock', value: 'stock'},
                    { text: 'Weight', value: 'weight', },
                    { text: 'Category', value: 'category' },
                    { text: 'Product ID', value: 'id', sortable: false },
                    { text: 'Edit', value: 'edit', sortable: false }
                ],
                items: [],
            }
        },
    }
</script>

<style scoped>
    .products{
        width: 95%;
        padding: 12px;
    }
    a {
        color: #4CAF50;
    }
</style>

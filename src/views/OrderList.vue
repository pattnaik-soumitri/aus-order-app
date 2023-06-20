<script setup>
import { ref, onMounted } from 'vue';
import { db } from '../fb.js';
import { collection, query, getDocs } from "firebase/firestore";

const orders = ref([]);

onMounted(async () => {
    const q = query(collection(db, "orders"));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        orders.value.push(doc.data());
    });
    
});

</script>

<template>

    <div>
        <h6>Order List</h6>

        <div class="order-list-container">
            <table role="grid">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Customer Name</th>
                    <th scope="col">Date</th>
                    <th scope="col">Salesman</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in orders" :key="order.sln">
                        <td>{{ order.sln }}</td>
                        <td>{{ order.customerName }}</td>
                        <td>{{ order.orderDate }}</td>
                        <td>{{ order.salesman }}</td>
                    </tr>
                </tbody>
                </table>
        </div>
    </div>
</template>


<style scoped>
.order-list-container {
    width: 900px;
    display: flex;
    margin: auto;
}
</style>
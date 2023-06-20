<script setup>
import OrderItemRow from '../components/OrderItemRow.vue';
import { ref } from 'vue';
import { collection, addDoc, getCountFromServer } from "firebase/firestore"; 
import { db } from '../fb.js';

const loading = ref(false);
const blankOrder = {
    customertName: '',
    orderDate: new Date(),
    salesman: '',
    // items: []
};
const order = ref({...blankOrder});

const notificationMsg = ref('');

const addOrderItem = () => {
    order.value.items.push({});
}

const submit = async () => {
    loading.value = true;
    const ordersColl = collection(db, "orders");
    const ordersSnapshot = await getCountFromServer(ordersColl);

    const docData = {
        sln: (ordersSnapshot.data().count + 1),
        customerName: order.value.customertName,
        orderDate: order.value.orderDate,
        salesman: order.value.salesman
    }
    const docRef = await addDoc(ordersColl, docData);
    console.log("Document written with ID: ", docRef.id);

    notificationMsg.value = `Order created | sln: ${docData.sln}`;
    order.value = {...blankOrder};
    loading.value = false;
}

</script>

<template>

    <div class="order-form grid">
        <form @submit.prevent="submit">
            <label for="customer_name">
                Customer Name
                <input type="text" v-model="order.customertName" id="customer_name" name="customer_name" placeholder="Customer name" required>
            </label>
            
            <label for="date">Date</label>
            <input type="date" v-model="order.orderDate" id="date" name="date" placeholder="Date" required>
    
            <label for="salesman">Salesman</label>
            <input type="text" v-model="order.salesman" id="salesman" name="salesman" placeholder="Salesman" required>
            
            <div v-for="(item, i) in order.items" :key="i">
                <OrderItemRow />
            </div>
    
            <!-- Add item -->
            <button type="button" @click="addOrderItem" class="secondary">Add item</button>

            <hr/>

            <!-- Button -->
            <button type="submit" class="submit" :aria-busy="loading">Submit</button>

            <!-- {{ order }} -->

            <!-- NOTIFICATION -->
            <div v-if="notificationMsg" class="notification">
                <small>{{ notificationMsg }}</small>
            </div>
    
        </form>
    </div>
</template>


<style scopedd>
.order-form {
    display: flex;
    margin: auto;
    width: 600px;
}
.submit {
    margin-top: 20px;
}
.notification {
    border: solid 1px green;
    /* background-color: lightgreen; */
    border-radius: 5px;
    /* color: black; */
    padding: 10px;
}
</style>
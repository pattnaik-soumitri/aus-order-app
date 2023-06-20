<script setup>
import OrderItemRow from '../components/OrderItemRow.vue';
import { ref } from 'vue';
import { collection, addDoc, getCountFromServer } from "firebase/firestore"; 
import { db } from '../fb.js';

const loading = ref(false);
const getFormattedDate = (date) => {
  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  
  return year + '-' + month + '-' + day;
}
const blankOrder = {
    customertName: '',
    orderDate: getFormattedDate(new Date()),
    salesman: '',
    items: [ {name: '', qty: 0} ],
    status: 'placed'
};
const order = ref({...blankOrder});

const notificationMsg = ref('');

const addOrderItem = () => {
    order.value.items.push({name: '', qty: 0});
}

const submit = async () => {
    loading.value = true;
    const ordersColl = collection(db, "orders");
    const ordersSnapshot = await getCountFromServer(ordersColl);

    const docData = {
        sln: (ordersSnapshot.data().count + 1),
        customerName: order.value.customertName,
        orderDate: order.value.orderDate,
        salesman: order.value.salesman,
        items: order.value.items,
        status: order.value.status
    }
    const docRef = await addDoc(ordersColl, docData);
    console.log("Document written with ID: ", docRef.id);

    notificationMsg.value = `Order created | sln: ${docData.sln}`;
    order.value = {...blankOrder, items: [ {name: '', qty: 0} ]};
    loading.value = false;
}

</script>

<template>
    <section>
        <div class="grid">
            <div class="order-form">
                <h6>Order Entry</h6>
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
                        <OrderItemRow v-model:name="item.name" v-model:qty="item.qty" />
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
        </div>
    </section>
</template>


<style scopedd>
.order-form {
    margin: auto;
    max-width: 720px;
}
.submit {
    margin-top: 20px;
}
</style>
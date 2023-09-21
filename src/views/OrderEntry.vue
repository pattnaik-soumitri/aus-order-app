<script setup>
import OrderItemRow from '../components/OrderItemRow.vue';
import {ref, computed} from 'vue';
import { collection, addDoc, getCountFromServer } from "firebase/firestore"; 
import { db } from '@/fb';
import { useSessionStore } from '@/stores/userSessionStore';

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
    customerName: '',
    orderDate: getFormattedDate(new Date()),
    salesman: '',
    items: [ {name: '', qty: 0} ],
    status: 'placed',
    notes: '',
    totalBillAmt: 0
};
const order = ref({...blankOrder});

const notificationMsg = ref('');

const addOrderItem = () => {
    order.value.items.push({name: '', qty: 0});
}

const calcTotalBillAmt = () => {
  let totalOrderAmt = 0;
  itemTotalPrices.forEach((value, key) => totalOrderAmt += value);
  order.value.totalBillAmt = totalOrderAmt;
  console.log(`total bill amount is: ${totalOrderAmt}`);
}

const itemTotalPrices = new Map();
const updateTotalOrderAmt = (productName, itemAmount) => {
  itemTotalPrices.set(productName, itemAmount);
  console.log(`item amount passed is: ${itemAmount} for the product name: ${productName.value}`);
  // calculate the total order amount
  calcTotalBillAmt();
}
// watch(order.value.items, updateTotalOrderAmt, { deep: true });

const submit = async () => {
    loading.value = true;
    const ordersColl = collection(db, "orders");
    const ordersSnapshot = await getCountFromServer(ordersColl);

    const docData = {
        sln: (ordersSnapshot.data().count + 1),
        customerName: order.value.customerName,
        orderDate: order.value.orderDate,
        salesman: order.value.salesman,
        items: order.value.items,
        status: order.value.status,
        notes: order.value.notes,
        totalBillAmt: order.value.totalBillAmt,
        createdBy: useSessionStore().currentUser.email
    }
    const docRef = await addDoc(ordersColl, docData);
    console.debug("Document written with ID: ", docRef.id);

    notificationMsg.value = `Order created | sln: ${docData.sln}`;
    itemTotalPrices.clear();
    calcTotalBillAmt();
    order.value = {...blankOrder, items: [ {name: '', qty: 0} ]};
    console.log(`the order value of bill after doc write is: ${order.value.totalBillAmt}`);
    loading.value = false;
}

const isSaveButtonDisabled = computed(() => {
    const noItem = order.value.items == null || order.value.items.length === 0;
    const hasInvalidQuantity = order.value.items.some(item => item.qty < 1);
    const hasInvalidName = order.value.items.some(item => {
        const productName = item.name.trim();
        return productName === '';
    });
    return hasInvalidQuantity || hasInvalidName || noItem;
});
</script>

<template>
    <section>
        <div class="grid">
            <div class="order-form">
                <h5>Order Entry</h5>
                <form @submit.prevent="submit">
                    <label for="customer_name">
                        Customer Name
                        <input type="text" v-model="order.customerName" id="customer_name" name="customer_name" placeholder="Customer name" required>
                    </label>
                    
                    <label for="date">Date</label>
                    <input type="date" v-model="order.orderDate" id="date" name="date" placeholder="Date" required>
            
                    <label for="salesman">Salesman</label>
                    <input type="text" v-model="order.salesman" id="salesman" name="salesman" placeholder="Salesman" required>

                    <label for="notes">Notes</label>
                    <textarea v-model="order.notes" id="notes" name="notes" placeholder="notes"></textarea>
                            
                    <fieldset class="order-item-container">
                        <legend><label>Item List</label></legend>
                        
                        <div v-for="(item, i) in order.items" :key="i">
                            <OrderItemRow v-model:name="item.name" v-model:qty="item.qty" :index="i" @delete-item="idx => order.items.splice(idx, 1)" @update:total-price="(productName, itemAmount) => updateTotalOrderAmt(productName, itemAmount)"/>
                        </div>

                        <!-- Add item -->
                        <button type="button" @click="addOrderItem" class="secondary" :disabled=isSaveButtonDisabled>Add item</button>

                        <!-- Total Bill Amount -->
                        <label for="billAmt">
                          <p>Total Bill Amount: {{ order.totalBillAmt }}</p>
                        </label>
                    </fieldset>
        
                    <hr/>
        
                    <!-- Button -->
                    <button type="submit" class="submit" :aria-busy="loading" :disabled=isSaveButtonDisabled>Submit</button>
        
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


<style scoped>
.order-form {
    margin: auto;
    /* min-width: 480px; */
}

hr {
    margin: 1rem 0;
}

.submit {
    margin-top: 1rem;
}
.order-item-container {
    border: solid 1px gray;
    border-radius: 5px;
    padding: 20px;
    margin-bottom: 10px;

    filter: alpha(opacity=80);
    -moz-opacity: 0.8;
    opacity: 0.8;
}
</style>
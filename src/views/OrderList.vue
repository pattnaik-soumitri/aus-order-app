<script setup>
import { ref, computed, onMounted } from 'vue';
import OrderItemRow from '../components/OrderItemRow.vue';
import { products } from '@/util/constants';
import { db } from '@/fb';
import { collection, query, getDocs, orderBy, updateDoc, doc } from "firebase/firestore";

const notification = ref({
    success: true,
    msg: ''
});

const orders = ref([]);

const currentOrder = ref(null);
const modalIsOpen = ref(false);
const isLoading = ref(false);
const editBtnEnabled = ref(false);

const fetchOrders = async () => {
    orders.value = []; // Clear the orders array
    const q = query(collection(db, "orders"), orderBy('sln', 'desc'));
    
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        orders.value.push({...doc.data(), id: doc.id});
    });
};

onMounted(async () => {   
    await fetchOrders();
});

// calculate total discounted amount
const calcTotalBillAmt = () => {
  let totalOrderAmt = 0;
  itemTotalPrices.forEach((value, key) => totalOrderAmt += value);
  currentOrder.value.totalBillAmt = Math.round(totalOrderAmt);
  console.log(`total bill amount is: ${Math.round(totalOrderAmt)}`);
}

// calculate total mrp amount
const calcTotalMrpAmount = () => {
  let totalMrpAmount = 0;
  itemTotalMrpPrices.forEach((value, key) => totalMrpAmount += value);
  currentOrder.value.totalMrpBillAmt =  Math.round(totalMrpAmount);
  console.log(`total bill amount is: ${Math.round(totalMrpAmount)}`);
}

// for updating total discounted amt
const itemTotalPrices = new Map();
const updateTotalOrderAmt = (productName, itemAmount) => {
  itemTotalPrices.set(productName, itemAmount);
  console.log(`item amount passed is: ${itemAmount} for the product name: ${productName.value}`);
  // calculate the total order amount
  calcTotalBillAmt();
}

// for updating total mrp amt
const itemTotalMrpPrices = new Map();
const updateTotalMrpAmt = (productName, mrpTotal) => {
  itemTotalMrpPrices.set(productName, mrpTotal);
  console.log(`item mrp amount passed is: ${mrpTotal} for the product name: ${productName.value}`);
  // calculate the total order amount
  calcTotalMrpAmount();
}


const updateStatus = async () => {
    if (isSaveButtonDisabled.value) {
         // Button is disabled, do not save data
        return;
    }
    isLoading.value = true;
    const docRef = doc(db, "orders", currentOrder.value.id);
    try {
        await updateDoc(docRef, {
            customerName: currentOrder.value.customerName,
            orderDate: currentOrder.value.orderDate,
            salesman: currentOrder.value.salesman,
            items: currentOrder.value.items,
            status: currentOrder.value.status,
            notes: currentOrder.value.notes,
            totalBillAmt: currentOrder.value.totalBillAmt,
            totalMrpBillAmt: currentOrder.value.totalMrpBillAmt,
            createdBy: currentOrder.value.createdBy
        });
        notification.value.msg = 'Saved successfully.';
        notification.value.success = true;
    } catch(e) {
        notification.value.success = false;
        notification.value.msg = 'Failed.';
    }
    isLoading.value = false;
 
}

const orderDetails = async () => {
    isLoading.value = true;
    const docRef = doc(db, "orders", currentOrder.value.id);
    try {
        await updateDoc(docRef, {status: currentOrder.value.status, notes: currentOrder.value.notes});
        notification.value.msg = 'Saved successfully.';
        notification.value.success = true;
    } catch(e) {
        notification.value.success = false;
        notification.value.msg = 'Failed.';
    }
    isLoading.value = false;
}

const closeModal = () => {
    currentOrder.value = null; 
    modalIsOpen.value = false;
    editBtnEnabled.value = false;
    notification.value = {
        success: true,
        msg: ''
    };
    itemTotalPrices.clear();
    fetchOrders(); // Fetch fresh orders after closing the modal
}

const addOrderItem = () => {
	currentOrder.value.items.push({ name: '', qty: 0 });
}

const isSaveButtonDisabled = computed(() => {
    const noItem = currentOrder.value?.items == null || currentOrder.value?.items.length === 0;
    const hasInvalidQuantity = currentOrder.value?.items.some(item => item.qty < 1);
    
    return hasInvalidQuantity || noItem;
});
</script>

<template>
    <section>
        <div class="grid">
            <div class="order-list-container">
                <h5 class="order-list-heading">Order List</h5>
                <figure>
                    <table role="grid">
                        <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Customer</th>
                              <th scope="col">Date</th>
                              <th scope="col">Status</th>
                              <th scope="col">Salesman</th>
                              <th scope="col">Notes</th>
                              <th scope="col">Created By</th>
                              <th scope="col">Total bill Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="order in orders" :key="order?.sln" class="order-item-row" @click="currentOrder = order; modalIsOpen = true;">
                                <td>{{ order?.sln }}</td>
                                <td>{{ order?.customerName }}</td>
                                <td>{{ order?.orderDate }}</td>
                                <td><code v-if="order?.status">{{ order?.status }}</code></td>
                                <td>{{ order?.salesman }}</td>
                                <td>{{ order?.notes }}</td>
                                <td>{{ order?.createdBy }}</td>
                                <td>&#8377; {{ order?.totalBillAmt }}</td>
                            </tr>
                        </tbody>
                    </table>
                </figure>
            </div>
        </div>
    </section>

    <!-- Modal -->
    <dialog id="order-detail" :open="modalIsOpen" v-if="modalIsOpen">
    <article class="update-order-modal" v-if="editBtnEnabled">
        <div class="symbols">
            <a href="#" @click.prevent="editBtnEnabled = !editBtnEnabled" class="edit-icon"><i class="fa-solid fa-pen-to-square fa-xl"></i></a>
            <a href="#close"
            aria-label="Close"
            class="close"
            data-target="#order-detail"
            @click="closeModal">
            </a>
        </div>
        <h6>#SLN: {{ currentOrder?.sln }}</h6>
        <div class="update-order-form">
            <form @submit.prevent="updateStatus">
                <label for="customer_name">
                    Customer Name
                    <input type="text" v-model="currentOrder.customerName" id="customer_name" name="customer_name" placeholder="Customer name" required>
                </label>

                <label for="date">Date</label>
                <input type="date" v-model="currentOrder.orderDate" id="date" name="date" defaultItemNames placeholder="Date" required>

                <label for="salesman">Salesman</label>
                <input type="text" v-model="currentOrder.salesman" id="salesman" name="salesman" placeholder="Salesman" required>

                <label for="status">Status
                    <select id="status" v-model="currentOrder.status">
                        <option value="placed">Placed</option>
                        <option value="processed">Processed</option>
                        <option value="completed">Completed</option>
                        <option value="recieved">Payment Recieved</option>
                    </select>
                </label>

                <label for="notes">Notes</label>
                <textarea v-model="currentOrder.notes" id="notes" name="notes" placeholder="notes"></textarea>

                <!-- current orders -->
                <fieldset class="order-item-container">
                    <legend><label>Item List</label></legend>

                    <div v-for="(item, i) in currentOrder?.items" :key="i">
                        <OrderItemRow v-model:name="item.name" v-model:qty="item.qty" v-model:discount="item.discount" :index="i" :products="products" @delete-item="(idx) => currentOrder.items.splice(idx, 1)" @update:total-price="(productName, itemAmount) => updateTotalOrderAmt(productName, itemAmount)" @update:total-mrp-price="(productName, mrpTotal) => updateTotalMrpAmt(productName, mrpTotal)" />
                    </div>

                    <!-- Add item -->
                    <button type="button" @click="addOrderItem" class="secondary" :disabled=isSaveButtonDisabled>Add item</button>

                    <!-- Total Bill Amount -->
                    <label for="billAmt">
                      <p>Total Bill Amount: &#8377; {{ currentOrder?.totalBillAmt }} <small class="notification green strikethrough" v-if="currentOrder?.totalBillAmt > 1">( &#8377; {{currentOrder?.totalMrpBillAmt}})</small></p>
                    </label>
                </fieldset>

                <hr />

                <footer>
                <div class="grid">
                    <button
                        role="button"
                        class="primary"
                        data-target="#order-detail"
                        :aria-busy="isLoading"
                        @click="updateStatus"
                        :disabled=isSaveButtonDisabled
                        :aria-invalid="isSaveButtonDisabled ? 'true' : false">
                        Save
                    </button>
                    <button
                        role="button"
                        class="secondary"
                        data-target="#order-detail"
                        @click="closeModal">
                        Close
                    </button>
                </div>
                </footer>
                <div class="order-details-notification">
                    <!-- NOTIFICATION -->
                    <p v-if="notification?.msg" :class="{notification: true, success:notification.success, failed:!notification.success}">
                        <small>{{ notification?.msg }}</small>
                    </p>
                </div>
            </form>
        </div>
    </article>
    <article class="update-order-modal" v-else>
        <div class="symbols">
            <a href="#" @click.prevent="editBtnEnabled = !editBtnEnabled" class="edit-icon"><i class="fa-solid fa-pen-to-square fa-xl"></i></a>
            <a href="#close"
            aria-label="Close"
            class="close"
            data-target="order-detail"
            @click="closeModal">
            </a>
        </div>
        <div class="modal-info">
            <h6 class="sl-no">#SLN: {{ currentOrder?.sln }}</h6>
            <h6 id="modal-date">Date: {{ currentOrder?.orderDate }}</h6>
        </div>
        <div class="item-details">
            <h6 class="cust-info">Customer Name: <span id="update-order-customer-name">{{ currentOrder?.customerName }}</span></h6>
            <ol class="order-item-list">
                <li v-for="(item, i) in currentOrder?.items" :key="i">
                    {{ item?.name }}  <code>{{ item?.qty }}</code>
                </li>
            </ol>
            
            <label for="status">Status
                <select 
                    id="status"
                    v-model="currentOrder.status"   
                >
                    <option value="placed">Placed</option>
                    <option value="processed">Processed</option>
                    <option value="completed">Completed</option>
                    <option value="recieved">Payment Recieved</option>
                </select>
            </label>

            <label for="notes">Notes
                <textarea
                id="notes"
                v-model="currentOrder.notes"
                ></textarea>
            </label>

            <!-- Total Bill Amount -->
            <label for="billAmt">
              <p>Total Bill Amount: &#8377; {{ currentOrder?.totalBillAmt }} <small class="notification green strikethrough" v-if="currentOrder?.totalBillAmt > 1">( &#8377; {{currentOrder?.totalMrpBillAmt}})</small></p>
            </label>
        </div>
        <footer>
        <div class="grid">
            <button
                role="button"
                class="primary"
                data-target="order-detail"
                :aria-busy="isLoading"
                @click="orderDetails">
                Save
            </button>
            <button
                role="button"
                class="secondary"
                data-target="order-detail"
                @click="closeModal">
                Close
            </button>
        </div>
        </footer>
        <div class="order-details-notification">
            <!-- NOTIFICATION -->
            <p v-if="notification?.msg" :class="{notification: true, success:notification.success, failed:!notification.success}">
                <small>{{ notification?.msg }}</small>
            </p>
        </div>
    </article>
    </dialog>

</template>


<style scoped>

.order-list-heading{
    font-size: 1.4rem;
    font-weight: bold;
}

.update-order-modal {
    margin-top: auto;
    padding-top: 1rem;
    width: 800px;
}

.update-order-form {
    margin: auto;
}

#update-order-customer-name {
    font-weight: bold;
    font-size: 110%;
    margin-left: 0;
}

.order-item-row {
    cursor: pointer;
}
.order-item-row:hover {
    filter: alpha(opacity=60);
    /* IE */
    -moz-opacity: 0.6;
    /* Mozilla */
    opacity: 0.6;
    font-weight: bolder;
}

.order-item-list {
    text-align: left;
}


.order-item-container {
    border: solid 1px gray;
    border-radius: 5px;
    padding: 1rem;
    margin-bottom: 1rem;

    filter: alpha(opacity=80);
    -moz-opacity: 0.8;
    opacity: 0.8;
}

.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

button:not(.disabled) {
  cursor: pointer; /* Normal cursor for non-disabled buttons */
}

.red {
    color: red;
}

.green {
  color: green;
}

.strikethrough {
  text-decoration: line-through;
}

.symbols {
    display: flex;
    width: 100%;
    flex-direction: row;
}

.edit-icon i {
    color: #c0ca33;
}


.edit-icon {
    float: left;
    position: relative;
}

.close {
    margin: 0;
    padding: 3% 95%;
}

.modal-info{
    margin: 1rem 0 0 0;
    display: inline-block;
    width: 100%;
}

.sl-no {
    float: left;
}

#modal-date {
    float: right;
}

#modal-date::first-letter {
    color: var(--primary);
    font-weight: bold;
    font-size: 150%;
}

hr {
    margin: 1rem 0;
}

@media (max-width: 350px) {
    .modal-info {
        display: inline-block;
        width: 100%;
        margin-left: auto;
    }

    #modal-date {
        display: block;
        margin-left: auto;
        float: left;
    }

    .cust-info {
        display: block;
        text-align: left;
    }
    .item-details {
        display: block;
    }
}

@media (max-width: 1024px) {
    .grid button {
        margin-top: 1.5rem;
    }
}

.order-details-notification {
    margin-top: 2rem;
}
</style>
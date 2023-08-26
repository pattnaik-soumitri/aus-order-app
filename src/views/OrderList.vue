<script setup>
import { ref, computed, onMounted } from 'vue';
import OrderItemRow from '../components/OrderItemRow.vue';
import Pagination from "../components/Pagination.vue";
import { db } from '../fb.js';
import { collection, query, getDocs, getDoc, orderBy, updateDoc, doc, limit, startAfter } from "firebase/firestore";

const notification = ref({
    success: true,
    msg: ''
});

const orders = ref([]);
const pageCount = ref(1);
const maxPerPage = 10; // Number of orders per page
const currentPage = ref(1);
const currentOrder = ref(null);
const modalIsOpen = ref(false);
const isLoading = ref(false);
const editBtnEnabled = ref(false);
const initial = ref(true);

const fetchOrders = async () => {
    // if (initial) {
    //     const q = query(collection(db, "orders"), orderBy('sln', 'desc'));
    //     try {
    //         const querySnapshot = await getDocs(q);
    //         querySnapshot.forEach((doc) => {
    //             orders.value.push({...doc.data(), id: doc.id});
    //         });
    //         pageCount.value = Math.ceil(querySnapshot.size / maxPerPage);
    //         console.log(pageCount.value);
    //         gotoPage(currentPage);
    //     } catch (error) {
    //         console.error('Error fetching orders:', error);
    //     }
    //     initial.value = false;
    // } else {
        gotoPage(currentPage);
    // }
};

const gotoPage = (page) => {
    console.log(`current page value is: ${page.value}`);
    if (page >= 1 && page <= pageCount.value) {
        currentPage.value = page;
        fetchPaginatedOrders();
    }
};

// const paginatedOrders = computed(() => {
//     const startIndex = (currentPage.value - 1) * maxPerPage;
//     const endIndex = startIndex + maxPerPage;
//     return orders.value.slice(startIndex, endIndex);
// });

const fetchPaginatedOrders = async () => {
    const q = query(collection(db, "orders"), orderBy('sln', 'desc'), startAfter(currentPage.value * maxPerPage - maxPerPage), limit(maxPerPage));
    try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            orders.value.push({...doc.data(), id: doc.id});
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
};

onMounted(async () => {
    // orders.value = [];
    await fetchOrders();
});

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

    fetchOrders(currentPage); // Fetch fresh orders after closing the modal
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
                <h5>Order List</h5>
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
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="order in paginatedOrders" :key="order?.sln" class="order-item-row" @click="currentOrder = order; modalIsOpen = true;">
                                <td>{{ order?.sln }}</td>
                                <td>{{ order?.customerName }}</td>
                                <td>{{ order?.orderDate }}</td>
                                <td><code v-if="order?.status">{{ order?.status }}</code></td>
                                <td>{{ order?.salesman }}</td>
                                <td>{{ order?.notes }}</td>
                                <td>{{ order?.createdBy }}</td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Pagination -->
                    <!-- <div class="pagination">
                        <button :disabled="page === 1" @click="previousPage" class="btn">Previous</button>
                        <span>{{ page }} / {{ pageCount }}</span>
                        <button :disabled="page === pageCount" @click="nextPage" class="btn">Next</button>
                    </div> -->
                    
                    <!-- alternative pagination -->
                    <Pagination 
                        :page="currentPage"
                        :pageCount="pageCount" 
                        @gotoPage="gotoPage"
                    />

                </figure>
            </div>
        </div>
    </section>

    <!-- Modal -->
    <dialog id="order-detail" :open="modalIsOpen" v-if="modalIsOpen">
    <article class="update-order-modal" v-if="editBtnEnabled">
    <a href="#" @click.prevent="editBtnEnabled = !editBtnEnabled" class="edit-icon"><i class="fa-solid fa-pen-to-square fa-xl"></i></a>
    <a href="#close"
    aria-label="Close"
    class="close"
    data-target="#order-detail"
    @click="closeModal">
    </a>
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
                    <OrderItemRow v-model:name="item.name" v-model:qty="item.qty" :index="i" @delete-item="(idx) => currentOrder.items.splice(idx, 1)" />
                </div>

                <!-- Add item -->
                <button type="button" @click="addOrderItem" class="secondary" :disabled=isSaveButtonDisabled>Add item</button>
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
        <a href="#" @click.prevent="editBtnEnabled = !editBtnEnabled" class="edit-icon"><i class="fa-solid fa-pen-to-square fa-xl"></i></a>
        <a href="#close"
        aria-label="Close"
        class="close"
        data-target="order-detail"
        @click="closeModal">
        </a>
        <div class="modal-info">
            <h6 class="sl-no">#SLN: {{ currentOrder?.sln }}<span id="modal-date">Date: {{ currentOrder?.orderDate }}</span></h6>
            <h6 class="cust-info">Customer Name: <span id="update-order-customer-name">{{ currentOrder?.customerName }}</span></h6>
        </div>
        <div class="item-details">
            <ol>
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

.btn {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    margin: 0 0.5rem;
    cursor: pointer;
}

.btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}


.update-order-modal {
    margin-top: auto;
    padding-top: 1rem;
    width: 800px;
}

.update-order-form {
    margin: auto;
}

#modal-date::first-letter {
    color: var(--primary);
    font-weight: bold;
    font-size: 150%;
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

.edit-icon i {
    color: #c0ca33;
}


.edit-icon {
    float: top-left;
    position: relative;
}

/* .modal-title {
    text-align: center;
} */

.modal-info .sl-no{
    margin-bottom: 0;
}

#modal-date {
    float: right;
}

hr {
    margin: 1rem 0;
}

@media (max-width: 350px) {
    .modal-info {
        display: block;
        margin-left: auto;
    }

    #modal-date {
        display: block;
        margin-left: auto;
        float: initial;
    }

    .cust-info {
        display: block;
        float: left;
    }
    .item-details {
        margin-top: 6rem;
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
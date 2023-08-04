<script setup>
import { ref, onMounted } from 'vue';
import { db } from '../fb.js';
import { collection, query, getDocs, orderBy, updateDoc, doc } from "firebase/firestore";

const notification = ref({
    success: true,
    msg: ''
});

const orders = ref([]);

const currentOrder = ref(null);
const modalIsOpen = ref(false);
const isLoading = ref(false);

onMounted(async () => {
    const q = query(collection(db, "orders"), orderBy('sln', 'desc'));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        orders.value.push({...doc.data(), id: doc.id});
    });
    
});

const updateStatus = async () => {
    isLoading.value = true;
    const docRef = doc(db, "orders", currentOrder.value.id);
    try {
        await updateDoc(docRef, {status: currentOrder.value.status});
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
    notification.value = {
        success: true,
        msg: ''
    }
}

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
                            <tr v-for="order in orders" :key="order?.sln" class="order-item-row" @click="currentOrder = order; modalIsOpen = true;">
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
                </figure>
            </div>
        </div>
    </section>

    <!-- Modal -->
    <dialog id="order-detail" :open="modalIsOpen" v-if="modalIsOpen">
    <article class="update-order-modal">
        <a href="#close"
        aria-label="Close"
        class="close"
        data-target="order-detail"
        @click="closeModal">
        </a>
        <h6>#SLN: {{ currentOrder?.sln }} <span><button class="btn-edit">Edit</button></span></h6>
        <div>
            <ol>
                <li v-for="(item, i) in currentOrder?.items" :key="i">
                    {{ item?.name }}  <code>{{ item?.qty }}</code>
                </li>
            </ol>
            
            <label for="status">
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

            <label for="notes">
                <textarea
                id="notes"
                v-model="currentOrder.notes"
                ></textarea>
            </label>
            
            <!-- NOTIFICATION -->
            <p v-if="notification?.msg" :class="{notification: true, success:notification.success, failed:!notification.success}">
                    <small>{{ notification?.msg }}</small>
            </p>
        </div>
        <footer>
        <div class="grid">
            <button
                role="button"
                class="prinary"
                data-target="order-detail"
                :aria-busy="isLoading"
                @click="updateStatus">
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
    </article>
    </dialog>

</template>


<style scoped>
.order-list-container {
    /* max-width: 900px; */
    /* margin: auto; */
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

.btn-edit {
    width: 150px;
    height: auto;
    text-align: center;
    display: inline;
    margin-left: 15%;
}
</style>
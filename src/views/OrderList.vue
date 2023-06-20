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

onMounted(async () => {
    const q = query(collection(db, "orders"), orderBy('sln', 'desc'));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        orders.value.push({...doc.data(), id: doc.id});
    });
    
});

const updateStatus = async () => {
    const docRef = doc(db, "orders", currentOrder.value.id);
    try {
        await updateDoc(docRef, {status: currentOrder.value.status});
        notification.value.msg = 'Saved successfully.';
        notification.value.success = true;
    } catch(e) {
        notification.value.success = false;
        notification.value.msg = 'Failed.';
    }
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
                <h6>Order List</h6>
                <figure>
                    <table role="grid">
                        <thead>
                            <tr>
                            <th scope="col">#</th>
                            <th scope="col">Customer Name</th>
                            <th scope="col">Date</th>
                            <th scope="col">Salesman</th>
                            <th scope="col">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="order in orders" :key="order?.sln" class="order-item-row" @click="currentOrder = order; modalIsOpen = true;">
                                <td>{{ order?.sln }}</td>
                                <td>{{ order?.customerName }}</td>
                                <td>{{ order?.orderDate }}</td>
                                <td>{{ order?.salesman }}</td>
                                <td><code v-if="order?.status">{{ order?.status }}</code></td>
                            </tr>
                        </tbody>
                    </table>
                </figure>
            </div>
        </div>
    </section>

    <!-- Modal -->
    <dialog id="order-detail" :open="modalIsOpen" v-if="modalIsOpen">
    <article>
        <a href="#close"
        aria-label="Close"
        class="close"
        data-target="order-detail"
        @click="closeModal">
        </a>
        <h6>#SLN: {{ currentOrder?.sln }}</h6>
        <div>
            <section>
                <ol>
                    <li v-for="(item, i) in currentOrder?.items" :key="i">
                        {{ item?.name }}  <code>{{ item?.qty }}</code>
                    </li>
                </ol>
            </section>
            <section>
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
            </section>
            <section>
                <!-- NOTIFICATION -->
                <p v-if="notification?.msg" :class="{notification: true, success:notification.success, failed:!notification.success}">
                        <small>{{ notification?.msg }}</small>
                </p>
            </section>
        </div>
        <footer>
        <a href="#save"
            role="button"
            class="prinary"
            data-target="order-detail"
            @click="updateStatus">
            Save
        </a>
        <a href="#close"
            role="button"
            class="secondary"
            data-target="order-detail"
            @click="closeModal">
            Close
        </a>
        </footer>
    </article>
    </dialog>

</template>


<style scoped>
.order-list-container {
    max-width: 900px;
    margin: auto;
}
.order-item-row {
    cursor: pointer;
}
.order-item-row:hover {
    background-color: lightgray;
}
</style>
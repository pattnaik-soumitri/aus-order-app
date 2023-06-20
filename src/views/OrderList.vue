<script setup>
import { ref, onMounted } from 'vue';
import { db } from '../fb.js';
import { collection, query, getDocs, orderBy } from "firebase/firestore";

const orders = ref([]);

const currentOrder = ref(null);
const modalIsOpen = ref(false);

onMounted(async () => {
    const q = query(collection(db, "orders"), orderBy('sln', 'desc'));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        orders.value.push(doc.data());
    });
    
});

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
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="order in orders" :key="order?.sln" class="order-item-row" @click="currentOrder = order; modalIsOpen = true;">
                                <td>{{ order?.sln }}</td>
                                <td>{{ order?.customerName }}</td>
                                <td>{{ order?.orderDate }}</td>
                                <td>{{ order?.salesman }}</td>
                            </tr>
                        </tbody>
                    </table>
                </figure>
            </div>
        </div>
    </section>

    <!-- Modal -->
    <dialog id="order-detail" :open="modalIsOpen">
    <article>
        <a href="#close"
        aria-label="Close"
        class="close"
        data-target="order-detail"
        @click="currentOrder = null; modalIsOpen = false;">
        </a>
        <h6>#SLN: {{ currentOrder?.sln }}</h6>
        <div>
            <ol>
                <li v-for="(item, i) in currentOrder?.items" :key="i">
                    {{ item?.name }}  <code>{{ item?.qty }}</code>
                </li>
            </ol>
        </div>
        <footer>
        <a href="#close"
            role="button"
            class="secondary"
            data-target="modal-example"
            @click="currentOrder = null; modalIsOpen = false;">
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
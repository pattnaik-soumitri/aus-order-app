<script setup>
import { products } from '../util/constants';
import { defineProps, defineEmits, ref, watch, computed } from 'vue';

const props = defineProps({
    index: Number,
    name: String,
    qty: Number
})

defineEmits(['delete-item', 'update:total-price', 'update:name', 'update:qty'])

let totalPrice = ref(0);

const productName = computed(() => props.name);
const productQty = computed(() => props.qty);

watch([productName, productQty], () => {
  const product = products.find((p) => p.name === productName.value);
  totalPrice.value = product ? product.mrp * productQty.value : 0;
});

// Expose the totalPrice to the template
defineExpose({
  totalPrice
});
</script>

<template>
    <div class="grid">
        <label for="items">
            <span style="display: flex; gap: 10px;">
            <a href="#" @click.prevent="$emit('delete-item', index)" class="danger"><i class="fa fa-trash" aria-hidden="true"></i></a>
            <label>Item #<span class="sln">{{ index + 1 }}</span></label>
            </span>
            <input list="items" :modelValue="name" :value="name" :aria-invalid="name === ''" @input="$emit('update:name', $event.target.value)" placeholder="Item Name">
            <small class="notification red" v-if="name.trim() === ''">Select an item</small>
            <datalist 
                id="items" 
                :value="name" 
                @input="$emit('update:name', $event.target.value)"
                required
                aria-invalid="true"
            >
            <option value="" selected>Select an item</option>
            <option v-for="(product) in products" :key="product.slno" :value="product.name">{{ product.name }}</option>
            </datalist>
            <!-- Add the notification message -->


        </label>

        <label for="qty">
        Qty
        <input 
            type="number" 
            :value="qty"
            @input="$emit('update:qty', Number($event.target.value))"
            id="qty" 
            name="qty" 
            placeholder="Qty" 
            required
            :aria-invalid="qty < 1"
            >
            <small class="notification red" v-if="qty < 1">Qty cannot be 0</small>
        </label>
    </div>
    <label for="price">
        Total Price: {{ totalPrice }}
    </label>
</template>

<style scoped>
.danger {
    color: red;
    font-size: x-large;
}

.red {
    color: red;
}

.sln {
    color: var(--primary);
}
</style>
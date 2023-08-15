<script setup>
defineProps({
    index: Number,
    name: String,
    qty: Number
})

defineEmits(['update:name', 'update:qty'])

import { products } from '../util/constants';
</script>

<template>
    <div class="grid">
        <label for="items">
            <span style="display: flex; gap: 10px;">
            <a href="#" @click.prevent="$emit('delete-item', index)" class="danger"><i class="fa fa-trash" aria-hidden="true"></i></a>
            <label>Item #<span class="sln">{{ index + 1 }}</span></label>
            </span>
            <input list="items" :modelValue="name" :value="name" :aria-invalid="name === '' ? true : ''" @input="$emit('update:name', $event.target.value)" placeholder="Item Name">
            <small class="notification red" v-if="name.trim() === ''">Select an item</small>
            <datalist 
                id="items" 
                :value="name" 
                @input="$emit('update:name', $event.target.value)"
                required
                aria-invalid="true"
            >
            <option value="" selected>Select an item</option>
            <option v-for="(product, i) in products" :key="i" :value="product">{{ product }}</option>
            </datalist>
            <!-- Add the notification message -->


        </label>

        <label for="qty">
        Qty
        <input 
            type="number" 
            :value="qty"
            @input="$emit('update:qty', $event.target.value)"
            id="qty" 
            name="qty" 
            placeholder="Qty" 
            required
            :aria-invalid="qty == 0 ? true : ''"
            >
            <small class="notification red" v-if="qty < 1">Qty cannot be 0</small>
        </label>
    </div>
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
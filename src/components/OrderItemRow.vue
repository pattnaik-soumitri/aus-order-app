<script setup>
defineProps({
  name: String,
  qty: Number
})

defineEmits(['update:name', 'update:qty'])

import { products } from '../util/constants';
</script>

<template>
    <div class="grid">
        <label for="items">
            Items
            <input list="items" :modelValue="name" @input="$emit('update:name', $event.target.value)" placeholder="Item Name">
            <datalist 
                id="items" 
                :value="name" 
                @input="$emit('update:name', $event.target.value)"
                required
            >
            <option value="" selected>Select an item</option>
            <option v-for="(product, i) in products" :key="i" :value="product">{{ product }}</option>
            </datalist>
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
            required>
        </label>
    </div>
</template>
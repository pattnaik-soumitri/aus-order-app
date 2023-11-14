<script setup>
//import { products } from '@/util/constants';
import { ref, watch, computed } from 'vue';

const props = defineProps({
    index: Number,
    name: String,
    qty: Number,
    products: Array,
    discount: {
      type: Number,
      default: 30,
    }
})

const emit = defineEmits({ 
    "delete-item": (value) => typeof value === "number" && value >= 0, 
    "update:total-price": (value1, value2) => (typeof value1 === "string") && (typeof value2 === "number" && value2 >= 0),
    "update:discount": (value) => typeof value === "number" && value >= 0,
    'update:name': (value) => typeof value === "string", 
    'update:qty': (value) => typeof value === "number" && value >= 0 
})

const products = props.products;
const productName = computed(() => props.name);
const productQty = computed(() => props.qty);
const discountRate = computed(() => props.discount);

const calcTotalPrice = () => {
  const product = products.find((p) => {
    return p.name === productName.value;
  });
  const discount_rate = (typeof discountRate.value === "number" && discountRate.value >= 0) ? discountRate.value : 0;
  emit('update:discount', discount_rate);
  const total = product ? Math.ceil(product.mrp * productQty.value * (1 -  discount_rate/100)) : 0;

  // pass data from child to parent for updating totalPrice in parent
  emit('update:total-price', productName, total);
  return total;
}

// define and initialize totalPrice value
const totalPrice = ref(0);
// to populate data for each product while editing orders from orderList, initialize here
totalPrice.value = calcTotalPrice();

watch([productName, productQty, discountRate], () => {
  totalPrice.value = calcTotalPrice();
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

    <!-- pricing section -->
    <div id="price-section">
      <label for="price">
        Total Price: {{ totalPrice }}
      </label>
      <label for="discount">
        Discount:
          <input
            type="number"
            :value="discount"
            @input="$emit('update:discount', Number($event.target.value))"
            id="discount"
            name="discount"
            :aria-invalid="discount < 1"
          />
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

#price-section {
  display: flex;
  gap: 90px;
}

#price-section label {
  display: flex;
  align-items: center;
}

#price-section label:last-child {
  display: flex;
  align-items: center;
  justify-content: end;
  padding-right: 10px;
}

#price-section label:last-child  > input {
  padding-left: 20px;
}

#discount {
  width: 50%;
  margin: 0;
  padding: 0;
  text-align: center;
}
</style>
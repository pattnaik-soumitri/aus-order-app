<script setup>
//import { products } from '@/util/constants';
import {computed, ref, watch} from 'vue';

const props = defineProps({
    index: Number,
    name: String,
    qty: Number,
    products: Array,
    discount: {
      type: Number,
      default: 30.00,
    }
})

const emit = defineEmits({ 
    "delete-item": (value) => typeof value === "number" && value >= 0, 
    "update:total-price": (value1, value2) => (typeof value1 === "string") && (typeof value2 === "number" && value2 >= 0),
    "update:total-mrp-price": (value1, value2) => (typeof value1 === "string") && (typeof value2 === "number" && value2 >= 0),
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
  const total = product ? parseFloat((product.mrp * productQty.value * (1 -  discount_rate/100)).toFixed(2)) : 0;

  // pass data from child to parent for updating totalPrice in parent
  emit('update:total-price', productName, total);
  return total;
}

const calcTotalMrpPrice = () => {
  const product = products.find((p) => {
    return p.name === productName.value;
  });

  // total MRP price
  const mrpTotal = product ? product.mrp * productQty.value : 0;

  // pass data from child to parent for updating totalPrice in parent
  emit('update:total-mrp-price', productName, mrpTotal);

  return mrpTotal;
}

// define and initialize totalPrice value
const totalPrice = ref(0);
// to populate data for each product while editing orders from orderList, initialize here
totalPrice.value = calcTotalPrice();

// for total mrp price calculation
const totalMrpPrice = ref(0);
totalMrpPrice.value = calcTotalMrpPrice();


watch([productName, productQty, discountRate], () => {
  totalPrice.value = calcTotalPrice();
  totalMrpPrice.value = calcTotalMrpPrice();
});

// Expose the totalPrice to the template
defineExpose({
  totalPrice,
  totalMrpPrice,
  discountRate
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
    <div class="grid">
      <label for="itemPrice">
        Item Price:
        <div class="currency-wrap">
          <span class="currency-code">&#8377;</span>
          <input
              type="number"
              :value="totalPrice"
              id="itemPrice"
              name="itemPrice"
              readonly="readonly"
              class="text-currency"
          />
        </div>
        <small class="notification green strikethrough" v-if="qty >= 1">( &#8377; {{totalMrpPrice}})</small>
      </label>
      <label for="discount">
        Discount &#37;:
          <input
            type="number"
            :value="discount"
            @input="$emit('update:discount', Number($event.target.value))"
            step="0.01"
            id="discount"
            name="discount"
            :aria-invalid="discount <= 0"
          />
          <small class="notification red" v-if="discount <= 0">No Discount!</small>
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

.green {
  color: green;
}

.sln {
    color: var(--primary);
}

.strikethrough {
  text-decoration: line-through;
}

.currency-wrap{
    position:relative;
}
  
.currency-code{
    position:absolute;
    left:8px;
    top:16px;
}
  
.text-currency{
    padding:10px 20px;
    border:solid 1px #ccc;
    border-radius:5px;
}

</style>
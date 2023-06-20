<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <ul>
        <li><h4><RouterLink class="logo-link contrast" to="/">ORDERS</RouterLink></h4></li>
      </ul>
      <ul>
        <li><RouterLink to="orders" class="contrast">Order List</RouterLink></li>
      </ul>
    </nav>
  </header>

  <main class="container">
    <RouterView />
  </main>
</template>


<style scoped>
.logo-link {
  text-decoration: none;
}
</style>
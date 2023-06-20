<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <ul>
        <li><RouterLink class="logo-link contrast" to="/">ORDERS</RouterLink></li>
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
nav {
  border-bottom: solid 1px gray;
}

nav ul {
  margin-left: 10px;
  margin-right: 10px;
}
</style>
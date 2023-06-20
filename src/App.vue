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

  <footer>
    <div class="footer">
      <small>Made with 💛 by <a href="https://in.linkedin.com/in/soumitri-pattnaik-69766a112" target="_blank">Soumitri</a></small>
    </div>
  </footer>
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

.footer {
  margin: auto;
  width: 100vh;
  text-align: center;
}
.footer small {
  font-size: small;
}
</style>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSessionStore } from '../stores/userSessionStore';
const router = useRouter();
const { login, currentUser } = useSessionStore();

const emptyLoginRequest = {
    email: '',
    password: '',
}

const loginRequest = ref({...emptyLoginRequest, error: null});

const handleLogin = async () => {
    console.log(loginRequest.value);
    const res = await login(loginRequest.value.email, loginRequest.value.password);
    loginRequest.value.error = res.error;
    if(res.error == null) {
        router.push('orders');
    }
}
</script>

<template>
    <section>
        <form class="login-form" @submit.prevent="handleLogin">
            <article>
                <header>
                    <strong>Login</strong>
                </header>

                <label for="email">Email</label>
                <input type="email" v-if="null != loginRequest.error" v-model="loginRequest.email" :aria-invalid="null != loginRequest.error" id="email" name="email" placeholder="Email" required>
                <input type="email" v-if="null == loginRequest.error" v-model="loginRequest.email" id="email" name="email" placeholder="Email" required>

                <label for="password">Password</label>
                <input type="password" v-if="null != loginRequest.error" v-model="loginRequest.password" :aria-invalid="null != loginRequest.error" id="password" name="password" placeholder="Password" required>
                <input type="password" v-if="null == loginRequest.error" v-model="loginRequest.password" id="password" name="password" placeholder="Password" required>
                <small class="error" v-if="loginRequest.error">Login unsuccessful</small>

                <footer>
                    <button :aria-busy="currentUser?.isLoading" type="submit">Login</button>
                </footer>
            </article>

        </form>
    </section>
</template>

<style scoped>
.login-form {
    margin: auto;
    max-width: 600px;
}
.error {
    color: red;
}
</style>
import { defineStore } from 'pinia';
import { ref } from 'vue';

import { auth } from '../fb';
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export const useSessionStore = defineStore('session', () => {

    const blankUser = {
        fbUser: null,
        isLoggedIn: false,
        email: '',
        loginTime: null,

        isLoading: false,
    };

    // Logged in user info
    const currentUser = ref({...blankUser});

    // Service / function (not setter)
    const login = async (email, password) => {
        currentUser.value.isLoading = true;
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // Signed in
            console.debug("login success!", userCredential.user);

            // Set state
            currentUser.value.isLoggedIn = true;
            currentUser.value.loginTime = new Date();
            currentUser.value.fbUser = userCredential.user;
            currentUser.value.email = userCredential.user.email;

            currentUser.value.isLoading = false;
            return { currentUser: currentUser.value, error: null };
        } catch(error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('login unsuccessful', error);
            currentUser.value.isLoading = false;
            return { currentUser: null, error: error };
        }
    }

    const isLoggedIn = () => currentUser.value.isLoggedIn;

    //
    const logout = async () => {
        try {
            await signOut(auth);
            currentUser.value = {...blankUser}
        } catch(err) {
            console.error(err);
        }
    }

  return { currentUser, login, logout, isLoggedIn };
});

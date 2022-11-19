<template>
          <b-container :toast="{root: true}" fluid="lg" ></b-container>

      <b-navbar class="nav-container" toggleable="lg">
          <router-link to="/"><img src="../assets/logo.png" alt=""></router-link>
          <span class="logo-name">RATE</span>
              <b-navbar-nav class="ms-auto">
                <div v-if="currentUser">
                  <router-link class="text-black" :to="{name: 'userProfile', params: {id: currentUser.userId} }"><span class="text-nav">My Profile</span></router-link>
                  <span class="text-black">Hi there, {{ currentUser.firstName }}.</span>
                  <button class="btn-brand" @click="handleLogout">Logout</button>
                </div>
                <div v-if="currentOwner">
                  <router-link class="text-black" :to="{name: 'ownerProfile'}"><span class="text-nav">Owner Profile</span></router-link>
                  <span class="text-black">Hi there, {{ currentOwner.firstName }}.</span>
                  <button class="btn-brand" @click="handleLogout">Logout</button>
                </div>
                <div v-if="!currentOwner && !currentUser">
                  <button class="btn-brand" @click="signupModalShow = !signupModalShow">Sign up</button>
                  <button class="btn-brand" @click="signinModalShow = !signinModalShow">Sign in</button>
                  <b-modal centered v-model="signinModalShow" modal-lg
                    @cancel="resetModal('signin')" @hidden="resetModal('signin')" hide-footer hide-header>
                    <template #default>
                        <h2 class="modal-title">User Signin</h2>
                            <input
                                v-model="email"
                                trim
                                placeholder="Email"
                                class="form-control"
                            >                
                            <input
                                v-model="password"
                                trim
                                placeholder="Password"
                                type="password"
                                class="form-control"
                                :class="{ invalid: invalid }"
                            >
                            <p class="text-center">If you are a restaurant owner, click <button class="text-nav" @click="ownerModalOpen = !ownerModalOpen, signinModalShow = false">here</button> to sign in.</p>
                        <div class="w-100 button-box">
                          <button class="btn-brand float-right" @click="handleUserSignIn">OK</button>
                          <button class="btn-brand float-right" @click="resetModal('signin')">Cancel</button>
                        </div>                        
                    </template>
                </b-modal>

                <b-modal centered v-model="ownerModalOpen" modal-lg
                  @cancel="resetModal('owner')" @hidden="resetModal('owner')" hide-footer hide-header>
                    <template #default>
                        <h2 class="modal-title">Owner Signin</h2>
                            <input
                                v-model="email"
                                trim
                                placeholder="Email"
                                class="form-control"
                            >                   
                            <input
                                v-model="password"
                                trim
                                placeholder="Password"
                                type="password"
                                class="form-control"
                                :class="{ invalid: invalidOwnerPassword }"
                            >
                        <div class="w-100 button-box">
                          <button class="btn-brand float-right" @click="handleOwnerSignin">OK</button>
                          <button class="btn-brand float-right" @click="resetModal('owner')">Cancel</button>
                        </div>                        
                    </template>
                </b-modal>
                  <b-modal centered v-model="signupModalShow" hide-footer hide-header
                     @cancel="resetModal('signup')" @hidden="resetModal('signup')">
                    <template #default>
                        <h2 class="modal-title">User Signup</h2>           
                        <input
                                v-model="email"
                                trim
                                placeholder="Email"
                                class="form-control"
                            >
                            <input
                                v-model="firstName"
                                trim
                                placeholder="First name"
                                class="form-control"
                            >
                            <input
                                v-model="lastName"
                                trim
                                placeholder="Last name"
                                class="form-control"
                            >                  
                            <input
                                v-model="password"
                                trim
                                placeholder="Password"
                                type="password"
                                class="form-control"
                            >
                        <p class="text-center">If you are a restaurant owner, click <button class="text-nav" @click="toOwnerSignup">here</button> to sign up.</p>
                        <div class="w-100 button-box">
                          <button class="btn-brand float-right" @click="handleSignUp">OK</button>
                          <button class="btn-brand float-right" @click="resetModal('signup')">Cancel</button>
                        </div>                           
                    </template>
                </b-modal>
                </div>
              </b-navbar-nav>
      </b-navbar>
  </template>
  
  <script>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import UserDataService from '@/services/UserDataService'
  import { sha256 } from 'js-sha256';
  import { onMounted } from '@vue/runtime-core';
  import { format } from 'date-fns'
  import {useToast} from 'bootstrap-vue-3'
  import OwnerDataService from '@/services/OwnerDataService';

  export default {
      setup() {
          const currentUser = ref(null)
          const toast = useToast()
          const invalid = ref(false)

          onMounted(() => {
            currentUser.value = JSON.parse(localStorage.getItem('currentUser'))
            currentOwner.value = JSON.parse(localStorage.getItem('currentOwner'))
          })

          const handleLogout = async () => {
              if (localStorage.getItem('currentUser')) {
                localStorage.removeItem('currentUser')
                currentUser.value = null
                toast.show({title: 'Logged out successfully'}, {pos: 'top-right', variant: 'danger'})      
              }

              if (localStorage.getItem('currentOwner')) {
                localStorage.removeItem('currentOwner')
                currentOwner.value = null
                toast.show({title: 'Logged out successfully'}, {pos: 'top-right', variant: 'danger'})
              }
              router.go()
          }
          const email = ref(null)
          const firstName = ref(null)
          const lastName = ref(null)
          const password = ref(null)
          
          const handleSignUp = async () => {
            try {
              await UserDataService.createUser(JSON.stringify(
                {
                email: email.value,
                firstName: firstName.value,
                lastName: lastName.value,
                hashedPassword: sha256(password.value)
              }
              ))

              const user = {
                email: email.value, 
                firstName: firstName.value, 
                lastName: lastName.value
              }

              currentUser.value = user
              localStorage.setItem('currentUser', JSON.stringify(user))
              resetModal('signup')
              toast.show({title: 'Signed up successfully'}, {pos: 'top-right', variant: 'danger'})
            } catch (error) {
              console.log(error)
            }
          }

          const handleUserSignIn = async () => {
            invalid.value = false
            if (email.value) {
              try {
                const res = await UserDataService.findUserByEmail({
                  email: email.value
                })
                const user = res.data
                if (user.hashedPassword === sha256(password.value)) {
                  currentUser.value = user
                  resetModal('signin')
                  toast.show({title: 'Signed in successfully'}, {pos: 'top-right', variant: 'danger'})
                  localStorage.setItem('currentUser', JSON.stringify(user))
                  router.go()
                } else {
                  password.value = null
                  invalid.value = true
                }
              } catch (err) {
                console.log(err)
              }
            }
          }

          const invalidOwnerPassword = ref(false)
          const currentOwner = ref(null)

          const handleOwnerSignin = async () => {
            invalidOwnerPassword.value = false
            if (email.value) {
              try {
                const res = await OwnerDataService.findOwnerByEmail({
                  email: email.value
                })
                const owner = res.data
                console.log(owner.hashedPassword)
                if (owner.hashedPassword === sha256(password.value)) {
                  currentOwner.value = owner
                  resetModal()
                  toast.show({title: 'Signed in successfully'}, {pos: 'top-right', variant: 'danger'})
                  localStorage.setItem('currentOwner', JSON.stringify(owner))
                  router.go()
                } else {
                  password.value = null
                  invalidOwnerPassword.value = true
                }
              } catch (err) {
                console.log(err)
              }
            }
          }

          
          const signinModalShow = ref(false)
          const signupModalShow = ref(false)
          const ownerModalOpen = ref(false)


          const resetModal = (type) => {
            if (type === 'signin') {
                signinModalShow.value = false
            } else if (type === 'signup') {
                signupModalShow.value = false
            } else {
                ownerModalOpen.value = false
            }
            invalid.value = false
            invalidOwnerPassword.value = false
            password.value = null
            email.value = null
            firstName.value = null
            lastName.value = null
            password.value = null
          }

          const router = useRouter()
          const toOwnerSignup = () => {
            signupModalShow.value = false
            router.push({ name: 'ownerSignup'})
          }

          return { 
            handleLogout, 
            currentUser,
            signinModalShow,
            signupModalShow,
            resetModal,
            toOwnerSignup,
            ownerModalOpen,
            email,
            lastName,
            firstName,
            password,
            handleSignUp,
            handleUserSignIn,
            invalid,
            handleOwnerSignin,
            invalidOwnerPassword,
            currentOwner
        }
      }
  }
  </script>
  
  <style scoped>
      img {
          max-height: 60px;
      }

      span {
          display: inline-block;
          margin-left: 16px;
          margin-right: 16px;
          padding-left: 16px;
          border-left: 1px solid black;
      }

      .nav-container {
        background: rgba(232, 212, 195, 0.5);
        height: 100px;
        font-family: 'Josefin Sans', sans-serif;
      }

      .text-nav:hover {
        color: rgba(195,144,127,1);
      }

      .text-nav {
        border-left: 0;
      }

      button.text-nav{
        text-decoration: underline;
      }

      .logo-name {
        font-family: 'Josefin Sans', sans-serif;
        font-size: 30px;
      }

      .form-control {
        padding: 15px;
        margin-bottom: 20px;
        margin-top: 20px;
      }

  </style>

  <style>
      .float-right {
        float: right;
        margin-right: 0;
        margin-top: 10px;
      }

      h2, h4 {
        font-family: 'Josefin Sans', sans-serif;
      }

      .modal-title {
        margin: 10px auto;
        margin-bottom: 20px;
        text-align: center;
      }

      .text-center {
        text-align: center;
        font-family: 'Josefin Sans', sans-serif;
        font-size: 1rem;
      }

      .form-control::placeholder {
        font-family: 'Josefin Sans', sans-serif;
      }

      .btn-brand {
        border-radius: 0;
        padding: 0.5rem 1.75rem;
        background-color: transparent;
        border-color: #000;
        color: #000;
        border: 1px solid #000;
        margin-right: 10px;
        font-family: 'Josefin Sans', sans-serif;
      }

      .btn-brand:hover{
        background-color: rgba(195,144,127,1);
        color: white;
      }

      .button-box button {
        margin-left: 10px;
      }

      .button-box {
        margin-top: 40px;
      }

      .invalid {
        border: none;
        outline: 2px solid red;
        border-radius: 5px;
      }

      .toast-header {
        font-size: 15px;
      }
  </style>
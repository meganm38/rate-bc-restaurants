<template>
  <div class="personal-container" v-if="user">
    <b-container :toast="{root: true}" fluid="lg" ></b-container>

    <div class="user-info">
        <img src="../assets/avatar1.png" alt="">
        <div>
            <h2>{{ user.firstName }} {{ user.lastName }}
                <span v-if="isCurrentUser" @click="changeUsernameOpen = !changeUsernameOpen" class="edit-pencil"><font-awesome-icon icon="fa-solid fa-pencil" /></span>
            </h2>
            <p v-if="isCurrentUser" @click="changePasswordOpen = !changePasswordOpen" class="changeP">Change password</p>
            <span>{{ user.numReviews }} Reviews</span>
        </div>
    </div> 
    <div class="reviews" v-if="reviews">
        <div v-for="review in reviewsEachPage" :key="review.id">
            <SingleReviewVue :byUser="true" :review="review" :isCurrentUser = isCurrentUser />
        </div>
        <b-pagination  align="center" v-if="reviews.length" v-model="currentPage" :per-page="perPage" pills :total-rows="reviews.length"></b-pagination>
    </div>
    <div v-else  class="d-flex justify-content-center">
        <b-spinner variant="danger"></b-spinner>
    </div>

    <b-modal centered v-model="changePasswordOpen" modal-lg
                    @cancel="resetModal" @hidden="resetModal" hide-footer hide-header>
                    <template #default>
                        <h2 class="modal-title">Change Password</h2>                
                            <input
                                v-model="newPassword"
                                trim
                                placeholder="New password"
                                type="password"
                                class="form-control"
                            >
                            <input :class="{invalid: matchError}"
                                v-model="repeatNewPassword"
                                trim
                                placeholder="Repeat new password"
                                type="password"
                                class="form-control"
                            >
                        <div class="w-100 button-box">
                          <button class="btn-brand float-right" @click="changePassword">OK</button>
                          <button class="btn-brand float-right" @click="resetModal">Cancel</button>
                        </div>                        
                    </template>
    </b-modal>

    <b-modal centered v-model="changeUsernameOpen" modal-lg
        @cancel="resetModal" @hidden="resetModal" hide-footer hide-header>
        <template #default>
            <h2 class="modal-title">Change Username</h2>                
                <input
                    v-model="firstName"
                    trim
                    placeholder="First name"
                    type="name"
                    class="form-control"
                >
                <input
                    v-model="lastName"
                    trim
                    placeholder="Last name"
                    type="name"
                    class="form-control"
                >
            <div class="w-100 button-box">
                <button class="btn-brand float-right" @click="changeUsername">OK</button>
                <button class="btn-brand float-right" @click="resetModal">Cancel</button>
            </div>                        
        </template>
    </b-modal>
  </div>
</template>

<script>
import SingleReviewVue from '@/components/SingleReview.vue'
import UserDataService from '@/services/UserDataService'
import RestaurantDataService from '@/services/RestaurantDataService'
import ReviewDataService from '@/services/ReviewDataService'
import { onMounted } from '@vue/runtime-core'
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { sha256 } from 'js-sha256'
import {useToast} from 'bootstrap-vue-3'
import router from '@/router'

export default {
    components: { SingleReviewVue },
    setup() {
        const user = ref(null)
        const reviews = ref(null)
        const route = useRoute()
        const isCurrentUser = ref(false)

        onMounted(async () => {
            const userFromId = await UserDataService.findUserById({userId: parseInt(route.params.id) })
            user.value = userFromId.data
            const currentUser = JSON.parse(localStorage.getItem('currentUser'))
            if (currentUser && currentUser.userId === user.value.userId) {
                isCurrentUser.value = true
            }
            const res = await UserDataService.getReviewsByUserId({userId: user.value.userId})
            await Promise.all(res.data.map(async (review) => {
                const res = await RestaurantDataService.getRestaurantTypesById({ businessId: review.businessId })
                const photos = await ReviewDataService.getPhotosByReviewId({ reviewId: review.reviewId })
                if (photos.data.length) {
                    review.photos = photos.data
                }
                review.types = []
                res.data.forEach((type) => {
                    review.types.push(type.typeName)
                })
            }))
            reviews.value = res.data
        })

        const changePasswordOpen = ref(false)
        const newPassword = ref(null)
        const repeatNewPassword = ref(null)
        const matchError = ref(false)
        
        const toast = useToast()

        const changePassword = async () => {
            matchError.value = false
            if (newPassword.value != repeatNewPassword.value || !newPassword.value || !newPassword.value.length) {
                matchError.value = true
                return
            }
            await UserDataService.updateUserInfo({
                userId: user.value.userId,
                attributes: [
                    `"hashedPassword" = '${sha256(newPassword.value)}'`
                ]
            })
            resetModal()
            toast.show({title: 'Password Updated'}, {pos: 'top-right', variant: 'danger'})
        }

        const changeUsernameOpen = ref(false)
        const firstName = ref(null)
        const lastName = ref(null)

        const changeUsername = async () => {
            await UserDataService.updateUserInfo({
                userId: user.value.userId,
                attributes: [
                    `"firstName" = '${firstName.value}'`,
                    `"lastName" = '${lastName.value}'`
                ]
            })
            toast.show({title: 'Username Updated'}, {pos: 'top-right', variant: 'danger'})
            const currentUser = JSON.parse(localStorage.getItem('currentUser'))
            currentUser.firstName = firstName.value
            currentUser.lastName = lastName.value
            localStorage.setItem('currentUser', JSON.stringify(currentUser))
            resetModal()
            router.go()
        }

        const resetModal = () => {
            newPassword.value = null
            repeatNewPassword.value = null
            matchError.value = false
            changePasswordOpen.value = false

            changeUsernameOpen.value = false
            firstName.value = null
            lastName.value = null
        }

        const currentPage = ref(1)
        const perPage = 5
        const reviewsEachPage = ref(null)
            watchEffect(() => {
                const start = (parseInt(currentPage.value) - 1) * perPage
                const end = start + perPage
                if (reviews.value) {
                    reviewsEachPage.value = reviews.value.slice(start, end)
                }
            })

        return {
            user,
            reviews,
            isCurrentUser,
            changePasswordOpen,
            resetModal,
            newPassword,
            repeatNewPassword,
            matchError,
            currentPage,
            perPage,
            reviewsEachPage,
            changePassword,
            changeUsernameOpen,
            firstName,
            lastName,
            changeUsername
        }
    }
}
</script>

<style scoped>
    .personal-container {
        font-family: 'Josefin Sans', sans-serif;
        margin-bottom: 100px;
    }

    .user-info img {
        height: 150px;
        width: auto;
    }

    .user-info {
        width: fit-content;
        margin: 20px auto;
        display: grid;
        grid-template-columns: 1fr 2fr;
        align-items: center;
        column-gap: 20px;
        border-bottom: 1px dotted 	#B8B8B8;
        padding-bottom: 20px;
    }

    .changeP {
        cursor: pointer;
        margin-top: 15px;
    }

    .changeP:hover {
        color: rgba(195,144,127,1);

    }

    .form-control {
        padding: 15px;
        margin-bottom: 20px;
        margin-top: 20px;
    }

    .edit-pencil {
        cursor: pointer;
        font-size: 16px;
    }

    .edit-pencil:hover {
        color: rgba(195,144,127,1);
    }
</style>
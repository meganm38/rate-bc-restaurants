<template>
  <div class="personal-container" v-if="user">
    <b-container :toast="{root: true}" fluid="lg" ></b-container>

    <div class="user-info">
        <img src="../assets/avatar1.png" alt="">
        <div>
            <h2>{{ user.firstName }} {{ user.lastName }}</h2>
            <span>{{ user.numReviews }} Reviews</span>
            <p v-if="isCurrentUser" @click="changePasswordOpen = !changePasswordOpen" class="changeP">Change password</p>
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
                                placeholder="New Password"
                                type="password"
                                class="form-control"
                            >
                            <input :class="{invalid: matchError}"
                                v-model="repeatNewPassword"
                                trim
                                placeholder="Repeat new Password"
                                type="password"
                                class="form-control"
                            >
                        <div class="w-100 button-box">
                          <button class="btn-brand float-right" @click="changePassword">OK</button>
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
        const resetModal = () => {
            newPassword.value = null
            repeatNewPassword.value = null
            matchError.value = false
            changePasswordOpen.value = false
        }
        
        const toast = useToast()

        const changePassword = async () => {
            matchError.value = false
            if (newPassword.value != repeatNewPassword.value || !newPassword.value || !newPassword.value.length) {
                matchError.value = true
                return
            }
            await UserDataService.updateUserPassWord({
                userId: user.value.userId,
                hashedPassword: sha256(newPassword.value)
            })
            resetModal()
            toast.show({title: 'Password Updated'}, {pos: 'top-right', variant: 'danger'})
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
            changePassword
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
    color: rgba(195,144,127,1);
}

.form-control {
        padding: 15px;
        margin-bottom: 20px;
        margin-top: 20px;
      }
</style>
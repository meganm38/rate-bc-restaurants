<template>
  <div class="review-container">
    <b-container :toast="{root: true}" fluid="lg" ></b-container>
    <b-row class="user-info" v-if="!byUser">
            <img v-if="review.reviewId % 2 === 0" src="../assets/avatar1.png" alt="">
            <img v-else src="../assets/avatar2.png" alt="">
            <div class="text">
                <p class="userNameClickable" @click="toUserProfile">{{ review.firstName }} {{ review.lastName }}</p>
                <p>Vancouver, Canada</p>
            </div>
    </b-row>
    <b-row class="user-info" v-else>
            <img src="../assets/japanese.jpeg" v-if="review.types[0] === 'Japanese'">
            <img src="../assets/chinese.jpeg" v-if="review.types[0] === 'Chinese'">
            <img src="../assets/fastfood.jpeg" v-if="review.types[0] === 'Fastfood'">
            <img src="../assets/coffee.jpeg" v-if="review.types[0] === 'Coffee & Tea'">
            <img src="../assets/italian.jpeg" v-if="review.types[0] === 'Italian'">
            <img src="../assets/french.jpeg" v-if="review.types[0] === 'French'">
            <img src="../assets/seafood.jpeg" v-if="review.types[0] === 'Seafood'">
            <img src="../assets/brunch.jpeg" v-if="review.types[0] === 'Breakfast & Brunch'">
            <div class="text">
                <p @click="goRest" class="rest-name">{{ review.businessName }}</p>
                <p>{{ review.city }}, BC</p>
            </div>
    </b-row>
    <div class="review-info">
        <div class="ratings">
            <div class="empty-stars"></div>
            <div class="full-stars" :style=" { width: starPercentage }"></div>
        </div>
        <span class="reviews-num">{{ review.date }}</span>
        <p>{{ review.content }}</p>
    </div>
    <div class="photo-row" v-if="review.photos">
        <div class="photo-column" v-for="photo in review.photos" :key="photo.id">
            <img class="photo" :src="photo.url" alt="">
        </div>
    </div>
    <div class="review-btns" v-if="!byUser">
        <button @click="btnSelected('useful')" class="btn-brand" :class="{ 'selected': usefulSelected }"><font-awesome-icon icon="fa-regular fa-face-grin-stars" /> Useful {{ review.usefulVotes }}</button>
        <button @click="btnSelected('funny')" class="btn-brand" :class="{ 'selected': funnySelected }"><font-awesome-icon icon="fa-regular fa-face-smile" /> Funny {{ review.funnyVotes }}</button>
        <button @click="btnSelected('cool')" class="btn-brand" :class="{ 'selected': coolSelected }"><font-awesome-icon icon="fa-regular fa-face-surprise" /> Cool {{ review.coolVotes }}</button>
    </div>
    <div v-if="byUser && isCurrentUser" class="review-btns">
        <button :class="{ disabled: deleting }" @click="deleteReview" class="btn-brand">Delete review</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import getStar from '@/Composables/StarCalculator';
import { computed } from '@vue/runtime-core'
import { useRouter } from 'vue-router';
import UserDataService from '@/services/UserDataService';
import RestaurantDataService from '@/services/RestaurantDataService';
import ReviewDataService from '@/services/ReviewDataService';
import {useToast} from 'bootstrap-vue-3'

export default {
    props: [ 'review', 'byUser', 'ownerProfile', 'isCurrentUser'],
    setup(props) {

        const usefulSelected = ref(false)
        const funnySelected = ref(false)
        const coolSelected = ref(false)

        const starPercentage = computed(() => {
            return getStar(props.review.starRating, 1)
        })

        const router = useRouter()

        const goRest = () => {
            router.push({ name: 'rest', params: { id: props.review.businessId }})
        }

        const toUserProfile = () => {
            router.push({ name: 'userProfile', params: { id: props.review.userId }})
        }

        
        const deleting = ref(false)
        const user = JSON.parse(localStorage.getItem('currentUser'))
        const toast = useToast()

        const deleteReview = async () => {
            deleting.value = true
            const data = await RestaurantDataService.getRestaurantInfoById({ businessId: props.review.businessId })
            const restaurant = data.data[0]
            await Promise.all([
                await UserDataService.updateUserNumRatings({
                    numReviews: user.numReviews - 1,
                    email: user.email
                }),
                await RestaurantDataService.updateRestaurantReviewInfo({
                    numReviews: restaurant.numReviews - 1,
                    stars: (restaurant.stars * restaurant.numReviews - parseInt(props.review.starRating)) / (restaurant.numReviews - 1),
                    businessId: restaurant.businessId
                }),
                await ReviewDataService.deleteReviewById({reviewId: props.review.reviewId})
            ])

            user.numReviews -= 1
            localStorage.setItem('currentUser', JSON.stringify(user))
            toast.show({title: 'Deleted Successfully'}, {pos: 'top-right', variant: 'danger'})
            deleting.value = true
            router.go()
        }


        const btnSelected = async (type) => {
            switch (type) {
                case 'useful':
                    let newUsefulVotes = 0
                    if (usefulSelected.value) {
                        newUsefulVotes = props.review.usefulVotes - 1
                    } else {
                        newUsefulVotes = props.review.usefulVotes + 1
                    }
                    usefulSelected.value = !usefulSelected.value
                    await ReviewDataService.updateVotesByReviewId({
                        usefulVotes: newUsefulVotes,
                        funnyVotes: props.review.funnyVotes,
                        coolVotes: props.review.coolVotes,
                        reviewId: props.review.reviewId
                    })
                    props.review.usefulVotes = newUsefulVotes
                    break;
                case 'funny':
                    let newFunnyVotes = 0
                    if (funnySelected.value) {
                        newFunnyVotes = props.review.funnyVotes - 1
                    } else {
                        newFunnyVotes = props.review.funnyVotes + 1
                    }
                    funnySelected.value = !funnySelected.value
                    await ReviewDataService.updateVotesByReviewId({
                        usefulVotes: props.review.usefulVotes,
                        funnyVotes: newFunnyVotes,
                        coolVotes: props.review.coolVotes,
                        reviewId: props.review.reviewId
                    })
                    props.review.funnyVotes = newFunnyVotes
                    break;
                default:
                    let newCoolVotes = 0
                    if (coolSelected.value) {
                        newCoolVotes = props.review.coolVotes - 1
                    } else {
                        newCoolVotes = props.review.coolVotes + 1
                    }
                    coolSelected.value = !coolSelected.value
                    await ReviewDataService.updateVotesByReviewId({
                        usefulVotes: props.review.usefulVotes,
                        funnyVotes: props.review.funnyVotes,
                        coolVotes: newCoolVotes,
                        reviewId: props.review.reviewId
                    })
                    props.review.coolVotes = newCoolVotes
                    break;
            }
        }

        return {
            usefulSelected,
            funnySelected,
            coolSelected,
            btnSelected,
            starPercentage,
            goRest,
            deleteReview,
            deleting,
            toUserProfile
        }
    }
}
</script>

<style scoped>
    
    .user-info img {
        height: 100px;
        width: 100px;
        object-fit: cover;
        border-radius: 50%;
        padding: 0;
        margin-left: 10px;
    }

    .userNameClickable {
        cursor: pointer;
        color: rgba(195,144,127,1);
    }

    .review-container {
        padding: 20px;
        width: 70%;
        margin-left: auto;
        margin-right: auto;
        font-family: 'Josefin Sans', sans-serif;
        padding-top: 0;
    }

    .user-info p {
        margin-left: 15px;
        display: block;
        margin: 2px 0 0 0;
    }

    .user-info .text {
        width: fit-content;
    }

    .user-info {
        padding: 20px;
        margin-bottom: 0;
        width: fit-content;
        width: fit-content;
        display: grid;
        grid-template-columns: 1fr 2fr;
        align-items: center;
        column-gap: 10px;
    }

    .review-info {
        padding: 20px;
        padding-top: 0;
        padding-bottom: 0px;
    }

    .btn-brand {
        padding: 5px;
        font-size: 14px;
        width: 100px;
        text-align: center;
    }

    .btn-brand.selected {
        background-color: rgba(195,144,127,1);
        color: white;
    }

    .review-btns {
        padding-left: 20px;
    }

    .rest-name {
        cursor: pointer;
        color: rgba(195,144,127,1);
    }
    .photo {
        width: 100%;
        aspect-ratio: 1 / 1;
        margin: 0 0 20px 20px;
    }

    .photo-row {
        display: flex;
    }

    .photo-column {
        float: left;
        width: 20%;
        padding-right: 20px;
    }
</style>
<template>
    <div class="write-container" v-if="rest">
        <h1>{{ rest.businessName }}</h1>
        <div class="mt-3">Select your rating:</div>
        <Rating @rate=updpateRating />
        <p>empty</p>
        <textarea autofocus v-model="content"
        placeholder="If you want to find the world's best street burrito, look no further. Whenenver I'm craving for a California burrito,I immediately head to this food truck. For $12, they stuff in fries, gucamole, sour cream, and your choice of meat. The empoyees like to keep the line moving, which is really great espically during lunch." 
        rows="7"></textarea>

        <PhotoUploader @uploaderClosed = updatePhotos />
        <button :class="{disabled: uploading }" @click="post" class="btn-brand">Post Review</button>
        <b-container :toast="{root: true}" fluid="lg" ></b-container>
    </div>
  
</template>

<script>
import Rating from '../components/Rating.vue'
import PhotoUploader from '../components/PhotoUploader.vue'
import uploadImage from '@/firebase/uploadImage'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RestaurantDataService from '@/services/RestaurantDataService';
import UserDataService from '@/services/UserDataService'
import { onMounted } from '@vue/runtime-core'
import ReviewDataService from '@/services/ReviewDataService'
import { format } from 'date-fns'
import {useToast} from 'bootstrap-vue-3'


export default {
    components: { Rating, PhotoUploader },
    setup() {
        const photos = ref(null)
        const rating = ref(null)
        const uploading = ref(false)
        const rest = ref(null)
        const content = ref(null)
        const toast = useToast()

        onMounted(async () => {
            const res = await RestaurantDataService.getRestaurantInfoById({businessId: route.params.id})
            rest.value = res.data[0]
        })

        const router = useRouter()
        const route = useRoute()

        const updatePhotos = (data) => {
            photos.value = data
        }

        const updpateRating = (data) => {
            rating.value = data
        }

        const post = async () => {
            if (!content.value || !rating.value) {
                toast.show({title: 'No Rating or content'}, {pos: 'top-right', variant: 'danger'})
                return
            }
            uploading.value = true
            const user = JSON.parse(localStorage.getItem('currentUser'))

            const review = {
                content: content.value,
                starRating: rating.value,
                date: format(Date.now(), 'yyyy-MM-dd'),
                userId: user.userId,
                businessId: rest.value.businessId
            }
            // Update Review Table
            const data = await ReviewDataService.postNewReview(review)

            // Update Photo Table
            const reviewId = (data.data[0])[0].reviewId
            if (photos.value && photos.value.length) {
                const urls = await uploadImage(photos.value)

                await Promise.all(urls.map(async (url)  => {
                    try {
                        await ReviewDataService.createNewPhotoForReview({
                        url,
                        reviewId,
                    })
                    } catch (error) {
                        console.log(error.response)
                    }
                }))
            }
            
            // Update Restaurant Table
            await RestaurantDataService.updateRestaurantReviewInfo({
                numReviews: rest.value.numReviews + 1,
                stars: (rest.value.stars * rest.value.numReviews + parseInt(review.starRating)) / (rest.value.numReviews + 1),
                businessId: review.businessId
            })

            // Update RateUser Table
            await UserDataService.updateUserNumRatings({
                numReviews: user.numReviews + 1,
                email: user.email
            })

            user.numReviews += 1
            localStorage.setItem('currentUser', JSON.stringify(user))
            uploading.value = false
            router.push({ name: 'rest', params: { id: rest.value.businessId }})
        }


        return {
            rest,
            updatePhotos,
            post,
            content,
            updpateRating,
            uploading,
            
        }
    }
}
</script>

<style scoped>
    .write-container {
        font-family: 'Josefin Sans', sans-serif;
        width: 800px;
        margin: 20px auto;
        border: 2px solid rgba(195,144,127,0.5);
        padding: 20px;
        margin-bottom: 100px;
    }

    textarea {
        box-sizing: border-box;
        border: none;
        border-radius: 4px;
        resize: none;
        margin: 30px 0;
        width: 100%;
    }

    textarea:focus {
        outline: none !important;
    }
    
    textarea::placeholder {
        color: 	#B0B0B0;
}

    span {
        padding-top: 20px;
    }

    p{
        visibility: hidden;
    }
</style>

<style>
    button.disabled{
        border: 1px solid #999999;
        background-color: #cccccc;
        color: #666666;
        cursor: not-allowed !important;
    }

    button.disabled:hover {
        border: 1px solid #999999;
        background-color: #cccccc;
        color: #666666;
    }

</style>
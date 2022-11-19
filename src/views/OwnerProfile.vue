<template>
  <div class="personal-container">
    <div class="user-info">
        <img src="../assets/avatar1.png" alt="">
        <div v-if="currentOwner">
            <h2>{{ currentOwner.firstName}} {{ currentOwner.lastName }}</h2>
            <span>Restaurant Owner</span>
        </div>
    </div>

    <div class="rest-info">
        <h1>Burger King</h1>
        <div class="ratings">
            <div class="empty-stars"></div>
            <div class="full-stars" :style=" { width: starPercentage }"></div>
        </div>
        <span class="reviews-num">2 reviews</span>
        <div class="tag mt-2">Fastfood</div>
        <div class="mt-3 mb-3">3070 Granville Street Vancouver, BC V6H 3J8 Canada</div>
        <h3>Reservations</h3>
    </div>
  </div>
</template>

<script>
import getStar from '../Composables/StarCalculator'
import SingleReviewVue from '@/components/SingleReview.vue'
import { onMounted, ref } from 'vue'
export default {
    components: { SingleReviewVue },
    setup() {
      const currentOwner = ref(null)
      onMounted(() => {
        currentOwner.value = JSON.parse(localStorage.getItem('currentOwner'))
      })


      return {
        currentOwner
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

.rest-image {
    background-image: url(../assets/fastfood.jpeg);
    width: 300px;
    height: 300px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
  }

  .image-container {
    height: fit-content;
    margin: 0 auto;
    width: fit-content;
  }

  .rest-info {
    text-align: center;
    margin-top: 50px;
    margin-bottom: 30px;
  }
</style>
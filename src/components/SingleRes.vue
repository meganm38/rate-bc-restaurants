<template>
  <b-row class="rest-container">
    <b-col sm="3" v-if="rest.types[0] === 'Fastfood'">
        <div  class="fastfood-image"></div>
    </b-col>
    <b-col sm="3" v-if="rest.types[0] === 'Japanese'">
        <div  class="japanese-image"></div>
    </b-col>
    <b-col sm="3" v-if="rest.types[0] === 'Breakfast & Brunch'">
        <div  class="brunch-image"></div>
    </b-col>
    <b-col sm="3" v-if="rest.types[0] === 'Seafood'">
        <div  class="seafood-image"></div>
    </b-col>
    <b-col sm="3" v-if="rest.types[0] === 'Chinese'">
        <div  class="chinese-image"></div>
    </b-col>
    <b-col sm="3" v-if="rest.types[0] === 'Coffee & Tea'">
        <div  class="coffee-image"></div>
    </b-col>
    <b-col sm="3" v-if="rest.types[0] === 'French'">
        <div  class="french-image"></div>
    </b-col>
    <b-col sm="3" v-if="rest.types[0] === 'Italian'">
        <div  class="italian-image"></div>
    </b-col>
    <b-col sm="9">
        <h4>{{ rest.businessName }}</h4>
        <div class="ratings">
            <div class="empty-stars"></div>
            <div class="full-stars" :style=" { width: starPercentage }"></div>
        </div>
        <span class="reviews-num">{{ rest.numReviews }}</span>
        <div class="tag mt-2 mb-3">{{rest.types[0]}}</div>
        <button class="btn-brand" @click="goRest(rest.businessId)">Read reviews</button>
    </b-col>
  </b-row>
</template>

<script>
import { computed } from '@vue/runtime-core'
import { useRouter } from 'vue-router'
import getStar from '../Composables/StarCalculator'
import { onMounted } from '@vue/runtime-core'

export default {
    props: ['rest'],
    setup(props) {
        const starPercentage = computed(() => {
            return getStar(props.rest.stars, 1)
        })

        const router = useRouter()

        const goRest = (id) => {
            router.push({ name: 'rest', params: { id: id }})
        }

        return {
            starPercentage,
            goRest
        }
    }
}
</script>

<style scoped>
    .rest-container {
        font-family: 'Josefin Sans', sans-serif;
        margin-bottom: 20px;
        border-bottom: 1px solid 	#B8B8B8;
        padding-bottom: 30px;
    }

    .ratings {
    position: relative;
    vertical-align: middle;
    display: inline-block;
    color: #b1b1b1;
    overflow: hidden;
}

img {
    height: 160px;
    width: 100%;
}

.fastfood-image {
    background-image: url(../assets/fastfood.jpeg);
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
  }

  .japanese-image {
    background-image: url(../assets/japanese.jpeg);
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
  }

  .brunch-image {
    background-image: url(../assets/brunch.jpeg);
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
  }

  .seafood-image {
    background-image: url(../assets/seafood.jpeg);
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
  }

  .chinese-image {
    background-image: url(../assets/chinese.jpeg);
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
  }

  .coffee-image {
    background-image: url(../assets/coffee.jpeg);
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
  }

  .french-image {
    background-image: url(../assets/french.jpeg);
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
  }

  .italian-image {
    background-image: url(../assets/italian.jpeg);
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
  }

</style>

<style>
    .ratings {
position: relative;
vertical-align: middle;
display: inline-block;
color: #b1b1b1;
overflow: hidden;
}
.full-stars {
    position: absolute;
    left: 0;
    top: 0;
    white-space: nowrap;
    overflow: hidden;
    color: #fde16d;
}
.empty-stars:before, .full-stars:before {
content:"\2605\2605\2605\2605\2605";
font-size: 14pt;
}
.empty-stars:before {
-webkit-text-stroke: 1px 	#B0B0B0;
}
.full-stars:before {
-webkit-text-stroke: 1px orange;
}

.reviews-num {
margin-left: 5px;
color: rgb(105,105,105);
}
</style>

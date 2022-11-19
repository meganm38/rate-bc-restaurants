<template>
  <div>
    <b-row class="home-container g-0">
      <b-col md="6" class="text-container d-flex align-items-center">
      <div class="centered">
        <h1>RATE BC RESTAURANTS.</h1>
        <p>Your next review awaits. Explore restaurants across British Columbia. </p>
        <p>Enter a resaurant name to get started. Or, simply click Search to see all restaurants.</p>
        <b-nav-form class="mt-6">
              <b-form-input size="sm" class="mr-sm-2" placeholder="Search" v-model="name" ></b-form-input>
              <button class="my-2 my-sm-0 btn-brand" type="submit" @click="goSearchResults">Search</button>
        </b-nav-form>
     </div>
      </b-col>
      <b-col md="6">
        <div class="main-image"></div>
      </b-col>
    </b-row>
    <div class="picture-container">
      <div class="text"><h2>EXPLORE DELICIOUS FOOD</h2></div>
      <div class="pictures">
        <div class="single-picture">
          <img src="../assets/fastfood.jpeg" @click="goTypeResults('Fastfood')">
          <div class="centered-in">Fastfood</div>
        </div>
        <div class="single-picture">
          <img src="../assets/chinese.jpeg" @click="goTypeResults('Chinese')">
          <div class="centered-in">Chinese</div>
        </div>
        <div class="single-picture">
          <img src="../assets/seafood.jpeg" @click="goTypeResults('Seafood')">
          <div class="centered-in">Seafood</div>
        </div>
        <div class="single-picture">
          <img src="../assets/japanese.jpeg" @click="goTypeResults('Japanese')">
          <div class="centered-in">Japanese</div>
        </div>
        <div class="single-picture">
          <img src="../assets/coffee.jpeg" @click="goTypeResults('Coffee & Tea')">
          <div class="centered-in">Coffee & Tea</div>
        </div>
        <div class="single-picture">
          <img src="../assets/french.jpeg" @click="goTypeResults('French')">
          <div class="centered-in">French</div>
        </div>
        <div class="single-picture">
          <img src="../assets/italian.jpeg" @click="goTypeResults('Italian')">
          <div class="centered-in">Italian</div>
        </div>
        <div class="single-picture">
          <img src="../assets/brunch.jpeg" @click="goTypeResults('Breakfast & Brunch')">
          <div class="centered-in">Breakfast & Brunch</div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'HomeView',
  components: {
    
  },
  setup() {
    const name = ref(null)
    const router = useRouter()

    const goSearchResults = () => {
      if (!name.value || !name.value.length) {
        name.value = 'All'
      }
      router.push({ name: 'searchResults', params: { name: name.value}})
    }

    const goTypeResults = (type) => {
      router.push({ name: 'searchResults', params: { name: 'type=' + type }})
    }

    return {
      name,
      goSearchResults,
      goTypeResults
    }
  }
}
</script>

<style scoped>
  .home-container {
    height: 800px;
    padding: 40px;
    overflow: hidden;
  }

  .text-container {
    color:#3e3c3c;
    line-height: 1.5;
    font-size: 1rem;
    font-family: 'Josefin Sans', sans-serif;
    background: rgba(195,144,127,0.5);
    align-items: center;
  }

  .centered {
    width: 70%;
    margin: auto;
  }

  .centered h1 {
    color: #000;
    font-weight: bold;
    line-height: 1.1;
    font-size: 1.75rem;
    border-bottom: 1px solid #3e3c3c;
    padding-bottom: 5px;
  }

  p {
    margin-top: 0;
    margin-bottom: 1rem;
    font-weight: 400;
    letter-spacing: 1px;
  }

  .main-image {
    background-image: url(../assets/main.avif);
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
  }

  .picture-container {
    font-family: 'Josefin Sans', sans-serif;
    margin-bottom: 60px;
  }

  .picture-container .text h2{
    font-family: 'Yellowtail', cursive;
    font-size: 35px;
    margin: 0 auto;
    width: fit-content;
    padding: 50px 0;
  }

  .pictures {
    margin-top: 20px;
  }

  .pictures img{
    aspect-ratio : 1 / 1;
    object-fit: cover;
    width: 100%;
  }


  .single-picture {
    width: 25%;
    position: relative;
    text-align: center;
    color: white;
    display: inline-block;
    cursor: pointer;

  }

  .centered-in {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 18px;
    background: rgba(195,144,127,0.8);
    padding: 5px 10px;
    border-radius: 15px;
  }


  .pictures .single-picture:hover {
    box-shadow: 1px 2px 3px rgba(50, 50, 50, 0.05);
    transform: scale(1.02);
    transition: all ease 0.2s;
  }
</style>

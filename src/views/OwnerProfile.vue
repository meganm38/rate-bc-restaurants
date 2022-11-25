<template>
  <div class="personal-container">
    <div class="user-info">
        <img src="../assets/avatar1.png" alt="">
        <div v-if="currentOwner && rests">
            <h2>{{ currentOwner.firstName}} {{ currentOwner.lastName }}</h2>
            <span>Owner of {{ rests.length }} restaurants</span>
        </div>
    </div>

    <div  v-if="rests" class="rest-info">
      <h1><span class="rest-name" @click="goRest(rest.businessId)">{{ rest.businessName }}</span></h1>
        <div class="ratings">
            <div class="empty-stars"></div>
            <div class="full-stars" :style=" { width: rest.starPercentage }"></div>
        </div>
        <span class="reviews-num">{{ rest.numReviews }} reviews</span>


      <b-tabs class="tabs box" content-class="mt-3" align="center" active-nav-item-class="font-weight-bold">
        <b-tab title="Reservations" active>
            <div class="mt-3">
            <b-form-group class="mt-2"
              label="Reservation Options:"
              v-slot="{ ariaDescribedby }"
            >
            <b-form-checkbox-group
                v-model="rest.selectedReservationAttributes"
                :options="ReservationOptions"
                :aria-describedby="ariaDescribedby"
                
              ></b-form-checkbox-group>
            </b-form-group>

            <button class="btn-brand mb-4" @click="getReservations(rest.businessId)">Search reservations for this restaurant</button>
            <b-table v-if="rest.items && rest.items != 'none'" striped hover :items="rest.items"></b-table>
            <p v-if="rest.items === 'none'">No reservationss for this restaurant.</p>
          </div>
        </b-tab>
        <b-tab title="Reviews">
          <div class="mt-3">
            <b-container>
          <b-row>
            <b-col>
              <b-form-group
                label-cols-lg="6"
                content-cols-lg="6"
                label="Min. cool votes:"
                label-for="input-horizontal"
              >
                <b-form-input v-model="minCool"></b-form-input>
              </b-form-group>
            </b-col>
              <b-col>
                <b-form-group
                  label-cols-lg="6"
                  content-cols-lg="6"
                  label="Min. funny votes:"
                  label-for="input-horizontal"
                >
                  <b-form-input v-model="minFunny"></b-form-input>
                </b-form-group>
            </b-col>
            <b-col>
              <b-form-group
                  label-cols-lg="6"
                  content-cols-lg="6"
                  label="Min. useful votes:"
                  label-for="input-horizontal"
                >
                  <b-form-input v-model="minUseful"></b-form-input>
                </b-form-group>
            </b-col>
          </b-row>
        </b-container>         
          <button class="btn-brand mb-4" @click="getReviews(rest.businessId)">Search reviews for this restaurant</button>
          <b-table v-if="rest.reviews && rest.reviews != 'none'" striped hover :items="rest.reviews"></b-table>
          <p v-if="rest.reviews === 'none'">No reviews that match the criteria.</p>
        </div>
        </b-tab>
        <b-tab title="Tables">
          <div>

              <b-form-group
                  label-cols-lg="3"
                  content-cols-lg="8"
                  label="Min. capacity:"
                  label-for="input-horizontal"
                >
                  <b-form-input v-model="minCapacity"></b-form-input>
                </b-form-group>
           
          <button class="btn-brand mb-4" @click="getTables(rest.businessId)">Search tables for this restaurant</button>
          <b-table :fields="fields" v-if="rest.tables && rest.tables != 'none'" striped hover :items="rest.tables">
          </b-table>
          <p v-if="rest.tables === 'none'">No tables that match the criteria.</p>
        </div>
        </b-tab>
      </b-tabs>
        <b-pagination align="center" v-model="currentPage" :total-rows="rests.length" :per-page="1"></b-pagination>
    </div>
  
  </div>
</template>

<script>
import SingleReviewVue from '@/components/SingleReview.vue'
import { onMounted, ref } from 'vue'
import getStar from '../Composables/StarCalculator'
import OwnerDataService from '../services/OwnerDataService'
import { useRouter } from 'vue-router'
import { watchEffect } from '@vue/runtime-core'

export default {
    components: { SingleReviewVue },
    setup() {
      const currentOwner = ref(null)
      const rests = ref(null)
      const starPercentage = ref(null)
      onMounted(async () => {
        if (localStorage.getItem('currentOwner')) {
          currentOwner.value = JSON.parse(localStorage.getItem('currentOwner'))
          const res = await OwnerDataService.findRestaurantsByOwnerId({ownerId: currentOwner.value.ownerId})
          rests.value = res.data
          rests.value.forEach((rest) => {
            rest.starPercentage = getStar(rest.stars, 1)
            rest.selectedReservationAttributes = []
          })
        }
      })

      const ReservationOptions = [
          { text: 'Reservation Id', value: '"reservationId"' },
          { text: 'Date', value: 'date' },
          { text: 'Time', value: 'time'},
          { text: 'Number of People', value: '"numPeople"' },
          { text: 'Table Id', value: '"tableId"' }
      ]

      const TableOptions = [
        { text: 'Business Id', value: '"businessId"' },
        { text: 'Table Id', value: '"tableId"' },
        { text: 'Capacity', value: 'capacity' },
      ]

      const getReservations = async (id) => {
        const rest = rests.value.find(rest => rest.businessId === id)

        if (!rest.selectedReservationAttributes.length) {
          return
        }
        const res = await OwnerDataService.findReservationsByRestId({
          table: '"Reservation"',
          businessId: id,
          attributes: rest.selectedReservationAttributes
        })
        if (res.data.length) {
          rest.items = res.data
        } else {
          rest.items = "none"
        }
      }

      const minCapacity = ref(0)

      const getTables = async (id) => {
        const rest = rests.value.find(rest => rest.businessId === id)
        const res = await OwnerDataService.findInfoBasedOnFilters({
          table: '"RestaurantTable"',
          selections: [
            `capacity >= ${minCapacity.value}`,
            `"businessId" = ${id}`
          ]
        })
        if (res.data.length) {
          rest.tables = res.data
        } else {
          rest.tables = "none"
        }
      }

      const router = useRouter()
      const goRest = (id) => {
        router.push({ name: 'rest', params: { id: id }})
      }

      const rest = ref(null)
      watchEffect(() => {
        if (rests.value) {
          rest.value = rests.value[currentPage.value-1]
        }
      })

      const currentPage = ref(1)

      const minUseful = ref(0)
      const minFunny = ref(0)
      const minCool = ref(0)

      const getReviews = async (id) => {
        const rest = rests.value.find(rest => rest.businessId === id)
        const res = await OwnerDataService.findInfoBasedOnFilters({
          table: '"Review"',
          selections: [
            `"usefulVotes" >= ${minUseful.value}`,
            `"funnyVotes" >= ${minFunny.value}`,
            `"coolVotes" >= ${minCool.value}`,
            `"businessId" = ${id}`
          ]
        })
        if (res.data.length) {
          rest.reviews = res.data
        } else {
          rest.reviews = "none"
        }
      }

      return {
        currentOwner,
        ReservationOptions,
        rests,
        starPercentage,
        getReservations,
        goRest,
        TableOptions,
        getTables,
        currentPage,
        rest,
        minUseful,
        minFunny,
        minCool,
        getReviews,
        minCapacity,
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
  }

  .rest-name {
    cursor: pointer;
  }

  .box {
    width: 70%;
        margin: 20px auto;
        border: 2px solid rgba(195,144,127,0.5);
        padding: 20px;
        margin-bottom: 50px;
  }
</style>

<style>
.col-form-label {
  font-size: 18px !important;
}

.tabs {
  margin: 30px;
}

.nav-tabs {
  width: fit-content;
  margin: auto;
}

.nav-link.active {
  background: rgba(195,144,127,1) !important;
  color: white !important;
  border-color: transparent !important;
}

.nav-link:hover {
  background: rgba(195,144,127,1) !important;
  color: white !important;
  border-color: transparent !important;
}

.nav-link{
  color: black !important;
  border-bottom-color: rgba(195,144,127,1) !important;
}

</style>
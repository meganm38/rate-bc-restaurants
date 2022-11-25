<template>
  <div class="rest-container" v-if="rest">
    <b-container :toast="{root: true}" fluid="lg" ></b-container>
    <div class="image-container">
        <div class="fastfood-image" v-if="rest.types[0] === 'Fastfood'"></div>
        <div class="japanese-image" v-if="rest.types[0] === 'Japanese'"></div>
        <div class="brunch-image" v-if="rest.types[0] === 'Breakfast & Brunch'"></div>
        <div class="seafood-image" v-if="rest.types[0] === 'Seafood'"></div>
        <div class="chinese-image" v-if="rest.types[0] === 'Chinese'"></div>
        <div class="tea-image" v-if="rest.types[0] === 'Coffee & Tea'"></div>
        <div class="french-image" v-if="rest.types[0] === 'French'"></div>
        <div class="italian-image" v-if="rest.types[0] === 'Italian'"></div>
    </div>
    <div class="rest-info">
        <h1>{{ rest.businessName }}</h1>

        <div class="ratings">
            <div class="empty-stars"></div>
            <div class="full-stars" :style=" { width: starPercentage }"></div>
        </div>
        <span class="reviews-num">{{ rest.numReviews }} reviews</span>
        <div class="tag mt-2">{{rest.types[0]}}</div>
        <span v-for="payment in rest.payments" :key="payment" class="payments">
              {{ payment }} &nbsp;
        </span>
        <div class="mt-3 mb-3">{{ rest.address }}, {{ rest.city }} {{ rest.postalCode }}</div>
        <div class="mt-3 mb-3"><a :href="rest.website" target="_blank">{{ rest.website }}</a></div>

        <button @click="toWriteReview" class="btn-brand">Write a review</button>
        <button @click="openReservationModel" class="btn-brand">Make a reservation</button>
        <b-modal centered v-model="showReservationModal"
                    @cancel="resetModal()" @hidden="resetModal()" hide-footer hide-header>
                    <template #default>
                        <h2 class="modal-title">Make a Reservation</h2>
                        <Datepicker v-model="date" required :minDate="new Date()" :maxDate="maxDate"
                        preventMinMaxNavigation :enableTimePicker="false"></Datepicker>
                        <b-row>
                          <b-col sm="6">
                            <b-form-select v-model="time" class="form-control">
                                <b-form-select-option value="170000">5:00 pm</b-form-select-option>
                                <b-form-select-option value="173000">5:30 pm</b-form-select-option>
                                <b-form-select-option value="180000">6:00 pm</b-form-select-option>
                                <b-form-select-option value="183000">6:30 pm</b-form-select-option>
                                <b-form-select-option value="190000">7:00 pm</b-form-select-option>
                                <b-form-select-option value="103000">7:30 pm</b-form-select-option>
                            </b-form-select>
                          </b-col>

                          <b-col sm="6">
                            <b-form-select v-model="numPeople" class="form-control">
                          <b-form-select-option class="select-option" value="1">1 People</b-form-select-option>
                          <b-form-select-option value="2">2 People</b-form-select-option>
                          <b-form-select-option value="3">3 People</b-form-select-option>
                          <b-form-select-option value="4">4 People</b-form-select-option>
                          <b-form-select-option value="5">5 People</b-form-select-option>
                          <b-form-select-option value="6">6 People</b-form-select-option>
                          <b-form-select-option value="7">7 People</b-form-select-option>
                      </b-form-select>
                          </b-col>
                        </b-row>
                          <button :class="{disabled: finding }" class="btn-brand full-width" @click="findTable">Find a table</button>
                          <div v-if="foundTables && !finding">
                            A table is avaiable at this time:
                            <button class="btn-brand time-button" @click="handleReservation">Book</button>
                          </div>
                          <div v-if="noTableFound && !finding">
                            No table is avaiable at this time, try a different time.
                          </div>
                    </template>
        </b-modal>
    </div>
    <div>
    <div class="reviews" v-if="reviewsEachPage">
        <div v-for="review in reviewsEachPage" :key="review.id">
            <SingleReview :review="review"/>
        </div>
        <b-pagination v-if="rest.reviews.length" align="center" v-model="currentPage" :per-page="perPage" pills :total-rows="rest.reviews.length"></b-pagination>
    </div>
    </div>

  </div>
</template>

<script>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { addMonths, getMonth, getYear } from 'date-fns';
import {useToast} from 'bootstrap-vue-3'
import { format } from 'date-fns'

import { computed, watchEffect } from '@vue/runtime-core'
import SingleReview from '../components/SingleReview.vue'
import getStar from '../Composables/StarCalculator'
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import { onMounted } from '@vue/runtime-core';
import RestaurantDataService from '@/services/RestaurantDataService';
import ReviewDataService from '@/services/ReviewDataService'
import ReservationDataService from '@/services/ReservationDataService'


export default {
    components: { SingleReview, Datepicker },
    setup() {
      const route = useRoute()
      const toast = useToast()

      onMounted(async () => {
            const [basicInfo, types, payments, reviews] = await Promise.all([
                RestaurantDataService.getRestaurantInfoById({businessId: route.params.id}),
                RestaurantDataService.getRestaurantTypesById({businessId: route.params.id}),
                RestaurantDataService.getRestaruantPaymentsById({businessId: route.params.id}),
                RestaurantDataService.getRestaurantReviewsById({businessId: route.params.id})
            ])
            rest.value = basicInfo.data[0]

            rest.value.types = []
            types.data.forEach(element => {
              rest.value.types.push(element['typeName'])
            });

            rest.value.reviews = []
            
            reviews.data.map(async (review) => {
              const photos = await ReviewDataService.getPhotosByReviewId({ reviewId: review.reviewId })
              if (photos.data.length) {
                review.photos = photos.data
              }
              rest.value.reviews.push(review)
            })

            rest.value.payments = []
            payments.data.forEach((payment) => {
              rest.value.payments.push(payment.optionName)
            })

        })

        const rest = ref(null)

        const starPercentage = computed(() => {
            return getStar(rest.value.stars, 1)
        })

        const router = useRouter()
        const toWriteReview = () => {
          if (!localStorage.getItem('currentUser')) {
              toast.show({title: 'Please sign in as user first'}, {pos: 'top-right', variant: 'danger'})
              return
          }
          router.push({ name: 'write', params: { id: rest.value.businessId }})
        }

        // Reservations
        const showReservationModal = ref(false)

        const openReservationModel = () => {
          if (!localStorage.getItem('currentUser')) {
              toast.show({title: 'Please sign in as user first'}, {pos: 'top-right', variant: 'danger'})
              return
          }
          showReservationModal.value = !showReservationModal.value
        }

        const maxDate = computed(() => addMonths(new Date(getYear(new Date()), getMonth(new Date())), 2));

        const date = ref(null)
        const numPeople = ref(2)
        const time = ref('170000')

        const foundTables = ref(null)
        const finding = ref(false)
        const noTableFound = ref(false)
        const tables = ref(null)

        const findTable = async () => {
          finding.value = true
          foundTables.value = false
          noTableFound.value = false
          const res = await ReservationDataService.findTables({
            date: format(date.value, 'yyyy-MM-dd'),
            time: time.value,
            businessId: rest.value.businessId,
            capacity: numPeople.value
          })
          tables.value = res.data

          if (tables.value && tables.value.length) {
            foundTables.value = true
          } else {
            noTableFound.value = true
          }
          finding.value = false          
        }

        const resetModal = () => {
          showReservationModal.value = false
          date.value = null
          numPeople.value = 2
          time.value = '170000'
          foundTables.value = null
          finding.value = false
          noTableFound.value = false
          tables.value = null
        }

        const handleReservation = async () => {
          await ReservationDataService.createNewReservation({
            date: format(date.value, 'yyyy-MM-dd'),
            time: time.value,
            numPeople: numPeople.value,
            userId: JSON.parse(localStorage.getItem('currentUser')).userId,
            businessId: rest.value.businessId,
            tableId: tables.value[0].tableId
          })
          resetModal()
          toast.show({title: 'Reservation Made.\nA confirmation email will be sent to you shortly.'}, {pos: 'top-right', variant: 'danger'})
        }

        // Pagination
        const currentPage = ref(1)
        const perPage = 5
        const reviewsEachPage = ref(null)
        watchEffect(() => {
            const start = (parseInt(currentPage.value) - 1) * perPage
            const end = start + perPage
            if (rest.value && rest.value.reviews && rest.value.reviews.length) {
              reviewsEachPage.value = rest.value.reviews.slice(start, end)
            }
        })


        return {
            rest,
            starPercentage,
            toWriteReview,
            showReservationModal,
            date,
            maxDate,
            numPeople,
            resetModal,
            foundTables,
            findTable,
            finding,
            time,
            handleReservation,
            openReservationModel,
            noTableFound,
            currentPage,
            perPage,
            reviewsEachPage
        }
    }
}
</script>

<style scoped>
.payments {
  display: inline-block;
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

  .tea-image {
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

  .chinese-image {
    background-image: url(../assets/chinese.jpeg);
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

  .italian-image {
    background-image: url(../assets/italian.jpeg);
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
  }
  .image-container {
    height: 500px;
  }

  .rest-container {
    font-family: 'Josefin Sans', sans-serif;
    margin-bottom: 100px;
  }

  .rest-info {
    text-align: center;
    margin-top: 50px;
    margin-bottom: 30px;
  }

  .form-control {
        padding: 15px;
        margin-bottom: 20px;
        margin-top: 20px;
      }

      .full-width {
        width: 100%;
        text-align: center;
        margin-bottom: 20px;
        margin-top: 20px;
      }

      .time-button {
        width: 25%;
        padding: 8px;
        text-align: center;
        margin-left: 20px;
      }

      .filters {
        width: 70%;
        margin: 0 auto;
        padding-left: 40px;
      }
</style>

<style>
  .dp__pointer {
    border-radius: 0.375rem;
    margin-top: 10px;
    font-family: 'Josefin Sans', sans-serif;
  }

  .dp__input{
    padding: 15px;
    padding-left: 40px;
  }

  .dp__instance_calendar, .dp__calendar_wrap, .dp__action_buttons, .dp__selection_preview, .dp__time_display, .dp__overlay_cell_active, .dp__overlay_cell_pad {
    font-family: 'Josefin Sans', sans-serif;
  }

  .form-control, .select-option {
    font-family: 'Josefin Sans', sans-serif;
  }

</style>

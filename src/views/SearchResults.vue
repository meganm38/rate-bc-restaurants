<template>
    <div class="results-container">
        <b-row>
            <b-col md="12">
                <b-nav-form class="mb-4 search-bar" v-if="!name.includes('type=')">
                    <b-form-input size="sm" class="mr-sm-2" placeholder="Search" v-model="name"></b-form-input>
                    <button class="my-2 my-sm-0 btn-brand" type="submit" @click="goSearchResults">Search</button>
                </b-nav-form> 
                <div v-if="rests">
                    <h2  v-if="!name.includes('type=')">Search Results</h2>
                    <h2 v-else class="mb-3 mt-3">All {{ name.slice(5)}} Restaurants</h2>
                    <div>
                        <b-form-select id="dropdown-1" v-model="ratingFilter" v-if="!name.includes('type=')">
                            <b-form-select-option value="null">Apply a filter</b-form-select-option>
                            <b-form-select-option value="highest">Highest rated by type</b-form-select-option>
                            <b-form-select-option value="4">Highest rated by type with more than 4 reviews</b-form-select-option>
                            <b-form-select-option value="allPayments">All payment options</b-form-select-option>
                            <b-form-select-option value="popular">Most popular types</b-form-select-option>
                        </b-form-select>
                    </div>
                    <div v-for="each in restEachPage" :key="each.businessId">
                    <SingleRes :rest="each"></SingleRes>
                    </div>
                    <b-pagination v-if="rests.length" v-model="currentPage" :per-page="perPage" pills :total-rows="rests.length"></b-pagination>
                </div>
                <div v-else>
                    <div class="text-center text-danger my-2">
                        <b-spinner class="align-middle" label="Loading..."></b-spinner>
                    </div>
                </div>
            </b-col>
        </b-row> 
    </div>
  </template>
  
  <script>
import { ref, watchEffect } from 'vue'
import SingleRes from '../components/SingleRes.vue'
import { useRouter } from 'vue-router'
import { onMounted } from '@vue/runtime-core'
import RestaurantDataService from '@/services/RestaurantDataService'

    export default {
        components: { SingleRes },
        props: ['name'],
        setup(props) {
            const isBusy = ref(false)

            const rests = ref(null)

            const router = useRouter()

            const goSearchResults = () => {
                if (props.name && props.name.length) {
                    router.push({ name: 'searchResults', params: { name: props.name }})
                } else {
                    router.push({ name: 'searchResults', params: { name: 'All' }})
                }
            }

            const ratingFilter = ref(null)

            const getRestsBasedOnSearch = async () => {
                let res = null
                if (props.name === 'All' || props.name === '') {
                    res = await RestaurantDataService.getAllRestaurants()
                } else if (props.name.includes('type=')) {
                    res = await RestaurantDataService.getRestaurantsByType({ typeName: props.name.slice(5)})
                } else {
                    res = await RestaurantDataService.getResturantsByName({ name: props.name })
                }

                await Promise.all(res.data.map(async (rest) => {
                    const res = await RestaurantDataService.getRestaurantTypesById({
                        businessId: rest.businessId
                    })
                    rest.types = []
                    res.data.forEach(element => {
                        rest.types.push(element.typeName)
                    });
                }))

                return res
            }

            watchEffect(async () => {
                let  res = null
                switch(props.name) {
                    case 'All':
                        switch (ratingFilter.value) {
                            case 'highest':
                                res = await RestaurantDataService.getHighestRatedPerTpye()
                                break
                            case '4':
                                res = await RestaurantDataService.getHighestRatedWithEnoughReviews()
                                break
                            case 'allPayments':
                                res = await RestaurantDataService.getAllPaymentsAccepted()
                                break
                            case 'popular':
                                res = await RestaurantDataService.getPopular()
                                break
                            default:
                                res = await getRestsBasedOnSearch()
                                break
                        }
                        break
                    default:
                        switch (ratingFilter.value) {
                            case 'highest':
                                res = await RestaurantDataService.getHighestRatedPerTpyeWithName({ name: props.name })
                                break
                            case '4':
                                res = await RestaurantDataService.getHighestRatedWithEnoughReviewsWithName({ name: props.name })
                                break
                            case 'allPayments':
                                res = await RestaurantDataService.getAllPaymentsAcceptedWithName({ name: props.name })
                                break
                            case 'popular':
                                res = await RestaurantDataService.getPopularWithName({ name: props.name })
                                break
                            default:
                                res = await getRestsBasedOnSearch()
                                break
                    }
                }

                await Promise.all(res.data.map(async (rest) => {
                    const res = await RestaurantDataService.getRestaurantTypesById({
                        businessId: rest.businessId
                    })
                    rest.types = []
                    res.data.forEach(element => {
                        rest.types.push(element.typeName)
                    });
                }))

                rests.value = res.data
            })

            onMounted(async () => {
                const data =  await getRestsBasedOnSearch()
                rests.value = data.data
            })

            // Pagination
            const currentPage = ref(1)
            const perPage = 8
            const restEachPage = ref(null)
            watchEffect(() => {
                const start = (parseInt(currentPage.value) - 1) * perPage
                const end = start + perPage
                if (rests.value) {
                    restEachPage.value = rests.value.slice(start, end)
                }
            })

            watchEffect(() => {
                if (ratingFilter.value) {
                    currentPage.value = 1
                }
            })

            return {
                isBusy,
                rests,
                goSearchResults,
                ratingFilter,
                currentPage,
                perPage,
                restEachPage
            }
        },
    }
  </script>

  <style scoped>

    .results-container {
        padding: 40px;
        padding-top: 0;
        font-family: 'Josefin Sans', sans-serif;
        margin-bottom: 100px;
    }

    .search-bar {
        width: 100%;
        margin: 20px 0;
    }

  </style>

  <style>
     #dropdown-1, #dropdown-2, #dropdown-3 {
        background: rgba(195,144,127,1);
        border: none;
        margin-bottom: 20px;
        margin-right: 5px;
        width: fit-content;
        display: inline-block;
        color: white;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-size: 16px 12px;
        background-position: right .75rem center;
    }

    .page-link.active, .active > .page-link{
        background-color: rgba(195,144,127,1) !important;
        border-color: rgba(195,144,127,1) !important;
        color: white !important;
    }

    .page-link {
        color: black !important;
    }

</style>

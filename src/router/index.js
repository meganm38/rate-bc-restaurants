import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SearchResultsView from '../views/SearchResults.vue'
import RestView from '../views/Rest.vue'
import WriteReviewView from '../views/WriteReview.vue'
import UserReviewsView from '../views/UserReviews.vue'
import OwnerSignupView from '../views/OwnerSignup.vue'
import OwnerProfileView from '../views/OwnerProfile.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/search/:name',
    name: 'searchResults',
    component: SearchResultsView,
    props: true
  },
  {
    path: '/:id',
    name: 'rest',
    component: RestView,
    props: true
  },
  {
    path: '/:id/review',
    name: 'write',
    component: WriteReviewView,
    props: true
  },
  {
    path: '/user-profile/:id',
    name: 'userProfile',
    component: UserReviewsView,
    props: true
  },
  {
    path: '/owner-signup',
    name: 'ownerSignup',
    component: OwnerSignupView,
  },
  {
    path: '/owner-profile',
    name: 'ownerProfile',
    component: OwnerProfileView,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  // history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

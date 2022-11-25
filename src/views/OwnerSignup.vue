<template>
    <div class="write-container clearfix">
      <b-container :toast="{root: true}" fluid="lg" ></b-container>

        <h1>Owner Signup</h1>
        <form @submit.prevent="handleOwnerSignup">
        <b-form-group label="Business Name" label-size="lg">
          <b-form-input
            v-model="bName"
            placeholder="Enter business name"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Business Website" label-size="lg">
          <b-form-input
            v-model="website"
            placeholder="Enter business website"
          ></b-form-input>
        </b-form-group>

        <b-form-group
      label="Business Address"
      label-size="lg"
      class="address-group"
      required
    >

      <b-form-group
        label="Address:"
        label-for="nested-street"
      >
        <b-form-input v-model="address" id="nested-street" required></b-form-input>
      </b-form-group>

      <b-form-group
        label="City:"
        label-for="nested-city"
      >
        <b-form-input v-model="city" id="nested-city" required></b-form-input>
      </b-form-group>

      <b-form-group label="Postal code:" label-for="nested-zipcode" >
        <b-form-input v-model="postalCode" id="nested-zipcode" required></b-form-input>
      </b-form-group>
    </b-form-group>


    <b-form-group label="Business Type" label-size="lg">
        <b-form-select v-model="type" class="form-control" required>
                          <b-form-select-option value="1">Japanese</b-form-select-option>
                          <b-form-select-option value="2">Breakfast & Brunch</b-form-select-option>
                          <b-form-select-option value="3">Seafood</b-form-select-option>
                          <b-form-select-option value="4">Chinese</b-form-select-option>
                          <b-form-select-option value="5">Coffee & Tea</b-form-select-option>
                          <b-form-select-option value="6">Fastfood</b-form-select-option>
                          <b-form-select-option value="7">French</b-form-select-option>
                          <b-form-select-option value="8">Italian</b-form-select-option>                      
        </b-form-select>
    </b-form-group>


    <b-form-group label="First Name" label-size="lg">
          <b-form-input
            v-model="firstName"
            placeholder="Enter first name"
            required
          ></b-form-input>
    </b-form-group>

    <b-form-group label="Last Name" label-size="lg">
          <b-form-input
            v-model="lastName"
            placeholder="Enter last name"
            required
          ></b-form-input>
    </b-form-group>

    <b-form-group label="Email" label-size="lg">
          <b-form-input
            v-model="email"
            placeholder="Enter email"
            required
          ></b-form-input>
    </b-form-group>
       
    <b-form-group label="Password" label-size="lg">
          <b-form-input
            v-model="password"
            placeholder="Enter password"
            required
            type="password"
          ></b-form-input>
    </b-form-group>

       <button :class="{disabled: creating}" @click="handleSignup" class="btn-brand float-right">Sign up</button>
        </form>
        
    </div>
  
</template>

<script>
import { ref } from 'vue'
import {useToast} from 'bootstrap-vue-3'
import RestaurantDataService from '@/services/RestaurantDataService'
import OwnerDataService from '@/services/OwnerDataService'
import { sha256 } from 'js-sha256'
import { useRouter } from 'vue-router'

export default {
    setup() {
      const bName = ref(null)
      const address = ref(null)
      const city = ref(null)
      const postalCode = ref(null)
      const type = ref(null)
      const firstName = ref(null)
      const lastName = ref(null)
      const email = ref(null)
      const password = ref(null)
      const website = ref(null)
      const toast = useToast()

      const router = useRouter()
      const creating = ref(false)

      const handleSignup = async () => {
        creating.value = true
        const owner = await OwnerDataService.createOwner({
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          hashedPassword: sha256(password.value)
        })

        const res = await RestaurantDataService.createNewRestaurant({
          ownerId: owner.data[0][0].ownerId,
          businessName: bName.value,
          address: address.value,
          postalCode: postalCode.value,
          website: website.value,
          city: city.value
        })
        console.log(type.value)
        await RestaurantDataService.createRestaurantType({
          businessId: res.data[0][0].businessId,
          typeId: type.value
        })
        creating.value = false
        toast.show({title: 'Restaurant and owner created.'}, {pos: 'top-right', variant: 'danger'})
        router.push({name: 'home'})
      }


      return {
        bName,
        address,
        city,
        postalCode,
        type,
        firstName,
        lastName,
        email,
        password,
        handleSignup,
        website,
        creating
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

    .form-control {
        background-color: rgba(195,144,127,0.5);
        padding: 15px;
        margin: 10px 0;
    }

    .btn-brand {
        margin-left: auto;
    }

    h1 {
        width: fit-content;
        margin: 20px auto;
    }

</style>
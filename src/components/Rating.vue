<template>
  <div class="rate">
    <input type="radio" id="star5" name="rate" value="5" v-model="rating"/>
    <label for="star5" title="text">5 stars</label>
    <input type="radio" id="star4" name="rate" value="4" v-model="rating"/>
    <label for="star4" title="text">4 stars</label>
    <input type="radio" id="star3" name="rate" value="3" v-model="rating"/>
    <label for="star3" title="text">3 stars</label>
    <input type="radio" id="star2" name="rate" value="2" v-model="rating"/>
    <label for="star2" title="text">2 stars</label>
    <input type="radio" id="star1" name="rate" value="1" v-model="rating"/>
    <label for="star1" title="text">1 star</label>
    <font-awesome-icon icon="fa-duotone fa-star" />
  </div>
</template>

<script>
import { ref } from 'vue'
import { watchEffect } from '@vue/runtime-core'
export default {
    setup(props, context) {
        const rating = ref(null)
        
        watchEffect(() => {
            context.emit('rate', rating.value)
        })

        return {rating}
    }
}
</script>
<style scoped>
*{
    margin: 0;
    padding: 0;
}
.rate {
    float: left;
    height: 4px;
    padding: 0;
}
.rate:not(:checked) > input {
    position:absolute;
    top:-9999px;
}
.rate:not(:checked) > label {
    float:right;
    width:1em;
    overflow:hidden;
    white-space:nowrap;
    cursor:pointer;
    font-size:26px;
    color:#ccc;
}
.rate:not(:checked) > label:before {
    content: '\2605 ';
}
.rate > input:checked ~ label {
    color: #ffc700;    
    -webkit-text-stroke: 1px orange;

}
.rate:not(:checked) > label:hover,
.rate:not(:checked) > label:hover ~ label {
    color: #ffc700;  
}
.rate > input:checked + label:hover,
.rate > input:checked + label:hover ~ label,
.rate > input:checked ~ label:hover,
.rate > input:checked ~ label:hover ~ label,
.rate > label:hover ~ input:checked ~ label {
    color: #ffc700;
}

</style>
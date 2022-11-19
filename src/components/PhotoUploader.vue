<template>
  <div>
    <p>Attach photos:</p>
    <button class="btn-brand upload-btn" @click="openUploaderModal = true">
        <font-awesome-icon icon="fa-solid fa-camera" />
    </button>
    <div v-if="previews.length && !openUploaderModal">
        <b-row class="previews-short">
            <b-col md="3" v-for="(preview, index) in previews" :key="index">
                <div class="single-preview">
                    <b-img thumbnail :src="preview" class="preview"></b-img>
                    <button @click="removeImage(index)" class="top-right"><font-awesome-icon icon="fa-regular fa-trash-can" /></button>
                </div>
            </b-col>
        </b-row>
    </div>
    <b-modal centered v-model="openUploaderModal" size="lg"
        no-close-on-backdrop no-close-on-esc hide-footer hide-header scrollable>
        <template #default>
            <button @click="cancelUpload" class="close-btn"><font-awesome-icon icon="fa-solid fa-xmark" /></button>
            <div class="uploader-container d-flex align-items-center" v-if="!images.length">
                <div class="centered-ele">
                    <img src="../assets/upload.svg" alt="">
                    <div class="centered-ele mt-5">
                        <button class="btn-brand" @click="fileInput.click()">Browse Photos</button>
                    </div>
                </div>
                <input style="display: none"
                    ref="fileInput"
                    type="file"
                    @change="handleFileChange">
            </div>
            <div v-if="images.length && !showCancelAlert" class="preview-container">
                <h3>Almost done! Write a description and attach.</h3>
                <b-row class="previews">
                    <b-col md="3" v-for="(preview, index) in previews" :key="index">
                        <div class="single-preview">
                            <b-img thumbnail :src="preview" class="preview"></b-img>
                            <button @click="removeImage(index)" class="top-right"><font-awesome-icon icon="fa-regular fa-trash-can" /></button>
                        </div>
                        <p class="mt-3 mb-1">Caption</p>
                        <textarea class="caption" placeholder="Captions help others identify what's in the photo."></textarea>
                    </b-col>
                </b-row>
                <div>
                    <button class="btn btn-text" @click="fileInput.click()">Browse</button>
                    <input style="display: none"
                    ref="fileInput"
                    type="file"
                    @change="handleFileChange">
                    <div class="float-right">
                        <button class="btn-brand" @click="cancelUpload">Cancel</button>
                        <button class="btn-brand" @click="attachPhotos">Attach</button>
                    </div>
                </div>
            </div>
            <div v-if="showCancelAlert" class="cancel-alert d-flex align-items-center">
                <div class="centered-ele">
                    <h3>Your photos aren't uploaded yet!</h3>
                    <p>Are you surer you want to leave now and lose your progress?</p>
                    <div class="centered-ele">
                        <button class="btn-brand" @click="resetModal">Yes, discard</button>
                        <button class="btn-brand" @click="showCancelAlert = false">No, continue upload</button> 
                    </div>
                </div>
                
            </div>                         
        </template>
    </b-modal>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
    setup(props, context) {
        const openUploaderModal = ref(false)
        const fileInput = ref(null)
        const images = ref([])
        const previews = ref([])
        const captions = ref([])

        // User selects file
        const allowedTypes = ['image/png', 'image/jpeg']
        const handleFileChange = (e) => {
            const selected = e.target.files[0]

            if (selected && allowedTypes.includes(selected.type)) {
                images.value.push(selected)
                previews.value.push(URL.createObjectURL(selected))
            }
        }

        const showCancelAlert = ref(false)

        const cancelUpload = (e) => {
            e.preventDefault()            
            if (images.value.length) {
                showCancelAlert.value = true
            } else {
                resetModal()
            }
        }


        const attachPhotos = () => {
            openUploaderModal.value = false
            if (images.value.length) {
                context.emit('uploaderClosed', images.value)
            }
        }

        const removeImage = (index) => {
            images.value.splice(index, 1)
            previews.value.splice(index, 1)
        }

        const resetModal = () => {
            openUploaderModal.value = false
            images.value = []
            previews.value = []
            showCancelAlert.value = false
        }


        return {
            openUploaderModal,
            fileInput,
            handleFileChange,
            images,
            resetModal,
            previews,
            showCancelAlert,
            cancelUpload,
            removeImage,
            attachPhotos
        }
    }
}
</script>

<style scoped>
    .upload-btn {
        width: 100%;
        text-align: center;
        margin-bottom: 30px;
        padding: 40px;
        border: 2px solid rgba(195,144,127,0.5);

    }
</style>

<style>

    .uploader-container {
        height: 500px;
    }

    .centered-ele {
        margin: auto;
        width: fit-content;
        padding: 0;
    }

    .preview-container {
        height: 500px;
        font-family: 'Josefin Sans', sans-serif;
        padding: 15px;
    }

    .cancel-alert {
        height: 500px;
        font-family: 'Josefin Sans', sans-serif;
        text-align: center;
    }

    .preview-container h3 {
        margin: 20px 0;
    }

    .previews {
        height : 350px;
        width: 100%;
        overflow: auto;
    }

    .previews-short {
        height: fit-content;
        width: 100%;
        overflow: auto;
        margin-bottom: 30px;
    }

    .preview {
        width: auto;
        aspect-ratio: 1 / 1;
    }

    .caption {
        width: 100%;
        min-height : 70px;
        font-size: 13px;
        margin-bottom: 20px;
    }

    .caption:focus {
        outline: none !important;
    }

    .caption::placeholder {
        font-size: 13px;
    }

    .btn-text {
        color: rgba(195,144,127,1) !important;
    }

    .btn-text:focus {
        border:none;
    }

    .single-preview {
        position: relative;
        text-align: center;
    }

    .top-right {
        position: absolute;
        top: 8px;
        right: 8px;
        color: white;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 3px;
        padding: 3px 5px 1px 5px;
    }

    .close-btn {
        position: absolute;
        top: 18px;
        right: 18px;
        border-radius: 50%;
        padding: 0 7px;
    }

    .close-btn:hover {
        background: rgba(195,144,127,0.7);
        color: white;
    }
</style>
import storage from "./config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';


const uploadImage = async (files) => {
    const urls = []
    await Promise.all(files.map(async (file) => {
        const imageRef = ref(storage, uuidv4())
        const res = await uploadBytes(imageRef, file)
        const url = await getDownloadURL(res.ref)
        urls.push(url)
    }))

    return urls
}


export default uploadImage
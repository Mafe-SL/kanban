

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage"
import { v4 } from "uuid";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWXZ_jHTwOyzaxqu1uQLqrfOJJPareCF8",
  authDomain: "kanban-fc752.firebaseapp.com",
  projectId: "kanban-fc752",
  storageBucket: "kanban-fc752.appspot.com",
  messagingSenderId: "469323232555",
  appId: "1:469323232555:web:851a4f49d0628ee514016e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)

export async function uploadFile(file) {
    const storageRef = ref(storage, v4())
    await uploadBytes(storageRef, file)
    const url = await getDownloadURL(storageRef)
    return url
}
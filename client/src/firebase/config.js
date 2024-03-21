// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfdG_Q0BDPdp0Hx1VWkRcrast8c6c6b5M",
  authDomain: "gallery-4ec2f.firebaseapp.com",
  projectId: "gallery-4ec2f",
  storageBucket: "gallery-4ec2f.appspot.com",
  messagingSenderId: "55809152662",
  appId: "1:55809152662:web:f9b7ba19a9bbc6a05d94b7",
  measurementId: "G-SVLHRSQPXG"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
export { auth };
export const storage = getStorage(app);

export async function uploadFile(file) {
  const storageRef = ref(storage, v4());
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}

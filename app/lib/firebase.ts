import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

// Firebase 구성
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// 파이어베이스 로그인 지속성 설정(브라우저의 로컬 스토리지)
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    customLogger("파이어베이스 로그인 지속성 설정완료");

    function customLogger(message: string) {
      console.info(message);
    }
  })
  .catch((error) => {
    throw new Error(`로그인 지속성 설정중 오류발생: ${error.message}`);
  });

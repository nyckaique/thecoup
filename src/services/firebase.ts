import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously, setPersistence, browserLocalPersistence  } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);

// Obtenha uma instância do Firestore
const db = getFirestore(app);

// Obtenha uma instância da autenticação
const auth = getAuth(app);

// Configura a persistência para manter o usuário logado
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistência de autenticação ativada!");
  })
  .catch((error) => {
    console.error("Erro ao definir persistência:", error);
  });

export { db, auth, signInAnonymously };
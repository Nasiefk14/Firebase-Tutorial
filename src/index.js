import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    onSnapshot,
    addDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    serverTimestamp,
    getDoc,
    updateDoc
} from "firebase/firestore";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDV-ZM48gYCtDeZQkuiw2YjA-wcVU21ltY",
    authDomain: "fir-tutorial-8d4c2.firebaseapp.com",
    projectId: "fir-tutorial-8d4c2",
    storageBucket: "fir-tutorial-8d4c2.appspot.com",
    messagingSenderId: "962217852787",
    appId: "1:962217852787:web:c6370cbe624bf85d7f0f06",
    measurementId: "G-2ERSXKYLVV",
};

//Initialize Firebase App
initializeApp(firebaseConfig);

//Inistialize Firebase Service
const db = getFirestore();
const auth = getAuth()

//Get Collection Reference
const colRef = collection(db, "books");

//Queries
const q = query(
    colRef,
    orderBy("createdAt")
);

//Realtime Collection Data
onSnapshot(colRef, (snapshot) => {
    let books = [];
    snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id });
    });
    //console.log(books);
});

//Add Documents
const addBookForm = document.querySelector(".add");
addBookForm.addEventListener("submit", (e) => {
    e.preventDefault();

    addDoc(colRef, {
        title: addBookForm.title.value,
        author: addBookForm.author.value,
        createdAt: serverTimestamp(),
    }).then(() => {
        addBookForm.reset();
    });
});

//Delete Documents
const deleteBookForm = document.querySelector(".delete");
deleteBookForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const docRef = doc(db, "books", deleteBookForm.id.value);
    deleteDoc(docRef).then(() => {
        deleteBookForm.reset();
    });
});

//Get Siingle Document
const docRef = doc(db, 'books', 'Bexv02o4QcQPwKWsP3x8')

onSnapshot(docRef, (doc) => {
    //console.log(doc.data(), doc.id)
})

//Update Document
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'books', updateForm.id.value)
    updateDoc(docRef, {
        title: 'Updated Title!'
    }).then(() => {
        updateForm.reset()
    })
})

//Auth User Sign Up
const signUpForm = document.querySelector('.signup')
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const email = signUpForm.email.value
    const password = signUpForm.password.value

    createUserWithEmailAndPassword(auth, email, password).then((cred) => {
        //console.log('User Created: ', cred.user)
        signUpForm.reset()
    }).catch((err) => {
            console.log(err.message)
        })
})

//Logging Out
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
    signOut(auth).then(() => {
        //console.log('User Signed Out')
    }).catch((err) => {
        console.log(err.message)
    })
})

//Logging In
const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const email = loginForm.email.value
    const password = loginForm.password.value

    signInWithEmailAndPassword(auth, email, password).then((cred) => {
        //console.log('User Logged In: ',cred.user)
    }).catch((err) => {
        console.log(err.message)
        loginForm.reset()
    })
})

//Subscribing To Auth Changes
onAuthStateChanged(auth,(user) => {
    console.log('User Status Changed: ',user)
})
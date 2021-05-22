import logo from './logo.svg';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';


import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  // your config
    apiKey: "AIzaSyD80I_S3W66ulRZ0wfNf77zVywrID5KMbI",
    authDomain: "rocketchat-21ac4.firebaseapp.com",
    projectId: "rocketchat-21ac4",
    storageBucket: "rocketchat-21ac4.appspot.com",
    messagingSenderId: "557684864916",
    appId: "1:557684864916:web:1c3c403b1b9c3c8a814181",
    measurementId: "G-P3TYLFKHQX"

})

const auth = firebase.auth();
const firestrore = firebase.firestore();


const [user] = useAuthState(auth);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        
      </header>

      <section>
        {user ? <ChatRoom/> : <SignIn />}
      </section>

    </div>
  );
}


function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return(
    <button onClick = {signInWithGoogle } >Sign in with Gooogle</button>
  )
}

function SignOut() {
  return auth.currentUser && (

    <button onClick = {() => auth.signOut()}>Sign Out</button>
  )
}


export default App;

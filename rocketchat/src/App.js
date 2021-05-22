import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyDPxMfHTkLQnN7JbNHLWlu76-sdaIW-g5Q",
    authDomain: "rocketleague-f4ebf.firebaseapp.com",
    projectId: "rocketleague-f4ebf",
    storageBucket: "rocketleague-f4ebf.appspot.com",
    messagingSenderId: "780372147818",
    appId: "1:780372147818:web:170fe979182142a0ec5413",
    measurementId: "G-598J8BQ5PC"
});

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Do not violate the community guidelines or you will be banned for life!</p>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(messagesRef, { idField: 'id' });

  const [formValue,setFormValue] = useState('');
  
  const sendMessage = async(e) => {

    e.preventDefault();

    const {uid} = auth.currentUser;

    await messagesRef.add({
      text:formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid
    });

    setFormValue('');
  }

  

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <form onSubmit = {sendMessage}>
          <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
          <button type="submit">submit</button>
      </form>

    </main>

    
  </>)
}


function ChatMessage(props) {
  const {text,uid} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  console.log(props)
  return (
    <div>
      <p>{text}</p>
    </div>
  )
  
}


export default App;
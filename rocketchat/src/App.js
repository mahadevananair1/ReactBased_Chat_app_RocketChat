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
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous"></link>
        <h1>&#129322;Rocket Chat🚯</h1>
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
      <p className='text-center container'>Do not violate the community guidelines or you will be banned for life!</p>
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
  const query = messagesRef.orderBy('createdAt');

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue,setFormValue] = useState('');
  
  const sendMessage = async(e) => {

    e.preventDefault();

    const {uid,photoURL} = auth.currentUser;


    if (!formValue) {
      alert("Cant go Speechless here buddy ;)");
      return false;
    }

    await messagesRef.add({
      text:formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');

    dummy.current.scrollIntoView({ behavior : 'smooth'});
  }

  

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <div ref = {dummy}></div>
      <form onSubmit = {sendMessage}>
          <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
          <button type="submit">💌</button>
      </form>

    </main>

    
  </>)
}


function ChatMessage(props) {
  const {text,uid,photoURL} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  console.log(props)
  return (
    <div className={`message ${ messageClass }`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  )
  
}


export default App;
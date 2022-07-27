import { useEffect, useState } from 'react';
import './App.css';
import jwtDecode from 'jwt-decode';
import Editor from 'react-simple-code-editor';
import {highlight, languages} from "prismjs/components/prism-core"
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css'

function App() {

  const [user, setUser] = useState({});

  function handleCallbackResponse(response){
    console.log(response)
    let userObject = jwtDecode(response.credential);
    console.log(userObject);
    setUser(userObject);
    document.getElementById("signInDiv").hidden = true;
  }

  function handleSignOut(e){
    setUser({});
    document.getElementById("signInDiv").hidden = false;
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleCallbackResponse
    });

    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large"}
    );
    google.accounts.id.prompt();
  }, [])

  return (
    <div className="App">
      <div id = "signInDiv"></div>
      { Object.keys(user).length !==0 &&
        <button onClick={(e) => handleSignOut(e)}>Sign Out</button>
      }
      {Object.keys(user).length !==0 &&
      <><div>
        <img alt="profile_picture" src={user.picture}></img>
        <h3>Welcome {user.name} !!</h3>
        </div>
        <Editor
        value={JSON.stringify(user).replaceAll(',', ',\n')}
        // onValueChange={code => setCode(code)}
        highlight={code => highlight(code, languages.js)}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
        }}
      /></>}
    </div>
  );
}

export default App;

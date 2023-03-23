import './App.css';
import styled from 'styled-components';
import { BsUpload } from 'react-icons/bs'
import Tablefiles from "./components/Tablefiles.js"
import Header from './components/Header';



function uploadFn(){
  alert('Upload Button was clicked');
}

function App() {
  return (
    <>
      
      <Header />
      <div className='ButtonRow'>
        <div>
          <main>
            <form onClick={ () => document.querySelector(".input-field").click()}>
              <input type="file" accept='image/*' className='input-field' hidden />

              <BsUpload size={36} className='uploadButton'/>

            </form>
          
          </main>
        </div>
      </div>

      <Tablefiles />

    </> 
  );
}

export default App;

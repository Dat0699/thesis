import React, {useEffect, useState, useRef} from 'react';
import { RenderingPage } from './Router/index'
import Header from "./components/Header"
import PatientLogin from './pages/PatientLogin';

import './App.css'
import Intro from './Intro';

function App() {
  const token = localStorage.getItem('user-token');
  const userInfo = JSON.parse(localStorage?.getItem('user-info') || "{}") || {};
  const [state, setState] = useState({

  })
  const ref = useRef();

  if(window.location.pathname === '/' ) {
    if(userInfo?.isPatient) {
      window.location.pathname ='/patientview'
    }
    window.location.pathname ='/dashboard'
  } 
  useEffect(() => {
    if(!token) {
      console.log('window.location.pathname', window.location.pathname);
        if(window.location.pathname == '/welcome') {
          return <PatientLogin/>
        }
        if(window.location.pathname !== '/login') {
          window.location.pathname ='/login'
        }
    } 
  }, [token])

  ///123

  useEffect(() => {
    const iw = window.innerWidth
    window.addEventListener('resize', () => {
        if (iw < 500) {
            document.body.classList.remove('tablet');
            document.body.classList.add('mobile');
        }

        if (iw > 500 && iw < 1250) {
            document.body.classList.add('tablet');
            document.body.classList.remove('mobile');
        }

        if (iw > 1250) {
            document.body.classList.remove('tablet');
            document.body.classList.remove('mobile');
        }
        setState(prev => ({ ...prev, forceUpdate: state.forceUpdate + 1 }))
    })
}, [])
  return (
      <div>
          {(!state.isDoneIntro && !!!localStorage.getItem('user-token')) && (
            <Intro onDoneIntro={() => setState({...state, isDoneIntro: true})}/> 
          )}
          <div className={`${(state.isDoneIntro || !!localStorage.getItem('user-token')) ? '' : 'hidden'} show`}>
            {(window.location.pathname !== "/login" && token ) && (<Header/>)}
            {RenderingPage()}
          </div>   
          
      </div>
  );
}

export default App;

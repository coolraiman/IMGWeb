import 'semantic-ui-css/semantic.min.css';
import './styles.css';
import { Container } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router-dom';
import React, { Fragment, useEffect } from 'react';
import NavBar from './NavBar';
import { ToastContainer } from 'react-toastify';
import { useStore } from '../stores/store';
import LoadingComponent from './loadingComponent';
import ModalContainer from '../common/modals/ModalContainer';
import HomePage from '../../features/home/HomePage';

function App() {
  const location = useLocation();
  const {commonStore, userStore} = useStore();

  useEffect(() => {
    if(commonStore.token){
      userStore.getUser().finally(() => commonStore.setAppLoaded())
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore])

  if(!commonStore.appLoaded) return <LoadingComponent content='Loading app...'/>
 
  return (
    <Fragment>
      <ModalContainer />
      <ToastContainer position='bottom-right' hideProgressBar theme='colored' />
      {location.pathname === '/' &&
        <HomePage/>
      }
      <NavBar/>
      <Container id="main_container" style={{marginTop: '4em'}}>
        <Outlet/>
      </Container>
    </Fragment>
  );
}

export default observer(App);

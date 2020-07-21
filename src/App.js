import React,{useState,useReducer, useEffect,Suspense } from 'react'
import './App.css';
import { CSSTransition } from 'react-transition-group'
import Axios from 'axios'
import SpinWithDots from './components/SpinWithDots'
import Chat from './components/Chat'
import Header from './components/Header'
import Home from './components/Home'
import HomeGuest from './components/HomeGuest'
import Footer from './components/Footer'
import About from './components/About'
import Terms from './components/Terms'

import { BrowserRouter,Route,Switch } from 'react-router-dom'

import FlashMessages from './components/FlashMessages'
import DispatchContext from './DispatchContext'
import StateContext from './StateContext'
import Profile from './components/Profile'
import EditPost from './components/EditPost';
import NotFound from './components/NotFound'

const  CreatePost = React.lazy(()=>import('./components/CreatePost')) 
const  ViewSinglePost = React.lazy(()=>import('./components/ViewSinglePost')) 
const  Search = React.lazy(()=>import('./components/Search')) 
//const Chat = React.lazy(()=>import ('./components/Chat'))
const App = () => {
  
  const initialState={
  loggedIn:Boolean(localStorage.getItem("appToken")),
  flashMessages:[],
  user:{
    token:localStorage.getItem("appToken"),
    username:localStorage.getItem("appUserName"),
    avatar:localStorage.getItem("appAvatar")        
  },
  isSearchOpen:false,
  isChatOpen:false,
  unreadChatCount:0
  

  };
  
  function ourReducer(state,action){
    switch (action.type){
      case "login":
        return {
          ...state,
          user:action.data,
          loggedIn:true

        }
        case "logout":
        return {
          ...state,
          loggedIn:false

        }
        case "flashMessage":
        return {
          ...state,
          flashMessages:state.flashMessages.concat(action.value)

        }
        case "searchOpen":
          return{
            ...state,
            isSearchOpen:true
          }
        
          case "searchClose":
            return{
              ...state,
              isSearchOpen:false
            }  
          case "toggleChat":
            return{
              ...state,
              isChatOpen:!state.isChatOpen
            }
            case "closeChat":
              return{
                ...state,
                isChatOpen:false
              }
            case "incrementUnreadChatCount":
              return{
                ...state,
                unreadChatCount:state.unreadChatCount+1
              }  
            case "clearUnreadChatCount":
                return{
                  ...state,
                  unreadChatCount:0
                }        
        default:
          return state
        
    }
  }
  
  
  const [state,dispatch] = useReducer(ourReducer,initialState)
  useEffect(()=>{
    if(state.loggedIn){
      localStorage.setItem("appToken",state.user.token)
      localStorage.setItem("appUserName",state.user.username)
      localStorage.setItem("appAvatar",state.user.avatar)
    }else{
      
      localStorage.removeItem("appToken")
      localStorage.removeItem("appUsername")
      localStorage.removeItem("appAvatar")
    }
  },[state.loggedIn])

  useEffect(()=>{
    if(state.loggedIn){
      const ourRequest = Axios.CancelToken.source();
      async function fetchResults(){
        try {
          const response = await Axios.post(`http://localhost:8080/token`,{token:state.token},{cancelToken:ourRequest.token})
          if(response.data){
          dispatch({type:"logout"})
          dispatch({type:"flashMessage",value:"Your session has expired.Please login again to continue"})
          }
             
        } catch (error) {
          console.log("There was a problem or the request was cancelled.")
        }
      }
      fetchResults()
    }
  },[])





  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Suspense fallback={<SpinWithDots/>}>
          <Switch>
            <Route path="/profile/:username">
              <Profile />
            </Route>
            <Route path="/" exact>
              {state.loggedIn ? <Home /> : <HomeGuest />}
            </Route>
            <Route path="/post/:id" exact>
              <ViewSinglePost />
            </Route>
            <Route path="/post/:id/edit" exact>
              <EditPost />
            </Route>
            <Route path="/create-post">
              <CreatePost />
            </Route>
            <Route path="/about-us">
              <About />
            </Route>
            <Route path="/terms">
              <Terms />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
          </Suspense>
          <CSSTransition timeout={330} in={state.isSearchOpen} classNames="search-overlay" unmountOnExit>
            <div className="search-overlay">
            <Suspense fallback="">
              <Search/>

            </Suspense>
            </div>



          </CSSTransition>
          
            <Chat/>

          
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export default App

import React,{useEffect,useContext, useState} from 'react'
import Page from './Page'
import { useParams , NavLink,Route,Switch } from 'react-router-dom'
import axios from 'axios'
import StateContext from '../StateContext'
import ProfilePosts from './ProfilePosts'
import { useImmer } from 'use-immer'
import ProfileFollowers from './ProfileFollowers'
import ProfileFollowing from './ProfileFollowing'

const Profile = (props) => {
    const { username } = useParams()
    // console.log("un",props)
    const appState = useContext(StateContext)
    const [state,setState] = useImmer({
      followActionLoading:false,
      startFollowingRequest:0,
      stopFollowingRequest:0,
      startFollowingCount:0,
      stopFollowingCount:0,

      profileData:{
        profileUsername:"...",
        profileAvatar:"https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128",
        isFollowing:false,
        counts:{
            postCount:"",
            followerCount:"",
            followingCount:""
        }
    }
    })
    
    useEffect(()=>{
        async function fetchData(){
            try {
                const res= await axios.post(`http://localhost:8080/profile/${username}`,{token:appState.user.token})
                setState(draft=>{
                  draft.profileData=res.data})    
            } catch (error) {
                console.log(error.message)
                
            }
            
        } 
        fetchData()
        
    },[username])

    
    useEffect(()=>{
      if(state.startFollowingCount){
        console.log(state.startFollowingCount)
        setState(draft=>{
          draft.followActionLoading=true
        })
      async function fetchData(){
          try {
              const res= await axios.post(`http://localhost:8080/addFollow/${state.profileData.profileUsername}`,{token:appState.user.token})
              console.log(res.data)
              setState(draft=>{
                draft.profileData.isFollowing=true
                draft.profileData.counts.followerCount++;
                draft.followActionLoading=false
              
              
              })    
          } catch (error) {
              console.log(error.message)
              
          }
          
      } 
      fetchData()
    }
  },[state.startFollowingCount])

  
  useEffect(()=>{
    if(state.stopFollowingCount){
      console.log(state.stopFollowingCount)
      setState(draft=>{
        draft.stopFollowingRequest=true
      })


    async function fetchData(){
        try {
            const res= await axios.post(`http://localhost:8080/removeFollow/${state.profileData.profileUsername}`,{token:appState.user.token})
            console.log(res.data)
            setState(draft=>{
              draft.profileData.isFollowing=false
              draft.profileData.counts.followerCount--;
              draft.stopFollowingRequest=false
            
            
            })    
        } catch (error) {
            console.log(error.message)
            
        }
        
    } 
    fetchData()
  }
},[state.stopFollowingCount])


    function startFollowing(){
      setState(draft=>{
        draft.startFollowingCount++;
      })
    }
    
    function stopFollowing(){
      setState(draft=>{
        draft.stopFollowingCount++;
      })
    }
    
  
    return (
        <Page title ="Profile Screen">
            <h2>
        <img className="avatar-small" src={state.profileData.profileAvatar} alt="----" /> 
        {state.profileData.profileUsername}
      {appState.loggedIn && !state.profileData.isFollowing && appState.user.username !== state.profileData.profileUsername  && state.profileData.profileUsername !=="..." && (  
      <button onClick={startFollowing} disabled={state.followActionLoading} className="btn btn-primary btn-sm ml-2">Follow <i className="fas fa-user-plus"></i></button>
      ) }

    {appState.loggedIn && state.profileData.isFollowing && appState.user.username !== state.profileData.profileUsername  && state.profileData.profileUsername !=="..." && (  
      <button onClick={stopFollowing} disabled={state.followActionLoading} className="btn btn-danger btn-sm ml-2">Unfollow <i className="fas fa-user-times"></i></button>
      ) }

      </h2>


      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink exact to={`/profile/${state.profileData.profileUsername}`} className="nav-item nav-link">
          Posts: {state.profileData.counts.postCount}
        </NavLink>
        <NavLink to={`/profile/${state.profileData.profileUsername}/followers`} className="nav-item nav-link">
          Followers: {state.profileData.counts.followerCount}
        </NavLink>
        <NavLink to={`/profile/${state.profileData.profileUsername}/following`} className="nav-item nav-link">
          Following: {state.profileData.counts.followingCount}
        </NavLink>
      </div>

      <Switch>
        <Route exact path="/profile/:username">
          <ProfilePosts />
        </Route>
        <Route path="/profile/:username/followers">
          <ProfileFollowers />
        </Route>
        <Route path="/profile/:username/following">
          <ProfileFollowing />
        </Route>
      </Switch>
    </Page>
  )
}

export default Profile

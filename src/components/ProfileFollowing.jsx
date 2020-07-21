import React from 'react'
import { useState,useEffect,useContext } from 'react'
import Axios from 'axios';
import StateContext from '../StateContext'
import { useParams ,Link} from 'react-router-dom';
import SpinWithDots from './SpinWithDots'


const ProfileFollowing = () => {

    const [isLoading,setisLoading] = useState(true);
    const [posts,setPosts] = useState([]);
    const appState = useContext(StateContext);
    const { username} = useParams();
    useEffect(() => {
        async function fetchPosts(){
        try {

            const response = await Axios.get(`http://localhost:8080/profile/${username}/following`);
            setPosts(response.data);
            setisLoading(false);
            
        } catch (error) {
            
        }
    }
    fetchPosts()
    }, [username])

    if(isLoading)
    return<SpinWithDots/>
    
    
    
    
    return (
        
      <div className="list-group">
      
      {posts.map((follower,index)=>{
          return(
            <Link key={index} to={`/profile/${follower.username}`}  className="list-group-item list-group-item-action py-4 ">
            <div className="d-flex justify-content-between ">
            <div>
            <img className="avatar-tiny" src={follower.avatar} />{" "} 
            <strong>{follower.username}</strong>{" "}
            </div>
            
            </div>
          </Link>
          )
      })}
      
    </div>
    
    )
}

export default ProfileFollowing

import React from 'react'
import { useState,useEffect,useContext } from 'react'
import Axios from 'axios';
import StateContext from '../StateContext'
import { useParams ,Link} from 'react-router-dom';
import SpinWithDots from './SpinWithDots'
import Post from './Post'

const ProfilePosts = () => {

    const [isLoading,setisLoading] = useState(true);
    const [posts,setPosts] = useState([]);
    const appState = useContext(StateContext);
    const { username} = useParams();
    useEffect(() => {
        async function fetchPosts(){
        try {

            const response = await Axios.get(`http://localhost:8080/profile/${username}/posts`);
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
      
      {posts.map(post=>{
         return <Post post={post} key={post._id} /> 
      })}
      
    </div>
    
    )
}

export default ProfilePosts

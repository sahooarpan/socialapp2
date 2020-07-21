import React,{useContext,useEffect} from 'react'
import Page from './Page'
import StateContext from '../StateContext'
import SpinWithDots from './SpinWithDots'
import { useImmer } from 'use-immer'
import axios from 'axios'
import Post from './Post'

const Home = () => {
    const appState = useContext(StateContext);
    const [state,setState] = useImmer({
        isLoading:true,
        feed:[]
    })

    useEffect(()=>{
        async function fetchData(){
            try {
                const res= await axios.post(`http://localhost:8080/getHomeFeed`,{token:appState.user.token})
                console.log(res.data)
                setState(draft=>{
                    draft.isLoading=false
                    draft.feed=res.data

                })    
            } catch (error) {
                console.log(error.message)
                
            }
            
        } 
        fetchData()
        
    },[])

    if(state.isLoading){
        return <SpinWithDots/>
    }    




    return (
        <Page title="Yor Feed">
            {state.feed.length>0 && (
                <>
                <h2 className="text-center mb-4">The latest from those you Follow</h2>    
                <div className="list-group">
                {state.feed.map(post=>{
                    return <Post post={post} id={post._id}  />
      })}
     

                </div>
                
                
                </>
            )}

            {state.feed.length ===0 &&(
            <>    
            <h2 className="text-center">
            Hello <strong>
                {appState.user.username}
            </strong>,your feed is empty
            <p className="lead text-muted text-center">Your feed displays the latest posts from the people you follow. If you don&rsquo;t have any friends to follow that&rsquo;s okay; you can use the &ldquo;Search&rdquo; feature in the top menu bar to find content written by people with similar interests and then follow them.</p>
        </h2>
        </>

            ) }
        </Page>
    )
}

export default Home

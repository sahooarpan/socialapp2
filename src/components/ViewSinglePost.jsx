import React, { useEffect, useState,useContext } from "react"
import Page from "./Page"
import { useParams, Link ,withRouter} from "react-router-dom"
import Axios from "axios"
import SpinWithDots from "./SpinWithDots"
import ReactMarkdown from "react-markdown"
import ReactToolTip from 'react-tooltip'
import NotFound from './NotFound'
import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'




function ViewSinglePost(props) {
  
const appState = useContext(StateContext);
const appDispatch = useContext(DispatchContext);
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState()

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPost() {
      try {
        const response = await Axios.get(`http://localhost:8080/post/${id}`, { cancelToken: ourRequest.token })
        setPost(response.data)
        setIsLoading(false)
      } catch (e) {
        console.log("There was a problem or the request was cancelled.")
      }
    }
    fetchPost()
    return () => {
      ourRequest.cancel()
    }
  }, [id])

  if(!isLoading && !post){
    return <NotFound/>
  }

  if (isLoading)
    return (
      <Page title="...">
        <SpinWithDots />
      </Page>
    )

  const date = new Date(post.createdDate)
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

  function isOwner(){
    console.log(appState.loggedIn,"al")
    if(appState.loggedIn){
      return appState.user.username == post.author.username
    }
    return false
  }    

  async function deleteHandler(){
    try {
      const areYouSure = window.confirm("Do you really want to delete this post")
      if(areYouSure){
      const response = await Axios.delete(`http://localhost:8080/post/${id}`,{data:{token:appState.user.token}})
      if(response.data=="Success"){
        appDispatch({type:"flashMessage",value:"Post is removed"})
        props.history.push(`/profile/${appState.user.username}`)
      }  
    }
      
    } catch (error) {
      
    }
    
  }

  return (
    <Page title={post.title}>
      <div className="d-flex align-items-center justify-content-between ">
        <h2>{post.title}</h2>
        {isOwner() &&( <span className="pt-2">
          <Link to={`/post/${post._id}/edit`}  data-tip="Edit" data-for="edit" href="#" className="text-primary mr-2" >
            <i className="fas fa-edit"></i>
          </Link>
          <ReactToolTip id="edit" className="custom-tooltip" />
          <a onClick={deleteHandler} className="delete-post-button text-danger" data-tip="Delete" data-for="delete">
            <i className="fas fa-trash"></i>
          </a>
          <ReactToolTip id="delete" className="custom-tooltip" />
        </span> )}
        
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {dateFormatted}
      </p>

      <div className="body-content">
        <ReactMarkdown source={post.body} allowedTypes={["paragraph", "strong", "emphasis", "text", "heading", "list", "listItem"]} />
      </div>
    </Page>
  )
}

export default withRouter(ViewSinglePost)

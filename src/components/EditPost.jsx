import React, { useEffect, useState , useReducer,useContext } from "react"
import Page from "./Page"
import { useParams, Link,withRouter } from "react-router-dom"
import Axios from "axios"
import SpinWithDots from "./SpinWithDots"
import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'
import NotFound from "./NotFound"

function EditPost(props) {
    const originalState = {
        title:"",
        body:"",
        titleErrors:false,
        bodyErrors:false,
        titleMessage:"",
        bodyMessage:"",
        isFetching:true,
        isLoading:false,
        isSaving:false,
        notFound:false,
        id:useParams().id,
        sendCount:0
    }
    const appState = useContext(StateContext);
    const appDispatch = useContext(DispatchContext);
    
    function ourReducer(state=originalState,action){
        console.log(state)
        switch(action.type){
            case "FETCH_COMPLETE":
                return{
                    ...state,
                    title:action.value.title,
                    body:action.value.body,
                    isFetching: false

                }
            case "titleChange":
                return{
                    ...state,
                    titleErrors:false,
                    title:action.value
                }
            case "bodyChange":
                return{
                    ...state,
                    bodyErrors:false,
                    body:action.value
                }
            case "submitrequest":
            if(!state.titleErrors && !state.bodyErrors){    
            return{
                    ...state,
                    sendcount:state.sendCount++
                }
              }
              return state
            case "saveRequestStarted":
              return{
                ...state,
                isSaving:true
              }        
            
            case "saveRequestFinished":
                return{
                  ...state,
                  isSaving:false
                }    
            case "titleRules":
                  if(!action.value.trim()){
                  return{
                    ...state,
                    titleErrors:true,
                    titleMessage:"You must enter a title"
                  }
                  
                } 
                return state
            case "notfound":
              return{
                ...state,
                notFound:true
              }     
                case "bodyRules":
                  if (!action.value.trim()) {
                    return{
                      ...state,
                      bodyErrors:true,
                      bodyMessage:"You must enter body content"
                    }
                  
              } 
              return state;

            default:
                return state;    
        }
        
    }
const [state,dispatch]= useReducer(ourReducer,originalState);     
  
useEffect(() => {

        const ourRequest = Axios.CancelToken.source()

    async function fetchPost() {
      try {
        const response = await Axios.get(`http://localhost:8080/post/${state.id}`, { cancelToken: ourRequest.token })
        if(response.data)
        {
        dispatch({type:"FETCH_COMPLETE",value:response.data})
        if(appState.user.username !== response.data.author.username){
            appDispatch({type:"flashMessage",value:"You do not have authority to change values"})
            props.history.push("/")
          }
        }else{
          dispatch({type:"notfound"})
        }
      } catch (e) {
        console.log("There was a problem or the request was cancelled.")
      }
    }
    fetchPost()
    return () => {
      ourRequest.cancel()
    }
    
  }, [])


  useEffect(() => {
    if(state.sendCount){
        
        dispatch({type:"saveRequestStarted"})
        const ourRequest = Axios.CancelToken.source()

    async function fetchPost() {
      try {
        const response = await Axios.post(`http://localhost:8080/post/${state.id}/edit`,
        {title:state.title,body:state.body,token:appState.user.token}, { cancelToken: ourRequest.token })
        console.log(response.data)
        dispatch({type:"saveRequestFinished"})
        appDispatch({type:"flashMessage",value:"Post was Updated!!"})
        }
       catch (e) {
        console.log("There was a problem or the request was cancelled.")
      }
    }
    fetchPost()
    return () => {
      ourRequest.cancel()
    }
    }
  }, [state.sendCount])

  if(state.notFound){
    return<NotFound/>
  }

  function handleSubmit(e){
      e.preventDefault();
      dispatch({type:"submitrequest"});

  }
  
  if (state.isFetching)
    return (
      <Page title="...">
        <SpinWithDots />
      </Page>
    )

  return (
    <Page title="Edit Post">
      <Link className="small font-weight-bold"  to={`/post/${state.id}`} >
        &laquo; Back to post permalink
      </Link>
      <form className="mt-3" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          
          <input onBlur={e=>dispatch({type:"titleRules",value:e.target.value})} onChange={e=>dispatch({type:"titleChange",value:e.target.value})} value={state.title} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
        {state.titleErrors && 
        <div className="alert alert-danger small liveValidateMessage">
        {state.titleMessage}
      </div>
        }
        
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onBlur={e=>dispatch({type:"bodyRules",value:e.target.value})} onChange={e=>dispatch({type:"bodyChange",value:e.target.value})} value={state.body} name="body" id="post-body" className="body-content tall-textarea form-control" type="text" />
          {state.bodyErrors && 
        <div className="alert alert-danger small liveValidateMessage">
        {state.bodyMessage}
      </div>
        }
        </div>

        <button disabled={state.isSaving} className="btn btn-primary">Save New Post</button>
      </form>
    </Page>
  )
}

export default withRouter(EditPost)

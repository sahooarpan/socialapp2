import React,{useContext} from 'react'
import { Link } from 'react-router-dom'
import DispatchContext from '../DispatchContext'
import StateContext from '../StateContext'
import ReactToolTip from 'react-tooltip'

const HeaderLoggedIn = () => {

    const appDispatch=useContext(DispatchContext)
    const appState=useContext(StateContext)
    
    function setLogOut(){
      appDispatch({type:"logout"});
      appDispatch({type:"flashMessage",value:"You have successfully logged out!"})  

    }

    function handleSearchIcon(e){
      e.preventDefault();
      appDispatch({type:"searchOpen"});
    }

    function handleClick(){
      console.log("Chat clicked")
      console.log(appState.isChatOpen)
      appDispatch({type:"toggleChat"})
      console.log(appState.isChatOpen)
    }

    return (

        <div className="flex-row my-3 my-md-0">
          <a onClick={handleSearchIcon} href="#" data-tip="Search" data-for="search" className="text-white mr-2 header-search-icon">
            <i className="fas fa-search"></i>
          </a>
          
          <ReactToolTip id="search" className="custom-tooltip" />
          {" "}
          <span onClick={() => appDispatch({ type: "toggleChat" })} data-for="chat" data-tip="Chat" className={"mr-2 header-chat-icon " +(appState.unreadChatCount?"text-danger":"text-white")} >
        <i className="fas fa-comment"></i>
        <span className="chat-count-badge text-white"> 
        {appState.unreadChatCount<10?appState.unreadChatCount:"9+"}
        
        </span>
        </span>
          {" "}
          <Link to={`/profile/${appState.user.username}`} data-tip="Profile" data-for="profile" className="mr-2">
            <img className="small-header-avatar" src={appState.user.avatar} alt="" />
          </Link>
          
          <ReactToolTip id="profile" className="custom-tooltip" />
          {" "}
          <Link className="btn btn-sm btn-success mr-2" to="/create-post">
            Create Post
          </Link>
          <button onClick={()=>setLogOut()} className="btn btn-sm btn-secondary">
            Sign Out
          </button>
        </div>
    )
}

export default HeaderLoggedIn

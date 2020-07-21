import React,{useState,useContext} from 'react'
import axios from 'axios'
import DispatchContext from '../DispatchContext'





const HeaderLoggedOut = (props) => {
const [username,setUsername] = useState();
const [password,setPassword] = useState();
const appDispatch=useContext(DispatchContext)
async function handleSubmit(e){
    e.preventDefault();
    try {
        const res = await axios.post("http://localhost:8080/login", { username,password })
        if(res.data){

            
            console.log(res.data);
            appDispatch({type:"login",data:res.data})
            
            appDispatch({type:"flashMessage",value:"You have successfully logged in!"})
        }else{
            console.log("Invalid email/password")
            appDispatch({type:"flashMessage",value:"Invalid email/password"})
        }
      } catch (e) {
        console.log(e.message)
        console.log("There was an error.")
}
}
    return (
        <form  onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
          <div className="row align-items-center">
            <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
              <input onChange={e=>setUsername(e.target.value)} name="username" className="form-control form-control-sm input-dark" type="text" placeholder="Username" autoComplete="off" />
            </div>
            <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
              <input onChange={e=>setPassword(e.target.value)} name="password" className="form-control form-control-sm input-dark" type="password" placeholder="Password" />
            </div>
            <div className="col-md-auto">
              <button className="btn btn-success btn-sm">Sign In</button>
            </div>
          </div>
        </form>
    )
}

export default HeaderLoggedOut
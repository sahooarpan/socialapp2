import React from 'react'
import { Link } from 'react-router-dom'
const Post = ({post,onClick}) => {

    const date = new Date(post.createdDate);
    const dateFormatted = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`         
return(


<Link  onClick={onClick} to={`/post/${post._id}`}  className="list-group-item list-group-item-action py-4 ">
<div className="d-flex justify-content-between ">
<div>
<img className="avatar-tiny" src={post.author.avatar} />{" "} 
<strong>{post.title}</strong>{" "}
</div>
<span className="text-muted small">{dateFormatted} </span>
</div>
</Link>
)


}
export default Post

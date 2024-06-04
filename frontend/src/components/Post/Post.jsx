import "../../../css/post.css"
import { useState } from "react";
import { formatDistanceToNow } from 'date-fns';
import { likePost } from '../../services/posts';
import { unlikePost } from '../../services/posts';
import SubmitComment from "../Comment/SubmitComment";
import Comment from "../Comment/Comment";

const Post = (props) => {
  const token = props.token
  const postId = props.post._id
  const postTimestamp = props.post.createdAt
  const userId = localStorage.getItem("userId");
  const initialLikeCount = props.post.likes.length;
  const initialLikeStatus = props.post.likes.includes(userId)
  const initialCommentsState = props.post.comments

  const [likeStatus, setLikeStatus] = useState(initialLikeStatus)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [commentsList, setCommentsList] = useState(initialCommentsState);

  function formatTimestamp(timestamp) {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  }
  
  const formattedTimestamp = formatTimestamp(postTimestamp);

  const handleLike = async () => {

    if (likeStatus == false) {
    setLikeCount(likeCount + 1);

    try {
      await likePost(token, postId);
  } catch (err) {
      console.error(err);
      setLikeCount(likeCount); 
  }
  } else if (likeStatus == true) {
    setLikeCount(likeCount - 1);
    try {
      await unlikePost(token, postId);
  } catch (err) {
      console.error(err);
      setLikeCount(likeCount); 

  }}
  setLikeStatus(!likeStatus)}

  const handleCommentCreated = (newComment) => {
    setCommentsList((prevComments) => [...prevComments, newComment]);
  };

  return <div key={postId} className="post">
    <h2>{props.post.username} - {formattedTimestamp}</h2>
    <article>{props.post.message}</article>
    <button onClick={ handleLike }>{likeStatus ? 'Unlike' : 'Like'}</button>
    <p>{likeCount} likes</p>
    <SubmitComment postId={postId} token={token} handleCommentCreated={handleCommentCreated} /> 
    {/* <div className="comments">
        {commentsList.map(comment => (
          // just gotta move this into own component 
          // similar to <Comment comment={comment} token={token} key={comment._id} postId={postId} />
          <div key={comment._id} className="comment">
            <h3>{comment.forename} says:</h3>
            <p>{comment.message}</p>
          </div>
        ))}
      </div> */}


        {commentsList.map(comment => (
        <Comment comment={comment} token={token} key={comment._id} postId={postId} />
        ))}
      </div>

};

export default Post;

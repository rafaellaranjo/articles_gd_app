import React from 'react';

const Comment = ({ author, time, content }) => {
  return (
    <div className="comment">
      <div className="comment-header">
        <strong>{author}</strong>
        <span className="comment-time">{time}</span>
      </div>
      <div className="comment-content">{content}</div>
    </div>
  );
};

export default Comment;

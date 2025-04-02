import React from 'react';

const tagColors = {
  Frontend: '#4a89dc',
  Backend: '#967adc',
  Mobile: '#48cfad',
  DevOps: '#ffaa33',
  AI: '#e74c3c',
  Product: '#659f2c',
  default: '#6c757d'
};

const TagBadge = ({ tag }) => {
  const bgColor = tagColors[tag] || tagColors.default;

  return (
    <span 
      className="badge" 
      style={{ 
        backgroundColor: bgColor,
        color: 'white'
      }}
    >
      {tag}
    </span>
  );
};

export default TagBadge;

import React, { useState } from 'react';

const TagSelector = ({ selectedTags = [] }) => {
  const [tags, setTags] = useState(selectedTags);
  const allTags = ['Frontend', 'Backend', 'Mobile', 'DevOps', 'AI'];

  const toggleTag = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  return (
    <div className="tag-selector">
      {allTags.map(tag => (
        <button
          key={tag}
          type="button"
          className={`tag ${tags.includes(tag) ? 'selected' : ''}`}
          onClick={() => toggleTag(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default TagSelector;

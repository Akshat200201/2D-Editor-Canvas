import { useState } from 'react';
import { copyToClipboard, shareableUrl } from '../utils/sceneUtils';
import './ShareButton.css';

const ShareButton = ({ sceneId }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = shareableUrl(sceneId);
    const success = await copyToClipboard(url);
    
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="share-container">
      <button 
        className="share-btn"
        onClick={handleShare}
        title="Copy shareable link"
      >
        {copied ? '✅ Copied!' : '🔗 Share Canvas'}
      </button>
      <div className="share-info">
        <small>Scene ID: {sceneId}</small>
      </div>
    </div>
  );
};

export default ShareButton;

// Utility functions for scene management

export const generateSceneId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy: ', err);
    return false;
  }
};

export const shareableUrl = (sceneId) => {
  return `${window.location.origin}/canvas/${sceneId}`;
};

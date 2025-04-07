import React from 'react';

// Add global CSS for avatar animation in index.css
// .avatar-pulse {
//   animation: avatar-pulse 1.5s infinite;
// }
// @keyframes avatar-pulse {
//   0% { transform: scale(1); opacity: 0.6; }
//   50% { transform: scale(1.05); opacity: 0.8; }
//   100% { transform: scale(1); opacity: 0.6; }
// }

// Simple 2D "speaking" avatar
const SimpleSpeakingAvatar = ({ speaking, size = 40 }: { speaking: boolean; size?: number }) => {
  return (
    <div className="speaking-avatar"
      style={{ 
        width: size, 
        height: size, 
        borderRadius: '50%',
        backgroundColor: '#4b6bfb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: size * 0.4,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Mouth */}
      <div style={{ 
        position: 'absolute',
        width: '60%',
        height: '20%',
        bottom: '20%',
        backgroundColor: '#ffffff',
        borderRadius: '30%',
        transition: 'all 0.2s ease-in-out',
        transform: speaking ? 'scaleY(0.8)' : 'scaleY(0.4)'
      }}></div>
      
      {/* Eyes */}
      <div style={{
        position: 'absolute',
        width: '8px',
        height: '8px',
        backgroundColor: '#ffffff',
        borderRadius: '50%',
        top: '35%',
        left: '30%'
      }}></div>
      <div style={{
        position: 'absolute',
        width: '8px',
        height: '8px',
        backgroundColor: '#ffffff',
        borderRadius: '50%',
        top: '35%',
        right: '30%'
      }}></div>
      
      {/* Pulsing effect when speaking */}
      {speaking && (
        <div className="pulse-effect" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '50%',
          boxShadow: '0 0 10px 2px rgba(75, 107, 251, 0.5)',
          opacity: 0.7
        }}></div>
      )}
    </div>
  );
};

interface Avatar3DProps {
  speaking: boolean;
  size?: number;
}

// Use simple 2D avatar while fixing Three.js issues
const Avatar3D: React.FC<Avatar3DProps> = ({ speaking, size = 40 }) => {
  return <SimpleSpeakingAvatar speaking={speaking} size={size} />;
};

export default Avatar3D;
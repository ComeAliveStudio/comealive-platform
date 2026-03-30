import React from 'react';

function App() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      padding: '20px'
    }}>
      <h1 style={{ color: '#333' }}>Welcome to My App</h1>
      <p style={{ color: '#555', marginBottom: '30px' }}>Click the links below:</p>
      <div style={{ display: 'flex', gap: '20px' }}>
        <a 
          href="https://YOUR_FIRST_LINK_HERE.com" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            textDecoration: 'none',
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: '#fff',
            borderRadius: '8px',
            transition: 'background-color 0.3s'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#005bb5'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#0070f3'}
        >
          First Link
        </a>
        <a 
          href="https://YOUR_SECOND_LINK_HERE.com" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            textDecoration: 'none',
            padding: '10px 20px',
            backgroundColor: '#21ba45',
            color: '#fff',
            borderRadius: '8px',
            transition: 'background-color 0.3s'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#168c2f'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#21ba45'}
        >
          Second Link
        </a>
      </div>
    </div>
  );
}

export default App;

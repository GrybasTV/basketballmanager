export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      fontFamily: 'sans-serif' 
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
      <h2 style={{ marginBottom: '2rem' }}>Puslapis nerastas</h2>
      <a 
        href="/" 
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#0070f3', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '5px' 
        }}
      >
        Grįžti į pradžią
      </a>
    </div>
  );
}

// src/pages/Test.jsx
export default function Test() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ color: 'green', fontSize: '48px' }}>✅ ROUTE BEKERJA!</h1>
      <p style={{ fontSize: '20px', marginTop: '20px' }}>Jika Anda melihat ini, routing Vercel berfungsi normal.</p>
      <p style={{ marginTop: '20px' }}>Waktu: {new Date().toLocaleString('id-ID')}</p>
    </div>
  );
}
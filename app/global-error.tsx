'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          padding: '20px'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '500px' }}>
            <h1 style={{ fontSize: '72px', margin: '0 0 20px' }}>Oops!</h1>
            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Une erreur s&apos;est produite</h2>
            <p style={{ marginBottom: '30px', color: '#666' }}>
              Quelque chose s&apos;est mal passé. Veuillez réessayer.
            </p>
            <button
              onClick={reset}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                backgroundColor: '#3B82F6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Réessayer
            </button>
            <button
              onClick={() => window.location.href = '/'}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                backgroundColor: 'white',
                color: '#3B82F6',
                border: '2px solid #3B82F6',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Retour à l&apos;accueil
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}


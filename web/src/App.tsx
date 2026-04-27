import { useEffect, useState } from 'react';
import './App.css';

function buildHealthUrl(): string {
  const raw = import.meta.env.VITE_API_URL;
  const base =
    typeof raw === 'string' && raw.length > 0 ? raw.replace(/\/$/, '') : '';
  return base ? `${base}/api/health` : '/api/health';
}

function App() {
  const [health, setHealth] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = buildHealthUrl();
    setLoading(true);
    setError(null);
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json() as Promise<{ status: string; service: string }>;
      })
      .then((data) => {
        setHealth(JSON.stringify(data, null, 2));
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Tiny Inventory</h1>
        <p className="muted">Stage 1 bootstrap: API health check</p>
      </header>
      <main className="panel">
        {loading && <p>Loading API status&hellip;</p>}
        {!loading && error && (
          <p className="error" role="alert">
            Could not reach the API: {error}
          </p>
        )}
        {!loading && !error && health && (
          <pre className="health-block">{health}</pre>
        )}
      </main>
    </div>
  );
}

export default App;

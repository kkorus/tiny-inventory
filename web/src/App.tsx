import { Outlet, NavLink, Link } from 'react-router-dom';
import type { JSX } from 'react';

function App(): JSX.Element {
  return (
    <div className="app-shell">
      <header className="header">
        <Link to="/" className="header-brand">
          <span className="brand-icon">📦</span>
          Tiny Inventory
        </Link>
        <nav className="nav">
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/categories">Categories</NavLink>
          <NavLink to="/stores">Stores</NavLink>
          <NavLink to="/store-products">Store Products</NavLink>
          <NavLink to="/reports">Reports</NavLink>
        </nav>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default App;

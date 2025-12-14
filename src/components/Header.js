import './Header.css'; // We'll create this CSS file

export default function Header({ cartCount, onCartOpen }) {
  return (
    <header className="site-header">
      <div className="header-container">
        <h1 className="site-title">GABHADIYA BOOZE</h1>
        <button className="cart-button" onClick={onCartOpen}>
          {/* Shopping Cart Icon using pure CSS */}
          <span className="cart-icon">Cart</span>
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </button>
      </div>
    </header>
  );
}
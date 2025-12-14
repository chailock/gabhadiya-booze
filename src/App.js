import { useState, useEffect } from 'react';
import './index.css';

const products = [
  { id: 1, name: "Jack Daniel's Old No.7 750ml", price: 349, image: "https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/1305d0d3-1518-4e5a-98fb-39e85d36e86c-retina-large.jpg" },
  { id: 2, name: "Savanna Dry 6-Pack", price: 129, image: "https://cdn.myshoptet.com/usr/www.braailapa.com/user/shop/big/1218_10394600pk2-20190726-media-checkers515wx515h.png?65087c73" },
  { id: 3, name: "Klipdrift Premium 750ml", price: 219, image: "http://www.baggiesdeli.com/cdn/shop/files/KlipdriftPremium1L.jpg?v=1758193945" },
  { id: 4, name: "Stellenbosch Cabernet 2021", price: 179, image: "https://keyassets.timeincuk.net/inspirewp/live/wp-content/uploads/sites/34/2024/07/SA_Cab_Bottles-920x609.gif" },
  { id: 5, name: "Heineken 12-Pack", price: 189, image: "https://goodeggs4.imgix.net/c0685eda-e797-489b-a8e1-353c4af1b13a.jpg?w=840&h=525&fm=jpg&q=80&fit=crop" },
  { id: 6, name: "Smirnoff Red 750ml", price: 179, image: "https://uptownspirits.com/cdn/shop/products/smirnoff-red-750ml-940093.jpg?crop=center&height=500&v=1684301256&width=600" }
];

export default function App() {
  const [ageVerified, setAgeVerified] = useState(false);
  const [id, setId] = useState('');
  const [error, setError] = useState('');
  const [cart, setCart] = useState({});
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    localStorage.removeItem('ageVerified'); // Remove this line when going live
  }, []);

  const verifySAID = (id) => {
    if (id.length !== 13) return false;
    const year = parseInt(id.substring(0, 2));
    const birthYear = year > 30 ? 1900 + year : 2000 + year;
    const age = new Date().getFullYear() - birthYear;
    return age >= 18;
  };

  const handleAgeSubmit = (e) => {
    e.preventDefault();
    if (verifySAID(id)) {
      localStorage.setItem('ageVerified', 'true');
      setAgeVerified(true);
    } else {
      setError('You must be 18+ to enter Gabhadiya Booze!');
    }
  };

  const addToCart = (id) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id) => {
    setCart(prev => {
      const updated = { ...prev };
      if (updated[id] > 1) {
        updated[id] -= 1;
      } else {
        delete updated[id];
      }
      return updated;
    });
  };

  const cartItems = Object.entries(cart).map(([id, qty]) => {
    const product = products.find(p => p.id === parseInt(id));
    return product ? { ...product, qty } : null;
  }).filter(Boolean);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const name = prompt('Enter your full name:') || 'Customer';
    const email = prompt('Enter your email:') || 'customer@example.com';
    const phone = prompt('Enter your phone number:') || '0821234567';
    const orderId = 'GB_' + Date.now();

    try {
      const response = await fetch('http://localhost:5000/api/payfast/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total, name, email, phone, orderId })
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Payment error: ' + (data.error || 'Try again'));
      }
    } catch (err) {
      alert('Backend not running. Start node server.js');
    }
  };

  if (!ageVerified) {
    return (
      <div className="age-gate">
        <div className="age-box">
          <h1>GABHADIYA BOOZE</h1>
          <p>You must be 18+ to enter</p>
          <form onSubmit={handleAgeSubmit}>
            <input
              type="text"
              placeholder="13-digit SA ID number"
              value={id}
              onChange={(e) => setId(e.target.value.replace(/\D/g, '').slice(0, 13))}
              required
            />
            {error && <p className="error">{error}</p>}
            <button type="submit">ENTER STORE</button>
          </form>
          <p className="footer">License pending • Trade responsibly • Volksrust, Mpumalanga</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <header>
        <h1>GABHADIYA BOOZE</h1>
        <button className="cart-btn" onClick={() => setShowCart(true)}>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </header>

      <main className="products">
        {products.map(p => (
          <div key={p.id} className="product-card">
            <img src={p.image} alt={p.name} />
            <div className="product-info">
              <h3>{p.name}</h3>
              <div className="price">R {p.price}</div>
              <button className="add-btn" onClick={() => addToCart(p.id)}>
                ADD TO CART
              </button>
            </div>
          </div>
        ))}
      </main>

      {showCart && (
        <div className="cart-overlay" onClick={() => setShowCart(false)}>
          <div className="cart-sidebar" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <h2>Your Cart</h2>
              <button className="close-btn" onClick={() => setShowCart(false)}>×</button>
            </div>

            {cartItems.length === 0 ? (
              <p className="empty-cart">Your cart is empty</p>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="item-info">
                        <strong className="item-name">{item.name}</strong>
                        <div className="item-price">R {item.price} × {item.qty}</div>
                      </div>
                      <div className="item-right">
                        <div className="item-total">R {item.price * item.qty}</div>
                        <button 
                          className="remove-btn"
                          onClick={() => removeFromCart(item.id)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div className="total-row">
                    <span>TOTAL :</span>
                    <span className="total-amount"> R {total}</span>
                  </div>
                  <button className="checkout-btn" onClick={handleCheckout}>
                    CHECKOUT WITH PAYFAST / OZOW
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
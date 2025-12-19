import './CartSidebar.css';

export default function CartSidebar({ items, total, onClose, onRemoveItem }) {
  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Empty Cart */}
        {items.length === 0 ? (
          <p className="empty-cart">Your cart is empty</p>
        ) : (
          <>
            <div className="cart-items">
              {items.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-info">
                    <strong className="item-name">{item.name}</strong>
                    <div className="item-price">
                      R {item.price} × {item.qty}
                    </div>
                  </div>

                  <div className="item-right">
                    <div className="item-total">
                      R {item.price * item.qty}
                    </div>

                    
                    <button 
                      className="remove-btn"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="total-row">
                <span>Total</span>
                <span className="total-amount">R {total}</span>
              </div>
              <button className="checkout-btn">
                CHECKOUT WITH PAYFAST
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

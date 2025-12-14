import './ProductCard.css';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price">R {product.price}</div>
        <button 
          className="add-to-cart-btn"
          onClick={() => onAddToCart(product.id)}
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
}
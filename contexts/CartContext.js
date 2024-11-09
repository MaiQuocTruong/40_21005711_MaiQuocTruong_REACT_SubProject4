import React, { createContext, useState } from 'react';

// Tạo context cho giỏ hàng
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = (newProduct, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.id === newProduct.id);

      if (existingItem) {
        // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
        return prevItems.map(item =>
          item.id === newProduct.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
        return [...prevItems, { ...newProduct, quantity }];
      }
    });
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.id === productId);

      if (existingItem && existingItem.quantity > 1) {
        // Giảm số lượng nếu số lượng lớn hơn 1
        return prevItems.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        // Xóa sản phẩm khỏi giỏ hàng nếu số lượng = 1
        return prevItems.filter(item => item.id !== productId);
      }
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

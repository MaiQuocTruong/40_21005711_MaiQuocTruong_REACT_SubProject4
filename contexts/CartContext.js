import React, { createContext, useState } from 'react';

// Tạo context cho giỏ hàng
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = (newProduct, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.id === newProduct.id && item.category === newProduct.category);

      if (existingItem) {
        // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
        return prevItems.map(item =>
          item.id === newProduct.id && item.category === newProduct.category
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
        return [...prevItems, { ...newProduct, quantity }];
      }
    });
  };

  // Lấy số lượng sản phẩm trong giỏ hàng
  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };
  
  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (productId, productCategory) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.id === productId && item.category === productCategory);
  
      if (existingItem && existingItem.quantity > 1) {
        return prevItems.map(item =>
          item.id === productId && item.category === productCategory
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prevItems.filter(item => !(item.id === productId && item.category === productCategory));
      }
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, getCartItemCount }}>
      {children}
    </CartContext.Provider>
  );
};

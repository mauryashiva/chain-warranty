"use client";

import { useState, useEffect } from "react";

export function useAdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/products");
      const json = await res.json();
      setProducts(json.data);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: any) => {
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    if (!res.ok) throw new Error("Failed to add product");
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, fetchProducts, addProduct };
}

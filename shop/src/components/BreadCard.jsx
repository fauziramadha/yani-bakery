// shop/src/components/BreadCard.jsx
import React from "react";
import { motion } from "framer-motion";

export default function BreadCard({ product, onClick }) {
  const soldOut = !product.stock || product.stock <= 0;
  return (
    <motion.article
      layout
      whileHover={{ scale: 1.02, y: -4 }}
      className={`card ${soldOut ? "sold" : ""}`}
      onClick={() => !soldOut && onClick && onClick(product)}
    >
      <div className="imageWrap">
        <img src={product.image || `/assets/${(product.name || "bread").toLowerCase().replace(/\s+/g, "-")}.png`} alt={product.name} />
        {soldOut && <div className="soldLabel">SOLD OUT</div>}
      </div>
      <div className="cardBody">
        <h3 className="cardTitle">{product.name}</h3>
        <div className="meta">
          <div className="price">Rp {Number(product.price || 0).toLocaleString()}</div>
          <div className="stock">{product.stock > 0 ? `${product.stock} pcs` : "—"}</div>
        </div>
      </div>
    </motion.article>
  );
}

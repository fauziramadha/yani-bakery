// shop/src/components/OrderModal.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function OrderModal({ product, paymentMethods = ["DANA", "QRIS"], onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    quantity: 1,
    orderDate: new Date().toISOString().slice(0, 10),
    pickupDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    paymentMethod: paymentMethods[0] || "DANA"
  });
  const [confirming, setConfirming] = useState(false);

  const soldOut = !product.stock || product.stock <= 0;

  const handleChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const trySubmit = () => {
    // simple validation
    if (!form.name || !form.phone) return alert("Isi nama dan nomor HP");
    if (form.quantity < 1) return alert("Masukkan jumlah yang valid");
    if (form.quantity > (product.stock || 0)) return alert("Jumlah melebihi stok");
    setConfirming(true);
  };

  const confirmAndSend = () => {
    setConfirming(false);
    // send to parent
    onSubmit({
      ...form,
      productId: product.id,
      productName: product.name
    });
  };

  return (
    <div className="modal-backdrop">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="modal">
        <div className="modalInner">
          <div className="left">
            <img src={product.image || "/assets/milk.png"} alt={product.name} style={{ width: "100%", borderRadius: 8 }} />
            <h2 style={{ marginTop: 10 }}>{product.name}</h2>
            <p className="muted">Rp {Number(product.price || 0).toLocaleString()}</p>
            <p style={{ fontSize: 13 }}>{product.stock > 0 ? `${product.stock} pcs tersedia` : "Sold Out"}</p>
          </div>

          <div className="right">
            <label>Jumlah</label>
            <input type="number" min="1" max={product.stock || 1} value={form.quantity} onChange={(e) => handleChange("quantity", Number(e.target.value))} />

            <label>Nama</label>
            <input placeholder="Nama" value={form.name} onChange={(e) => handleChange("name", e.target.value)} />

            <label>No HP</label>
            <input placeholder="08xxxxxxxx" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />

            <label>Alamat</label>
            <input placeholder="Alamat lengkap" value={form.address} onChange={(e) => handleChange("address", e.target.value)} />

            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <label>Tanggal Order</label>
                <input type="date" value={form.orderDate} onChange={(e) => handleChange("orderDate", e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label>Tanggal Ambil</label>
                <input type="date" value={form.pickupDate} onChange={(e) => handleChange("pickupDate", e.target.value)} />
              </div>
            </div>

            <label>Metode Pembayaran</label>
            <select value={form.paymentMethod} onChange={(e) => handleChange("paymentMethod", e.target.value)}>
              {paymentMethods.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button className="button" onClick={trySubmit} disabled={soldOut}>Submit Order</button>
              <button onClick={onClose} className="btnGhost">Batal</button>
            </div>

            {confirming && (
              <div className="confirmBox">
                <p>Apakah kamu yakin untuk melanjutkan orderan ini?</p>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button onClick={() => setConfirming(false)} className="btnGhost">Batal</button>
                  <button className="button" onClick={confirmAndSend}>Lanjut</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

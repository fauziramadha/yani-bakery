// shop/src/App.jsx
import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import BreadCard from "./components/BreadCard";
import OrderModal from "./components/OrderModal";
import "./styles.css";

export default function App() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null); // product object when user clicks
  const [loading, setLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState(["DANA", "QRIS"]);

  // Listen products in real-time
  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const items = [];
      snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
      setProducts(items);
      setLoading(false);
    }, (err) => {
      console.error("products onSnapshot error:", err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Load payment methods from settings (optional)
  useEffect(() => {
    (async () => {
      try {
        const settingsRef = doc(db, "settings", "payments");
        const s = await getDoc(settingsRef);
        if (s.exists() && Array.isArray(s.data().methods)) {
          setPaymentMethods(s.data().methods);
        }
      } catch (e) {
        // ignore; keep defaults
        console.warn("failed to load payment settings", e);
      }
    })();
  }, []);

  const openOrder = (product) => {
    setSelected(product);
  };

  const closeOrder = () => setSelected(null);

  // submit handler called from modal:
  // orderData = { name, phone, address, quantity, orderDate, pickupDate, paymentMethod, productId }
  const handleSubmitOrder = async (orderData) => {
    if (!orderData || !orderData.productId) return;
    try {
      // double-check stock atomically-ish: read current stock, then update
      const prodRef = doc(db, "products", orderData.productId);
      const snap = await getDoc(prodRef);
      if (!snap.exists()) throw new Error("Product not found");
      const prod = snap.data();
      const currentStock = prod.stock || 0;
      if (orderData.quantity > currentStock) {
        throw new Error("Stock tidak mencukupi");
      }

      // decrease stock
      await updateDoc(prodRef, { stock: currentStock - orderData.quantity });

      // create order doc (the backend/serverless can also enrich it)
      // we keep using client-side Firestore add via serverless if needed later
      const orderPayload = {
        name: orderData.name,
        phone: orderData.phone,
        address: orderData.address,
        quantity: Number(orderData.quantity),
        productId: orderData.productId,
        productName: prod.name || orderData.productName || "—",
        orderDate: orderData.orderDate,
        pickupDate: orderData.pickupDate,
        paymentMethod: orderData.paymentMethod,
        paymentStatus: "pending",
        createdAt: new Date()
      };
      // add to orders collection
      const { addDoc, collection: coll } = await import("firebase/firestore");
      const ordersRef = coll(db, "orders");
      const orderDoc = await addDoc(ordersRef, orderPayload);

      // notify Telegram via serverless endpoint (api/notify) — not blocking user
      try {
        fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: orderDoc.id, order: orderPayload })
        }).catch((e) => console.warn("notify failed", e));
      } catch (e) {
        console.warn("notify catch", e);
      }

      // close modal and inform user
      closeOrder();
      alert("Terima kasih — order berhasil dikirim! (Status: pending)");
    } catch (err) {
      console.error(err);
      alert("Gagal memproses order: " + (err.message || err));
    }
  };

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1 className="brand">La Petite Boulangerie</h1>
          <p className="subtitle">Roti artisan — fresh daily</p>
        </div>
      </header>

      <main>
        {loading ? (
          <div className="center">Memuat produk…</div>
        ) : (
          <section className="grid">
            {products.length === 0 && <div className="center">Belum ada produk.</div>}
            {products.map((p) => (
              <BreadCard key={p.id} product={p} onClick={() => openOrder(p)} />
            ))}
          </section>
        )}
      </main>

      {selected && (
        <OrderModal
          product={selected}
          paymentMethods={paymentMethods}
          onClose={closeOrder}
          onSubmit={handleSubmitOrder}
        />
      )}

      <footer className="footer">© La Petite Boulangerie</footer>
    </div>
  );
}

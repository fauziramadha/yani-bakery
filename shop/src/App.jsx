import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BreadCard from "./components/BreadCard";
import OrderForm from "./components/OrderForm";
import ConfirmationModal from "./components/ConfirmationModal";
import { db } from "./firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import "./styles.css";

const App = () => {
  const [breads, setBreads] = useState([]);
  const [selectedBread, setSelectedBread] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Ambil data roti dari Firestore
  useEffect(() => {
    const fetchBreads = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "breads"));
        const breadList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBreads(breadList);
      } catch (error) {
        console.error("Gagal ambil data roti:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBreads();
  }, []);

  // 🔹 Saat pelanggan submit order form
  const handleOrderSubmit = (formData) => {
    setOrderData(formData);
    setShowConfirm(true);
  };

  // 🔹 Konfirmasi dan simpan order ke Firestore
  const handleConfirmOrder = async () => {
    setShowConfirm(false);

    try {
      const order = {
        ...orderData,
        bread: selectedBread.name,
        breadId: selectedBread.id,
        status: "pending",
        createdAt: new Date(),
      };

      // simpan ke Firestore
      await addDoc(collection(db, "orders"), order);

      // kurangi stok roti
      const newStock = selectedBread.stock - orderData.quantity;
      await updateDoc(doc(db, "breads", selectedBread.id), { stock: newStock });

      // kirim notifikasi Telegram (via backend serverless function)
      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `🍞 Pesanan Baru!\nNama: ${order.name}\nRoti: ${order.bread}\nJumlah: ${order.quantity}\nPembayaran: ${order.paymentMethod}\n📅 Pengambilan: ${order.pickupDate}`,
        }),
      });

      alert("✅ Pesanan berhasil dikirim!");
      setSelectedBread(null);

      // perbarui stok di UI
      setBreads((prev) =>
        prev.map((b) =>
          b.id === selectedBread.id ? { ...b, stock: newStock } : b
        )
      );
    } catch (error) {
      console.error("Gagal kirim pesanan:", error);
      alert("❌ Terjadi kesalahan saat mengirim pesanan.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-rose-50 p-4">
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-[Playfair_Display] text-amber-800 font-semibold">
          🍞 Aurum Bakery
        </h1>
        <p className="text-gray-600 font-light">
          Nikmati roti premium buatan tangan, lembut & elegan ✨
        </p>
      </header>

      {/* Grid daftar roti */}
      {loading ? (
        <p className="text-center text-gray-600">Memuat menu...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {breads.map((bread) => (
            <BreadCard
              key={bread.id}
              bread={bread}
              onSelect={(b) => setSelectedBread(b)}
            />
          ))}
        </div>
      )}

      {/* Popup Order Form */}
      <AnimatePresence>
        {selectedBread && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <OrderForm
                bread={selectedBread}
                onSubmit={handleOrderSubmit}
                onCancel={() => setSelectedBread(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popup Konfirmasi */}
      <ConfirmationModal
        show={showConfirm}
        onConfirm={handleConfirmOrder}
        onCancel={() => setShowConfirm(false)}
      />

      <footer className="text-center mt-12 text-sm text-gray-500">
        © 2025 Aurum Bakery — Crafted with ❤️
      </footer>
    </div>
  );
};

export default App;

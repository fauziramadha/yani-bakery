import React, { useState } from "react";

const OrderForm = ({ bread, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    quantity: 1,
    paymentMethod: "DANA",
    pickupDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-amber-900 font-[Cinzel]">
        Order {bread.name}
      </h2>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nama Lengkap"
          value={form.name}
          onChange={handleChange}
          required
          className="border rounded-lg p-2 focus:ring-2 focus:ring-amber-400"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Nomor HP"
          value={form.phone}
          onChange={handleChange}
          required
          className="border rounded-lg p-2 focus:ring-2 focus:ring-amber-400"
        />
        <textarea
          name="address"
          placeholder="Alamat Pengiriman"
          value={form.address}
          onChange={handleChange}
          required
          className="border rounded-lg p-2 focus:ring-2 focus:ring-amber-400"
        />
        <input
          type="number"
          name="quantity"
          min="1"
          max={bread.stock}
          value={form.quantity}
          onChange={handleChange}
          required
          className="border rounded-lg p-2 focus:ring-2 focus:ring-amber-400"
        />
        <label className="text-sm text-gray-700">Metode Pembayaran:</label>
        <select
          name="paymentMethod"
          value={form.paymentMethod}
          onChange={handleChange}
          className="border rounded-lg p-2"
        >
          <option value="DANA">DANA</option>
          <option value="QRIS">QRIS</option>
        </select>
        <label className="text-sm text-gray-700">Tanggal Pengambilan:</label>
        <input
          type="date"
          name="pickupDate"
          value={form.pickupDate}
          onChange={handleChange}
          required
          className="border rounded-lg p-2 focus:ring-2 focus:ring-amber-400"
        />

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >
            Pesan Sekarang
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;

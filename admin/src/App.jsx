import React, { useEffect, useState } from 'react';
import { auth, db } from './firebaseConfig';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc
} from 'firebase/firestore';

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: 0, image: '', stock: 5 });
  const [orders, setOrders] = useState([]);

  // Auth listener
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, u => setUser(u));
    return () => unsubAuth();
  }, []);

  // Data listener
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), snap => {
      const items = [];
      snap.forEach(d => items.push({ id: d.id, ...d.data() }));
      setProducts(items);
    });
    const unsub2 = onSnapshot(collection(db, 'orders'), snap => {
      const os = [];
      snap.forEach(d => os.push({ id: d.id, ...d.data() }));
      setOrders(os);
    });
    return () => {
      unsub();
      unsub2();
    };
  }, []);

  // Login
  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Logged in');
    } catch (e) {
      alert('Login failed: ' + e.message);
    }
  };

  // Tambah produk
  const addProduct = async () => {
    await addDoc(collection(db, 'products'), { ...newProduct, createdAt: new Date() });
    setNewProduct({ name: '', price: 0, image: '', stock: 5 });
  };

  // Hapus produk
  const removeProduct = async (id) => {
    if (!confirm('Hapus produk?')) return;
    await deleteDoc(doc(db, 'products', id));
  };

  // Edit stok
  const editStock = async (id) => {
    const v = Number(prompt('Masukkan stok baru'));
    if (!isNaN(v)) await updateDoc(doc(db, 'products', id), { stock: v });
  };

  // Toggle pembayaran
  const togglePayment = async (o) => {
    await updateDoc(doc(db, 'orders', o.id), {
      paymentStatus: o.paymentStatus === 'done' ? 'pending' : 'done'
    });
  };

  return (
    <div className='container'>
      <header className='header'>
        <h1>Admin Dashboard</h1>
      </header>

      {/* Login */}
      {!user && (
        <div className='card'>
          <h3>Login</h3>
          <input
            placeholder='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            placeholder='password'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button className='button' onClick={login}>Login</button>
          <p>Gunakan Firebase Console untuk membuat akun admin dengan email & password.</p>
        </div>
      )}

      {/* Panel admin */}
      {user && (
        <div>
          <div className='admin-panel'>
            <h3>Tambah Produk</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
              <input
                placeholder='Nama roti'
                value={newProduct.name}
                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <input
                placeholder='Harga'
                value={newProduct.price}
                onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
              />
              <input
                placeholder='Image URL'
                value={newProduct.image}
                onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
              />
              <input
                placeholder='Stok'
                value={newProduct.stock}
                onChange={e => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
              />
            </div>
            <div style={{ marginTop: 8 }}>
              <button className='button' onClick={addProduct}>Tambah Produk</button>
            </div>

            <h3 style={{ marginTop: 12 }}>Produk Saat Ini</h3>
            <div>
              {products.map(p => (
                <div
                  key={p.id}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 8, borderBottom: '1px solid #eee' }}
                >
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <img src={p.image} style={{ width: 56, height: 56, objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: 12 }}>Rp {p.price}</div>
                      <div style={{ fontSize: 12 }}>Stok: {p.stock}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => removeProduct(p.id)}>Hapus</button>
                    <button onClick={() => editStock(p.id)}>Edit Stok</button>
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{ marginTop: 12 }}>Orders</h3>
            <table className='table'>
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Nama</th>
                  <th>Produk</th>
                  <th>Qty</th>
                  <th>Pickup</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td>{new Date(o.createdAt?.seconds ? o.createdAt.seconds * 1000 : o.createdAt).toLocaleString()}</td>
                    <td>{o.name}<br /><span style={{ fontSize: 12 }}>{o.phone}</span></td>
                    <td>{o.productName}</td>
                    <td>{o.quantity}</td>
                    <td>{o.pickupDate}</td>
                    <td>{o.paymentStatus === 'done' ? '✅ Done' : '❌ Pending'}</td>
                    <td style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => togglePayment(o)}>Toggle Pay</button>
                      <button onClick={async () => {
                        if (!confirm('Hapus order?')) return;
                        await deleteDoc(doc(db, 'orders', o.id));
                      }}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

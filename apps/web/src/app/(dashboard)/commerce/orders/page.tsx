'use client';

import { useState } from 'react';
import { ShoppingCart, MessageSquare, ChevronDown } from 'lucide-react';

type OrderStatus = 'pending' | 'confirmed' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

interface Order {
  id: string;
  waNumber: string;
  itemsCount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  paid: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const MOCK_ORDERS: Order[] = [
  { id: 'ORD-001', waNumber: '+91 98765 43210', itemsCount: 2, total: 5998, status: 'pending', createdAt: '2024-01-15' },
  { id: 'ORD-002', waNumber: '+91 87654 32109', itemsCount: 1, total: 2999, status: 'paid', createdAt: '2024-01-14' },
  { id: 'ORD-003', waNumber: '+91 76543 21098', itemsCount: 3, total: 15997, status: 'delivered', createdAt: '2024-01-13' },
  { id: 'ORD-004', waNumber: '+91 65432 10987', itemsCount: 1, total: 999, status: 'confirmed', createdAt: '2024-01-12' },
  { id: 'ORD-005', waNumber: '+91 54321 09876', itemsCount: 2, total: 9998, status: 'shipped', createdAt: '2024-01-11' },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [sentMsg, setSentMsg] = useState<string | null>(null);

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const sendWhatsApp = (order: Order) => {
    setSentMsg(`Cart for ${order.waNumber} sent via WhatsApp!`);
    setTimeout(() => setSentMsg(null), 3000);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
          <ShoppingCart className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
          <p className="text-slate-500 text-sm">Manage WhatsApp commerce orders</p>
        </div>
      </div>

      {sentMsg && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          ✓ {sentMsg}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Order #', 'Customer (WA)', 'Items', 'Total', 'Status', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-slate-900">{order.id}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{order.waNumber}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{order.itemsCount} item{order.itemsCount !== 1 ? 's' : ''}</td>
                <td className="px-4 py-3 text-sm font-medium text-slate-900">₹{order.total.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="relative inline-block">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                      className={`text-xs font-medium px-2 py-1 rounded-full appearance-none pr-6 cursor-pointer border-0 focus:outline-none ${STATUS_COLORS[order.status]}`}
                    >
                      {(['pending', 'confirmed', 'paid', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((s) => (
                        <option key={s} value={s} className="bg-white text-slate-900">{s}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-1 top-1 w-3 h-3 pointer-events-none" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => sendWhatsApp(order)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    <MessageSquare className="w-3 h-3" /> Send to WA
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

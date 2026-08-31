import React, { useState, useEffect } from "react";
import { MdTableBar, MdCategory } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import Metrics from "../components/dashboard/Metrics";
import RecentOrders from "../components/dashboard/RecentOrders";
import Modal from "../components/dashboard/Modal";
import { getPayments } from "../https";

const buttons = [
  { label: "Add Table", icon: <MdTableBar />, action: "table" },
  { label: "Add Category", icon: <MdCategory />, action: "category" },
  { label: "Add Dishes", icon: <BiSolidDish />, action: "dishes" },
];

const tabs = ["Metrics", "Orders", "Payments"];

const Dashboard = () => {

  useEffect(() => {
    document.title = "POS | Admin Dashboard"
  }, [])

 

  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Metrics");
  const [payments, setPayments] = useState([]);

   useEffect(() => {
  if (activeTab === "Payments") {
    getPayments()
      .then((res) => {
        setPayments(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}, [activeTab]);

  const handleOpenModal = (action) => {
    if (action === "table") setIsTableModalOpen(true);
  };

  return (
    <div className="bg-[#1f1f1f] h-[calc(100vh-5rem)]">
      <div className="container mx-auto flex items-center justify-between py-14 px-6 md:px-4">
        <div className="flex items-center gap-3">
          {buttons.map(({ label, icon, action }) => {
            return (
              <button
                onClick={() => handleOpenModal(action)}
                className="bg-[#1a1a1a] hover:bg-[#262626] px-8 py-3 rounded-lg text-[#f5f5f5] font-semibold text-md flex items-center gap-2"
              >
                {label} {icon}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {tabs.map((tab) => {
            return (
              <button
                className={`
                px-8 py-3 rounded-lg text-[#f5f5f5] font-semibold text-md flex items-center gap-2 ${
                  activeTab === tab
                    ? "bg-[#262626]"
                    : "bg-[#1a1a1a] hover:bg-[#262626]"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === "Metrics" && <Metrics />}
      {activeTab === "Orders" && <RecentOrders />}
     {activeTab === "Payments" && (
  <div className="container mx-auto px-6 text-white">
    <div className="bg-[#262626] rounded-lg overflow-hidden">
      <div className="p-4 border-b border-[#3a3a3a]">
        <h2 className="text-lg font-semibold">Payment History</h2>
      </div>

      {payments.length === 0 ? (
        <div className="p-6 text-[#ababab] text-center">
          No payments found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#1f1f1f]">
              <tr>
                <th className="text-left p-4">Payment ID</th>
                <th className="text-left p-4">Order ID</th>
                <th className="text-left p-4">Amount</th>
                <th className="text-left p-4">Method</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Date</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment._id}
                  className="border-t border-[#3a3a3a]"
                >
                  <td className="p-4">{payment.paymentId}</td>
                  <td className="p-4">{payment.orderId}</td>
                  <td className="p-4">
                    ₹{payment.amount?.toFixed(2)}
                  </td>
                  <td className="p-4 capitalize">{payment.method}</td>
                  <td className="p-4">{payment.status}</td>
                  <td className="p-4">
                    {payment.createdAt
                      ? new Date(payment.createdAt).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
)}

      {isTableModalOpen && <Modal setIsTableModalOpen={setIsTableModalOpen} />}
    </div>
  );
};

export default Dashboard;

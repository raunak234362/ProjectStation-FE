/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from 'react';

const EditLineItemModal = ({ item, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    scopeOfWork: item?.scopeOfWork || '',
    quantity: item?.quantity || '',
    hoursPerQty: item?.hoursPerQty || '',
    totalHours: item?.totalHours || '',
    remarks: item?.remarks || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(item.id, formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-teal-700 mb-4">Edit Line Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Scope of Work</label>
            <input
              type="text"
              name="scopeOfWork"
              value={formData.scopeOfWork}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Hours/Qty</label>
            <input
              type="number"
              name="hoursPerQty"
              value={formData.hoursPerQty}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Total Hours</label>
            <input
              type="number"
              name="totalHours"
              value={formData.totalHours}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LineItemTable = ({ items, onEdit }) => {
  const [editItem, setEditItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!items || items.length === 0) {
    return <div className="text-gray-600">No Line Items Available</div>;
  }

  const handleEditable = () => {
    const response = sessionStorage.getItem("userType");
    return response === "admin"; // Example: Only admins can edit
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setIsModalOpen(true);
  };

  const handleSave = (id, updatedData) => {
    onEdit(id, updatedData);
  };

  return (
    <div className="mt-6 h-[50vh] overflow-y-auto">
      <h2 className="text-xl font-bold text-teal-700 mb-3">Line Items</h2>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-800">
            <tr>
              <th className="border px-3 py-2">#</th>
              <th className="border px-3 py-2">Scope of Work</th>
              <th className="border px-3 py-2">Quantity</th>
              <th className="border px-3 py-2">Hours/Qty</th>
              <th className="border px-3 py-2">Total Hours</th>
              <th className="border px-3 py-2">Remarks</th>
              {handleEditable() && <th className="border px-3 py-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id} className="even:bg-gray-50">
                <td className="border px-3 py-2">{idx + 1}</td>
                <td className="border px-3 py-2">{item.scopeOfWork}</td>
                <td className="border px-3 py-2">{item.quantity ?? "N/A"}</td>
                <td className="border px-3 py-2">{item.hoursPerQty ?? "N/A"}</td>
                <td className="border px-3 py-2">{item.totalHours ?? "N/A"}</td>
                <td className="border px-3 py-2">{item.remarks || "-"}</td>
                {handleEditable() && (
                  <td className="border px-3 py-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="text-teal-700 hover:text-teal-900"
                    >
                      Edit
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <EditLineItemModal
        item={editItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default LineItemTable;
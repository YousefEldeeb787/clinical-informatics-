import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isReceptionist } from "../../utils/auth";
import { PERMISSIONS } from "../../utils/permissions";
import RoleRestricted from "../common/RoleRestricted";
import "./BillingList.css";

export default function BillingList() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const receptionist = isReceptionist();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      const mockData = [
        {
          id: 1,
          invoiceNumber: "INV-20241228-1001",
          patientName: "John Doe",
          patientId: "P001",
          invoiceDate: "2024-12-28",
          dueDate: "2025-01-12",
          totalAmount: 450.00,
          amountPaid: 450.00,
          amountDue: 0,
          status: "Paid",
        },
        {
          id: 2,
          invoiceNumber: "INV-20241227-1002",
          patientName: "Jane Smith",
          patientId: "P002",
          invoiceDate: "2024-12-27",
          dueDate: "2025-01-11",
          totalAmount: 1250.00,
          amountPaid: 500.00,
          amountDue: 750.00,
          status: "PartiallyPaid",
        },
        {
          id: 3,
          invoiceNumber: "INV-20241226-1003",
          patientName: "Bob Johnson",
          patientId: "P003",
          invoiceDate: "2024-12-26",
          dueDate: "2025-01-10",
          totalAmount: 890.00,
          amountPaid: 0,
          amountDue: 890.00,
          status: "Pending",
        },
      ];
      setInvoices(mockData);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      Paid: "status-success",
      PartiallyPaid: "status-warning",
      Pending: "status-info",
      Overdue: "status-danger",
      Cancelled: "status-default",
    };
    return colors[status] || "status-default";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const filtered = invoices.filter((invoice) =>
    (invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === "" || invoice.status === statusFilter)
  );

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.amountDue, 0);

  return (
    <div className="billing-container">
      <div className="billing-header">
        <div>
          <h1>💰 Billing & Invoices</h1>
          <p>{receptionist ? "Manage patient billing and payments" : "View your bills and payment history"}</p>
        </div>
        <RoleRestricted permission={PERMISSIONS.CREATE_INVOICE}>
          <button className="btn-primary" onClick={() => navigate("/billing/new")}>
            + Create Invoice
          </button>
        </RoleRestricted>
      </div>

      <div className="filters-section">
        <input
          type="text"
          placeholder="🔍 Search patient name, ID, or invoice number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="PartiallyPaid">Partially Paid</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      <div className="stats-grid">
        <div className="stat-card revenue">
          <div className="stat-value">{formatCurrency(totalRevenue)}</div>
          <div className="stat-label">Total Revenue</div>
        </div>
        <div className="stat-card outstanding">
          <div className="stat-value">{formatCurrency(totalOutstanding)}</div>
          <div className="stat-label">Outstanding</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{invoices.filter(i => i.status === "Paid").length}</div>
          <div className="stat-label">Paid Invoices</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{invoices.filter(i => i.status === "Pending" || i.status === "PartiallyPaid").length}</div>
          <div className="stat-label">Unpaid</div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading invoices...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💰</div>
          <h3>No invoices found</h3>
          <p>No billing records match your search criteria.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="billing-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                {receptionist && <th>Patient</th>}
                <th>Invoice Date</th>
                <th>Due Date</th>
                <th>Total Amount</th>
                <th>Amount Paid</th>
                <th>Amount Due</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((invoice) => (
                <tr key={invoice.id}>
                  <td><strong>{invoice.invoiceNumber}</strong></td>
                  {receptionist && (
                    <td>
                      <div className="patient-info">
                        <strong>{invoice.patientName}</strong>
                        <span className="patient-id">{invoice.patientId}</span>
                      </div>
                    </td>
                  )}
                  <td>{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                  <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                  <td><strong>{formatCurrency(invoice.totalAmount)}</strong></td>
                  <td className="amount-paid">{formatCurrency(invoice.amountPaid)}</td>
                  <td className="amount-due">{formatCurrency(invoice.amountDue)}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadge(invoice.status)}`}>
                      {invoice.status.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon"
                        onClick={() => navigate(`/billing/${invoice.id}`)}
                        title="View Invoice"
                      >
                        👁️
                      </button>
                      {invoice.amountDue > 0 && (
                        <RoleRestricted permission={PERMISSIONS.RECORD_PAYMENT}>
                          <button
                            className="btn-icon btn-pay"
                            onClick={() => navigate(`/billing/${invoice.id}/payment`)}
                            title="Record Payment"
                          >
                            💳
                          </button>
                        </RoleRestricted>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

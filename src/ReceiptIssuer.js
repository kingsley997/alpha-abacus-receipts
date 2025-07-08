import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';
import './ReceiptIssuer.css';

function ReceiptIssuer() {
    const [schoolName, setSchoolName] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [description, setDescription] = useState('');
    const [receiptDetails, setReceiptDetails] = useState(null);

    const companyName = "Alpha Abacus";
    const companyAddress = "Juba River Main Street, Accra, Ghana";
    const companyContact = "+233 54 598 3544";

    const getCurrentDateTime = () => {
        const now = new Date();
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Africa/Accra'
        };
        return now.toLocaleString('en-GH', options);
    };

    const generateReceiptNumber = () => {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `AA-${timestamp}-${random}`;
    };

    const handleIssueReceipt = (e) => {
        e.preventDefault();
        if (!schoolName || !amount) {
            alert('Please enter School Name and Amount Received.');
            return;
        }

        const newReceipt = {
            receiptNumber: generateReceiptNumber(),
            date: getCurrentDateTime(),
            schoolName: schoolName,
            amount: parseFloat(amount).toFixed(2),
            paymentMethod: paymentMethod,
            description: description,
            issuedBy: companyName,
        };

        setReceiptDetails(newReceipt);
        setSchoolName('');
        setAmount('');
        setPaymentMethod('Cash');
        setDescription('');
        console.log('Receipt Issued:', newReceipt);
    };

    const handlePrint = () => {
        const printContent = document.getElementById('receipt-print-area').innerHTML;
        const originalContent = document.body.innerHTML;
        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload();
    };

    const handleDownloadPDF = () => {
        const element = document.getElementById('receipt-print-area');
        const opt = {
            margin:       0.5,
            filename:     `${receiptDetails.receiptNumber}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

    return (
        <div className="receipt-container">
            <header className="receipt-header">
                <img src="/alpha_abacus_logo.jpeg" alt="Alpha Abacus Logo" className="company-logo" />
                <h1>Receipt Issuer</h1>
            </header>

            <div className="form-section">
                <h2>Issue New Receipt</h2>
                <form onSubmit={handleIssueReceipt}>
                    <div className="form-group">
                        <label htmlFor="schoolName">School Name:</label>
                        <input
                            type="text"
                            id="schoolName"
                            value={schoolName}
                            onChange={(e) => setSchoolName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="amount">Amount Received (GHS):</label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min="0.01"
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="paymentMethod">Payment Method:</label>
                        <select
                            id="paymentMethod"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option value="Cash">Cash</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Cheque">Cheque</option>
                            <option value="Mobile Money">Mobile Money</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">For (Description):</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                            placeholder="e.g., Tuition Fee, Books, Termly Fees"
                        ></textarea>
                    </div>

                    <p className="date-display">
                        **Date of Issue:** {getCurrentDateTime()}
                    </p>
                    <p className="issued-by">**Issued by:** {companyName}</p>

                    <button type="submit" className="submit-button">Issue Receipt</button>
                </form>
            </div>

            {receiptDetails && (
                <div className="receipt-display-section">
                    <h2>Generated Receipt</h2>
                    <div id="receipt-print-area" className="receipt-preview">
                        <div className="receipt-header-print">
                            <img src="/alpha_abacus_logo.jpeg" alt="Alpha Abacus Logo" className="company-logo-print" />
                            <div>
                                <h3>{companyName}</h3>
                                <p>{companyAddress}</p>
                                <p>{companyContact}</p>
                            </div>
                        </div>
                        <hr />
                        <div className="receipt-info">
                            <p><strong>Receipt No:</strong> {receiptDetails.receiptNumber}</p>
                            <p><strong>Date:</strong> {receiptDetails.date}</p>
                            <p><strong>Received From:</strong> {receiptDetails.schoolName}</p>
                            <p><strong>Amount:</strong> GHS {receiptDetails.amount}</p>
                            <p><strong>Payment Method:</strong> {receiptDetails.paymentMethod}</p>
                            <p><strong>For:</strong> {receiptDetails.description || 'N/A'}</p>
                        </div>
                        <hr />
                        <div className="receipt-footer-print">
                            <p>Thank you for your business!</p>
                            <p>_________________________</p>
                            <p>Authorized Signature</p>
                        </div>
                    </div>
                    <button onClick={handlePrint} className="print-button">Print Receipt</button>
                    <button onClick={handleDownloadPDF} className="print-button">Download PDF</button>
                </div>
            )}
        </div>
    );
}

export default ReceiptIssuer;

document.addEventListener("DOMContentLoaded", function () {
    // Set the current date
    const dateElement = document.getElementById("date");
    const currentDate = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = "Date: " + currentDate.toLocaleDateString(undefined, options);

    // PDF generation
    document.getElementById("downloadPdf").addEventListener("click", function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(18);
        doc.text("Monthly Contribution", 20, 20);

        // Add table
        const table = document.getElementById("contributionTable");
        doc.autoTable({ html: table, startY: 30 });

        // Calculate position for additional information
        const tableHeight = doc.autoTable.previous.finalY;
        const yOffset = tableHeight + 10;

        // Add balance carried forward and total money in account
        const balanceCarriedForward = document.querySelector('.right-info').textContent;
        doc.setFontSize(10);
        doc.setFont("courier");

        // Add payment information
        const paymentInfo = document.querySelector('.payment-info').textContent;
        const paymentInfoLines = paymentInfo.split('\n');
        const paymentInfoHeight = paymentInfoLines.length * 4;
        doc.text("Payment Information:", 20, yOffset + 15 + paymentInfoHeight);
        doc.text(paymentInfo, 20, yOffset + 12 + paymentInfoHeight);

        // Save the PDF
        doc.save("Monthly_Contribution.pdf");
    });
});

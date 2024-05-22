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
        doc.autoTable({
            html: '#contributionTable',
            startY: 30
        });

        // Calculate position for additional information
        const tableHeight = doc.autoTable.previous.finalY;
        const yOffset = tableHeight + 10;

        // Add balance carried forward and total money in account
        const balanceInfo = document.querySelector('.right-info').textContent;
        doc.setFont("courier");
        doc.setFontSize(10);
        doc.text(balanceInfo, 20, yOffset);

        // Add payment information
        const paymentInfo = document.querySelector('.left-info').textContent;
        doc.setFont("courier");
        doc.text(paymentInfo, 20, yOffset + 20);

        // Save the PDF
        doc.save("Monthly_Contribution.pdf");
    });
});

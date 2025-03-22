// popup.js
document.addEventListener('DOMContentLoaded', function() {
    // Get current tab URL to use as default QR code content
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const currentUrl = tabs[0].url;
      initializeApp(currentUrl);
    });
    
    function initializeApp(url) {
      // Set up default values
      const vehicleTitle = document.getElementById('title');
      const stockNum = document.getElementById('stock');
      const miles = document.getElementById('miles');
      const dealer = document.getElementById('dealer');
      const scanText = document.getElementById('scanText');
      const subText = document.getElementById('subText');
      
      // Initialize preview
      updatePreview();
      
      // Create QR code initially with current URL
      generateQRCode(url);
      
      // Add event listeners
      document.getElementById('generate').addEventListener('click', function() {
        updatePreview();
        generateQRCode(url);
      });
      
      document.getElementById('download').addEventListener('click', function() {
        downloadPDF();
      });
      
      // Update preview when input changes
      vehicleTitle.addEventListener('input', updatePreview);
      stockNum.addEventListener('input', updatePreview);
      miles.addEventListener('input', updatePreview);
      dealer.addEventListener('input', updatePreview);
      scanText.addEventListener('input', updatePreview);
      subText.addEventListener('input', updatePreview);
    }
    
    function updatePreview() {
      document.getElementById('preview-title').textContent = document.getElementById('title').value || '2020 PORSCHE CAYENNE AWD';
      document.getElementById('preview-stock').textContent = document.getElementById('stock').value || 'A00570';
      document.getElementById('preview-miles').textContent = document.getElementById('miles').value || '40,277';
      document.getElementById('preview-dealer').textContent = document.getElementById('dealer').value || 'ANDERSON MOTOR';
      document.getElementById('preview-scan-text').textContent = document.getElementById('scanText').value || 'SCAN ME';
      document.getElementById('preview-sub-text').textContent = document.getElementById('subText').value || 'FOR INFO + PRICE';
    }
    
    function generateQRCode(url) {
      // Clear previous QR code
      document.getElementById('qrcode').innerHTML = '';
      
      // Generate new QR code
      new QRCode(document.getElementById('qrcode'), {
        text: url,
        width: 220,
        height: 220,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      });
    }
    
    function downloadPDF() {
        // Use html2canvas to capture the exact preview as an image
        html2canvas(document.getElementById('preview'), {
            scale: 4, // Higher scale for better quality
            useCORS: true,
            logging: false,
            backgroundColor: "white"
        }).then(canvas => {
            if (typeof window.jspdf === 'undefined') {
                console.error('jsPDF library not found');
                alert('PDF generation failed: Library not loaded');
                return;
            }
    
            const { jsPDF } = window.jspdf;
            
            // Get the canvas dimensions
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            
            // Create PDF with exact dimensions (3 x 5 inches)
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'in',
                format: [3.0, 5.0]
            });
            

            const pdfWidth = 3.0;
            const pdfHeight = 5.0
            
            // Add the image to the PDF (centered if needed)
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            
            // Save the PDF
            pdf.save('vehicle-qr-code.pdf');
        }).catch(error => {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        });
    }
  });
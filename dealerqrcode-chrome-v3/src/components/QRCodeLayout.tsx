import React, { useRef } from 'react';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";

interface QRCodeData {
  id: number;
  title: string;
  stock: string;
  miles: string;
  dealer: string;
  qrCodeSrc: string;
  scanText: string;
  subText: string;
}

interface QRCodeLayoutProps {
  codes: QRCodeData[];
  onBack: () => void;
}

const QRCodeLayout: React.FC<QRCodeLayoutProps> = ({ codes, onBack }) => {
  const layoutRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!layoutRef.current) {
      console.error("❌ Error: layoutRef is null");
      alert("Error: Could not capture layout.");
      return;
    }

    console.log("📸 Capturing layout as image...");

    try {
      const canvas = await html2canvas(layoutRef.current, {
        scale: 4,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      console.log("✅ Image captured, converting to PDF...");
      const imgData = canvas.toDataURL("image/png", 1.0);

      // Use letter size for the PDF (8.5 x 11 inches)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "letter"
      });

      // Calculate dimensions to fit the layout on the page
      const pageWidth = 8.5;
      const pageHeight = 11;
      const margin = 0.5;
      const availableWidth = pageWidth - (2 * margin);
      const aspectRatio = canvas.height / canvas.width;
      const imgWidth = availableWidth;
      const imgHeight = imgWidth * aspectRatio;

      // Center the image on the page
      const xOffset = margin;
      const yOffset = (pageHeight - imgHeight) / 2;

      pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight, undefined, "FAST");

      const filename = "qr_codes_layout.pdf";
      pdf.save(filename);
      console.log("✅ PDF saved successfully!");
    } catch (error) {
      console.error("❌ Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  // Determine which grid positions to show based on number of codes
  const getGridPositions = () => {
    const positions = [];
    for (let i = 0; i < Math.min(codes.length, 4); i++) {
      positions.push(i);
    }
    return positions;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-neutral-50 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="px-4 py-2 text-black hover:bg-neutral-200 rounded-lg transition duration-200"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-center">QR Code Layout</h1>
        <button
          onClick={downloadPDF}
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-neutral-700 transition duration-200"
        >
          Download PDF
        </button>
      </div>

      <div 
        ref={layoutRef}
        className="grid grid-cols-2 gap-8 bg-white p-8 rounded-lg"
        style={{ minHeight: '800px' }}
      >
        {getGridPositions().map((index) => (
          <div
            key={codes[index].id}
            className="bg-white text-black rounded-lg p-6 shadow-md border border-gray-200"
          >
            {/* Vehicle Title */}
            <h2 className="text-xl font-black text-center mb-2 mt-1">
              {codes[index].title}
            </h2>

            {/* Stock & Miles */}
            <div className="mb-6 text-center">
              <span className="font-black text-[14px]">STOCK #:</span>{" "}
              <span className="text-[14px]">{codes[index].stock}</span>
              <span className="mx-2"></span>
              <span className="font-black text-[14px]">MILES:</span>{" "}
              <span className="text-[14px]">{codes[index].miles}</span>
            </div>

            {/* QR Code */}
            <div className="mb-4 relative">
              <div className="relative">
                {/* Scan Button */}
                <div className="bg-black text-white py-2 px-6 rounded-xl text-center mx-auto w-[180px] z-10 relative">
                  <div className="text-xl font-bold">{codes[index].scanText}</div>
                  <div className="text-base">{codes[index].subText}</div>
                </div>
                
                {/* QR Code Container */}
                <div className="border-4 border-black rounded-3xl p-0 pt-4 flex justify-center items-center mt-[-22px] mx-auto">
                  <div className="flex justify-center items-center w-full h-full">
                    <img 
                      src={codes[index].qrCodeSrc}
                      alt="QR Code"
                      width="180"
                      height="180"
                      className="max-w-full max-h-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Dealer Name */}
            <div className="justify-center border-2 border-black rounded-lg px-3 py-1 text-center mx-auto w-fit">
              <span className="font-black text-base">{codes[index].dealer}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QRCodeLayout; 
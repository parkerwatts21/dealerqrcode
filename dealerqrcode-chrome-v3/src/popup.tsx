import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import QRCodeLayout from "./components/QRCodeLayout";

// Define types for our form data
type FormField = "title" | "stock" | "miles" | "dealer";

interface FormDataType {
  title: string;
  stock: string;
  miles: string;
  dealer: string;
  scanText: string;
  subText: string;
}

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

interface ScrapedData {
  title?: string;
  stock?: string;
  miles?: string;
  dealer?: string;
}

const Popup: React.FC = () => {
  // State management for form inputs and QR codes
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    stock: "",
    miles: "",
    dealer: "",
    scanText: "SCAN ME",
    subText: "FOR INFO + PRICE"
  });
  
  const [url, setUrl] = useState<string>("");
  const [qrCodeSrc, setQrCodeSrc] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showLayout, setShowLayout] = useState<boolean>(false);
  const [savedCodes, setSavedCodes] = useState<QRCodeData[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  
  const previewRef = useRef<HTMLDivElement>(null);
  const initialized = useRef<boolean>(false);

  // Initialize the app with the current tab URL
  const initializeApp = (currentUrl: string | null) => {
    console.log("Initializing app with URL:", currentUrl);
    
    if (!currentUrl) {
      setErrorMessage("Error: Unable to fetch current page URL");
      return;
    }
    
    setUrl(currentUrl);
    generateQRCodeFromUrl(currentUrl);
    
    // Wait a bit to make sure the page is fully loaded before scraping
    console.log("Scheduling web scraping...");
    setTimeout(() => {
      console.log("Executing delayed web scraping");
      scrapeVehicleData();
    }, 500);
  };
  
  // Generate QR code from the provided URL
  const generateQRCodeFromUrl = (qrUrl: string) => {
    if (!qrUrl) {
      setErrorMessage("Error: No valid URL provided");
      return;
    }
    
    setIsGenerating(true);
    setErrorMessage("");
    
    try {
      QRCode.toDataURL(
        qrUrl, 
        {
          width: 210,
          margin: 0,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'H'
        }, 
        (error, dataUrl) => {
          setIsGenerating(false);
          
          if (error) {
            console.error('Error generating QR code:', error);
            setErrorMessage("Error Generating QR code");
            return;
          }
          
          if (dataUrl) {
            console.log("QR code generated successfully");
            setQrCodeSrc(dataUrl);
          }
        }
      );
    } catch (err) {
      console.error('Error in QR code generation process:', err);
      setErrorMessage("Error Generating QR code");
      setIsGenerating(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as FormField]: value
    });
  };

  // Generate QR code on button click
  const generateQRCode = () => {
    if (!url) {
      setErrorMessage("Error: No URL available");
      return;
    }
    generateQRCodeFromUrl(url);
  };

  // Save current QR code to a position
  const saveToPosition = (position: number) => {
    if (!qrCodeSrc) {
      alert("Please generate a QR code first");
      return;
    }

    const newCode: QRCodeData = {
      id: Date.now(),
      title: formData.title,
      stock: formData.stock,
      miles: formData.miles,
      dealer: formData.dealer,
      qrCodeSrc: qrCodeSrc,
      scanText: formData.scanText,
      subText: formData.subText
    };

    // Update saved codes
    const updatedCodes = [...savedCodes];
    updatedCodes[position - 1] = newCode;
    setSavedCodes(updatedCodes);
    setSelectedPosition(position);
  };

  // Web scraping function to extract vehicle data from the current page
  const scrapeVehicleData = () => {
    console.log("Starting vehicle data scraping process...");
    
    // Using chrome.scripting.executeScript for Manifest V3
    if (typeof chrome !== "undefined" && chrome?.scripting && chrome.scripting.executeScript) {
      try {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          console.log("Found active tabs:", tabs?.length);
          
          if (tabs && tabs.length > 0 && tabs[0]?.id) {
            console.log("Attempting to execute content script on tab:", tabs[0].id);
            
            // Execute content script in the active tab using the newer API
            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              func: contentScriptFunction
            }).then(injectionResults => {
              console.log("Content script execution completed, results:", injectionResults);
              
              if (injectionResults && injectionResults[0] && injectionResults[0].result) {
                const scrapedData = injectionResults[0].result as ScrapedData;
                console.log("Successfully received scraped data:", scrapedData);
                
                // Update form with scraped data
                setFormData(prevData => ({
                  ...prevData,
                  ...(scrapedData.title && { title: scrapedData.title }),
                  ...(scrapedData.stock && { stock: scrapedData.stock }),
                  ...(scrapedData.miles && { miles: scrapedData.miles }),
                  ...(scrapedData.dealer && { dealer: scrapedData.dealer })
                }));
              } else {
                console.log("No data returned from content script");
              }
            }).catch(err => {
              console.error("Error during script execution:", err);
            });
          } else {
            console.error("No valid tab found for scraping");
          }
        });
      } catch (err) {
        console.error("Error executing content script:", err);
      }
    } else {
      console.error("Chrome scripting API not available");
    }
  };
  
  // Content script function to be executed in the context of the web page
  function contentScriptFunction() {
    const scrapedData: ScrapedData = {};

    try {
        console.log("🚗 Running scraping script...");

        /** ========================
         * VEHICLE TITLE EXTRACTION
         ========================= */
        const titleSelectors = [
            'h1.vehicle-title', '.vehicle-title', '.vehicle-name', 
            '[data-testid="vehicleTitle"]', '.listing-title',
            '.vdp-vehicle-title', '.inventory-title', 'h1', '.vehicle-header h1',
            '.inventory-title h1', '.vdp-title', '.detail-title', '.listing-title h1',
            '.vehicle-details h1', '.title h1'
        ];

        for (const selector of titleSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent) {
                const text = element.textContent.trim();
                if (text.length > 3) { 
                    scrapedData.title = text.toUpperCase();
                    console.log("✅ Found Title:", scrapedData.title);
                    break;
                }
            }
        }

        // Fallback: Search page for a year + make pattern
        if (!scrapedData.title) {
            const titlePattern = /\b(20\d{2}|19\d{2})\s+(FORD|CHEVROLET|HONDA|TOYOTA|BMW|AUDI|JEEP|RAM|DODGE|CADILLAC|KIA|HYUNDAI|SUBARU|VOLKSWAGEN|MAZDA|VOLVO|BUICK|GMC|LINCOLN|NISSAN|MITSUBISHI|FIAT|JAGUAR|LAND ROVER)\b/i;
            const allElements = document.querySelectorAll('h1, h2, h3, div, p, span');
            for (const el of allElements) {
                if (el.textContent && titlePattern.test(el.textContent)) {
                    scrapedData.title = el.textContent.trim().toUpperCase();
                    console.log("✅ Found Title via Pattern:", scrapedData.title);
                    break;
                }
            }
        }

        /** ========================
         * DEALERSHIP NAME EXTRACTION
         ========================= */
        const dealerSelectors = [
            '.dealer-name', '.dealership', '[data-testid="dealerName"]',
            'meta[property="og:site_name"]', '.vdp-dealer-name',
            '.dealer-info h2', '.dealer-info h1', '.header-dealer-name',
            '.site-header .logo', '.dealership-name'
        ];

        for (const selector of dealerSelectors) {
            const element = selector.startsWith('meta') 
                ? document.querySelector(selector) as HTMLMetaElement
                : document.querySelector(selector);

            if (element) {
                const content = selector.startsWith('meta')
                    ? (element as HTMLMetaElement).content
                    : element.textContent;
                if (content) {
                    scrapedData.dealer = content.trim().toUpperCase();
                    console.log("✅ Found Dealer:", scrapedData.dealer);
                    break;
                }
            }
        }

        // Fallback: Extract from the website's title
        if (!scrapedData.dealer) {
            const pageTitle = document.title;
            if (pageTitle && pageTitle.includes(' | ')) {
                const parts = pageTitle.split(' | ');
                if (parts.length > 1) {
                    scrapedData.dealer = parts[parts.length - 1].trim().toUpperCase();
                    console.log("✅ Found Dealer from Title:", scrapedData.dealer);
                }
            }
        }

        // Last Fallback: Extract from domain
        if (!scrapedData.dealer) {
            try {
                const domain = window.location.hostname
                    .replace('www.', '')
                    .replace('.com', '')
                    .replace(/\./g, ' ')
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                if (domain) {
                    scrapedData.dealer = domain.toUpperCase();
                    console.log("✅ Using Domain as Dealer:", scrapedData.dealer);
                }
            } catch (e) {
                console.error("⚠️ Error extracting dealer from domain:", e);
            }
        }

        /** ========================
         * STOCK NUMBER EXTRACTION
         ========================= */
        const stockSelectors = [
            '.vdp-info-block__info-item-description', '.optStock', '.dws-vehicle-fields-label', '.stock-number', '.stockNumber', '.stock', '.vin-stock',
            '.stockNum', '.stock-num', '.vehicle-stock'
        ];

        
        let stockNumbers: string[] = [];

        for (const selector of stockSelectors) {
          let elements = document.querySelectorAll(selector);
          console.log(`Checking selector: ${selector}`);
      
          elements.forEach(element => {
              if (element.textContent) {
                  let stockText = element.textContent.trim();
      
                  // Special handling for .optStock
                  if (selector === '.optStock') {
                      stockText = stockText.replace(/[^0-9]/g, ''); // Extract only numbers
                      if (stockText.length >= 5 && stockText.length <= 8) { 
                          if (!stockNumbers.includes(stockText)) {
                              scrapedData.stock = stockText;
                              console.log("✅ Found Stock:", stockText);
                          }
                      }
                  }
                  // Special handling for `.dws-vehicle-fields-label`
                  else if (selector === '.dws-vehicle-fields-label' && stockText.includes('Stock No.')) {
                      const stockValueElement = element.parentElement?.querySelector('.dws-vehicle-fields-value');
                      if (stockValueElement && stockValueElement.textContent) {
                          stockText = stockValueElement.textContent.trim().replace(/[^0-9A-Z]/g, ''); // Extract only valid characters
                          if (stockText.length >= 5 && stockText.length <= 8) { 
                              if (!stockNumbers.includes(stockText)) {
                                  scrapedData.stock = stockText;
                                  console.log("✅ Found Stock:", stockText);
                              }
                          }
                      } else {
                          console.log("❌ Stock Number element not found for `.dws-vehicle-fields-label`.");
                      }
                  }
                  // Default stock number extraction logic for other selectors
                  else {
                      const matches = stockText.match(/[A-Z0-9]+/g); // Match alphanumeric values
                      if (matches) {
                          matches.forEach(match => {
                              if (match.length >= 5 && match.length <= 8 && !match.includes(' ')) { 
                                  if (!stockNumbers.includes(match)) {
                                      scrapedData.stock = match;
                                      console.log("✅ Found Stock:", match);
                                  }
                              }
                          });
                      }
                  }
              }
          });
      }      

        /** ========================
         * MILEAGE EXTRACTION
         ========================= */
      const milesSelectors = [
          '.vdp-header-bar__mileage.font-primary', 'vdp-header-bar__mileage', '.optMileage', '.mileage', '.odometer', '.dws-vehicle-fields-label',
          '.basic-info-item__value', '.vdp-header-bar__mileage.font-primary', '.vehicle-miles',
          '.miles', '.odometer-reading', '.mileage-display', '.t-value'
      ];
      
      for (const selector of milesSelectors) {
        let elements = document.querySelectorAll(selector);
    
        elements.forEach(element => {
            if (element.textContent) {
                let mileageText = element.textContent.trim();
    
                // Special handling for `.optMileage`
                if (selector === '.optMileage') {
                    mileageText = mileageText.replace(/[^0-9]/g, ''); // Extract only numbers
                }
                // Special handling for `.dws-vehicle-fields-label`
                else if (selector === '.dws-vehicle-fields-label' && mileageText.includes('Mileage')) {
                    const mileageValueElement = element.parentElement?.querySelector('.dws-vehicle-fields-value');
                    if (mileageValueElement && mileageValueElement.textContent) {
                        mileageText = mileageValueElement.textContent.trim().replace(/,/g, ''); // Remove commas
                    } else {
                        console.log("❌ Mileage element not found for `.dws-vehicle-fields-label`.");
                        return;
                    }
                }
                // Default mileage extraction logic for other selectors
                else {
                    const match = mileageText.match(/([\d,]+)\s*(?:mi|miles|odometer|mileage)?/i);
                    if (match && match[1]) {
                        mileageText = match[1].replace(/,/g, '').trim();
                    } else {
                        return; // Skip to the next selector if no match is found
                    }
                }
    
                scrapedData.miles = mileageText;
                console.log("✅ Found Mileage:", scrapedData.miles);
            }
        });
      }

        console.log("🚗 Final scraped data:", scrapedData);
    } catch (error) {
        console.error('❌ Error during web scraping:', error);
    }

    return scrapedData;
  }

  // Setup the Chrome extension integration
  useEffect(() => {
    // Only run this once
    if (!initialized.current) {
      initialized.current = true;
      
      // Similar to DOMContentLoaded, run this once the component is mounted
      console.log("Component mounted, querying for tab URL");
      
      if (typeof chrome !== "undefined" && chrome?.tabs) {
        try {
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs && tabs.length > 0 && tabs[0]?.url) {
              const currentUrl = tabs[0].url;
              console.log("Found tab URL:", currentUrl);
              initializeApp(currentUrl);
            } else {
              console.log("No valid URL found in tabs");
              setErrorMessage("Error: Unable to get current page URL");
            }
          });
        } catch (chromeError) {
          console.error("Chrome API error:", chromeError);
          setErrorMessage("Error: Problem accessing browser tabs");
        }
      } else {
        console.log("Not in Chrome extension context or Chrome API not available");
        setErrorMessage("Error: This extension requires Chrome browser context");
      }
    }
  }, []);

  // Preview values 
  const preview = {
    title: formData.title || "Vehicle Title",
    stock: formData.stock || "",
    miles: formData.miles || "0",
    dealer: formData.dealer || "Company Name",
    scanText: formData.scanText,
    subText: formData.subText
  };

  // Form field configuration for cleaner rendering
  const formFields: Array<{name: FormField; label: string; placeholder: string}> = [
    { name: "title", label: "Vehicle Title", placeholder: "Enter vehicle make, model, year" },
    { name: "stock", label: "Stock Number", placeholder: "Enter stock number" },
    { name: "miles", label: "Miles", placeholder: "Enter vehicle mileage" },
    { name: "dealer", label: "Dealership Name", placeholder: "Enter dealership name" }
  ];

  if (showLayout) {
    return <QRCodeLayout codes={savedCodes} onBack={() => setShowLayout(false)} />;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-neutral-50 rounded-lg shadow-md">
      <div className="flex justify-center mb-2">
        <img src="./logo.jpeg" alt="DealerQRCode Logo" className="h-24" />
      </div>

      <h1 className="text-2xl font-bold text-center mb-6">QR Code Generator</h1>

      {/* Form Fields */}
      <div className="space-y-4 mb-8">
        {formFields.map((field) => (
          <div key={field.name} className="grid grid-cols-3 items-center gap-4">
            <label className="font-medium text-neutral-800 text-right">
              {field.label}:
            </label>
            <input
              type="text"
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleInputChange}
              className="col-span-2 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-800 focus:bg-white transition-colors"
            />
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button 
          onClick={generateQRCode}
          disabled={isGenerating || !url}
          className="flex-1 py-3 rounded-lg px-4 text-white bg-black hover:bg-neutral-700 transition duration-200 font-semibold disabled:bg-neutral-400"
        >
          {isGenerating ? "Generating..." : "Generate QR Code"}
        </button>
        <button
          onClick={() => setShowLayout(true)}
          disabled={savedCodes.length === 0}
          className="flex-1 py-3 rounded-lg px-4 text-white bg-black hover:bg-neutral-700 transition duration-200 font-semibold disabled:bg-neutral-400"
        >
          QR Code Layout
        </button>
      </div>

      {/* Position Selection Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        {[1, 2, 3, 4].map((position) => (
          <button
            key={position}
            onClick={() => saveToPosition(position)}
            disabled={!qrCodeSrc}
            className={`w-12 h-12 rounded-full font-bold border-2 transition duration-200
              ${selectedPosition === position 
                ? 'bg-black text-white border-black' 
                : 'bg-white text-black border-black hover:bg-neutral-100'}
              ${savedCodes[position - 1] ? 'ring-2 ring-green-500' : ''}
              disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {position}
          </button>
        ))}
      </div>

      {/* Preview Section */}
      <h2 className="text-xl text-center mb-5 font-bold">Preview</h2>
      <div className="flex justify-center">
        <div 
          ref={previewRef} 
          className="bg-white text-black rounded-lg p-8 w-90 mx-auto shadow-md border border-gray-200"
          style={{ aspectRatio: "3/5" }}
        >
          {/* Vehicle Title */}
          <h2 className="text-2xl font-black text-center mb-2 mt-1">{preview.title}</h2>

          {/* Stock & Miles on same line */}
          <div className="mb-7 text-center">
            <span className="font-black text-[16px]">STOCK #:</span> <span className="text-[16px]">{preview.stock}</span>
            <span className="mx-2"></span>
            <span className="font-black text-[16px]">MILES:</span> <span className="text-[16px]">{preview.miles}</span>
          </div>

          {/* QR Code Container */}
          <div className="mb-5 relative">
            <div className="relative">
              {/* Scan Button */}
              <div className="bg-black text-white py-2 px-8 rounded-xl text-center mx-auto w-[220px] z-10 relative">
                <div className="text-2xl font-bold">{preview.scanText}</div>
                <div className="text-lg">{preview.subText}</div>
              </div>
              
              {/* QR Code Container */}
              <div className="border-6 border-black rounded-3xl p-0 pt-4 flex justify-center items-center mt-[-22px] mx-auto w-70 h-70">
                <div className="flex justify-center items-center w-full h-full">
                  {isGenerating ? (
                    <div className="text-gray-400">Generating QR code...</div>
                  ) : errorMessage ? (
                    <div className="text-red-500 text-center">{errorMessage}</div>
                  ) : qrCodeSrc ? (
                    <img 
                      src={qrCodeSrc} 
                      alt="QR Code" 
                      width="220" 
                      height="220" 
                      className="max-w-full max-h-full"
                    />
                  ) : (
                    <div className="text-gray-400 text-center">QR code will appear here</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Dealer Name */}
          <div className="justify-center border-4 border-black rounded-lg px-4 py-2 text-center mx-auto w-fit">
            <span className="font-black text-lg">{preview.dealer}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
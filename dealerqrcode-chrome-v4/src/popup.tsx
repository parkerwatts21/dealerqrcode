import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import html2canvas from "html2canvas-pro";

// Import Chrome types
/// <reference types="chrome"/>

// Define types for our form data
type FormField = "title" | "stock" | "miles" | "dealer" | "scanText" | "subText";

interface FormDataType {
  title: string;
  stock: string;
  miles: string;
  dealer: string;
  scanText: string;
  subText: string;
}

interface ScrapedData {
  title?: string;
  stock?: string;
  miles?: string;
  dealer?: string;
}

// Settings type definition
interface Settings {
  scanText: string;
  subText: string;
  dealer: string;
  logoUrl: string;
  isDealerCustomized: boolean; // Track if dealer name has been manually set
}

// Default values for settings
const DEFAULT_SETTINGS: Settings = {
  scanText: "SCAN ME",
  subText: "FOR INFO + PRICE",
  dealer: "", // Empty by default
  logoUrl: "",
  isDealerCustomized: false
};

// Local storage key
const STORAGE_KEY = 'dealerqrcode_settings';

// Storage utility functions
const storage = {
  async get(): Promise<Settings> {
    try {
      if (typeof chrome !== 'undefined' && chrome?.storage?.sync) {
        return new Promise((resolve) => {
          chrome.storage.sync.get(DEFAULT_SETTINGS, (result: Settings) => {
            resolve({
              scanText: result.scanText || DEFAULT_SETTINGS.scanText,
              subText: result.subText || DEFAULT_SETTINGS.subText,
              dealer: result.dealer || DEFAULT_SETTINGS.dealer,
              logoUrl: result.logoUrl || DEFAULT_SETTINGS.logoUrl,
              isDealerCustomized: result.isDealerCustomized || DEFAULT_SETTINGS.isDealerCustomized
            });
          });
        });
      } else {
        // Fallback to localStorage in development
        const saved = localStorage.getItem(STORAGE_KEY);
        const parsedSettings = saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
        return {
          scanText: parsedSettings.scanText || DEFAULT_SETTINGS.scanText,
          subText: parsedSettings.subText || DEFAULT_SETTINGS.subText,
          dealer: parsedSettings.dealer || DEFAULT_SETTINGS.dealer,
          logoUrl: parsedSettings.logoUrl || DEFAULT_SETTINGS.logoUrl,
          isDealerCustomized: parsedSettings.isDealerCustomized || DEFAULT_SETTINGS.isDealerCustomized
        };
      }
    } catch (error) {
      console.warn('Error reading settings, using defaults:', error);
      return { ...DEFAULT_SETTINGS };
    }
  },

  async set(settings: Partial<Settings>): Promise<void> {
    try {
      if (typeof chrome !== 'undefined' && chrome?.storage?.sync) {
        return new Promise((resolve) => {
          chrome.storage.sync.set(settings, () => {
            resolve();
          });
        });
      } else {
        // Fallback to localStorage in development
        const current = await this.get();
        const updated = { ...current, ...settings };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
    } catch (error) {
      console.warn('Error saving settings:', error);
    }
  }
};

// Add this helper function near the top of the file, after the imports
const truncateTitle = (title: string) => {
  const maxLength = 36; // Length of "2022 GMC YUKON XL DENALI 2022 IFNIEFFE"
  return title.length > maxLength ? title.substring(0, maxLength) : title;
};

const Popup: React.FC = () => {
  // State management for form inputs (empty by default)
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    stock: "",
    miles: "",
    dealer: DEFAULT_SETTINGS.dealer,
    scanText: DEFAULT_SETTINGS.scanText,
    subText: DEFAULT_SETTINGS.subText
  });
  
  // Add state for logo filename
  const [logoFilename, setLogoFilename] = useState<string>("");
  
  // Add print position state
  const [selectedPosition, setSelectedPosition] = useState<number>(1);
  
  // QR code and URL states
  const [url, setUrl] = useState<string>("");
  const [qrCodeSrc, setQrCodeSrc] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>(DEFAULT_SETTINGS.logoUrl);
  
  const previewRef = useRef<HTMLDivElement>(null);
  const initialized = useRef<boolean>(false);

  // Add state to track if dealer info is customized
  const [isDealerCustomized, setIsDealerCustomized] = useState<boolean>(false);

  // Add file input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await storage.get();
        setFormData(prev => ({
          ...prev,
          scanText: savedSettings.scanText,
          subText: savedSettings.subText,
          dealer: savedSettings.dealer || "" // Ensure dealer is empty string if not set
        }));
        
        if (savedSettings.logoUrl) {
          setLogoUrl(savedSettings.logoUrl);
          // Extract filename from base64 if it exists
          const filenameMatch = savedSettings.logoUrl.match(/;filename=([^;]+)/);
          if (filenameMatch) {
            setLogoFilename(filenameMatch[1]);
          }
        }

        setIsDealerCustomized(savedSettings.isDealerCustomized);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newValue = name === 'title' ? truncateTitle(value) : value;
      const newData = {
        ...prev,
        [name as FormField]: newValue
      };
      
      // Save settings when they change
      if (name === 'scanText' || name === 'subText' || name === 'dealer') {
        const isCustomizingDealer = name === 'dealer' && value !== '';
        if (isCustomizingDealer) {
          setIsDealerCustomized(true);
        }

        storage.set({
          scanText: newData.scanText,
          subText: newData.subText,
          dealer: newData.dealer,
          logoUrl,
          isDealerCustomized: isCustomizingDealer ? true : isDealerCustomized
        });
      }
      
      return newData;
    });
  };

  // Handle logo file upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFilename(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        // Add filename to the base64 string
        const base64WithFilename = `${reader.result};filename=${file.name}`;
        setLogoUrl(base64WithFilename);
        setIsDealerCustomized(true); // Mark as customized when logo is uploaded
        storage.set({ 
          logoUrl: base64WithFilename,
          scanText: formData.scanText,
          subText: formData.subText,
          dealer: formData.dealer,
          isDealerCustomized: true
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle logo removal
  const handleRemoveLogo = () => {
    setLogoUrl("");
    setLogoFilename("");
    setIsDealerCustomized(false);
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    storage.set({
      logoUrl: "",
      scanText: formData.scanText,
      subText: formData.subText,
      dealer: formData.dealer,
      isDealerCustomized: false
    });
  };

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

  // Modified scrapeVehicleData function
  const scrapeVehicleData = () => {
    console.log("Starting vehicle data scraping process...");
    
    if (typeof chrome !== "undefined" && chrome?.scripting && chrome.scripting.executeScript) {
      try {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          console.log("Found active tabs:", tabs?.length);
          
          if (tabs && tabs.length > 0 && tabs[0]?.id) {
            console.log("Attempting to execute content script on tab:", tabs[0].id);
            
            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              func: contentScriptFunction
            }).then(injectionResults => {
              console.log("Content script execution completed, results:", injectionResults);
              
              if (injectionResults && injectionResults[0] && injectionResults[0].result) {
                const scrapedData = injectionResults[0].result as ScrapedData;
                console.log("Successfully received scraped data:", scrapedData);
                
                // Update form with scraped data
                setFormData(prevData => {
                  const newData = {
                    ...prevData,
                    ...(scrapedData.title && { title: truncateTitle(scrapedData.title) }),
                    ...(scrapedData.stock && { stock: scrapedData.stock }),
                    ...(scrapedData.miles && { miles: scrapedData.miles })
                  };

                  // Only update dealer name if it's currently empty and we have scraped data
                  if (!prevData.dealer && scrapedData.dealer) {
                    newData.dealer = scrapedData.dealer;
                    // Save the scraped dealer name
                    storage.set({
                      dealer: scrapedData.dealer,
                      scanText: prevData.scanText,
                      subText: prevData.subText,
                      logoUrl,
                      isDealerCustomized: false
                    });
                  }

                  return newData;
                });
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
        // Only proceed with dealer name extraction if dealer is empty
        if (!scrapedData.dealer) {
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
        } else {
          console.log("ℹ️ Skipping dealer extraction - dealer already set");
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
    title: truncateTitle(formData.title) || "Vehicle Title",
    stock: formData.stock || "",
    miles: formData.miles || "0",
    dealer: formData.dealer || "Company Name",
    scanText: formData.scanText,
    subText: formData.subText
  };

  const downloadPDF = () => {
    if (!previewRef.current) {
      console.error("⚠️ Preview reference not available");
      return;
    }
  
    // Ensure the QR code is generated before capturing
    if (!qrCodeSrc) {
      console.warn("⚠️ QR Code not available yet, regenerating...");
      generateQRCodeFromUrl(url);
  
      // Wait for QR code to generate before capturing
      setTimeout(() => {
        if (qrCodeSrc) {
          console.log("✅ QR Code ready, capturing...");
          captureAndDownload();
        } else {
          alert("Error: QR Code failed to generate. Try again.");
        }
      }, 500);
      return;
    }
  
    captureAndDownload();
  };
  
  const captureAndDownload = async () => {
    if (!previewRef.current) {
        console.error("❌ Error: previewRef is null");
        alert("Error: Could not capture preview.");
        return;
    }

    console.log("📸 Capturing preview as image...");

    try {
        // Create a canvas for the full page (8.5 x 11 inches at 300 DPI)
        const fullCanvas = document.createElement('canvas');
        const dpi = 300;
        fullCanvas.width = 8.5 * dpi; // 8.5 inches * 300 DPI
        fullCanvas.height = 11 * dpi; // 11 inches * 300 DPI
        const fullCtx = fullCanvas.getContext('2d');
        
        if (!fullCtx) {
            throw new Error("Could not get canvas context");
        }

        // Set white background
        fullCtx.fillStyle = 'white';
        fullCtx.fillRect(0, 0, fullCanvas.width, fullCanvas.height);

        // Capture the QR code preview
        const previewCanvas = await html2canvas(previewRef.current, {
            scale: 4,
            useCORS: true,
            backgroundColor: null,
            logging: false,
        });

        // Define page margins and spacing
        const pageMargin = 0.5 * dpi; // 0.5 inch margin

        // Calculate usable area dimensions (excluding margins)
        const usableWidth = fullCanvas.width - (2 * pageMargin);
        const usableHeight = fullCanvas.height - (2 * pageMargin);

        // Calculate dimensions for each quadrant (including spacing)
        const quadrantWidth = 3.75 * dpi; // Exactly 3.75 inches
        const quadrantHeight = 5 * dpi; // Exactly 5 inches
        const remainingWidth = usableWidth - (2 * quadrantWidth);
        const remainingHeight = usableHeight - (2 * quadrantHeight);
        const horizontalSpacing = remainingWidth / 3; // Divide remaining space
        const verticalSpacing = remainingHeight / 3;

        // Add offset for quadrant 1 and 2
        const leftQuadrantOffset = -0.228 * dpi; // Move left by 0.25 inches
        const rightQuadrantOffset = 0.228 * dpi; // Move right by 0.25 inches

        // Calculate position based on selected quadrant
        let x = pageMargin;
        let y = pageMargin;

        switch (selectedPosition) {
            case 1: // Top left
                x = pageMargin + horizontalSpacing + leftQuadrantOffset;
                y = pageMargin + verticalSpacing;
                break;
            case 2: // Top right
                x = pageMargin + quadrantWidth + (2 * horizontalSpacing) + rightQuadrantOffset;
                y = pageMargin + verticalSpacing;
                break;
            case 3: // Bottom left
                x = pageMargin + horizontalSpacing + leftQuadrantOffset;
                y = pageMargin + quadrantHeight + (2 * verticalSpacing);
                break;
            case 4: // Bottom right
                x = pageMargin + quadrantWidth + (2 * horizontalSpacing) + rightQuadrantOffset;
                y = pageMargin + quadrantHeight + (2 * verticalSpacing);
                break;
        }

        // Scale the preview to fit exactly in the 3.75x5 inch space
        const scaledWidth = 3.75 * dpi;
        const scaledHeight = 5 * dpi;

        // Draw the preview onto the full canvas
        fullCtx.save(); // Save the current context state
        fullCtx.filter = 'grayscale(100%)'; // Apply grayscale filter
        fullCtx.drawImage(
            previewCanvas,
            x,
            y,
            scaledWidth,
            scaledHeight
        );
        fullCtx.restore(); // Restore the context state

        // Convert to JPEG
        const jpegData = fullCanvas.toDataURL('image/jpeg', 1.0);

        // Create download link
        const downloadLink = document.createElement('a');
        const filename = formData?.title
            ? `${formData.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}_${formData.stock || "000000"}.jpg`
            : "qr_code.jpg";

        downloadLink.href = jpegData;
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        console.log("✅ JPEG saved successfully!");
    } catch (error) {
        console.error("❌ Error generating JPEG:", error);
        alert("Error generating JPEG. Please try again.");
    }
  };


  // Form field configuration for cleaner rendering - only vehicle info fields
  const formFields: Array<{name: FormField; label: string; placeholder: string}> = [
    { name: "title", label: "Vehicle Title", placeholder: "Enter vehicle make, model, year" },
    { name: "stock", label: "Stock Number", placeholder: "Enter stock number" },
    { name: "miles", label: "Miles", placeholder: "Enter vehicle mileage" },
    { name: "scanText", label: "Scan Title", placeholder: "Enter scan button text" },
    { name: "subText", label: "Scan Text", placeholder: "Enter text below scan button" },
    { name: "dealer", label: "Dealership Logo", placeholder: "Enter dealership name" }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-neutral-50 rounded-lg shadow-md">
      <div className="flex justify-center mb-2">
        <img src="./logo.jpeg" alt="DealerQRCode Logo" className="h-24" />
      </div>

      <h1 className="text-2xl font-bold text-center mb-6">QR Code Generator</h1>

      {/* Form Fields - only vehicle info, no QR text fields */}
      <div className="space-y-4 mb-6">
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

        {/* Divider Line with OR */}
        <div className="grid grid-cols-3 items-center gap-4">
          <div className="col-span-3 flex items-center justify-center">
            <div className="flex-grow border-t-1 border-neutral-300"></div>
            <span className="mx-4 text-neutral-600">or</span>
            <div className="flex-grow border-t-1 border-neutral-300"></div>
          </div>
        </div>

        {/* Import Logo Field */}
        <div className="flex justify-center items-center gap-4 pl-16">
          <div className="col-span-2">
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className={`file:mr-2 file:py-0.5 file:px-2 file:rounded file:border file:border-gray-400 file:text-sm file:bg-gray-200 hover:file:bg-gray-300 file:cursor-pointer cursor-pointer w-full text-center ${logoFilename ? 'has-file' : ''}`}
              />
              {logoFilename && (
                <div className="absolute left-[100px] top-1/2 transform -translate-y-1/2 flex items-center gap-0.5 bg-neutral-50">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveLogo();
                    }}
                    className="text-black hover:text-gray-700 text-base flex items-center h-full"
                    title="Remove logo"
                  >
                    <span className="relative bottom-[1px]">×</span>
                  </button>
                  <span className="text-black truncate max-w-[200px]">{logoFilename}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Print Position Selector */}
      <div className="grid grid-cols-3 items-center gap-4 mb-6">
        <label className="font-medium text-neutral-800 text-right">
          Print Position:
        </label>
        <div className="col-span-2">
          <div className="relative" style={{ width: '120px', height: '168px' }}>
            <div className="absolute inset-0 border-1 border-black rounded-lg"></div>
            <div className="grid grid-cols-2 grid-rows-2 h-full">
              {[1, 2, 3, 4].map((position) => (
                <button
                  key={position}
                  type="button"
                  onClick={() => {
                    console.log('Selecting position:', position);
                    setSelectedPosition(position);
                  }}
                  className={`relative z-10 flex items-center justify-center text-xl font-bold border border-black m-0.5 rounded-md transition-colors ${
                    selectedPosition === position ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
                  }`}
                >
                  {position}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6 text-center justify-center">
        <button
          onClick={downloadPDF}
          disabled={!qrCodeSrc}
          className="w-3/4 py-3 rounded-lg px-4 text-white bg-black hover:bg-neutral-700 transition duration-200 font-semibold disabled:bg-neutral-400"
        >
          Download PDF
        </button>
      </div>

      {/* Divider Line */}
      <div className="grid grid-cols-3 items-center gap-4 mb-6">
        <div className="col-span-3 flex items-center justify-center">
          <div className="flex-grow border-t-1 border-neutral-300"></div>
        </div>
      </div>

      {/* Preview Section */}
      <h2 className="text-xl text-center mb-5 font-bold">Preview</h2>
      <div className="flex justify-center">
        <div 
          ref={previewRef} 
          className="bg-white text-black rounded-lg p-6 w-[375px] mx-auto shadow-md"
          style={{ aspectRatio: "4/5" }}
        >
          {/* Vehicle Title */}
          <h2 className="text-[28px] font-black text-center leading-tight mb-1">{preview.title}</h2>

          {/* Stock & Miles on same line */}
          <div className="mb-3 text-center">
            <span className="font-black text-[20px]">STOCK #:</span> <span className="text-[20px]">{preview.stock}</span>
            <span className="mx-2"></span>
            <span className="font-black text-[20px]">MILES:</span> <span className="text-[20px]">{preview.miles}</span>
          </div>

          {/* QR Code Container - centered but narrower than text */}
          <div className="mb-4 flex justify-center">
            <div className="w-[240px]"> {/* Container to constrain QR section width */}
              {/* Scan Button */}
              <div className="bg-black text-white py-1.5 px-4 rounded-xl text-center mx-auto w-[180px] z-10 relative">
                <div className="text-lg font-bold">{preview.scanText}</div>
                <div className="text-base">{preview.subText}</div>
              </div>
              
              {/* QR Code Container */}
              <div className="relative w-full flex justify-center">
                <div className="border-6 border-black rounded-3xl p-3 flex justify-center items-center mt-[-22px] w-56 h-56">
                  <div className="flex justify-center items-center w-full h-full">
                    {isGenerating ? (
                      <div className="text-gray-400">Generating QR code...</div>
                    ) : errorMessage ? (
                      <div className="text-red-500 text-center">{errorMessage}</div>
                    ) : qrCodeSrc ? (
                      <img 
                        src={qrCodeSrc} 
                        alt="QR Code" 
                        width="174" 
                        height="174" 
                        className="max-w-full max-h-full pt-3"
                      />
                    ) : (
                      <div className="text-gray-400 text-center">QR code will appear here</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dealer Name */}
          {logoUrl ? (
            <div className="justify-center text-center mx-auto w-fit">
              <img 
                src={logoUrl.split(';filename=')[0]} 
                alt="Dealer Logo" 
                className="h-12 w-auto object-contain grayscale"
                onError={(e) => {
                  console.error('Error loading logo:', e);
                  handleRemoveLogo();
                }}
              />
            </div>
          ) : (
            <div className="justify-center border-4 border-black rounded-lg px-4 py-1.5 text-center mx-auto w-fit">
              <span className="font-black text-base">{preview.dealer}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;

<style>
{`
  input[type="file"].has-file::file-selector-button {
    margin-right: 8px;
  }
  input[type="file"].has-file {
    color: transparent !important;
  }
`}
</style>
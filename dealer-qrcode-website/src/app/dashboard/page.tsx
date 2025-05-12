"use client";

import Image from 'next/image';
import { useState, useRef, useEffect, Fragment } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Dialog } from '@headlessui/react';
import { supabase } from '@/lib/supabase';
import { FiDownload } from 'react-icons/fi';
import html2canvas from 'html2canvas-pro';

interface Vehicle {
  qr_code_id: string;
  user_id: string;
  title: string;
  stock: string;
  miles: string;
  url: string;
  dealer?: string;
}

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Vehicle state
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ title: '', stock: '', miles: '', url: '' });
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [printModalIdx, setPrintModalIdx] = useState<number | null>(null);
  const [printFormat, setPrintFormat] = useState<'Small' | 'Large'>('Small');
  const [printPosition, setPrintPosition] = useState(1); // 1-4 for quadrant
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  // Fetch vehicles for current user
  useEffect(() => {
    if (!user) return;
    const fetchVehicles = async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
      if (!error) setVehicles(data || []);
    };
    fetchVehicles();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setDropdownOpen(false); // Close dropdown after sign out
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

  // Edit handlers
  const handleEdit = (idx: number) => {
    setEditIdx(idx);
    // Ensure all fields are present for Vehicle
    const v = vehicles[idx];
    setEditVehicle({
      qr_code_id: v.qr_code_id,
      user_id: v.user_id,
      title: v.title,
      stock: v.stock,
      miles: v.miles,
      url: v.url,
      dealer: v.dealer,
    });
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editVehicle) return;
    setEditVehicle({ ...editVehicle, [e.target.name]: e.target.value });
  };
  const handleEditSave = async () => {
    if (!user || !editVehicle || !editVehicle.qr_code_id) return;
    const { data, error } = await supabase
      .from('vehicles')
      .update({
        title: editVehicle.title,
        stock: editVehicle.stock,
        miles: editVehicle.miles,
        url: editVehicle.url,
        dealer: editVehicle.dealer,
      })
      .eq('qr_code_id', editVehicle.qr_code_id)
      .eq('user_id', user.id)
      .select();
    if (error) {
      console.error('Supabase update error:', error);
      alert('Error updating vehicle: ' + error.message);
      return;
    }
    if (data && data.length > 0) {
      const updated = [...vehicles];
      updated[editIdx!] = data[0];
      setVehicles(updated);
    }
    setEditIdx(null);
    setEditVehicle(null);
  };
  const handleEditCancel = () => {
    setEditIdx(null);
    setEditVehicle(null);
  };

  // Modal handlers
  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewVehicle({ ...newVehicle, [e.target.name]: e.target.value });
  };
  const handleAddVehicle = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('vehicles')
      .insert([{ ...newVehicle, user_id: user.id }])
      .select();
    if (error) {
      console.error('Supabase insert error:', error);
      alert('Error adding vehicle: ' + error.message);
      return;
    }
    if (data && data.length > 0) {
      setVehicles([...vehicles, data[0]]);
    }
    setNewVehicle({ title: '', stock: '', miles: '', url: '' });
    setModalOpen(false);
  };
  const handleModalCancel = () => {
    setNewVehicle({ title: '', stock: '', miles: '', url: '' });
    setModalOpen(false);
  };

  // Delete handlers
  const handleDelete = (idx: number) => {
    setDeleteIdx(idx);
    setDeleteModalOpen(true);
  };
  const confirmDelete = async () => {
    if (deleteIdx === null) return;
    const vehicle = vehicles[deleteIdx];
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('qr_code_id', vehicle.qr_code_id)
      .eq('user_id', user.id);
    if (error) {
      alert('Error deleting vehicle: ' + error.message);
      setDeleteModalOpen(false);
      setDeleteIdx(null);
      return;
    }
    setVehicles(vehicles.filter((_, idx) => idx !== deleteIdx));
    setDeleteModalOpen(false);
    setDeleteIdx(null);
  };
  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setDeleteIdx(null);
  };

  const handleDownloadClick = (idx: number) => {
    setPrintModalIdx(idx);
    setPrintFormat('Small');
  };
  const closePrintModal = () => {
    setPrintModalIdx(null);
  };
  const handleFormatSelect = (format: 'Small' | 'Large') => {
    setPrintFormat(format);
  };

  // Helper for truncating title (from extension)
  const truncateTitle = (title: string) => {
    const maxLength = 36;
    return title.length > maxLength ? title.substring(0, maxLength) : title;
  };

  // --- PDF/IMAGE GENERATION LOGIC (from extension) ---
  const handleDownload = async () => {
    if (printModalIdx === null) {
      console.error('No vehicle selected for download');
      return;
    }
    const vehicle = vehicles[printModalIdx];
    if (!vehicle) return;

    setTimeout(async () => {
      if (!previewRef.current) {
        alert('Error: Could not capture preview.');
        return;
      }
      try {
        // Create a canvas for the full page (8.5 x 11 inches at 300 DPI)
        const fullCanvas = document.createElement('canvas');
        const dpi = 300;
        fullCanvas.width = 8.5 * dpi;
        fullCanvas.height = 11 * dpi;
        const fullCtx = fullCanvas.getContext('2d');
        if (!fullCtx) throw new Error('Could not get canvas context');
        fullCtx.fillStyle = 'white';
        fullCtx.fillRect(0, 0, fullCanvas.width, fullCanvas.height);

        // Capture the preview
        const previewCanvas = await html2canvas(previewRef.current, {
          scale: 4,
          useCORS: true,
          backgroundColor: null,
          logging: false,
        });

        let x = 0, y = 0, scaledWidth = 0, scaledHeight = 0;
        if (printFormat === 'Large') {
          // Fill the printable area (centered, scaled up) with smaller margin
          const pageMargin = 0.2 * dpi; // 0.2 inch margin
          scaledWidth = fullCanvas.width - 2 * pageMargin;
          scaledHeight = fullCanvas.height - 2 * pageMargin;
          x = pageMargin;
          y = pageMargin;
        } else {
          // Quadrant logic (matches extension)
          const pageMargin = 0.5 * dpi;
          const usableWidth = fullCanvas.width - (2 * pageMargin);
          const usableHeight = fullCanvas.height - (2 * pageMargin);
          const quadrantWidth = 3.75 * dpi;
          const quadrantHeight = 5 * dpi;
          const remainingWidth = usableWidth - (2 * quadrantWidth);
          const remainingHeight = usableHeight - (2 * quadrantHeight);
          const horizontalSpacing = remainingWidth / 3;
          const verticalSpacing = remainingHeight / 3;
          const leftQuadrantOffset = -0.228 * dpi;
          const rightQuadrantOffset = 0.228 * dpi;
          switch (printPosition) {
            case 1:
              x = pageMargin + horizontalSpacing + leftQuadrantOffset;
              y = pageMargin + verticalSpacing;
              break;
            case 2:
              x = pageMargin + quadrantWidth + (2 * horizontalSpacing) + rightQuadrantOffset;
              y = pageMargin + verticalSpacing;
              break;
            case 3:
              x = pageMargin + horizontalSpacing + leftQuadrantOffset;
              y = pageMargin + quadrantHeight + (2 * verticalSpacing);
              break;
            case 4:
              x = pageMargin + quadrantWidth + (2 * horizontalSpacing) + rightQuadrantOffset;
              y = pageMargin + quadrantHeight + (2 * verticalSpacing);
              break;
          }
          scaledWidth = 3.75 * dpi;
          scaledHeight = 5 * dpi;
        }
        fullCtx.save();
        fullCtx.drawImage(previewCanvas, x, y, scaledWidth, scaledHeight);
        fullCtx.restore();
        const jpegData = fullCanvas.toDataURL('image/jpeg', 1.0);
        const downloadLink = document.createElement('a');
        const filename = vehicle?.title
          ? `${vehicle.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}_${vehicle.stock || "000000"}.jpg`
          : "qr_code.jpg";
        downloadLink.href = jpegData;
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        closePrintModal();
      } catch {
        alert('Error generating JPEG. Please try again.');
      }
    }, 100);
  };

  const isAddDisabled = !newVehicle.title || !newVehicle.stock || !newVehicle.miles || !newVehicle.url;

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 text-neutral-900 flex flex-col py-8 px-6">
        <div>
          <div className="flex items-center mb-10">
            <Image src="/images/logo.svg" alt="Dealer QRCode" width={60} height={60} className="mr-2" />
          </div>
          <nav className="space-y-2">
            <a
              href="#"
              className="flex items-center px-4 py-2 rounded-lg font-bold transition-colors bg-neutral-100 text-neutral-900 border border-neutral-200 text-sm"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Dashboard
            </a>
          </nav>
        </div>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-0">
        {/* Top navbar */}
        <div className="w-full bg-white border-b border-neutral-200 flex justify-end items-center h-20 px-10 relative">
          <div
            ref={profileRef}
            className="flex items-center gap-2 cursor-pointer select-none relative"
            onClick={() => setDropdownOpen((open) => !open)}
            tabIndex={0}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=000000&color=ffffff&size=64`} 
              alt={userName} 
              width={36}
              height={36}
              className="w-9 h-9 rounded-full border-2 border-white" 
            />
            <span className="text-neutral-900 font-semibold text-sm">{userName}</span>
            <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 top-10 w-36 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 z-50">
                <button 
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-1.5 text-sm text-neutral-900 hover:bg-neutral-100"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="p-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-xl font-bold text-neutral-900 mb-1">Dynamic QR Code</h2>
                <p className="text-neutral-500 text-sm">Manage your vehicle QR codes. Each row represents a vehicle and its associated dynamic QR code URL.</p>
              </div>
              <button onClick={() => setModalOpen(true)} className="bg-neutral-900 text-white px-5 py-1.5 rounded-lg font-semibold shadow-sm hover:bg-neutral-800 transition-colors text-sm">Add vehicle</button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
              <table className="min-w-full divide-y divide-neutral-200 text-sm">
                <thead>
                  <tr>
                    <th className="px-2 py-3 text-left pl-5 font-semibold text-neutral-900">QR Code Id</th>
                    <th className="px-2 py-3 text-left font-semibold text-neutral-900">Vehicle Title</th>
                    <th className="px-2 py-3 text-left font-semibold text-neutral-900">Stock Number</th>
                    <th className="px-2 py-3 text-left font-semibold text-neutral-900">Miles</th>
                    <th className="px-2 py-3 text-left font-semibold text-neutral-900">URL</th>
                    <th className="px-2 py-3 text-left font-semibold text-neutral-900">Download</th>
                    <th className="px-2 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {vehicles.map((vehicle, idx) => (
                    <tr key={vehicle.qr_code_id} className={editIdx === idx ? "bg-neutral-50" : ""}>
                      {/* QR Code ID column, always same style */}
                      <td className="px-2 py-1.5 pl-5 align-middle font-semibold text-neutral-700 text-sm text-left">{vehicle.qr_code_id}</td>
                      {editIdx === idx ? (
                        <>
                          <td className="px-2 py-2 ml-12 align-middle text-left">
                            <input name="title" value={editVehicle?.title ?? ''} onChange={handleEditChange} className="border border-neutral-300 rounded-lg px-2 py-1.5 w-full text-sm font-semibold focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition" />
                          </td>
                          <td className="px-2 py-2 align-middle text-left">
                            <input name="stock" value={editVehicle?.stock ?? ''} onChange={handleEditChange} className="border border-neutral-300 rounded-lg px-2 py-1.5 w-full text-sm text-neutral-700 focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition" />
                          </td>
                          <td className="px-2 py-2 align-middle text-left">
                            <input name="miles" value={editVehicle?.miles ?? ''} onChange={handleEditChange} className="border border-neutral-300 rounded-lg px-2 py-1.5 w-full text-sm text-neutral-700 focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition" />
                          </td>
                          <td className="px-2 py-2 align-middle text-left">
                            <input name="url" value={editVehicle?.url ?? ''} onChange={handleEditChange} className="border border-neutral-300 rounded-lg px-2 py-1.5 w-full text-sm text-blue-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
                          </td>
                          <td className="px-4 py-2 align-middle w-20 pl-6">
                            <div className="flex justify-center items-center w-full">
                              <button onClick={() => handleDownloadClick(idx)} className="p-1" title="Download">
                                <FiDownload size={18} className="text-black" />
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-1.5 align-middle text-right">
                            <div className="flex gap-2 items-center justify-end">
                              <button onClick={handleEditSave} className="px-3 py-1.5 rounded-lg bg-green-100 text-green-700 font-semibold text-xs hover:bg-green-200 transition">Save</button>
                              <button onClick={handleEditCancel} className="px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-700 font-semibold text-xs hover:bg-neutral-200 transition">Cancel</button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-2 py-3 font-semibold text-neutral-900 text-left">{vehicle.title}</td>
                          <td className="px-2 py-3 text-neutral-400 text-left">{vehicle.stock}</td>
                          <td className="px-2 py-3 text-neutral-400 text-left">{vehicle.miles}</td>
                          <td className="px-2 py-3 text-blue-600 underline max-w-[140px] truncate text-left">
                            <a href={vehicle.url} target="_blank" rel="noopener noreferrer" title={vehicle.url}>{vehicle.url}</a>
                          </td>
                          <td className="px-2 py-3 align-middle w-20 pl-2">
                            <div className="flex justify-center items-center w-full">
                              <button onClick={() => handleDownloadClick(idx)} className="p-1" title="Download">
                                <FiDownload size={18} className="text-black" />
                              </button>
                            </div>
                          </td>
                          <td className="px-2 py-3 text-right flex gap-6 justify-end pr-4">
                            <button onClick={() => handleEdit(idx)} className="text-neutral-900 font-semibold hover:text-neutral-700 transition-colors pt-1">Edit</button>
                            <button onClick={() => handleDelete(idx)} className="text-red-600 font-semibold hover:text-red-800 transition-colors pr-2 pt-1">Delete</button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Add Vehicle Modal */}
      <Dialog open={modalOpen} onClose={handleModalCancel} as={Fragment}>
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Dialog.Panel className="bg-white border border-neutral-200 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <Dialog.Title className="text-base font-bold mb-3 text-neutral-900">Add Vehicle</Dialog.Title>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1 text-neutral-700">Vehicle Title</label>
                <input name="title" value={newVehicle.title} onChange={handleModalChange} className="border border-neutral-300 rounded-lg px-2 py-1.5 w-full text-sm focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-neutral-700">Stock Number</label>
                <input name="stock" value={newVehicle.stock} onChange={handleModalChange} className="border border-neutral-300 rounded-lg px-2 py-1.5 w-full text-sm focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-neutral-700">Miles</label>
                <input name="miles" value={newVehicle.miles} onChange={handleModalChange} className="border border-neutral-300 rounded-lg px-2 py-1.5 w-full text-sm focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-neutral-700">URL</label>
                <input name="url" value={newVehicle.url} onChange={handleModalChange} className="border border-neutral-300 rounded-lg px-2 py-1.5 w-full text-sm focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={handleModalCancel} className="px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-700 font-semibold text-sm hover:bg-neutral-200 transition">Cancel</button>
              <button
                onClick={handleAddVehicle}
                disabled={isAddDisabled}
                className={`px-3 py-1.5 rounded-lg bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800 transition ${isAddDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Add
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Delete Vehicle Modal */}
      <Dialog open={deleteModalOpen} onClose={cancelDelete} as={Fragment}>
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Dialog.Panel className="bg-white border border-neutral-200 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <Dialog.Title className="text-base font-bold mb-3 text-neutral-900">Delete Vehicle</Dialog.Title>
            <div className="mb-4 text-sm text-neutral-700">Are you sure you want to delete this vehicle? This action cannot be undone.</div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={cancelDelete} className="px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-700 font-semibold text-sm hover:bg-neutral-200 transition">Cancel</button>
              <button onClick={confirmDelete} className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition">Delete</button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Print Format Modal */}
      <Dialog open={printModalIdx !== null} onClose={closePrintModal} as={Fragment}>
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Dialog.Panel className="bg-white border border-neutral-200 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <Dialog.Title className="text-base font-bold mb-3 text-neutral-900">Print Format</Dialog.Title>
            <div className="space-y-3 mb-6">
              <label className="flex items-center space-x-3 p-3 rounded-lg border border-neutral-200 cursor-pointer hover:bg-neutral-50">
                <input
                  type="radio"
                  name="printFormat"
                  checked={printFormat === 'Small'}
                  onChange={() => handleFormatSelect('Small')}
                  className="w-4 h-4 text-neutral-900 focus:ring-neutral-500"
                />
                <span className="text-sm font-medium text-neutral-900">Small</span>
              </label>
              {printFormat === 'Small' && (
                <div className="flex items-center justify-center mb-2 pr-6">
                  <span className="text-base font-medium text-neutral-900 mr-4 whitespace-nowrap">Print Position:</span>
                  <div className="p-1 border-2 border-black rounded-2xl flex-shrink-0" style={{ width: '120px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
                    <div className="grid grid-cols-2 grid-rows-2 gap-1 w-full h-full">
                      {[1,2,3,4].map(pos => (
                        <button
                          key={pos}
                          type="button"
                          onClick={() => setPrintPosition(pos)}
                          className={`rounded-lg border-2 flex items-center justify-center text-2xl font-bold transition-colors
                            ${printPosition === pos ? 'bg-black text-white border-black' : 'bg-white text-black border-neutral-400 hover:bg-neutral-100'}`}
                          style={{ width: '100%', height: '100%', aspectRatio: '3/4' }}
                          aria-label={`Quadrant ${pos}`}
                        >
                          {pos}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <label className="flex items-center space-x-3 p-3 rounded-lg border border-neutral-200 cursor-pointer hover:bg-neutral-50">
                <input
                  type="radio"
                  name="printFormat"
                  checked={printFormat === 'Large'}
                  onChange={() => handleFormatSelect('Large')}
                  className="w-4 h-4 text-neutral-900 focus:ring-neutral-500"
                />
                <span className="text-sm font-medium text-neutral-900">Large</span>
              </label>
            </div>
            <div className="flex justify-end">
              <button onClick={handleDownload} className="px-4 py-2 rounded-lg bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800 transition">Download</button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Hidden Preview for PDF/Print Generation */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div
          ref={previewRef}
          className="bg-white text-black rounded-lg p-6 w-[375px] mx-auto shadow-md"
          style={{ aspectRatio: '4/5' }}
        >
          {/* Vehicle Title */}
          <h2 className="text-[16px] font-bold text-center leading-tight mb-1">{truncateTitle(vehicles[printModalIdx || 0]?.title || '') || 'Vehicle Title'}</h2>
          {/* Stock & Miles on same line */}
          <div className="text-center">
            <span className="font-bold text-[12px]">STOCK #:</span> <span className="text-[12px]">{vehicles[printModalIdx || 0]?.stock || ''}</span>
            <span className="mx-2"></span>
            <span className="font-bold text-[12px]">MILES:</span> <span className="text-[12px]">{vehicles[printModalIdx || 0]?.miles || '0'}</span>
          </div>
          {/* I'M FOR SALE text */}
          <div className="text-center mt-[-6px]">
            <div className="text-[42px]">I&apos;M FOR SALE</div>
          </div>
          {/* SCAN ME text */}
          <div className="text-center mt-[-20px] mb-[-12px]">
            <div className="text-[42px]">SCAN ME</div>
          </div>
          {/* QR Code Container */}
          <div className="relative w-full flex justify-center">
            <div className="p-3 flex justify-center items-center w-56 h-56">
              <div className="flex justify-center items-center w-full h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent('https://dealerqrcode.com/dynamic/' + (vehicles[printModalIdx || 0]?.qr_code_id || ''))}&size=210x210&format=png`} 
                  alt="QR Code" 
                  width="210" 
                  height="210" 
                  className="max-w-full max-h-full"
                />
              </div>
            </div>
          </div>
          {/* Dealer Name or Logo */}
          <div className="justify-center text-center mx-auto w-fit mt-[-75px] mb-[-95px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/IMG_2491.PNG" 
              alt="Dealer Logo" 
              className="h-64 w-auto object-contain mx-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = document.createElement('span');
                fallback.textContent = vehicles[printModalIdx || 0]?.dealer || 'Company Name';
                fallback.className = 'text-[24px] font-black';
                if (e.currentTarget.parentNode) {
                  e.currentTarget.parentNode.appendChild(fallback);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 
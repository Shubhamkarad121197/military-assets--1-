import * as React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Backdrop, Box, Modal, Button, Typography } from '@mui/material';
import { useSpring, animated } from '@react-spring/web';

const Fade = React.forwardRef(function Fade(props, ref) {
  const { children, in: open, onClick, onEnter, onExited, ...other } = props;
  
  const style = useSpring({
    from: { opacity: 0, transform: 'translate(-50%, -48%) scale(0.95)' },
    to: { 
      opacity: open ? 1 : 0, 
      transform: open ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -48%) scale(0.95)' 
    },
    config: { tension: 250, friction: 20 },
    onStart: () => { if (open && onEnter) onEnter(null, true); },
    onRest: () => { if (!open && onExited) onExited(null, true); },
  });

  return (
    <animated.div ref={ref} style={{
      ...style,
      position: 'fixed',
      top: '50%',
      left: '50%',
      zIndex: 1300,
    }} {...other}>
      {React.cloneElement(children, { onClick })}
    </animated.div>
  );
});

const modalContainerStyle = {
  width: { xs: '90vw', sm: '450px' },
  bgcolor: '#111827',
  border: '1px solid rgba(0, 198, 255, 0.3)',
  borderRadius: '20px',
  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)',
  p: 4,
  color: 'white',
  outline: 'none',
};

export default function Dashboard() {
  const nav = useNavigate();
  
  const [data, setData] = useState({ assets: [], purchases: [], transfers: [] });
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  
  const [purchaseData, setPurchaseData] = useState({ 
    name: "", category: "Weapon", base: "", quantity: 1 
  });

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return nav("/");
    try {
      const res = await axios.get(`http://localhost:5000/api/dashboard?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData({
        assets: res.data.assets || [],
        purchases: res.data.purchases || [],
        transfers: res.data.transfers || []
      });
      setLoading(false);
    } catch (err) {
      console.error("Fetch Error:", err);
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handlePurchaseSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post("http://localhost:5000/api/purchases", purchaseData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("Command: Purchase Logged Successfully.");
      
      setPurchaseData({ name: "", category: "Weapon", base: "", quantity: 1 });
      setShowPurchaseForm(false);
      
      fetchData(); 
    } catch (err) {
      alert("Network Error: Procurement protocol failed.");
    }
  };

  const calculateNet = () => {
    const pCount = data.purchases?.length || 0;
    const tIn = data.transfers?.filter(t => t.type === 'IN').length || 0;
    const tOut = data.transfers?.filter(t => t.type === 'OUT').length || 0;
    return pCount + tIn - tOut;
  };

  if (loading) return <div className="loader">Accessing Secure Assets...</div>;

  return (
    <div className="dash-page">
      <div className="dash-header">
        <h1>Military Assets Command</h1>
        <div className="header-actions">
          <button 
            className="btn-primary-action" 
            onClick={() => setShowPurchaseForm(!showPurchaseForm)}
            style={{ background: showPurchaseForm ? '#4b5563' : '' }}
          >
            {showPurchaseForm ? "✖ Cancel Registry" : "✚ Record Purchase"}
          </button>
          <button className="btn-logout" onClick={() => { localStorage.removeItem("token"); nav("/"); }}>
            Logout
          </button>
        </div>
      </div>

      {showPurchaseForm && (
        <div className="purchase-card">
          <Typography variant="h6" mb={3} sx={{ color: '#00c6ff', fontWeight: 600 }}>
            Strategic Procurement Form
          </Typography>
          
          <form onSubmit={handlePurchaseSubmit} className="purchase-grid-container">
            <div className="input-group">
              <label>Asset Name</label>
              <input 
                type="text" 
                placeholder="e.g. MK-14" 
                value={purchaseData.name}
                required 
                onChange={e => setPurchaseData({...purchaseData, name: e.target.value})} 
              />
            </div>

            <div className="input-group">
              <label>Category</label>
              <select 
                value={purchaseData.category}
                onChange={e => setPurchaseData({...purchaseData, category: e.target.value})}
              >
                <option value="Weapon">Weapon</option>
                <option value="Vehicle">Vehicle</option>
                <option value="Ammunition">Ammunition</option>
              </select>
            </div>

            <div className="input-group">
              <label>Deployment Base</label>
              <input 
                type="text" 
                placeholder="Base Alpha" 
                value={purchaseData.base}
                required 
                onChange={e => setPurchaseData({...purchaseData, base: e.target.value})} 
              />
            </div>

            <div className="input-group">
              <label>Units</label>
              <input 
                type="number" 
                min="1" 
                value={purchaseData.quantity}
                required 
                onChange={e => setPurchaseData({...purchaseData, quantity: e.target.value})} 
              />
            </div>

            <button type="submit" className="purchase-submit-btn">
              Authorize Procurement
            </button>
          </form>
        </div>
      )}

      <div className="dash-cards">
        <div className="card" onClick={() => setOpenModal(true)} style={{ cursor: 'pointer' }}>
          <h3>Net Movement (Audit)</h3>
          <p className="green">{calculateNet()} Units</p>
          <Typography sx={{ fontSize: '11px', opacity: 0.6, mt: 1 }}>View Intel Details</Typography>
        </div>
        <div className="card">
          <h3>Active Registry</h3>
          <p>{data.assets?.length || 0} Categories</p>
        </div>
        <div className="card">
          <h3>System Security</h3>
          <p className="green">Active</p>
        </div>
      </div>

      <div className="dash-table">
        <h2>Live Inventory Ledger</h2>
        <table>
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Base Location</th>
              <th>Current Stock</th>
            </tr>
          </thead>
          <tbody>
            {data.assets.length > 0 ? (
              data.assets.map((asset, index) => (
                <tr key={asset._id || index}>
                  <td>{asset.name}</td>
                  <td>{asset.base}</td>
                  <td><span className="green">{asset.quantity}</span></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '30px', opacity: 0.5 }}>
                  No assets found in the registry.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            TransitionComponent: Fade,
            style: { backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)' }
          },
        }}
      >
        <Fade in={openModal}>
          <Box sx={modalContainerStyle}>
            <Typography variant="h5" sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold', color: '#00c6ff' }}>
              Movement Audit
            </Typography>
            
            <div className="detail-row">
              <span>Direct Procurement</span>
              <span className="green">+{data.purchases?.length || 0}</span>
            </div>
            <div className="detail-row">
              <span>Transfers Received</span>
              <span className="green">+{data.transfers?.filter(t => t.type === 'IN').length || 0}</span>
            </div>
            <div className="detail-row">
              <span>Transfers Dispatched</span>
              <span style={{ color: '#ff4d4d' }}>-{data.transfers?.filter(t => t.type === 'OUT').length || 0}</span>
            </div>

            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #333', display: 'flex', justifyContent: 'space-between' }}>
              <Typography fontWeight="bold">NET AUDIT TOTAL:</Typography>
              <Typography fontWeight="bold" color="#00c6ff">{calculateNet()} Units</Typography>
            </Box>

            <Button 
              fullWidth 
              variant="contained" 
              onClick={() => setOpenModal(false)}
              sx={{ mt: 4, bgcolor: '#0072ff', borderRadius: '10px', p: 1.5 }}
            >
              Acknowledge & Close
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

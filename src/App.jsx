import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, CheckCircle, User, Phone, MapPin, Sparkles, ChevronRight } from "lucide-react";

// --- CUSTOM INLINE SVGS FOR A PREMIUM LOOK ---
const ChefKnifeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
    <path d="M22 6c0 0-4 0-10 4s-8 9-8 9l-2 1 2 2 1-2s5-2 9-8 4-10 4-10l4 4z" />
  </svg>
);

const ScissorsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
);

const CleaverIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
    <path d="M4 2v10l3 2v8h4v-8l3-2V2H4z" />
    <path d="M14 6h6v8h-6" />
    <circle cx="17" cy="10" r="1" fill="currentColor"/>
  </svg>
);

const INVENTORY = [
  { id: "chef", name: "Chef's Knife", desc: "Japanese & Western profiles", price: 150, icon: <ChefKnifeIcon /> },
  { id: "paring", name: "Paring Knife", desc: "Small utility blades", price: 80, icon: <ChefKnifeIcon /> },
  { id: "barber", name: "Barber Scissors", desc: "Convex & beveled edge", price: 200, icon: <ScissorsIcon /> },
  { id: "cleaver", name: "Meat Cleaver", desc: "Heavy duty re-profiling", price: 250, icon: <CleaverIcon /> }
];

export default function App() {
  const [cart, setCart] = useState({ chef: 0, paring: 0, barber: 0, cleaver: 0 });
  const [formData, setFormData] = useState({ name: "", phone: "", area: "" });
  const [status, setStatus] = useState("idle"); 
  const [mounted, setMounted] = useState(false);

  // 👇 PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE 👇
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyBGqD_Gath1XZ-oouiRoMvgLiZhKQ8jfGigGrZ5GaWXrp3gjYwCktZtgWyX-sqO93gIA/exec";
  // 👆 ------------------------------------------------ 👆

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = INVENTORY.reduce((sum, item) => sum + item.price * cart[item.id], 0);
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  const updateQuantity = (id, delta) => {
    setCart((prev) => ({
      ...prev,
      [id]: Math.max(0, prev[id] + delta)
    }));
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (total === 0) return;
    
    setStatus("submitting");

    const orderDetails = INVENTORY
      .filter(item => cart[item.id] > 0)
      .map(item => `${cart[item.id]}x ${item.name}`)
      .join(", ");

    const orderData = { 
      name: formData.name, 
      phone: formData.phone, 
      area: formData.area,
      orderDetails: orderDetails,
      totalPrice: `₹${total}` 
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });
      
      setStatus("success");
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert("Something went wrong checking out. Please try again.");
      setStatus("idle");
    }
  };

  if (!mounted) return null;

  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 text-zinc-100 font-sans selection:bg-amber-900/50">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, filter: "blur(10px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="text-center space-y-6 max-w-md w-full bg-zinc-900/50 p-10 rounded-2xl border border-zinc-800 shadow-2xl shadow-amber-900/10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
            className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/20"
          >
            <CheckCircle size={40} className="text-amber-500" />
          </motion.div>
          
          <div>
            <h2 className="text-3xl font-light tracking-wide text-white mb-2">Order Forged.</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Your blades are in the queue. Our dispatch team will ping you on WhatsApp shortly to arrange the pickup from <span className="text-zinc-200 font-medium">{formData.area || "your location"}</span>.
            </p>
          </div>

          <div className="pt-6 border-t border-zinc-800/50 flex justify-between text-sm">
            <span className="text-zinc-500">Items: {totalItems}</span>
            <span className="text-amber-400 font-mono">₹{total}</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-amber-900/50 pb-32">
      <header className="relative pt-20 pb-16 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="flex items-center justify-center gap-2 mb-4 text-amber-500">
            <Sparkles size={16} />
            <span className="text-xs uppercase tracking-[0.3em] font-bold">Premium Restoration</span>
            <Sparkles size={16} />
          </div>
          <h1 className="text-4xl md:text-5xl font-light tracking-widest uppercase mb-4 text-zinc-100">
            Sheffield<br/>
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500">
              Sharpening
            </span>
          </h1>
          <p className="text-sm md:text-base text-zinc-500 tracking-wide max-w-md mx-auto">
            Kochi's professional bladesmiths. Bring your edges back to life.
          </p>
        </motion.div>
      </header>

      <main className="max-w-xl mx-auto px-4 md:px-6">
        <form onSubmit={handleBooking} className="space-y-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6 px-2">
              <h2 className="text-xs font-bold tracking-[0.2em] text-zinc-500 uppercase">Select Arsenal</h2>
              <span className="text-xs font-mono text-amber-500/80 bg-amber-500/10 px-2 py-1 rounded">B2B / B2C</span>
            </div>

            {INVENTORY.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 50 }}
                className={`relative overflow-hidden group flex items-center justify-between p-5 bg-zinc-900/40 backdrop-blur-sm border rounded-2xl transition-all duration-300 ${
                  cart[item.id] > 0 ? "border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.05)]" : "border-zinc-800/50 hover:border-zinc-700"
                }`}
              >
                {cart[item.id] > 0 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent pointer-events-none" />
                )}

                <div className="flex items-center gap-4 relative z-10">
                  <div className={`p-3 rounded-xl transition-colors ${cart[item.id] > 0 ? "bg-amber-500/10 text-amber-500" : "bg-zinc-800 text-zinc-400"}`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-lg tracking-wide text-zinc-200 group-hover:text-white transition-colors">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-mono text-amber-400/80">₹{item.price}</span>
                      <span className="text-xs text-zinc-600 tracking-wide hidden sm:inline">• {item.desc}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-zinc-950/80 p-1 rounded-xl border border-zinc-800/50 relative z-10">
                  <button 
                    type="button" 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-2.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-all active:scale-95"
                  >
                    <Minus size={16} strokeWidth={2.5} />
                  </button>
                  <div className="w-8 text-center overflow-hidden">
                    <AnimatePresence mode="popLayout">
                      <motion.span 
                        key={cart[item.id]}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        className="block font-bold text-lg font-mono text-zinc-200"
                      >
                        {cart[item.id]}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-2.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-all active:scale-95"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-4 pt-6 relative"
          >
            <div className="flex items-center gap-2 mb-6 px-2">
              <h2 className="text-xs font-bold tracking-[0.2em] text-zinc-500 uppercase">Logistics</h2>
              <div className="h-px bg-zinc-800 flex-1" />
            </div>

            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-amber-500 transition-colors" size={20} />
              <input 
                type="text" required placeholder="Name or Business Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-zinc-900/40 border border-zinc-800/80 p-4 pl-12 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:bg-zinc-900 transition-all font-light"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-amber-500 transition-colors" size={20} />
                <input 
                  type="tel" required placeholder="WhatsApp Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-zinc-900/40 border border-zinc-800/80 p-4 pl-12 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:bg-zinc-900 transition-all font-light"
                />
              </div>

              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-amber-500 transition-colors" size={20} />
                <input 
                  type="text" required placeholder="Kochi Area (e.g. Edappally)"
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                  className="w-full bg-zinc-900/40 border border-zinc-800/80 p-4 pl-12 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:bg-zinc-900 transition-all font-light"
                />
              </div>
            </div>
          </motion.div>

          <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-[#09090b] via-[#09090b] to-transparent pointer-events-none z-50">
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
              className="max-w-xl mx-auto bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 p-2 pl-6 rounded-2xl flex items-center justify-between shadow-2xl pointer-events-auto"
            >
              <div className="text-zinc-400">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5 text-zinc-500">Estimate</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-amber-500 font-mono font-medium">₹</span>
                  <AnimatePresence mode="popLayout">
                    <motion.p 
                      key={total}
                      initial={{ opacity: 0, y: -20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="text-2xl md:text-3xl font-light text-white font-mono"
                    >
                      {total}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={total === 0 || status === "submitting"}
                className="relative overflow-hidden group bg-zinc-100 text-zinc-950 px-6 py-4 rounded-xl font-bold tracking-wide transition-all disabled:opacity-50 disabled:active:scale-100 active:scale-95 flex items-center gap-2"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
                
                {status === "submitting" ? (
                  <span className="flex items-center gap-2">Processing <div className="w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin"/></span>
                ) : (
                  <>
                    Lock In Order <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.div>
          </div>
        </form>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}

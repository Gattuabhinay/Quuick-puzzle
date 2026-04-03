/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  MapPin, 
  IndianRupee, 
  Clock, 
  ChevronRight, 
  Trophy, 
  AlertTriangle, 
  QrCode, 
  User, 
  Phone, 
  Mail, 
  Hash, 
  School, 
  Send,
  Puzzle,
  Timer,
  CheckCircle2,
  ArrowDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://dklzqwcgboolzisqngei.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrbHpxd2NnYm9vbHppc3FuZ2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNDcxNzEsImV4cCI6MjA4MzcyMzE3MX0.TEqgRDBCHGJJJsOoLdUfXlKXmnR6m_J5woumAjOtw9E'
);

// --- Types ---
interface FormData {
  college: string;
  otherCollege: string;
  fullName: string;
  rollNumber: string;
  department: string;
  year: string;
  mobile: string;
  email: string;
  member2Name: string;
  member2Roll: string;
  transactionId: string;
}

interface FormErrors {
  [key: string]: boolean;
}

// --- Constants ---
const COLLEGES = [
  "NNRG - Nalla Narasimha Reddy Education Society's Group of Institutions",
  "GCTC - Geethanjali College of Engineering and Technology",
  "KPRIT - Kommuri Pratap Reddy Institute of Technology",
  "SITS - Siddhartha Institute of Technology & Sciences",
  "ANURAG - Anurag University, Hyderabad",
  "NMREC - Nalla Malla Reddy Engineering College",
  "Other"
];

const DEPARTMENTS = ["CSE", "CSE (AI&ML)", "CSE (DS)", "ECE", "CIVIL", "IT"];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

export default function App() {
  const [formData, setFormData] = useState<FormData>({
    college: COLLEGES[0],
    otherCollege: '',
    fullName: '',
    rollNumber: '',
    department: '',
    year: '',
    mobile: '',
    email: '',
    member2Name: '',
    member2Roll: '',
    transactionId: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isShaking, setIsShaking] = useState(false);
  const [registrationCount, setRegistrationCount] = useState(0);
  const formRef = useRef<HTMLDivElement>(null);

  const fetchCount = async () => {
    const { count } = await supabase
      .from('quickpuzzle')
      .select('*', { count: 'exact', head: true });
    setRegistrationCount(count ?? 0);
  };

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    const requiredFields = ['fullName', 'rollNumber', 'department', 'year', 'mobile', 'transactionId'];
    
    if (formData.college === 'Other' && !formData.otherCollege) {
      newErrors.otherCollege = true;
    }

    requiredFields.forEach(field => {
      if (!formData[field as keyof FormData]) {
        newErrors[field] = true;
      }
    });

    if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const totalAmount = formData.member2Name.trim() !== '' ? 200 : 100;
  const personCount = formData.member2Name.trim() !== '' ? 2 : 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const collegeName = formData.college === 'Other' ? formData.otherCollege : formData.college;

      // Save to Supabase
      const { error } = await supabase
        .from('quickpuzzle')
        .insert([{
          college: collegeName,
          team_name: formData.fullName, // Using fullName as team name per instructions
          name: formData.fullName,
          roll_number: formData.rollNumber,
          department: formData.department,
          year: formData.year,
          mobile_no: formData.mobile,
          e_mail: formData.email || null,
          transaction_id: formData.transactionId,
          member2_name: formData.member2Name || null,
          member2_roll: formData.member2Roll || null
        }]);

      if (error) {
        console.error('Supabase error:', error);
      } else {
        console.log('Saved successfully!');
        fetchCount();
      }

      const message = `Hello! I have registered for *QUICK PUZZLE* event at NNRG Tech Fest 2027.

*Registration Details:*
━━━━━━━━━━━━━━━━
College: ${collegeName}
Name: ${formData.fullName}
Roll No: ${formData.rollNumber}
Department: ${formData.department}
Year: ${formData.year}
Mobile: ${formData.mobile}
Email: ${formData.email || 'Not provided'}

*Member 2:* ${formData.member2Name ? `\nName: ${formData.member2Name}\nRoll No: ${formData.member2Roll}` : 'None'}

*Payment Details:*
Amount Paid: ₹${totalAmount}
Transaction ID: ${formData.transactionId}
━━━━━━━━━━━━━━━━
Please verify my payment and confirm my registration for Quick Puzzle.
Thank you! 🙏
━━━━━━━━━━━━━━━━━━━━━━━`;

      const whatsappUrl = `https://wa.me/918309030400?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      const firstError = document.querySelector('.border-red-500');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div className="min-h-screen selection:bg-amber-500 selection:text-black">
      {/* --- HERO SECTION --- */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#0D1117]">
        {/* Layer 2: Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: 'url("https://res.cloudinary.com/djz4ulfhh/image/upload/v1774023662/puzzle_gyzp69.png")' }}
        />
        
        {/* Layer 3: Gradient Overlay */}
        <div 
          className="absolute inset-0 z-10"
          style={{ 
            background: 'linear-gradient(to bottom, rgba(13,17,23,0.5) 0%, rgba(13,17,23,0.3) 40%, rgba(13,17,23,0.92) 100%)' 
          }}
        />

        {/* Floating Snippets */}
        <div className="absolute inset-0 z-20 pointer-events-none font-mono text-[13px] text-amber-500/10">
          <span className="absolute top-[15%] left-[10%]">puzzle.solve()</span>
          <span className="absolute top-[25%] right-[15%]">timer.start()</span>
          <span className="absolute bottom-[30%] left-[20%]">if(correct) win();</span>
          <span className="absolute bottom-[40%] right-[10%]">team.compete()</span>
          <span className="absolute top-[50%] left-[5%]">fastest.wins()</span>
        </div>

        {/* Hero Content */}
        <div className="relative z-30 flex flex-col items-center text-center px-4 max-w-5xl">
          {/* Live Registration Counter */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 bg-amber-500/12 border border-amber-500/40 rounded-[50px] px-6 py-2.5 backdrop-blur-md shadow-[0_0_30px_rgba(234,179,8,0.2)] mb-5"
          >
            <div className="w-2.5 h-2.5 bg-[#EAB308] rounded-full shadow-[0_0_10px_rgba(234,179,8,0.8)] animate-pulse" />
            <span className="text-white text-[13px] font-bold tracking-[3px] uppercase">
              LIVE  •  <span className="text-[#EAB308] text-[18px] font-black">{registrationCount}</span> REGISTERED
            </span>
            <span className="text-amber-500/70 text-base">👥</span>
          </motion.div>

          <p className="text-white/35 text-[11px] mb-8 font-mono">
            visitor@nnrg:~$ ./launch quickpuzzle --year=2027
          </p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#F59E0B] text-black text-[11px] font-bold px-5 py-1.5 rounded-full tracking-[1px] mb-6"
          >
            🧩 PUZZLE COMPETITION
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[56px] md:text-[100px] font-black tracking-[-3px] leading-none mb-6"
          >
            <span className="text-white">QUICK</span>{' '}
            <span className="text-[#F59E0B] amber-glow">PUZZLE</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/60 text-base tracking-[3px] mb-12 uppercase"
          >
            Race against time. Solve the puzzle. Win.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4 md:gap-0 mb-12 text-white/90 text-[13px]"
          >
            <div className="flex items-center gap-2 px-4 border-r-0 md:border-r border-white/20">
              <Calendar className="w-4 h-4 text-[#F59E0B]" />
              <span>Feb 26, 2027</span>
            </div>
            <div className="flex items-center gap-2 px-4 border-r-0 md:border-r border-white/20">
              <Users className="w-4 h-4 text-[#F59E0B]" />
              <span>1-2 Members</span>
            </div>
            <div className="flex items-center gap-2 px-4 border-r-0 md:border-r border-white/20">
              <MapPin className="w-4 h-4 text-[#F59E0B]" />
              <span>Seminar Hall</span>
            </div>
            <div className="flex items-center gap-2 px-4">
              <IndianRupee className="w-4 h-4 text-[#F59E0B]" />
              <span>₹100/team</span>
            </div>
          </motion.div>

          <motion.a 
            href="#register"
            whileHover={{ scale: 1.02, backgroundColor: '#D97706' }}
            whileTap={{ scale: 0.98 }}
            className="w-full max-w-[500px] bg-[#F59E0B] text-black py-[18px] rounded-xl font-bold text-[15px] shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-shadow"
          >
            ↓ Register Now →
          </motion.a>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex flex-col items-center gap-1"
          >
            <p className="text-white/40 text-[10px] uppercase tracking-[4px]">Organizing by</p>
            <p className="text-[#F59E0B] font-black text-2xl md:text-3xl tracking-tight uppercase">
              AI & ML Department
            </p>
          </motion.div>

          <div className="mt-12 text-white/20 tracking-[4px] text-[10px] animate-bounce">
            ↓ SCROLL TO EXPLORE ↓
          </div>
        </div>
      </section>

      {/* --- EVENT DETAILS SECTION --- */}
      <section className="py-24 bg-[#F5F5F5] px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[36px] font-black tracking-[3px] text-[#F59E0B] text-center mb-16 uppercase">
            EVENT DETAILS
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: 'DATE', value: 'Feb 26, 2027', icon: Calendar },
              { label: 'TIME', value: '9:30 AM', icon: Clock },
              { label: 'VENUE', value: 'Seminar Hall', icon: MapPin },
              { label: 'TEAM', value: '1-2 Members', icon: Users },
              { label: 'FEE', value: '₹100 / Person', icon: IndianRupee },
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ borderColor: 'rgba(245,158,11,0.4)' }}
                className="bg-[#0D1B2A] rounded-2xl p-7 text-center border border-white/6 transition-colors"
              >
                <item.icon className="w-6 h-6 text-[#F59E0B] mx-auto mb-4" />
                <p className="text-[#9CA3AF] text-[11px] uppercase tracking-[2px] mb-1">{item.label}</p>
                <p className="text-[#F59E0B] font-bold text-base">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- EVENT PROCESS SECTION --- */}
      <section className="py-24 bg-[#F5F5F5] px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[36px] font-black tracking-[3px] text-[#F59E0B] text-center mb-4 uppercase">
            EVENT PROCESS
          </h2>
          <p className="text-[#6e7681] text-center mb-16">Three stages of the puzzle competition</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stage 1 */}
            <div className="bg-[#0D1B2A] rounded-2xl p-6 border border-white/6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[#9CA3AF] text-[9px] uppercase tracking-[1px]">STAGE 1</span>
                <span className="bg-[#F59E0B] text-black text-[11px] px-3 py-1 rounded-full font-medium">Team Formation</span>
              </div>
              <h3 className="text-[#F59E0B] text-xl font-bold mb-3">Team Formation</h3>
              <p className="text-white text-sm font-bold mb-6">Participants grouped into teams</p>
              <ul className="space-y-3">
                {['5 teams per batch', 'Competition within each team', 'Random team assignment'].map((bullet, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/70 text-sm">
                    <span className="text-[#F59E0B]">►</span> {bullet}
                  </li>
                ))}
              </ul>
            </div>

            {/* Stage 2 */}
            <div className="bg-[#0D1B2A] rounded-2xl p-6 border border-white/6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[#9CA3AF] text-[9px] uppercase tracking-[1px]">STAGE 2</span>
                <span className="bg-[#06B6D4] text-white text-[11px] px-3 py-1 rounded-full font-medium">Puzzle Selection</span>
              </div>
              <h3 className="text-[#06B6D4] text-xl font-bold mb-3">Puzzle Selection</h3>
              <p className="text-white text-sm font-bold mb-6">Random puzzle assignment</p>
              <ul className="space-y-3">
                {['Pick puzzle name from bowl', 'Different puzzle per team', 'No puzzle repetition'].map((bullet, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/70 text-sm">
                    <span className="text-[#06B6D4]">►</span> {bullet}
                  </li>
                ))}
              </ul>
            </div>

            {/* Stage 3 */}
            <div className="bg-[#0D1B2A] rounded-2xl p-6 border border-white/6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[#9CA3AF] text-[9px] uppercase tracking-[1px]">STAGE 3</span>
                <span className="bg-[#22C55E] text-white text-[11px] px-3 py-1 rounded-full font-medium">Competition</span>
              </div>
              <h3 className="text-[#22C55E] text-xl font-bold mb-3">Competition</h3>
              <p className="text-white text-sm font-bold mb-6">Solve within time limit</p>
              <ul className="space-y-3">
                {['Time tracking starts immediately', 'Fastest completion wins', 'Correct solution required'].map((bullet, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/70 text-sm">
                    <span className="text-[#22C55E]">►</span> {bullet}
                  </li>
                ))}
              </ul>
              <div className="mt-8 p-3 bg-[#22C55E]/8 border-l-3 border-[#22C55E] text-[#22C55E] text-sm font-bold">
                🏆 Fastest correct solution wins!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- EVENT RULES SECTION --- */}
      <section className="py-24 bg-[#F5F5F5] px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[36px] font-black tracking-[3px] text-[#F59E0B] text-center mb-16 uppercase">
            EVENT RULES
          </h2>

          <div className="max-w-[900px] mx-auto bg-[#0D1B2A] rounded-2xl p-8 border border-white/6">
            <div className="space-y-6">
              {[
                { id: '01', text: 'Teams consist of 1-2 participants only. No exceptions allowed.' },
                { id: '02', text: 'Puzzle assignment is completely <span class="text-[#F59E0B] font-bold">random</span>. No team can choose their own puzzle.' },
                { id: '03', text: 'Time tracking begins <span class="text-[#F59E0B] font-bold">immediately</span> after puzzle is revealed.' },
                { id: '04', text: 'The fastest team with the <span class="text-[#F59E0B] font-bold">correct solution</span> wins the round.' },
                { id: '05', text: 'No internet access or mobile phones allowed during the event.' },
                { id: '06', text: 'Partially completed puzzles will not be considered for scoring.' },
                { id: '07', text: 'Each puzzle is unique — no two teams get the same puzzle in one batch.' },
                { id: '08', text: "Judges' decision is <span class='text-[#F59E0B] font-bold'>final and binding</span> in all matters." },
              ].map((rule, i) => (
                <div key={i} className={`flex gap-6 pb-6 ${i !== 7 ? 'border-b border-white/6' : ''}`}>
                  <span className="text-[#F59E0B] font-bold text-lg">{rule.id}</span>
                  <p className="text-[#8b949e] text-[13px] leading-relaxed" dangerouslySetInnerHTML={{ __html: rule.text }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- PRIZES & REWARDS SECTION --- */}
      <section className="py-24 bg-[#F5F5F5] px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[36px] font-black tracking-[3px] text-[#F59E0B] text-center mb-16 uppercase">
            PRIZES & REWARDS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1st Place */}
            <div className="bg-[#1A1000] rounded-2xl p-7 border border-[#F59E0B]/40 text-center">
              <div className="text-[36px] mb-4">🥇</div>
              <p className="text-[#F59E0B] text-[11px] font-bold tracking-[3px] mb-1">1ST PLACE</p>
              <h3 className="text-white text-[22px] font-black mb-6">WINNER</h3>
              <div className="space-y-3 text-white/80 text-sm">
                <p>💵 Cash Prize</p>
                <p>🎖 Certificate</p>
                <p>🏆 Trophy</p>
              </div>
            </div>

            {/* 2nd Place */}
            <div className="bg-[#0D1B2A] rounded-2xl p-7 border border-[#3B82F6]/30 text-center">
              <div className="text-[36px] mb-4">🥈</div>
              <p className="text-[#60A5FA] text-[11px] font-bold tracking-[3px] mb-1">2ND PLACE</p>
              <h3 className="text-white text-[22px] font-black mb-6">RUNNER-UP</h3>
              <div className="space-y-3 text-white/80 text-sm">
                <p>💵 Cash Prize</p>
                <p>🎖 Certificate</p>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="bg-[#0D1117] rounded-2xl p-7 border border-[#9CA3AF]/30 text-center">
              <div className="text-[36px] mb-4">🥉</div>
              <p className="text-[#9CA3AF] text-[11px] font-bold tracking-[3px] mb-1">3RD PLACE</p>
              <h3 className="text-white text-[22px] font-black mb-6">FINALIST</h3>
              <div className="space-y-3 text-white/80 text-sm">
                <p>💵 Cash Prize</p>
                <p>🎖 Certificate</p>
              </div>
            </div>
          </div>

          <p className="text-[#6e7681] text-[13px] text-center mt-8">
            🎓 Every participant will receive a participation certificate
          </p>
        </div>
      </section>

      {/* --- PAYMENT DETAILS SECTION --- */}
      <section className="py-24 bg-[#F5F5F5] px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[36px] font-black tracking-[3px] text-[#F59E0B] text-center mb-16 uppercase">
            PAYMENT DETAILS
          </h2>

          <div className="max-w-[700px] mx-auto bg-[#0D1B2A] rounded-2xl p-8 border border-white/6">
            <div className="bg-[#F59E0B]/8 border-l-3 border-[#F59E0B] p-3 mb-8 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
              <p className="text-[#F59E0B] text-xs font-bold">
                ⚠ PAY FIRST, THEN FILL THE FORM | Keep your Transaction ID ready
              </p>
            </div>

            <p className="text-[#6e7681] text-[10px] tracking-[3px] text-center mb-6 uppercase">SCAN QR CODE TO PAY</p>

            <div className="flex justify-center mb-8">
              <div className="bg-white p-3 rounded-xl">
                <img 
                  src={`https://quickchart.io/qr?text=upi://pay?pa=8309030400-id8e@axl%26pn=GattuAbhinay%26am=${totalAmount}%26cu=INR%26tn=NNRG_TechFest_QuickPuzzle&size=300`} 
                  alt="Payment QR Code"
                  className="w-[260px] h-[260px]"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-[#6e7681] text-[10px] uppercase mb-1">UPI ID</p>
                <p className="text-[#F59E0B] font-bold text-sm">8309030400-id8e@axl</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-[#6e7681] text-[10px] uppercase mb-1">PHONE</p>
                <p className="text-[#F59E0B] font-bold text-sm">8309030400</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-[#6e7681] text-[10px] uppercase mb-1">NAME</p>
                <p className="text-white font-bold text-sm">GATTU ABHINAY</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-[#6e7681] text-[10px] uppercase mb-1">AMOUNT</p>
                <p className="text-[#22C55E] font-bold text-sm">₹{totalAmount}</p>
              </div>
            </div>

            <div className="p-3 bg-[#F59E0B]/6 border-l-2 border-[#F59E0B] text-[#F59E0B] text-sm">
              📋 Note: NNRG TechFest - Quick Puzzle (${personCount} Person${personCount > 1 ? 's' : ''})
            </div>
          </div>
        </div>
      </section>

      {/* --- REGISTRATION FORM SECTION --- */}
      <section id="register" className="py-24 bg-[#F5F5F5] px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[36px] font-black tracking-[3px] text-[#F59E0B] text-center mb-4 uppercase">
            REGISTRATION FORM
          </h2>
          <p className="text-[#6e7681] text-center mb-16 max-w-2xl mx-auto">
            Fill in your details below. After submission, you'll be redirected to WhatsApp to confirm your registration.
          </p>

          <div 
            ref={formRef}
            className={`max-w-[760px] mx-auto bg-[#0D1B2A] rounded-2xl p-9 border border-white/6 ${isShaking ? 'animate-shake' : ''}`}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* College Selection */}
              <div>
                <label className="block text-[#F59E0B] text-[10px] font-bold uppercase tracking-[2px] mb-2">COLLEGE *</label>
                <select 
                  name="college"
                  value={formData.college}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white text-[13px] focus:border-[#F59E0B] outline-none transition-colors"
                >
                  {COLLEGES.map(college => (
                    <option key={college} value={college} className="bg-[#0D1B2A]">{college}</option>
                  ))}
                </select>
              </div>

              {formData.college === 'Other' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <label className="block text-[#F59E0B] text-[10px] font-bold uppercase tracking-[2px] mb-2">COLLEGE NAME *</label>
                  <input 
                    type="text"
                    name="otherCollege"
                    placeholder="Enter your college name"
                    value={formData.otherCollege}
                    onChange={handleInputChange}
                    className={`w-full bg-white/5 border ${errors.otherCollege ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 text-white text-[13px] focus:border-[#F59E0B] outline-none transition-colors`}
                  />
                </motion.div>
              )}

              <div className="pt-4 border-t border-white/5">
                <h3 className="text-white font-bold text-[15px] mb-6">Participant Details</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[#F59E0B] text-[10px] font-bold uppercase tracking-[2px] mb-2">FULL NAME *</label>
                    <input 
                      type="text"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full bg-white/5 border ${errors.fullName ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 text-white text-[13px] focus:border-[#F59E0B] outline-none transition-colors`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[#F59E0B] text-[10px] font-bold uppercase tracking-[2px] mb-2">ROLL NUMBER *</label>
                      <input 
                        type="text"
                        name="rollNumber"
                        placeholder="Roll Number"
                        value={formData.rollNumber}
                        onChange={handleInputChange}
                        className={`w-full bg-white/5 border ${errors.rollNumber ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 text-white text-[13px] focus:border-[#F59E0B] outline-none transition-colors`}
                      />
                    </div>
                    <div>
                      <label className="block text-[#F59E0B] text-[10px] font-bold uppercase tracking-[2px] mb-2">DEPARTMENT *</label>
                      <select 
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className={`w-full bg-white/5 border ${errors.department ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 text-white text-[13px] focus:border-[#F59E0B] outline-none transition-colors`}
                      >
                        <option value="" className="bg-[#0D1B2A]">Select Dept</option>
                        {DEPARTMENTS.map(dept => (
                          <option key={dept} value={dept} className="bg-[#0D1B2A]">{dept}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#F59E0B] text-[10px] font-bold uppercase tracking-[2px] mb-2">YEAR *</label>
                      <select 
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        className={`w-full bg-white/5 border ${errors.year ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 text-white text-[13px] focus:border-[#F59E0B] outline-none transition-colors`}
                      >
                        <option value="" className="bg-[#0D1B2A]">Select Year</option>
                        {YEARS.map(year => (
                          <option key={year} value={year} className="bg-[#0D1B2A]">{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#F59E0B] text-[10px] font-bold uppercase tracking-[2px] mb-2">MOBILE *</label>
                      <input 
                        type="tel"
                        name="mobile"
                        placeholder="10-digit mobile number"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        className={`w-full bg-white/5 border ${errors.mobile ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 text-white text-[13px] focus:border-[#F59E0B] outline-none transition-colors`}
                      />
                    </div>
                    <div>
                      <label className="block text-[#F59E0B] text-[10px] font-bold uppercase tracking-[2px] mb-2">EMAIL (OPTIONAL)</label>
                      <input 
                        type="email"
                        name="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white text-[13px] focus:border-[#F59E0B] outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white font-bold text-[14px]">Member 2 (Optional)</h3>
                  <div className="text-[#F59E0B] text-[12px] font-bold bg-[#F59E0B]/10 px-3 py-1 rounded-full border border-[#F59E0B]/20">
                    Registration Fee: ₹{totalAmount} ({personCount} person{personCount > 1 ? 's' : ''})
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#F59E0B] text-[10px] font-bold uppercase tracking-[2px] mb-2">FULL NAME</label>
                    <input 
                      type="text"
                      name="member2Name"
                      placeholder="Enter member 2 name"
                      value={formData.member2Name}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white text-[13px] focus:border-[#F59E0B] outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[#F59E0B] text-[10px] font-bold uppercase tracking-[2px] mb-2">ROLL NUMBER</label>
                    <input 
                      type="text"
                      name="member2Roll"
                      placeholder="Roll Number"
                      value={formData.member2Roll}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white text-[13px] focus:border-[#F59E0B] outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <label className="block text-[#F59E0B] text-[10px] font-bold uppercase tracking-[2px] mb-2">TRANSACTION ID *</label>
                <input 
                  type="text"
                  name="transactionId"
                  placeholder="UPI Transaction ID after payment"
                  value={formData.transactionId}
                  onChange={handleInputChange}
                  className={`w-full bg-white/5 border ${errors.transactionId ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 text-white text-[13px] focus:border-[#F59E0B] outline-none transition-colors`}
                />
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-[#F59E0B]/6 border-l-3 border-[#F59E0B] text-[#F59E0B] text-[13px]">
                  💡 Reminder: Pay ₹{totalAmount} to UPI ID <span className="font-bold">8309030400-id8e@axl</span> first, then enter your Transaction ID above.
                </div>

                <div className="p-4 bg-[#22C55E]/6 border-l-3 border-[#22C55E] text-[#22C55E] text-[13px]">
                  🟢 On Submit: You'll be redirected to WhatsApp to send your registration details to the coordinator for confirmation.
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#F59E0B] hover:bg-[#D97706] active:scale-[0.98] text-black py-[18px] rounded-xl font-bold text-[15px] shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2"
              >
                ⊕ Submit Registration & Open WhatsApp →
              </button>

              <p className="text-[#6e7681] text-[11px] text-center">
                By submitting, you agree to the event rules and confirm that your payment has been made. All decisions by the organizing committee are final.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* --- FOOTER SECTION --- */}
      <footer className="relative py-20 px-4 overflow-hidden bg-[#0D1117]">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: 'url("https://res.cloudinary.com/djz4ulfhh/image/upload/v1774025204/nnrg_web_logo_image_vrvgoq.png")' }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <span className="text-white/3 font-black tracking-[8px] whitespace-nowrap text-[min(160px,12vw)]">
            TECH FEST 2027
          </span>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <h2 className="text-white text-[28px] font-bold text-center mb-16">NEED HELP?</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Faculty Coordinators */}
            <div>
              <h3 className="text-white/30 text-[10px] font-bold uppercase tracking-[3px] mb-6">FACULTY COORDINATORS</h3>
              <div className="space-y-2">
                {[
                  { name: 'Dr. V.V. Appaji', phone: '9949062386' },
                  { name: 'Mr. M. Eswara Rao', phone: '8143848778' },
                ].map((coord, i) => (
                  <div key={i} className="bg-[#0D1117] border border-[#21262d] rounded-md p-4 flex justify-between items-center">
                    <span className="text-white font-bold text-sm">{coord.name}</span>
                    <span className="text-gray-400 text-xs">{coord.phone}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Coordinators */}
            <div>
              <h3 className="text-white/30 text-[10px] font-bold uppercase tracking-[3px] mb-6">STUDENT COORDINATORS</h3>
              <div className="space-y-2">
                {/* Main Student Coordinator */}
                <a 
                  href="https://wa.me/918309030400"
                  target="_blank"
                  className="block bg-[#1a1200] border-l-4 border-[#F59E0B] rounded-r-md p-4 flex justify-between items-center group transition-colors"
                >
                  <div>
                    <p className="text-[#F59E0B]/60 text-[8px] font-bold uppercase mb-1">STUDENT COORDINATOR</p>
                    <p className="text-[#F59E0B] font-bold text-base">GATTU ABHINAY</p>
                  </div>
                  <span className="text-[#F59E0B] font-bold text-[13px] group-hover:translate-x-1 transition-transform">
                    8309030400 ↗
                  </span>
                </a>

                {[
                  { name: 'Nithish', phone: '6301234532' },
                  { name: 'Akhil', phone: '7281823454' },
                ].map((coord, i) => (
                  <div key={i} className="bg-[#0D1117] border border-[#21262d] rounded-md p-4 flex justify-between items-center">
                    <div>
                      <p className="text-gray-500 text-[8px] font-bold uppercase">STUDENT COORDINATOR</p>
                      <p className="text-white font-bold text-sm">{coord.name}</p>
                    </div>
                    <span className="text-gray-400 text-xs">{coord.phone}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-20 pt-4 border-t border-white/7 flex flex-col md:flex-row justify-between items-center gap-4 text-white/20 text-[10px]">
            <p>Developed by the Department CSM</p>
            <p>© 2027 NNRG Fest. All rights reserved.</p>
            <a 
              href="https://wa.me/918309030400" 
              target="_blank" 
              className="text-[#F59E0B] hover:underline"
            >
              Designed by GATTU ABHINAY ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

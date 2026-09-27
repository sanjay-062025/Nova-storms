import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Smartphone,
  CreditCard,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Building,
  GraduationCap,
  FileText,
  KeyRound,
  RotateCcw
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { StudentProfile } from '../types';

interface AuthViewProps {
  onLoginSuccess: (profile?: Partial<StudentProfile>) => void;
  onExploreGuest: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess, onExploreGuest }) => {
  const { t, language, setLanguage, languages } = useLanguage();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [signInMode, setSignInMode] = useState<'otp' | 'id'>('otp');

  // OTP Login States
  const [aadhaarOrPhone, setAadhaarOrPhone] = useState('8924 1120 4589');
  const [otpSent, setOtpSent] = useState(false);
  const [simulatedOtp, setSimulatedOtp] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(30);
  const [otpError, setOtpError] = useState('');

  // ID Login States
  const [studentId, setStudentId] = useState('ST-2026-JH-8831');
  const [password, setPassword] = useState('Scholar@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [idError, setIdError] = useState('');

  // Sign Up Form States
  const [fullName, setFullName] = useState('');
  const [tribe, setTribe] = useState('Santhal');
  const [state, setState] = useState('Jharkhand');
  const [annualIncome, setAnnualIncome] = useState('180000');
  const [college, setCollege] = useState('National Institute of Technology, Jamshedpur');
  const [course, setCourse] = useState('B.Tech in Computer Science & Engineering');
  const [signupAadhaar, setSignupAadhaar] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [consentChecked, setConsentChecked] = useState(true);
  const [signupError, setSignupError] = useState('');

  // OTP Countdown timer
  React.useEffect(() => {
    let interval: any = null;
    if (otpSent && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpSent, otpTimer]);

  const handleSendOtp = () => {
    if (!aadhaarOrPhone.trim()) {
      setOtpError('Please enter a valid Aadhaar or mobile number');
      return;
    }
    setOtpError('');
    const genOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedOtp(genOtp);
    setOtpSent(true);
    setOtpTimer(30);
    // Pre-fill for convenience
    setEnteredOtp(genOtp.split(''));
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const newOtp = [...enteredOtp];
    newOtp[index] = val;
    setEnteredOtp(newOtp);

    // Auto focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const code = enteredOtp.join('');
    if (code.length < 6) {
      setOtpError('Please enter all 6 digits of the OTP');
      return;
    }
    onLoginSuccess();
  };

  const handleSignInWithId = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim() || !password.trim()) {
      setIdError('Please enter your Unified Student ID and Password');
      return;
    }
    onLoginSuccess();
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setSignupError('Please enter your Full Name');
      return;
    }
    if (!signupPassword.trim()) {
      setSignupError('Please choose a password');
      return;
    }
    if (!consentChecked) {
      setSignupError('Please consent to DigiLocker and e-KYC verification');
      return;
    }

    const newStudentId = `ST-2026-${state.substring(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newProfile: Partial<StudentProfile> = {
      name: fullName,
      studentId: newStudentId,
      id: newStudentId,
      tribe: tribe,
      subTribe: tribe,
      state: state,
      domicile: state,
      annualFamilyIncome: parseInt(annualIncome) || 180000,
      annualIncome: parseInt(annualIncome) || 180000,
      institution: college,
      college: college,
      currentCourse: course,
      aadhaarMask: signupAadhaar ? `XXXX-XXXX-${signupAadhaar.slice(-4)}` : 'XXXX-XXXX-8924',
      phoneMask: signupPhone ? `+91 ${signupPhone.slice(0, 2)}XXX-XX${signupPhone.slice(-3)}` : '+91 98XXX-XX412'
    };

    onLoginSuccess(newProfile);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between text-slate-100 relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Tricolor National Government Strip */}
      <div className="h-1.5 w-full flex sticky top-0 z-50">
        <div className="w-1/3 bg-[#FF9933]"></div>
        <div className="w-1/3 bg-white"></div>
        <div className="w-1/3 bg-[#138808]"></div>
      </div>

      {/* Header Bar */}
      <header className="px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex items-center justify-center font-serif font-bold text-xl shadow-xs">
            🏛️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400">
                {t('gov_india')}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">
                SIH26238
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-none mt-0.5">
              {t('mota_title')} <span className="text-slate-400 font-normal hidden sm:inline">| {t('mota_sub')}</span>
            </h1>
          </div>
        </div>

        {/* Language Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline">{t('select_language')}:</span>
          <div className="flex items-center bg-slate-800/90 rounded-xl p-1 border border-slate-700">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  language === l.code
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
                title={l.label}
              >
                {l.badge}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-xl bg-slate-950/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl space-y-6">
          {/* Portal Title & Motto */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Ministry of Tribal Affairs Official Authentication Gateway</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {t('auth_portal_title')}
            </h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {t('auth_tagline')}
            </p>
          </div>

          {/* Tab Switcher: Sign In vs Sign Up */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              id="tab-btn-signin"
              onClick={() => setActiveTab('signin')}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'signin'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('tab_sign_in')}
            </button>
            <button
              id="tab-btn-signup"
              onClick={() => setActiveTab('signup')}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('tab_sign_up')}
            </button>
          </div>

          {/* =========================================================================
              SIGN IN TAB
             ========================================================================= */}
          {activeTab === 'signin' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Quick 1-Click Demo Login Banner (For SIH Jury & Reviewers) */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/40 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0 ring-2 ring-emerald-400/30">
                      S
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">Sanjay Kumar</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">
                          ST Verified
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-300">
                        NIT Jamshedpur • B.Tech CSE (3rd Yr) • Unified ID: ST-2026-JH-8831
                      </p>
                    </div>
                  </div>

                  <button
                    id="btn-quick-demo-login"
                    onClick={() => onLoginSuccess()}
                    className="whitespace-nowrap px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Quick Login</span>
                  </button>
                </div>
              </div>

              {/* Sign In Mode Selector: Aadhaar OTP vs Student ID */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={() => setSignInMode('otp')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    signInMode === 'otp'
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t('login_mode_otp')}</span>
                </button>
                <span className="text-slate-600">•</span>
                <button
                  onClick={() => setSignInMode('id')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    signInMode === 'id'
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{t('login_mode_id')}</span>
                </button>
              </div>

              {/* MODE A: Aadhaar / Mobile OTP */}
              {signInMode === 'otp' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {t('enter_aadhaar_phone')}
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={aadhaarOrPhone}
                        onChange={(e) => setAadhaarOrPhone(e.target.value)}
                        placeholder="e.g. 8924 1120 4589 or 9876543210"
                        className="w-full pl-10 pr-24 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        {otpSent ? 'Resend' : t('btn_send_otp')}
                      </button>
                    </div>
                  </div>

                  {/* Simulated OTP Notification Banner */}
                  {otpSent && (
                    <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2 animate-in fade-in">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Simulated e-KYC SMS Received</p>
                        <p className="text-[11px] text-amber-200 mt-0.5">
                          Your MoTA e-KYC verification code is{' '}
                          <span className="font-mono font-extrabold text-white bg-slate-900 px-1.5 py-0.5 rounded">
                            {simulatedOtp}
                          </span>
                          . Valid for 10 minutes.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 6-digit OTP Inputs */}
                  {otpSent && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-slate-300">
                          {t('enter_otp')}
                        </label>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {otpTimer > 0 ? `${t('resend_otp_in')} ${otpTimer}s` : (
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              className="text-amber-400 hover:underline font-bold"
                            >
                              {t('btn_resend_otp')}
                            </button>
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between gap-2">
                        {enteredOtp.map((digit, idx) => (
                          <input
                            key={idx}
                            id={`otp-input-${idx}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            className="w-11 sm:w-12 h-12 text-center text-lg font-bold font-mono bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {otpError && (
                    <p className="text-xs text-rose-400 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" /> {otpError}
                    </p>
                  )}

                  <button
                    id="btn-verify-signin-otp"
                    type="button"
                    onClick={otpSent ? handleVerifyOtp : handleSendOtp}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{otpSent ? t('btn_verify_signin') : t('btn_send_otp')}</span>
                  </button>
                </div>
              )}

              {/* MODE B: Student ID & Password */}
              {signInMode === 'id' && (
                <form onSubmit={handleSignInWithId} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {t('enter_student_id')}
                    </label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="e.g. ST-2026-JH-8831"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {t('enter_password')}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {idError && (
                    <p className="text-xs text-rose-400 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" /> {idError}
                    </p>
                  )}

                  <button
                    id="btn-signin-id"
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{t('btn_signin_id')}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* =========================================================================
              SIGN UP TAB (New ST Student Registration)
             ========================================================================= */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t('signup_name')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra Murmu"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Tribal Community */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t('signup_tribe')} *
                  </label>
                  <select
                    value={tribe}
                    onChange={(e) => setTribe(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Santhal">Santhal (ᱥᱟᱱᱛᱟᱲ)</option>
                    <option value="Munda">Munda (मुंडा)</option>
                    <option value="Oraon">Oraon / Kurukh (उरांव)</option>
                    <option value="Gond">Gond (गोंड)</option>
                    <option value="Bodo">Bodo (बड़ो)</option>
                    <option value="Khasi">Khasi (खासी)</option>
                    <option value="Bhil">Bhil (भील)</option>
                    <option value="Ho">Ho (हो)</option>
                    <option value="PVTG">PVTG (Particularly Vulnerable Tribal Group)</option>
                    <option value="Other ST">Other Recognized ST Community</option>
                  </select>
                </div>

                {/* State of Domicile */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t('signup_state')} *
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Assam">Assam</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                  </select>
                </div>

                {/* Annual Income */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t('signup_income')} *
                  </label>
                  <input
                    type="number"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value)}
                    placeholder="e.g. 180000"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t('signup_phone')} *
                  </label>
                  <input
                    type="tel"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* College / Institution */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t('signup_college')} *
                  </label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. NIT Jamshedpur or Ranchi University"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Course Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t('signup_course')} *
                  </label>
                  <input
                    type="text"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    placeholder="e.g. B.Tech Computer Science (3rd Year)"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Password */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t('signup_password')} *
                  </label>
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Choose a secure password"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Consent Checkbox */}
              <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-[11px] leading-relaxed text-slate-400">
                  {t('signup_consent')}
                </span>
              </label>

              {signupError && (
                <p className="text-xs text-rose-400 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {signupError}
                </p>
              )}

              <button
                id="btn-signup-submit"
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('btn_register_submit')}</span>
              </button>
            </form>
          )}

          {/* Footer Guest Entry */}
          <div className="pt-2 border-t border-slate-800 text-center">
            <button
              id="btn-explore-as-guest"
              onClick={onExploreGuest}
              className="text-xs text-slate-400 hover:text-amber-400 font-semibold transition-colors cursor-pointer"
            >
              {t('explore_as_guest')} →
            </button>
          </div>
        </div>
      </main>

      {/* Government Footer */}
      <footer className="py-3 px-4 text-center border-t border-slate-800/80 text-[11px] text-slate-500 relative z-10 bg-slate-950/80">
        <p>
          Ministry of Tribal Affairs, Government of India • Smart India Hackathon 2026 (SIH26238)
        </p>
        <p className="text-[10px] text-slate-600 mt-0.5">
          Complies with MeitY e-Governance standards, UIDAI Aadhaar e-KYC guidelines & Digilocker API protocols.
        </p>
      </footer>
    </div>
  );
};

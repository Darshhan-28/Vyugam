import React, { useState } from 'react';
import { X, Zap, Upload, CheckCircle, QrCode, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import upiQrImg from '../assets/upi-qr.png';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

// API endpoint — real backend

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    year: '',
    dept: '',
    utrId: '',
  });
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [paymentProofName, setPaymentProofName] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please enter your full name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
      errs.email = 'Please enter a valid email address';
    if (!/^[0-9]{10}$/.test(formData.phone.trim()))
      errs.phone = 'Please enter a valid 10-digit mobile number';
    if (!formData.college.trim()) errs.college = 'Please enter your college name';
    if (!formData.year) errs.year = 'Please select your year of study';
    if (!formData.dept.trim()) errs.dept = 'Please enter your department';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    } else {
      onShowToast('Please fix the errors before continuing', 'error');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      onShowToast('File size must be under 3MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setPaymentProof(ev.target?.result as string);
      setPaymentProofName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Extract base64 content and mime type separately for the API
      let screenshotBase64: string | null = null;
      let screenshotType: string | null = null;
      if (paymentProof) {
        const match = paymentProof.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          screenshotType = match[1];
          screenshotBase64 = match[2];
        }
      }

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          college: formData.college,
          department: formData.dept,
          year: formData.year,
          utr: formData.utrId || null,
          screenshotBase64,
          screenshotType,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Duplicate email or validation error
        onShowToast(result.error || 'Registration failed. Please try again.', 'error');
        setIsSubmitting(false);
        return;
      }

      // Success
      setIsSuccess(true);

      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FDB515', '#FF4A12', '#C1121F'],
      });
    } catch {
      onShowToast('Network error. Please check your connection and try again.', 'error');
    }

    setIsSubmitting(false);
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', phone: '', college: '', year: '', dept: '', utrId: '' });
    setPaymentProof(null);
    setPaymentProofName('');
    setErrors({});
    setStep(1);
    setIsSuccess(false);
  };

  const inputClass = (field: string) =>
    `w-full bg-carbon text-smoke border-2 p-3 font-body outline-none focus:border-marigold transition-colors ${
      errors[field] ? 'border-red-500' : 'border-carbon-2'
    }`;

  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-obsidian/95 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-obsidian border-2 sm:border-4 border-marigold p-4 sm:p-8 shadow-[6px_6px_0_#7A0606] sm:shadow-[10px_10px_0_#7A0606] my-auto max-h-[92vh] overflow-y-auto scrollbar-thin">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 text-cream hover:text-marigold p-2 font-bold z-10 bg-carbon/90 rounded-full border border-marigold/40 transition-colors"
          aria-label="Close registration modal"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {!isSuccess ? (
          <>
            {/* Header */}
            <div className="text-center mb-6 pt-6 sm:pt-0">
              <span className="font-heading font-extrabold text-xs uppercase tracking-widest bg-marigold text-obsidian px-4 py-1 clip-polygon inline-block mb-3">
                {step === 1 ? 'Step 1 of 2' : 'Step 2 of 2'}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl text-smoke uppercase">
                GET YOUR VYUGAM PASS
              </h2>
              <p className="font-mono text-xs text-mustard mt-1 tracking-wider uppercase">
                {step === 1 ? 'Your Details' : 'Secure Your Pass'}
              </p>

              {/* Step indicator */}
              <div className="flex items-center justify-center gap-2 mt-3">
                <div className={`w-8 h-1 transition-colors ${step === 1 ? 'bg-marigold' : 'bg-marigold'}`} />
                <div className={`w-8 h-1 transition-colors ${step === 2 ? 'bg-marigold' : 'bg-carbon-2'}`} />
              </div>
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <form onSubmit={handleStep1Next} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-heading font-bold text-xs uppercase text-marigold mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Arjun Krishnan"
                      className={inputClass('name')}
                    />
                    {errors.name && <p className="font-mono text-xs text-red-400 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block font-heading font-bold text-xs uppercase text-marigold mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. arjun@college.edu"
                      className={inputClass('email')}
                    />
                    {errors.email && <p className="font-mono text-xs text-red-400 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-heading font-bold text-xs uppercase text-marigold mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="10-digit Mobile Number"
                      className={inputClass('phone')}
                    />
                    {errors.phone && <p className="font-mono text-xs text-red-400 mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block font-heading font-bold text-xs uppercase text-marigold mb-1">College / Institution *</label>
                    <input
                      type="text"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      placeholder="Your College Name"
                      className={inputClass('college')}
                    />
                    {errors.college && <p className="font-mono text-xs text-red-400 mt-1">{errors.college}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-heading font-bold text-xs uppercase text-marigold mb-1">Year of Study *</label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className={inputClass('year')}
                    >
                      <option value="">-- Select Year --</option>
                      <option value="I Year">I Year</option>
                      <option value="II Year">II Year</option>
                      <option value="III Year">III Year</option>
                      <option value="IV Year">IV Year</option>
                    </select>
                    {errors.year && <p className="font-mono text-xs text-red-400 mt-1">{errors.year}</p>}
                  </div>
                  <div>
                    <label className="block font-heading font-bold text-xs uppercase text-marigold mb-1">Department / Branch *</label>
                    <input
                      type="text"
                      value={formData.dept}
                      onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                      placeholder="e.g. IT, CSE, ECE"
                      className={inputClass('dept')}
                    />
                    {errors.dept && <p className="font-mono text-xs text-red-400 mt-1">{errors.dept}</p>}
                  </div>
                </div>

                <p className="font-mono text-[11px] text-red-400 font-bold bg-red-500/10 border border-red-500/30 px-3 py-2 rounded flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  Pass registration closes on 19 September 2026
                </p>

                <button
                  type="submit"
                  className="w-full mt-1 font-display text-xl tracking-wider uppercase text-obsidian bg-marigold border-3 border-obsidian py-4 shadow-[5px_5px_0_#C1121F] hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#C1121F] active:translate-y-0 transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5 fill-current" />
                  Continue to Payment
                </button>
              </form>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Pass Display */}
                <div className="bg-carbon border-2 border-marigold p-5 shadow-[5px_5px_0_#7A0606] relative overflow-hidden">
                  {/* Pass decorative stripe */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-ember via-marigold to-ember" />
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-mustard">VYUGAM SYMPOSIUM PASS</p>
                      <p className="font-display text-3xl text-marigold leading-none">₹200</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-mustard">One Pass. Five+ Arenas.</p>
                      <p className="font-heading font-extrabold text-sm text-smoke uppercase">24 Sept 2026</p>
                    </div>
                  </div>
                  <div className="border-t border-dashed border-marigold/40 pt-3 font-mono text-xs text-cream/70 flex items-center justify-between">
                    <span>{formData.name || 'Participant'}</span>
                    <span className="text-marigold font-bold">IT DEPT · PACET</span>
                  </div>
                </div>

                {/* QR Section */}
                <div className="bg-obsidian border-2 border-marigold/60 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <QrCode className="w-5 h-5 text-marigold" />
                    <span className="font-heading font-extrabold text-sm uppercase tracking-wider text-smoke">Scan & Pay ₹200</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                    <div className="flex-shrink-0 border-2 border-marigold p-2 bg-white shadow-[4px_4px_0_#7A0606]">
                      <img
                        src={upiQrImg}
                        alt="VYUGAM UPI QR Code for payment"
                        className="w-32 h-32 object-contain"
                        onError={(e) => {
                          // Fallback placeholder or retry root asset if QR fails
                          const target = e.target as HTMLImageElement;
                          if (target.src !== '/upi-qr.png' && !target.src.endsWith('/upi-qr.png')) {
                            target.src = '/upi-qr.png';
                            return;
                          }
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent && !parent.querySelector('.qr-fallback')) {
                            const fb = document.createElement('div');
                            fb.className = 'qr-fallback w-32 h-32 bg-carbon flex items-center justify-center text-center p-2';
                            fb.innerHTML = '<span style="color:#FDB515;font-size:10px;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em">QR Code<br/>Coming Soon</span>';
                            parent.appendChild(fb);
                          }
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-body text-sm text-cream/90 leading-relaxed">
                        Scan using <span className="text-marigold font-bold">Google Pay</span> or any UPI app and complete the ₹200 payment.
                      </p>
                      <p className="font-mono text-xs text-mustard mt-2 uppercase tracking-wider">
                        Amount: ₹200 · One-time · Full symposium access
                      </p>
                    </div>
                  </div>
                </div>

                {/* Upload Screenshot */}
                <div>
                  <label className="block font-heading font-bold text-xs uppercase text-marigold mb-2">
                    Upload Payment Screenshot <span className="text-mustard/60 normal-case font-normal">(recommended)</span>
                  </label>
                  <label
                    htmlFor="payment-proof"
                    className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-marigold/50 hover:border-marigold bg-carbon/50 p-5 cursor-pointer transition-all group"
                  >
                    {paymentProofName ? (
                      <>
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                        <span className="font-mono text-xs text-emerald-400 font-bold">{paymentProofName}</span>
                        <span className="font-mono text-[10px] text-mustard/60 uppercase">Click to replace</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-marigold/60 group-hover:text-marigold transition-colors" />
                        <span className="font-mono text-xs uppercase tracking-wider text-cream/60 group-hover:text-cream transition-colors">
                          Click to upload screenshot
                        </span>
                        <span className="font-mono text-[10px] text-mustard/50 uppercase">PNG, JPG · Max 3MB</span>
                      </>
                    )}
                    <input
                      id="payment-proof"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>

                {/* UTR */}
                <div>
                  <label className="block font-heading font-bold text-xs uppercase text-marigold mb-1">
                    UPI Transaction ID / UTR <span className="text-mustard/60 normal-case font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.utrId}
                    onChange={(e) => setFormData({ ...formData, utrId: e.target.value })}
                    placeholder="e.g. 426789123456"
                    className="w-full bg-carbon text-smoke border-2 border-carbon-2 p-3 font-body outline-none focus:border-marigold transition-colors"
                  />
                </div>

                <p className="font-mono text-[11px] text-cream/50 bg-carbon/40 border border-marigold/20 px-3 py-2 rounded text-center">
                  Payment is collected through UPI. Your pass is issued after manual verification by the VYUGAM team.
                </p>

                <div className="flex flex-col xs:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="font-heading font-bold text-sm uppercase tracking-wider text-marigold border-2 border-marigold px-5 py-3 hover:bg-marigold hover:text-obsidian transition-colors xs:w-auto"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 font-display text-xl tracking-wider uppercase text-obsidian bg-marigold border-3 border-obsidian py-4 shadow-[5px_5px_0_#C1121F] hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#C1121F] active:translate-y-0 disabled:opacity-60 transition-all"
                  >
                    {isSubmitting ? 'Submitting...' : '⚡ Submit for Verification'}
                  </button>
                </div>
              </form>
            )}
          </>
        ) : (
          /* Submission Confirmation */
          <div className="text-center py-4 pt-10 sm:pt-4">
            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-carbon border-2 border-marigold flex items-center justify-center mx-auto mb-5 shadow-[0_0_24px_rgba(253,181,21,0.35)]">
              <CheckCircle className="w-8 h-8 text-marigold" />
            </div>

            <span className="font-heading font-extrabold text-xs uppercase tracking-widest bg-marigold/20 text-marigold border border-marigold/50 px-4 py-1 inline-block mb-3">
              Payment Submitted
            </span>

            <h3 className="font-display text-2xl sm:text-3xl text-smoke uppercase mb-2">
              Registration Received
            </h3>

            <p className="font-body text-sm text-cream/80 max-w-sm mx-auto mb-6 leading-relaxed">
              Your registration and payment proof have been received. Your payment is now <span className="text-marigold font-bold">pending manual verification</span> by the VYUGAM team.
            </p>

            {/* What happens next */}
            <div className="bg-carbon border-2 border-marigold/40 p-4 sm:p-5 text-left font-mono text-xs text-cream/80 space-y-3 mb-6 shadow-inner">
              <p className="text-marigold font-bold uppercase tracking-wider text-[11px] mb-2">What happens next?</p>
              {[
                'Your payment proof will be reviewed by the VYUGAM team.',
                'Once verified, your personalized VYUGAM Pass will be sent to your registered email.',
                'Please check your Spam / Junk folder if you do not see the pass email in your Inbox.',
                'Save the pass on your phone and bring it to the symposium on 24 September 2026.',
                'Event coordinators will scan your pass QR before you enter participating arenas.',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-marigold font-bold flex-shrink-0">{i + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            <div className="bg-obsidian border border-marigold/30 px-4 py-3 mb-6">
              <p className="font-mono text-[11px] text-mustard/70 uppercase tracking-wider">
                Pass will be sent to: <span className="text-cream font-bold">{formData.email}</span>
              </p>
              <p className="font-mono text-[10px] text-amber-400 mt-1 uppercase tracking-wider">
                💡 Tip: Check your Spam / Junk folder if the email is not in your Inbox after verification.
              </p>
            </div>

            <button
              onClick={handleReset}
              className="font-heading font-bold text-sm uppercase tracking-wider text-marigold border-2 border-marigold px-6 py-2.5 hover:bg-marigold hover:text-obsidian transition-colors"
            >
              Register Another Delegate
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

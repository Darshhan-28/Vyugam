import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventTrack } from '../data/events';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTrack?: EventTrack | null;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwiwKcyftHjhj_tkzZxl1oF1r9cMiyqBY_uDnrYYaVAXC0mbpBRIGAgwNEwTNdgkbtFOw/exec';

interface TeamMember {
  name: string;
  email: string;
  phone: string;
}

const getMemberCountFromTeamSize = (sizeStr: string): number => {
  if (sizeStr.includes('Team of 4')) return 3;
  if (sizeStr.includes('Team of 3')) return 2;
  if (sizeStr.includes('Team of 2')) return 1;
  return 0;
};

const getTeamOptionsForEvent = (eventName: string) => {
  if (eventName.includes('Tech Tactics')) {
    return [
      { label: 'Individual (1 Member)', value: 'Individual (1 Member)' },
      { label: 'Team of 2', value: 'Team of 2' },
      { label: 'Team of 3', value: 'Team of 3' },
      { label: 'Team of 4', value: 'Team of 4' },
    ];
  }
  return [
    { label: 'Individual (1 Member)', value: 'Individual (1 Member)' },
  ];
};

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  selectedTrack,
  onShowToast,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    year: '',
    dept: '',
    event: '',
    teamSize: 'Individual (1 Member)',
    message: '',
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const syncTeamMembers = (teamSizeStr: string) => {
    const targetCount = getMemberCountFromTeamSize(teamSizeStr);
    setTeamMembers((prev) => {
      if (prev.length === targetCount) return prev;
      if (prev.length < targetCount) {
        const added = Array.from({ length: targetCount - prev.length }, () => ({
          name: '',
          email: '',
          phone: '',
        }));
        return [...prev, ...added];
      }
      return prev.slice(0, targetCount);
    });
  };

  useEffect(() => {
    if (selectedTrack) {
      const options = getTeamOptionsForEvent(selectedTrack.title);
      const initialSize = options[0].value;
      setFormData((prev) => ({
        ...prev,
        event: selectedTrack.title,
        teamSize: initialSize,
      }));
      syncTeamMembers(initialSize);
    }
  }, [selectedTrack]);

  const handleEventChange = (eventName: string) => {
    const options = getTeamOptionsForEvent(eventName);
    const newSize = options[0].value;
    setFormData((prev) => ({
      ...prev,
      event: eventName,
      teamSize: newSize,
    }));
    syncTeamMembers(newSize);
  };

  const handleTeamSizeChange = (sizeStr: string) => {
    setFormData((prev) => ({ ...prev, teamSize: sizeStr }));
    syncTeamMembers(sizeStr);
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    setTeamMembers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please enter your full name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
      errs.email = 'Please enter a valid email address';
    if (!/^[0-9]{10}$/.test(formData.phone.trim()))
      errs.phone = 'Please enter a valid 10-digit mobile number';
    if (!formData.college.trim()) errs.college = 'Please enter your college name';
    if (!formData.year) errs.year = 'Please select your year of study';
    if (!formData.dept.trim()) errs.dept = 'Please enter your department';
    if (!formData.event) errs.event = 'Please select an event track';

    teamMembers.forEach((m, idx) => {
      if (!m.name.trim()) {
        errs[`member_${idx}_name`] = `Please enter Member ${idx + 2}'s full name`;
      }
      if (m.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email.trim())) {
        errs[`member_${idx}_email`] = `Valid email required for Member ${idx + 2}`;
      }
      if (m.phone.trim() && !/^[0-9]{10}$/.test(m.phone.trim())) {
        errs[`member_${idx}_phone`] = `10-digit phone required for Member ${idx + 2}`;
      }
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      onShowToast('Please fix errors in the form', 'error');
      return;
    }

    setIsSubmitting(true);

    const formattedTeamMembers = teamMembers
      .map((m, idx) => `Member ${idx + 2}: ${m.name}${m.email ? ` (${m.email})` : ''}${m.phone ? ` [${m.phone}]` : ''}`)
      .join('; ');

    const payload = {
      ...formData,
      teamMembers: formattedTeamMembers,
    };

    // Instant ticket confirmation
    setIsSuccess(true);
    setIsSubmitting(false);

    // Trigger Confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FDB515', '#FF4A12', '#C1121F'],
    });

    onShowToast('Registration successful!', 'success');

    // Fire & Forget Background POST to Google Sheets
    if (SCRIPT_URL) {
      fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      }).catch((err) => {
        console.error('Background submission error:', err);
      });
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      college: '',
      year: '',
      dept: '',
      event: '',
      teamSize: 'Individual (1 Member)',
      message: '',
    });
    setTeamMembers([]);
    setIsSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-obsidian/95 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-obsidian border-2 sm:border-4 border-marigold p-4 sm:p-8 shadow-[6px_6px_0_#7A0606] sm:shadow-[10px_10px_0_#7A0606] my-auto max-h-[92vh] overflow-y-auto scrollbar-thin">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 text-cream hover:text-marigold p-2 font-bold z-10 bg-carbon/90 sm:bg-transparent rounded-full border border-marigold/40 sm:border-none"
          aria-label="Close registration modal"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {!isSuccess ? (
          <div>
            <div className="text-center mb-6 sm:mb-8 pt-6 sm:pt-0">
              <span className="font-heading font-extrabold text-xs uppercase tracking-widest bg-marigold text-obsidian px-4 py-1 clip-polygon inline-block mb-2">
                Register Free
              </span>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-smoke uppercase">
                Claim Your Spot In The Arena
              </h2>
              <p className="font-body text-sm text-cream/80 mt-1">
                No entry fee. No catch. Fill out your details below.
              </p>
              <p className="font-mono text-xs text-red-400 font-bold bg-red-500/10 border border-red-500/30 px-3 py-2 rounded mt-3 inline-block">
                ⚠️ Registration closes on 17 September 2026
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-heading font-bold text-xs uppercase text-marigold mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Doe"
                    className={`w-full bg-carbon text-smoke border-2 p-3 font-body outline-none focus:border-marigold ${
                      errors.name ? 'border-red-500' : 'border-carbon-2'
                    }`}
                  />
                  {errors.name && <p className="font-mono text-xs text-red-400 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block font-heading font-bold text-xs uppercase text-marigold mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. john@college.edu"
                    className={`w-full bg-carbon text-smoke border-2 p-3 font-body outline-none focus:border-marigold ${
                      errors.email ? 'border-red-500' : 'border-carbon-2'
                    }`}
                  />
                  {errors.email && <p className="font-mono text-xs text-red-400 mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-heading font-bold text-xs uppercase text-marigold mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit Mobile Number"
                    className={`w-full bg-carbon text-smoke border-2 p-3 font-body outline-none focus:border-marigold ${
                      errors.phone ? 'border-red-500' : 'border-carbon-2'
                    }`}
                  />
                  {errors.phone && <p className="font-mono text-xs text-red-400 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block font-heading font-bold text-xs uppercase text-marigold mb-1">
                    College / Institution *
                  </label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    placeholder="Your College Name"
                    className={`w-full bg-carbon text-smoke border-2 p-3 font-body outline-none focus:border-marigold ${
                      errors.college ? 'border-red-500' : 'border-carbon-2'
                    }`}
                  />
                  {errors.college && <p className="font-mono text-xs text-red-400 mt-1">{errors.college}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-heading font-bold text-xs uppercase text-marigold mb-1">
                    Year of Study *
                  </label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className={`w-full bg-carbon text-smoke border-2 p-3 font-body outline-none focus:border-marigold ${
                      errors.year ? 'border-red-500' : 'border-carbon-2'
                    }`}
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
                  <label className="block font-heading font-bold text-xs uppercase text-marigold mb-1">
                    Department / Branch *
                  </label>
                  <input
                    type="text"
                    value={formData.dept}
                    onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                    placeholder="e.g. IT, CSE, ECE"
                    className={`w-full bg-carbon text-smoke border-2 p-3 font-body outline-none focus:border-marigold ${
                      errors.dept ? 'border-red-500' : 'border-carbon-2'
                    }`}
                  />
                  {errors.dept && <p className="font-mono text-xs text-red-400 mt-1">{errors.dept}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-heading font-bold text-xs uppercase text-marigold mb-1">
                    Event Track *
                  </label>
                  <select
                    value={formData.event}
                    onChange={(e) => handleEventChange(e.target.value)}
                    className={`w-full bg-carbon text-smoke border-2 p-3 font-body outline-none focus:border-marigold ${
                      errors.event ? 'border-red-500' : 'border-carbon-2'
                    }`}
                  >
                    <option value="">-- Select Event Track --</option>
                    <option value="Code Crusade">Code Crusade (Coding Challenge)</option>
                    <option value="Logic Arena">Logic Arena (Quiz Competition)</option>
                    <option value="UI/UX Studio">UI/UX Studio (Design Challenge)</option>
                    <option value="Tech Tactics">Tech Tactics (Paper Presentation)</option>
                    <option value="Pixel Pulse">Pixel Pulse (Poster Design)</option>
                  </select>
                  {errors.event && <p className="font-mono text-xs text-red-400 mt-1">{errors.event}</p>}
                </div>

                <div>
                  <label className="block font-heading font-bold text-xs uppercase text-marigold mb-1">
                    Team Participation
                  </label>
                  <select
                    value={formData.teamSize}
                    onChange={(e) => handleTeamSizeChange(e.target.value)}
                    className="w-full bg-carbon text-smoke border-2 border-carbon-2 p-3 font-body outline-none focus:border-marigold"
                  >
                    {getTeamOptionsForEvent(formData.event).map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {teamMembers.length > 0 && (
                <div className="border-2 border-marigold/40 bg-carbon/50 p-4 space-y-4 rounded">
                  <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-marigold">
                    Additional Team Member Details
                  </h4>
                  {teamMembers.map((member, index) => (
                    <div key={index} className="space-y-2 border-t border-carbon-2 pt-3">
                      <span className="font-heading font-bold text-xs text-smoke uppercase">
                        Member {index + 2} Details
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <input
                            type="text"
                            placeholder={`Member ${index + 2} Full Name *`}
                            value={member.name}
                            onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                            className={`w-full bg-carbon text-smoke border-2 p-2.5 text-xs font-body outline-none focus:border-marigold ${
                              errors[`member_${index}_name`] ? 'border-red-500' : 'border-carbon-2'
                            }`}
                          />
                          {errors[`member_${index}_name`] && (
                            <p className="font-mono text-[10px] text-red-400 mt-1">
                              {errors[`member_${index}_name`]}
                            </p>
                          )}
                        </div>
                        <div>
                          <input
                            type="email"
                            placeholder={`Member ${index + 2} Email`}
                            value={member.email}
                            onChange={(e) => updateTeamMember(index, 'email', e.target.value)}
                            className={`w-full bg-carbon text-smoke border-2 p-2.5 text-xs font-body outline-none focus:border-marigold ${
                              errors[`member_${index}_email`] ? 'border-red-500' : 'border-carbon-2'
                            }`}
                          />
                          {errors[`member_${index}_email`] && (
                            <p className="font-mono text-[10px] text-red-400 mt-1">
                              {errors[`member_${index}_email`]}
                            </p>
                          )}
                        </div>
                        <div>
                          <input
                            type="tel"
                            placeholder={`Member ${index + 2} Phone`}
                            value={member.phone}
                            onChange={(e) => updateTeamMember(index, 'phone', e.target.value)}
                            className={`w-full bg-carbon text-smoke border-2 p-2.5 text-xs font-body outline-none focus:border-marigold ${
                              errors[`member_${index}_phone`] ? 'border-red-500' : 'border-carbon-2'
                            }`}
                          />
                          {errors[`member_${index}_phone`] && (
                            <p className="font-mono text-[10px] text-red-400 mt-1">
                              {errors[`member_${index}_phone`]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="block font-heading font-bold text-xs uppercase text-marigold mb-1">
                  Additional Note / Query (Optional)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Any questions or special requirements?"
                  rows={2}
                  className="w-full bg-carbon text-smoke border-2 border-carbon-2 p-3 font-body outline-none focus:border-marigold"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 font-display text-xl tracking-wider uppercase text-obsidian bg-marigold border-3 border-obsidian py-4 shadow-[5px_5px_0_#C1121F] hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#C1121F] active:translate-y-0 disabled:opacity-60 transition-all"
              >
                {isSubmitting ? 'Submitting Registration...' : '⚡ Complete Registration'}
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation Ticket Pass */
          <div className="text-center py-4 pt-10 sm:pt-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-marigold text-obsidian flex items-center justify-center mx-auto mb-4 text-2xl sm:text-3xl font-bold shadow-[0_0_20px_rgba(253,181,21,0.6)]">
              ✓
            </div>
            <h3 className="font-display text-2xl sm:text-3xl text-marigold uppercase mb-2">
              Registration Confirmed!
            </h3>
            <p className="font-body text-sm text-smoke mb-6">
              Welcome to VYUGAM 2.0. Your spot in the arena is reserved.
            </p>

            <div className="bg-carbon border-2 border-marigold p-4 sm:p-5 text-left font-mono text-xs text-cream space-y-2 mb-6 shadow-inner">
              <div className="flex flex-col xs:flex-row justify-between border-b border-carbon-2 pb-2 gap-1">
                <span className="text-mustard">Participant:</span>
                <strong className="text-smoke text-right">{formData.name} ({formData.year} - {formData.dept})</strong>
              </div>
              <div className="flex flex-col xs:flex-row justify-between border-b border-carbon-2 pb-2 gap-1">
                <span className="text-mustard">Track:</span>
                <strong className="text-marigold text-right">{formData.event}</strong>
              </div>
              <div className="flex flex-col xs:flex-row justify-between border-b border-carbon-2 pb-2 gap-1">
                <span className="text-mustard">Team Size:</span>
                <strong className="text-smoke text-right">{formData.teamSize}</strong>
              </div>
              {teamMembers.length > 0 && (
                <div className="flex flex-col xs:flex-row justify-between border-b border-carbon-2 pb-2 gap-1">
                  <span className="text-mustard">Team Members:</span>
                  <strong className="text-smoke text-right">{teamMembers.map((m) => m.name).join(', ')}</strong>
                </div>
              )}
              <div className="flex flex-col xs:flex-row justify-between gap-1">
                <span className="text-mustard">Date &amp; Venue:</span>
                <strong className="text-emerald-400 text-right">24 Sept 2026 @ IT Hall, PACET</strong>
              </div>
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

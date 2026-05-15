import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';

type ArrayFieldKey = 'professional_skills' | 'organizational_skills' | 'interested_in';

type ApplyFormState = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  whatsapp: string;
  facebook_profile: string;
  personal_email: string;
  present_address: string;
  permanent_address: string;
  student_id: string;
  registration_number: string;
  enrollment_semester: string;
  enrollment_year: string;
  department: string;
  batch: string;
  section: string;
  professional_skills: string[];
  organizational_skills: string[];
  interested_in: string[];
  other_professional_skill: string;
  other_organizational_skill: string;
  other_interest: string;
};

const PROFESSIONAL_SKILL_OPTIONS = ['Microsoft Office', 'Graphics Design / Illustration', 'Competitive Programming'];
const ORGANIZATIONAL_SKILL_OPTIONS = ['Program Organization', 'Communication & Networking'];
const INTEREST_OPTIONS = ['AI / ML Development', 'Web Design & Development', 'Cyber Security'];

function getApiMessage(responseData: unknown, fallback: string) {
  if (!responseData || typeof responseData !== 'object') {
    return fallback;
  }

  const data = responseData as Record<string, unknown>;

  if (typeof data.message === 'string' && data.message.trim()) {
    return data.message;
  }

  if (typeof data.detail === 'string' && data.detail.trim()) {
    return data.detail;
  }

  const firstValue = Object.values(data).find((value) => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return false;
  });

  if (typeof firstValue === 'string') {
    return firstValue;
  }

  if (Array.isArray(firstValue)) {
    const firstItem = firstValue[0];
    if (typeof firstItem === 'string') {
      return firstItem;
    }
  }

  return fallback;
}

const INITIAL_FORM: ApplyFormState = {
  email: 'reshadmajumder69@gmail.com',
  password: 'StrongPassword123!',
  first_name: 'Reshad',
  last_name: 'Majumder',
  phone: '01627076527',
  whatsapp: '01627076527',
  facebook_profile: 'https://facebook.com/reshad',
  personal_email: 'reshad.personal@gmail.com',
  present_address: 'Kaliganj, Gazipur, Dhaka, Bangladesh',
  permanent_address: 'Kaliganj, Gazipur, Dhaka, Bangladesh',
  student_id: '0242220005341202',
  registration_number: '2212345678',
  enrollment_semester: 'SPRING',
  enrollment_year: '2024',
  department: 'SWE',
  batch: '61',
  section: 'A',
  professional_skills: ['Microsoft Office', 'Graphics Design / Illustration', 'Competitive Programming'],
  organizational_skills: ['Program Organization', 'Communication & Networking'],
  interested_in: ['AI / ML Development', 'Web Design & Development', 'Cyber Security'],
  other_professional_skill: 'Docker',
  other_organizational_skill: 'Team Leadership',
  other_interest: 'Open Source Contribution',
};

function CheckboxGroup({
  label,
  options,
  values,
  onToggle,
}: {
  label: string;
  options: string[];
  values: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">{label}</span>
        <div className="h-px flex-1 bg-black/10" />
      </div>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const active = values.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={`px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${
                active
                  ? 'bg-brand-black text-white border-brand-black'
                  : 'bg-transparent text-black/50 border-black/10 hover:border-black/20 hover:text-black'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = true,
  rows,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <label className="space-y-3 block">
      <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">{label}</span>
      {rows ? (
        <textarea
          required={required}
          rows={rows}
          value={value}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full bg-white border border-black/10 rounded-2xl px-4 py-4 text-sm font-medium tracking-normal uppercase focus:outline-none focus:border-black transition-colors resize-none"
        />
      ) : (
        <input
          required={required}
          type={type}
          value={value}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full bg-white border border-black/10 rounded-2xl px-4 py-4 text-sm font-medium tracking-normal uppercase focus:outline-none focus:border-black transition-colors"
        />
      )}
    </label>
  );
}

export function ApplyForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState<ApplyFormState>(INITIAL_FORM);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const updateField = (field: keyof ApplyFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const toggleArrayField = (field: ArrayFieldKey, value: string) => {
    setForm((current) => {
      const nextValues = current[field].includes(value)
        ? current[field].filter((item) => item !== value)
        : [...current[field], value];

      return { ...current, [field]: nextValues };
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setMessage('');

    try {
      const response = await fetch(`${BASE_URL}/api/v1/accounts/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          enrollment_year: Number(form.enrollment_year),
        }),
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(getApiMessage(responseData, 'Registration failed'));
      }

      navigate('/apply/verify-otp', {
        state: {
          email: form.email,
          message: getApiMessage(responseData, 'Registration successful. OTP sent to your email.'),
        },
      });
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl mx-auto bg-white border border-black/10 shadow-[0_24px_80px_rgba(0,0,0,0.08)] rounded-[2rem] overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-brand-black text-white p-8 md:p-10 lg:p-12 flex flex-col justify-between gap-10">
          <div className="space-y-6">
            <span className="text-[10px] font-mono tracking-[0.5em] text-white/40 uppercase">APPLY_PORTAL</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.85]">
              JOIN THE
              <span className="text-white/20 block">COLLECTIVE.</span>
            </h2>
            <p className="text-sm md:text-base text-white/60 max-w-md leading-relaxed uppercase tracking-wide">
              Submit your details and portfolio-ready profile to the SEC registration endpoint.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.35em] text-white/40">
              <span>Status</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="text-sm font-bold uppercase tracking-widest">
              {status === 'idle' && 'READY'}
              {status === 'submitting' && 'SENDING_REQUEST'}
              {status === 'error' && 'REQUEST_FAILED'}
            </div>
            {message && <p className="text-xs text-white/60 leading-relaxed">{message}</p>}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 lg:p-10 space-y-8 bg-brand-off-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TextField label="Email" type="email" value={form.email} onChange={(value) => updateField('email', value)} />
            <TextField label="Password" type="password" value={form.password} onChange={(value) => updateField('password', value)} />
            <TextField label="First Name" value={form.first_name} onChange={(value) => updateField('first_name', value)} />
            <TextField label="Last Name" value={form.last_name} onChange={(value) => updateField('last_name', value)} />
            <TextField label="Phone" type="tel" value={form.phone} onChange={(value) => updateField('phone', value)} />
            <TextField label="WhatsApp" type="tel" value={form.whatsapp} onChange={(value) => updateField('whatsapp', value)} />
            <TextField label="Personal Email" type="email" value={form.personal_email} onChange={(value) => updateField('personal_email', value)} />
            <TextField label="Facebook Profile" type="url" value={form.facebook_profile} onChange={(value) => updateField('facebook_profile', value)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TextField label="Present Address" value={form.present_address} onChange={(value) => updateField('present_address', value)} rows={3} />
            <TextField label="Permanent Address" value={form.permanent_address} onChange={(value) => updateField('permanent_address', value)} rows={3} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <TextField label="Student ID" value={form.student_id} onChange={(value) => updateField('student_id', value)} />
            <TextField label="Registration Number" value={form.registration_number} onChange={(value) => updateField('registration_number', value)} />
            <TextField label="Enrollment Semester" value={form.enrollment_semester} onChange={(value) => updateField('enrollment_semester', value)} />
            <TextField label="Enrollment Year" type="number" value={form.enrollment_year} onChange={(value) => updateField('enrollment_year', value)} />
            <TextField label="Department" value={form.department} onChange={(value) => updateField('department', value)} />
            <TextField label="Batch" value={form.batch} onChange={(value) => updateField('batch', value)} />
            <TextField label="Section" value={form.section} onChange={(value) => updateField('section', value)} />
          </div>

          <div className="space-y-6">
            <CheckboxGroup
              label="Professional Skills"
              options={PROFESSIONAL_SKILL_OPTIONS}
              values={form.professional_skills}
              onToggle={(value) => toggleArrayField('professional_skills', value)}
            />
            <TextField
              label="Other Professional Skill"
              value={form.other_professional_skill}
              onChange={(value) => updateField('other_professional_skill', value)}
              required={false}
            />

            <CheckboxGroup
              label="Organizational Skills"
              options={ORGANIZATIONAL_SKILL_OPTIONS}
              values={form.organizational_skills}
              onToggle={(value) => toggleArrayField('organizational_skills', value)}
            />
            <TextField
              label="Other Organizational Skill"
              value={form.other_organizational_skill}
              onChange={(value) => updateField('other_organizational_skill', value)}
              required={false}
            />

            <CheckboxGroup
              label="Interested In"
              options={INTEREST_OPTIONS}
              values={form.interested_in}
              onToggle={(value) => toggleArrayField('interested_in', value)}
            />
            <TextField
              label="Other Interest"
              value={form.other_interest}
              onChange={(value) => updateField('other_interest', value)}
              required={false}
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 max-w-xl leading-relaxed">
              By submitting, your profile is posted to the SEC registration API using the shared base URL configuration.
            </p>
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-brand-black text-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.35em] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  SUBMITTING
                </>
              ) : (
                <>
                  Continue to OTP
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

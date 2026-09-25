import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Info, MapPin } from 'lucide-react';
import { useToast } from '../context/ToastContext';


export const ContactUs: React.FC = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please enter your name';
    if (!formData.email.trim()) {
      errs.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.subject.trim()) errs.subject = 'Please enter a subject';
    if (!formData.message.trim()) {
      errs.message = 'Please enter your message';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    // Mark as submitted and show transparent notice
    setSubmitted(true);
    showToast('Feedback recorded! (Client-side demo mode)', 'success');
  };

  const handleMailto = () => {
    const mailtoUrl = `mailto:support@fontconverter.local?subject=${encodeURIComponent(
      formData.subject || 'Font Converter Feedback'
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="flex flex-col min-h-screen py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
          Contact Us
        </h1>
        <p className="mt-2 text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Have suggestions, feature requests, or encountered an unexpected conversion result? We would love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Sidebar */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Get in Touch
            </h3>
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-200">Email Support</div>
                  <a
                    href="mailto:support@nepaliconverter.local"
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    support@nepaliconverter.local
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-200">Location</div>
                  <div className="text-xs">Kathmandu, Nepal</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-teal-800 dark:text-teal-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-teal-600 dark:text-teal-400" />
            <div>
              <span className="font-bold">Transparent Delivery Note:</span> This converter operates 100% in your browser without an active email server. Submitting the form simulates receipt or you can click "Open Email App" below.
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            {submitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Thank You for Your Feedback!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  Your message has been captured. If you would like to send it directly via your personal mail client, use the option below:
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleMailto}
                    type="button"
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                  >
                    Open in Email App
                  </button>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: '', message: '' });
                    }}
                    type="button"
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    Send Another Note
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your Full Name"
                    className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.name
                        ? 'border-rose-400 focus:ring-rose-500'
                        : 'border-slate-200 dark:border-slate-750 focus:ring-emerald-500'
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.email
                        ? 'border-rose-400 focus:ring-rose-500'
                        : 'border-slate-200 dark:border-slate-750 focus:ring-emerald-500'
                    }`}
                  />
                  {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Conversion Feedback, Bug Report, Feature Idea"
                    className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.subject
                        ? 'border-rose-400 focus:ring-rose-500'
                        : 'border-slate-200 dark:border-slate-750 focus:ring-emerald-500'
                    }`}
                  />
                  {errors.subject && <p className="mt-1 text-xs text-rose-500">{errors.subject}</p>}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your message or question here..."
                    className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.message
                        ? 'border-rose-400 focus:ring-rose-500'
                        : 'border-slate-200 dark:border-slate-750 focus:ring-emerald-500'
                    }`}
                  />
                  {errors.message && <p className="mt-1 text-xs text-rose-500">{errors.message}</p>}
                </div>

                {/* Submit button */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleMailto}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 underline"
                  >
                    Or open in mail client
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

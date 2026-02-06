import { useState } from 'react';
import { ChevronRight, ChevronLeft, Upload, X, QrCode, ExternalLink } from 'lucide-react';
import { supabase, hasSupabase } from '../lib/supabase';
import { useWallet } from '../context/WalletContext';
import { isValidUrl, isValidIssuer, isValidTicker, validateOptionalUrl } from '../lib/validation';

const TREASURY = import.meta.env.VITE_TREASURY_WALLET;
const SUBMIT_FEE_DROPS = '1000000'; // 1 XRP

const STEPS = ['Token Basics', 'Description & Links', 'Media Upload', 'Preview & Submit'];

export default function SubmitPage() {
  const { account, requestPayment, hasXumm } = useWallet();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    ticker: '',
    issuer: '',
    tagline: '',
    description: '',
    website: '',
    twitter: '',
    discord: '',
    telegram: '',
    github: '',
    whitepaper: '',
    category: '',
    mediaUrls: [],
    mediaFiles: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [paymentPending, setPaymentPending] = useState(false);
  const [paymentPayload, setPaymentPayload] = useState(null);

  const updateForm = (updates) => setForm((f) => ({ ...f, ...updates }));

  const validateStep = (s) => {
    if (s === 0) {
      if (!form.name?.trim()) return 'Please fill in the project name.';
      if (!form.ticker?.trim()) return 'Please fill in the token ticker.';
      if (!form.issuer?.trim()) return 'Please fill in the issuer address.';
      if (!isValidIssuer(form.issuer)) return 'Issuer must be a valid XRPL address (starts with r, 25–34 characters).';
      if (!isValidTicker(form.ticker)) return 'Ticker must be 1–10 uppercase letters or numbers.';
    }
    if (s === 1) {
      for (const [name, value] of [['Website', form.website], ['Twitter', form.twitter], ['Discord', form.discord], ['Telegram', form.telegram], ['GitHub', form.github], ['Whitepaper', form.whitepaper]]) {
        const err = validateOptionalUrl(value, name);
        if (err) return err;
      }
    }
    return null;
  };

  const canAdvanceFromStep0 = form.name?.trim() && form.ticker?.trim() && form.issuer?.trim();

  const handleNext = () => {
    setError('');
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }
    setStep((s) => s + 1);
  };

  const handleMediaDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || []);
    if (files.length) {
      updateForm({ mediaFiles: [...form.mediaFiles, ...files] });
    }
  };

  const handleMediaSelect = (e) => {
    const files = Array.from(e.target?.files || []);
    if (files.length) {
      updateForm({ mediaFiles: [...form.mediaFiles, ...files] });
    }
  };

  const removeMedia = (index) => {
    updateForm({ mediaFiles: form.mediaFiles.filter((_, i) => i !== index) });
  };

  const uploadMediaFiles = async (files) => {
    if (!hasSupabase || !files || files.length === 0) return { urls: [], logoUrl: null, bannerUrl: null };
    const uploadedUrls = [];
    const projectId = crypto.randomUUID();
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${projectId}/${fileName}`;
      const { error } = await supabase.storage.from('project-media').upload(filePath, file);
      if (error) {
        console.error('Upload error:', error);
        continue;
      }
      const { data: { publicUrl } } = supabase.storage.from('project-media').getPublicUrl(filePath);
      uploadedUrls.push(publicUrl);
    }
    const logoUrl = uploadedUrls[0] || null;
    const bannerUrl = uploadedUrls.length === 1 ? uploadedUrls[0] : (uploadedUrls[1] || null);
    return { urls: uploadedUrls, logoUrl, bannerUrl };
  };

  const doInsert = async () => {
    const { urls, logoUrl, bannerUrl } = await uploadMediaFiles(form.mediaFiles);
    const { error: err } = await supabase.from('projects').insert({
          name: form.name,
          ticker: form.ticker,
          issuer: form.issuer,
          tagline: form.tagline || null,
          description: form.description || null,
          website: form.website || null,
          twitter: form.twitter || null,
          discord: form.discord || null,
          telegram: form.telegram || null,
          github: form.github || null,
          whitepaper: form.whitepaper || null,
          category: form.category || null,
          status: 'approved',
          logo_url: logoUrl,
          banner_url: bannerUrl,
          media_urls: urls,
          holders: '0',
          trust_lines: '0',
          supply: '—',
          badges: ['New'],
          submitted_by: account || null,
        });
    if (err) throw err;
    setSubmitted(true);
  };

  const handleSubmit = async () => {
    setError('');
    if (!form.name || !form.ticker || !form.issuer) {
      setError('Name, ticker, and issuer are required.');
      return;
    }
    if (!isValidIssuer(form.issuer)) {
      setError('Issuer must be a valid XRPL address (starts with r, 25–34 characters).');
      return;
    }
    if (!isValidTicker(form.ticker)) {
      setError('Ticker must be 1–10 uppercase letters or numbers.');
      return;
    }
    const linkFields = [
      ['website', form.website],
      ['Twitter', form.twitter],
      ['Discord', form.discord],
      ['Telegram', form.telegram],
      ['GitHub', form.github],
      ['Whitepaper', form.whitepaper],
    ];
    for (const [name, value] of linkFields) {
      const err = validateOptionalUrl(value, name);
      if (err) {
        setError(err);
        return;
      }
    }
    if (!hasSupabase) {
      setError('Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable submissions.');
      return;
    }

    const needsPayment = TREASURY && hasXumm;

    if (needsPayment && !paymentPayload) {
      setSubmitting(true);
      const result = await requestPayment(TREASURY, SUBMIT_FEE_DROPS, `BOP: ${form.name}`);
      setSubmitting(false);
      if (!result.ok) {
        setError(result.error || 'Payment failed');
        return;
      }
      setPaymentPending(true);
      setPaymentPayload(result);
      try {
        const payload = await result.resolved;
        setPaymentPending(false);
        setPaymentPayload(null);
        const signed = payload?.signed ?? payload?.data?.signed;
        if (import.meta.env.DEV && import.meta.env.VITE_XRPL_NETWORK === 'testnet') {
          console.log('[BOP] Payment resolved:', { signed, payload: payload?.data ?? payload });
        }
        if (!payload || signed === false) {
          setError('Payment was rejected or cancelled.');
          return;
        }
      } catch (e) {
        setPaymentPending(false);
        setPaymentPayload(null);
        if (import.meta.env.DEV && import.meta.env.VITE_XRPL_NETWORK === 'testnet') {
          console.error('[BOP] Payment resolve error:', e);
        }
        setError('Payment was rejected or cancelled.');
        return;
      }
    }

    setSubmitting(true);
    try {
      await doInsert();
    } catch (e) {
      setError(e.message);
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-4xl font-bold text-white mb-4">Submission Received</h1>
        <p className="text-neutral-400 mb-8">
          Your project is now live in the directory.
        </p>
        <a href="/" className="text-amber-400 hover:text-amber-300">
          Back to Directory
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl font-bold text-white mb-8">Submit Your Project</h1>

      <div className="flex gap-2 mb-10">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm ${i === step ? 'bg-amber-600 text-white' : i < step ? 'bg-amber-600/30 text-amber-400' : 'bg-neutral-800 text-neutral-500'}`}>
              {i + 1}. {s}
            </span>
            {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-neutral-600" />}
          </div>
        ))}
      </div>

      {paymentPending && paymentPayload && (
        <div className="mb-6 p-6 bg-amber-900/20 border border-amber-600/50 rounded-2xl text-center">
          <QrCode className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h3 className="font-display text-xl font-bold text-white mb-2">Pay 1 XRP to Submit</h3>
          <p className="text-neutral-400 mb-4">Scan with XUMM or open the link below</p>
          {paymentPayload.qrPng && (
            <img src={paymentPayload.qrPng} alt="XUMM QR" className="mx-auto mb-4 w-48 h-48 bg-white rounded-xl p-2" />
          )}
          {paymentPayload.qrUrl && (
            <a
              href={paymentPayload.qrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 rounded-xl font-semibold text-white"
            >
              <ExternalLink className="w-4 h-4" />
              Open in XUMM
            </a>
          )}
          <p className="text-neutral-500 text-sm mt-4">Waiting for payment...</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300">
          {error}
        </div>
      )}

      {step === 0 && (
        <div className="space-y-6">
          <div>
            <label className="block text-neutral-400 mb-2">Project Name *</label>
            <input
              value={form.name}
              onChange={(e) => updateForm({ name: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-700"
              placeholder="Board of Peace"
            />
          </div>
          <div>
            <label className="block text-neutral-400 mb-2">Token Ticker *</label>
            <input
              value={form.ticker}
              onChange={(e) => updateForm({ ticker: e.target.value.toUpperCase() })}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-700 font-mono"
              placeholder="BOP"
            />
          </div>
          <div>
            <label className="block text-neutral-400 mb-2">Issuer Address *</label>
            <input
              value={form.issuer}
              onChange={(e) => updateForm({ issuer: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-700 font-mono"
              placeholder="rGF1o7dsC776Hov8qKkPCN1wkVh18sz5bf"
            />
          </div>
          <div>
            <label className="block text-neutral-400 mb-2">Category</label>
            <select
              value={form.category}
              onChange={(e) => updateForm({ category: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-700"
            >
              <option value="">Select...</option>
              <option value="DeFi">DeFi</option>
              <option value="NFT">NFT</option>
              <option value="Gaming">Gaming</option>
              <option value="Charity">Charity</option>
              <option value="Utility">Utility</option>
              <option value="Social">Social</option>
              <option value="Meme">Meme</option>
            </select>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-neutral-400 mb-2">Tagline</label>
            <input
              value={form.tagline}
              onChange={(e) => updateForm({ tagline: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-700"
              placeholder="United Stewards on XRPL"
            />
          </div>
          <div>
            <label className="block text-neutral-400 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => updateForm({ description: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-700 resize-none"
              rows="6"
              placeholder="Tell us about your project..."
            />
          </div>
          <div>
            <label className="block text-neutral-400 mb-2">Website</label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => updateForm({ website: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-700"
              placeholder="https://..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-400 mb-2">Twitter</label>
              <input
                type="url"
                value={form.twitter}
                onChange={(e) => updateForm({ twitter: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-700"
                placeholder="https://twitter.com/..."
              />
            </div>
            <div>
              <label className="block text-neutral-400 mb-2">Discord</label>
              <input
                type="url"
                value={form.discord}
                onChange={(e) => updateForm({ discord: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-700"
                placeholder="https://discord.gg/..."
              />
            </div>
            <div>
              <label className="block text-neutral-400 mb-2">Telegram</label>
              <input
                type="url"
                value={form.telegram}
                onChange={(e) => updateForm({ telegram: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-700"
                placeholder="https://t.me/..."
              />
            </div>
            <div>
              <label className="block text-neutral-400 mb-2">GitHub</label>
              <input
                type="url"
                value={form.github}
                onChange={(e) => updateForm({ github: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-700"
                placeholder="https://github.com/..."
              />
            </div>
          </div>
          <div>
            <label className="block text-neutral-400 mb-2">Whitepaper</label>
            <input
              type="url"
              value={form.whitepaper}
              onChange={(e) => updateForm({ whitepaper: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-700"
              placeholder="https://..."
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <div
            onDrop={handleMediaDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-neutral-700 rounded-2xl p-12 text-center hover:border-amber-600/50 transition-colors cursor-pointer"
            onClick={() => document.getElementById('media-input').click()}
          >
            <input
              id="media-input"
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleMediaSelect}
              className="hidden"
            />
            <Upload className="w-12 h-12 text-neutral-500 mx-auto mb-4" />
            <p className="text-neutral-400 mb-2">Drag and drop images or videos here, or click to select</p>
            <p className="text-neutral-500 text-sm">Images and videos for your project gallery</p>
          </div>
          {form.mediaFiles.length > 0 && (
            <div className="mt-6 grid grid-cols-3 gap-4">
              {form.mediaFiles.map((file, i) => (
                <div key={i} className="relative group">
                  <div className="aspect-square bg-neutral-800 rounded-xl overflow-hidden">
                    {file.type.startsWith('image/') ? (
                      <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-500">
                        Video
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeMedia(i)}
                    className="absolute top-2 right-2 p-2 bg-black/70 hover:bg-red-500 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-neutral-500 text-sm mt-4">
            Images and videos will be uploaded to Supabase Storage when you submit.
          </p>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
          <h3 className="font-display text-2xl font-bold text-white">Preview</h3>
          <div>
            <span className="text-neutral-500">Name:</span> <span className="text-white font-bold">{form.name}</span>
          </div>
          <div>
            <span className="text-neutral-500">Ticker:</span> <span className="text-amber-400 font-mono">${form.ticker}</span>
          </div>
          <div>
            <span className="text-neutral-500">Issuer:</span> <code className="text-amber-400/80 text-sm">{form.issuer}</code>
          </div>
          {form.tagline && (
            <div>
              <span className="text-neutral-500">Tagline:</span> <span className="text-neutral-300">{form.tagline}</span>
            </div>
          )}
          {form.description && (
            <div>
              <span className="text-neutral-500">Description:</span>
              <p className="text-neutral-300 mt-2 whitespace-pre-wrap">{form.description.slice(0, 200)}...</p>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between mt-10">
        <button
          onClick={() => { setError(''); setStep((s) => Math.max(0, s - 1)); }}
          disabled={step === 0}
          className="px-6 py-3 bg-neutral-800 disabled:opacity-50 rounded-xl font-semibold text-white hover:bg-neutral-700 transition-colors flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={step === 0 && !canAdvanceFromStep0}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-white transition-colors flex items-center gap-2"
          >
            Next <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 rounded-xl font-semibold text-white transition-colors"
          >
            {submitting ? 'Submitting...' : 'Submit for Review'}
          </button>
        )}
      </div>
    </div>
  );
}

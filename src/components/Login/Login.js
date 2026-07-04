import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateOTP, validateOTP } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [step, setStep] = useState('mobile'); // 'mobile' | 'otp'
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const isValidMobile = (val) => /^\d{10}$/.test(val);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!isValidMobile(mobile)) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    try {
      await generateOTP(mobile);
      setInfo('OTP sent to your mobile number.');
      setStep('otp');
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!otp) {
      setError('Enter the OTP you received.');
      return;
    }
    setLoading(true);
    try {
      const res = await validateOTP(mobile, otp);
      // API response is expected to carry the token, commonly under data.token
      const token =
        res?.data?.token || res?.data?.data?.token || res?.data?.data || res?.data;
      if (!token || typeof token !== 'string') {
        setError('Login succeeded but no token was returned by the server.');
        setLoading(false);
        return;
      }
      login(token, mobile);
      navigate('/upload');
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-hero">
        <div className="auth-hero-top">
          <div className="auth-hero-mark">D</div>
          <div className="auth-hero-word">DocVault</div>
        </div>

        <div className="auth-hero-mid">
          <div className="eyebrow">Document management</div>
          <h1>Every record, indexed and within reach.</h1>
          <div className="seal">
            <strong>DV</strong>
            <span>Verified</span>
          </div>
          <p>
            Personal and professional documents, filed by category, tagged for instant search,
            and never more than a lookup away.
          </p>
        </div>

        <div className="auth-hero-foot">
          <span>OTP-secured access</span>
          <span>Est. records vault</span>
        </div>
      </div>

      <div className="auth-panel">
        <div className="card auth-card">
          <div className="display">Sign in</div>
          <p className="sub">
            {step === 'mobile'
              ? 'Enter your mobile number and we will send a one-time code.'
              : `Enter the code sent to +91 ${mobile}`}
          </p>

          {error && <div className="error-banner">{error}</div>}
          {info && !error && <div className="success-banner">{info}</div>}

          {step === 'mobile' && (
            <form onSubmit={handleSendOtp}>
              <div className="field">
                <label htmlFor="mobile">Mobile number</label>
                <input
                  id="mobile"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={mobile}
                  maxLength={10}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                />
              </div>
              <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
                {loading ? <span className="spinner" /> : 'Send OTP'}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp}>
              <div className="field">
                <label htmlFor="otp">OTP</label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                />
              </div>
              <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
                {loading ? <span className="spinner" /> : 'Verify & sign in'}
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-block"
                style={{ marginTop: 10 }}
                onClick={() => {
                  setStep('mobile');
                  setOtp('');
                  setError('');
                  setInfo('');
                }}
              >
                Change mobile number
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

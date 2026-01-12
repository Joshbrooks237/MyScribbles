import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Coffee, Heart, X, Sparkles } from 'lucide-react';

// Initialize Stripe - Add your publishable key when ready
const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : null;

interface TipJarProps {
  isOpen: boolean;
  onClose: () => void;
}

const tipAmounts = [
  { amount: 3, label: '$3', emoji: '☕', description: 'Buy me a coffee' },
  { amount: 5, label: '$5', emoji: '🎵', description: 'Support a song' },
  { amount: 10, label: '$10', emoji: '💝', description: 'Super supporter' },
  { amount: 25, label: '$25', emoji: '⭐', description: 'Amazing patron' },
];

export function TipJar({ isOpen, onClose }: TipJarProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTip = async () => {
    const amount = selectedAmount || (customAmount ? parseFloat(customAmount) : 0);
    
    if (!amount || amount < 1) {
      setError('Please select or enter an amount');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Check if Stripe is configured
      if (!stripePromise) {
        // Fallback: Open a "coming soon" message or PayPal/Venmo link
        setError('Payment system coming soon! Thank you for your support! 💝');
        setIsProcessing(false);
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) {
        setError('Payment system is being set up. Check back soon!');
        setIsProcessing(false);
        return;
      }

      // For production: Create a Checkout Session via your backend
      // For now, we'll use Stripe Payment Links (simpler, no backend needed)
      
      // Option 1: Redirect to Stripe Payment Link (set this up in Stripe Dashboard)
      const paymentLinkUrl = import.meta.env.VITE_STRIPE_PAYMENT_LINK;
      if (paymentLinkUrl) {
        window.open(paymentLinkUrl, '_blank');
        onClose();
        return;
      }

      // Option 2: Use Stripe Checkout (requires backend)
      setError('Payment link not configured yet. Coming soon!');
      
    } catch (err) {
      console.error('Payment error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="tip-jar-overlay" onClick={onClose}>
      <div className="tip-jar-modal" onClick={(e) => e.stopPropagation()}>
        <button className="tip-jar-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="tip-jar-header">
          <Coffee size={32} />
          <h2>Support MyScribbles</h2>
          <p>Your tips help keep the music flowing! 🎵</p>
        </div>

        <div className="tip-amounts">
          {tipAmounts.map((tip) => (
            <button
              key={tip.amount}
              className={`tip-amount-btn ${selectedAmount === tip.amount ? 'selected' : ''}`}
              onClick={() => {
                setSelectedAmount(tip.amount);
                setCustomAmount('');
                setError(null);
              }}
            >
              <span className="tip-emoji">{tip.emoji}</span>
              <span className="tip-label">{tip.label}</span>
              <span className="tip-description">{tip.description}</span>
            </button>
          ))}
        </div>

        <div className="custom-amount">
          <label>Or enter custom amount:</label>
          <div className="custom-input-wrapper">
            <span className="currency-symbol">$</span>
            <input
              type="number"
              min="1"
              placeholder="0"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(null);
                setError(null);
              }}
            />
          </div>
        </div>

        {error && <p className="tip-error">{error}</p>}

        <button 
          className="tip-submit-btn"
          onClick={handleTip}
          disabled={isProcessing}
        >
          {isProcessing ? (
            'Processing...'
          ) : (
            <>
              <Sparkles size={18} />
              Send Tip
              <Heart size={16} className="heart-pulse" />
            </>
          )}
        </button>

        <p className="tip-footer">
          Secure payments powered by Stripe 🔒
        </p>
      </div>
    </div>
  );
}








import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../lib/api';
import toast from 'react-hot-toast';
import './DashboardPage.css';

const PLANS = [
    {
        tier: 'free',
        price: '₹0',
        period: 'forever',
        maxImages: 10,
        features: ['10 image uploads', 'ImageKit CDN delivery', 'Basic dashboard'],
        cta: 'Current Plan',
        disabled: true,
    },
    {
        tier: 'premium',
        price: '₹99',
        period: '/month',
        maxImages: 100,
        features: ['100 image uploads', 'ImageKit CDN delivery', 'Priority support', 'Higher resolution'],
        cta: 'Upgrade to Premium',
        isPopular: true,
    },
    {
        tier: 'ultra',
        price: '₹499',
        period: '/month',
        maxImages: 1000,
        features: ['1000 image uploads', 'ImageKit CDN delivery', '24/7 support', 'API access', 'Custom domain'],
        cta: 'Upgrade to Ultra',
    },
];

export default function BillingPage() {
    const { profile, refreshProfile } = useAuth();
    const [loadingTier, setLoadingTier] = useState(null);

    const loadRazorpay = () =>
        new Promise((resolve) => {
            if (window.Razorpay) { resolve(true); return; }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });

    const handleUpgrade = async (targetTier) => {
        setLoadingTier(targetTier);
        try {
            const loaded = await loadRazorpay();
            if (!loaded) { toast.error('Payment gateway unavailable'); return; }

            const res = await api.post('/payments/create-order', { target_tier: targetTier });
            const { order_id, amount, currency, key_id } = res.data;

            const options = {
                key: key_id,
                amount,
                currency,
                order_id,
                name: 'ImageTier',
                description: `Upgrade to ${targetTier} plan`,
                handler: async (response) => {
                    try {
                        await api.post('/payments/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        toast.success('Payment successful! Your tier has been upgraded 🎉');
                        await refreshProfile();
                    } catch (err) {
                        toast.error('Payment verification failed. Contact support if you were charged.');
                    }
                },
                modal: {
                    ondismiss: () => toast('Payment cancelled', { icon: 'ℹ️' }),
                },
                prefill: { email: profile?.email },
                theme: { color: '#D9534F' },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            toast.error(err?.response?.data?.detail || 'Failed to initiate payment');
        } finally {
            setLoadingTier(null);
        }
    };

    const tierOrder = ['free', 'premium', 'ultra'];
    const currentIdx = tierOrder.indexOf(profile?.tier || 'free');

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-header">
                    <h1 id="billing-page-title">Billing & Plans</h1>
                    <p className="dashboard-subtitle">
                        Current plan: <strong style={{ color: 'var(--color-primary)', textTransform: 'capitalize' }}>{profile?.tier || 'free'}</strong>
                    </p>
                </div>

                <div className="pricing-grid" id="pricing-grid">
                    {PLANS.map((plan) => {
                        const planIdx = tierOrder.indexOf(plan.tier);
                        const isCurrentPlan = plan.tier === profile?.tier;
                        const isDowngrade = planIdx < currentIdx;
                        const isDisabled = isCurrentPlan || isDowngrade || plan.disabled;

                        return (
                            <div
                                key={plan.tier}
                                className={`pricing-card card${plan.isPopular ? ' pricing-card--popular' : ''}`}
                                id={`pricing-card-${plan.tier}`}
                            >
                                {plan.isPopular && <span className="pricing-card__badge">Most Popular</span>}
                                <h3 className="pricing-card__tier">{plan.tier.charAt(0).toUpperCase() + plan.tier.slice(1)}</h3>
                                <div className="pricing-card__price">
                                    <span className="pricing-card__amount">{plan.price}</span>
                                    <span className="pricing-card__period">{plan.period}</span>
                                </div>
                                <ul className="pricing-card__features">
                                    {plan.features.map(f => <li key={f}>✓ {f}</li>)}
                                </ul>
                                <button
                                    className={`btn ${isCurrentPlan ? 'btn-outline' : 'btn-primary'} pricing-card__cta`}
                                    id={`billing-upgrade-${plan.tier}`}
                                    onClick={() => !isDisabled && handleUpgrade(plan.tier)}
                                    disabled={isDisabled || loadingTier === plan.tier}
                                >
                                    {isCurrentPlan ? '✓ Current Plan' : loadingTier === plan.tier ? 'Processing…' : plan.cta}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

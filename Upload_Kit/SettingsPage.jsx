import { useAuth } from '../hooks/useAuth';
import QuotaIndicator from '../components/QuotaIndicator';
import './DashboardPage.css';

export default function SettingsPage() {
    const { profile, user } = useAuth();
    const tierColors = { free: '#6A7CA0', premium: '#D9534F', ultra: '#DAA520' };

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-header">
                    <h1 id="settings-page-title">Settings</h1>
                    <p className="dashboard-subtitle">Account information and preferences</p>
                </div>

                <div className="settings-grid">
                    <div className="card" id="settings-account-card">
                        <h3>Account</h3>
                        <div className="settings-row">
                            <span className="settings-label">Email</span>
                            <span className="settings-value" id="settings-email">{profile?.email || user?.email || '—'}</span>
                        </div>
                        <div className="settings-row">
                            <span className="settings-label">Current Plan</span>
                            <span
                                className="settings-value settings-tier-badge"
                                id="settings-tier"
                                style={{ color: tierColors[profile?.tier || 'free'] }}
                            >
                                {profile?.tier || 'free'}
                            </span>
                        </div>
                        <div className="settings-row">
                            <span className="settings-label">Payment Status</span>
                            <span className="settings-value" id="settings-payment-status">
                                {profile?.payment_status || 'unpaid'}
                            </span>
                        </div>
                        <div className="settings-row">
                            <span className="settings-label">Member Since</span>
                            <span className="settings-value" id="settings-created-at">
                                {profile?.created_at
                                    ? new Date(profile.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
                                    : '—'}
                            </span>
                        </div>
                    </div>

                    <div className="card" id="settings-quota-card">
                        <h3>Storage Usage</h3>
                        {profile ? (
                            <>
                                <QuotaIndicator used={profile.image_count} max={profile.max_images} />
                                <a href="/billing" className="btn btn-outline" id="settings-upgrade-link" style={{ marginTop: 'var(--space-md)', display: 'inline-flex' }}>
                                    Upgrade Plan
                                </a>
                            </>
                        ) : (
                            <div className="skeleton" style={{ height: 32, width: '100%', marginTop: 8 }} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

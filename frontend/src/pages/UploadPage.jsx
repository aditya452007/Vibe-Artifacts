import { useAuth } from '../hooks/useAuth';
import UploadBox from '../components/UploadBox';
import QuotaIndicator from '../components/QuotaIndicator';
import toast from 'react-hot-toast';
import './DashboardPage.css';

export default function UploadPage() {
    const { profile, refreshProfile } = useAuth();

    const handleUploadSuccess = async () => {
        toast.success('Image uploaded successfully! 🎉');
        await refreshProfile();
    };

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-header">
                    <h1 id="upload-page-title">Upload Image</h1>
                    <p className="dashboard-subtitle">
                        Drag & drop or click to upload — images stored on ImageKit CDN
                    </p>
                </div>

                {profile && (
                    <div className="card quota-card">
                        <h3>Storage Quota</h3>
                        <QuotaIndicator used={profile.image_count} max={profile.max_images} />
                        {profile.image_count >= profile.max_images && (
                            <p className="quota-upgrade-hint">
                                Quota full —{' '}
                                <a href="/billing" id="upload-upgrade-link">Upgrade your plan</a>
                            </p>
                        )}
                    </div>
                )}

                <div className="upload-section">
                    <UploadBox
                        onUpload={handleUploadSuccess}
                        quota={profile ? { used: profile.image_count, max: profile.max_images } : null}
                    />
                </div>
            </div>
        </div>
    );
}

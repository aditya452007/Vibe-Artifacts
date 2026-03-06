import { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import ImageCard from '../components/ImageCard';
import QuotaIndicator from '../components/QuotaIndicator';
import './DashboardPage.css';

export default function ImagesPage() {
    const { profile } = useAuth();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/uploads')
            .then(res => setImages(res.data))
            .catch(() => setImages([]))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = (deletedId) => {
        setImages(prev => prev.filter(img => img.id !== deletedId));
    };

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-header">
                    <h1 id="images-page-title">My Images</h1>
                    <p className="dashboard-subtitle">{images.length} image{images.length !== 1 ? 's' : ''} in your gallery</p>
                </div>

                {profile && (
                    <div className="card quota-card">
                        <QuotaIndicator used={profile.image_count} max={profile.max_images} />
                    </div>
                )}

                {loading ? (
                    <div className="images-grid" id="images-skeleton">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="skeleton" style={{ aspectRatio: '1', borderRadius: 'var(--radius-md)' }} />
                        ))}
                    </div>
                ) : images.length === 0 ? (
                    <div className="empty-state" id="images-empty-state">
                        <span className="empty-state__icon">🖼️</span>
                        <h3>No images yet</h3>
                        <p>Upload your first image to get started</p>
                        <a href="/upload" className="btn btn-primary" id="images-upload-link">Upload Image</a>
                    </div>
                ) : (
                    <div className="images-grid" id="images-grid">
                        {images.map(img => (
                            <ImageCard key={img.id} image={img} onDelete={handleDelete} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

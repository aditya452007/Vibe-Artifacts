import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import './ImageCard.css';

export default function ImageCard({ image, onDelete }) {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (!window.confirm('Delete this image?')) return;
        setDeleting(true);
        try {
            await api.delete(`/uploads/${image.id}`);
            toast.success('Image deleted');
            if (onDelete) onDelete(image.id);
        } catch {
            toast.error('Failed to delete image');
            setDeleting(false);
        }
    };

    const formattedDate = new Date(image.uploaded_at).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
    });

    return (
        <div className="image-card" id={`image-card-${image.id}`}>
            <div className="image-card__media-wrap">
                <img
                    src={image.image_url}
                    alt="Uploaded image"
                    className="image-card__img"
                    width={280}
                    height={280}
                    loading="lazy"
                />
                <div className="image-card__overlay" role="group" aria-label="Image actions">
                    <time className="image-card__date">{formattedDate}</time>
                    <button
                        className="image-card__delete-btn"
                        onClick={handleDelete}
                        disabled={deleting}
                        aria-label="Delete image"
                        id={`delete-btn-${image.id}`}
                    >
                        {deleting ? '…' : '🗑️'}
                    </button>
                </div>
            </div>
        </div>
    );
}

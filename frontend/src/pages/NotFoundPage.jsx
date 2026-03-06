import { Link } from 'react-router-dom';
import './NotFoundPage.css';

export default function NotFoundPage() {
    return (
        <div className="not-found" id="not-found-page">
            <div className="not-found__content">
                <span className="not-found__emoji">🔍</span>
                <h1>404</h1>
                <h2>Page Not Found</h2>
                <p>The page you're looking for doesn't exist or has been moved.</p>
                <Link to="/" className="btn btn-primary" id="not-found-home-link">
                    Go Home
                </Link>
            </div>
        </div>
    );
}

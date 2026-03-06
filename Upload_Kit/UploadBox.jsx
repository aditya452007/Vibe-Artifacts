import { useCallback, useRef, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import gsap from 'gsap';
import api from '../lib/api';
import './UploadBox.css';


export default function UploadBox({ onUpload, quota }) {
    const [files, setFiles] = useState([]); // Array of { id, file, status, progress, errorMsg }
    const boxRef = useRef(null);
    const borderTween = useRef(null);

    const IMAGEKIT_URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;
    const IMAGEKIT_PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;

    const startBorderPulse = () => {
        if (borderTween.current) borderTween.current.kill();
        borderTween.current = gsap.to(boxRef.current, {
            borderColor: 'var(--color-primary)',
            duration: 0.6,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
        });
    };

    const stopBorderPulse = () => {
        if (borderTween.current) {
            borderTween.current.kill();
            borderTween.current = null;
        }
        if (boxRef.current) gsap.set(boxRef.current, { clearProps: 'borderColor' });
    };

    const onDrop = useCallback(async (acceptedFiles) => {
        stopBorderPulse();
        if (!acceptedFiles.length) return;

        const newFiles = acceptedFiles.map(f => ({
            id: Math.random().toString(36).substring(7),
            file: f,
            status: 'pending', // pending | uploading | success | error
            progress: 0,
            errorMsg: ''
        }));

        setFiles(prev => [...prev, ...newFiles]);
    }, []);

    // Process the queue sequentially to avoid hammering the backend/rate limits unnecessarily
    useEffect(() => {
        const processQueue = async () => {
            const nextFile = files.find(f => f.status === 'pending');
            if (!nextFile) return;

            // Check overall quota before uploading
            if (quota && quota.used >= quota.max) {
                setFiles(prev => prev.map(f =>
                    f.id === nextFile.id ? { ...f, status: 'error', errorMsg: 'Quota exceeded. Upgrade your plan.' } : f
                ));
                return;
            }

            setFiles(prev => prev.map(f =>
                f.id === nextFile.id ? { ...f, status: 'uploading' } : f
            ));

            try {
                // Get auth token from backend
                const tokenRes = await api.post('/uploads/token');
                const { token, expire, signature, public_key } = tokenRes.data;

                const formData = new FormData();
                formData.append('file', nextFile.file);
                formData.append('fileName', nextFile.file.name);
                formData.append('publicKey', public_key || IMAGEKIT_PUBLIC_KEY);
                formData.append('signature', signature);
                formData.append('expire', expire);
                formData.append('token', token);

                const xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://upload.imagekit.io/api/v1/files/upload');

                xhr.upload.onprogress = (e) => {
                    if (e.lengthComputable) {
                        const progress = Math.round((e.loaded / e.total) * 100);
                        setFiles(prev => prev.map(f =>
                            f.id === nextFile.id ? { ...f, progress } : f
                        ));
                    }
                };

                const uploadPromise = new Promise((resolve, reject) => {
                    xhr.onload = async () => {
                        if (xhr.status === 200) {
                            try {
                                const result = JSON.parse(xhr.responseText);
                                await api.post('/uploads/register', {
                                    image_url: result.url,
                                    imagekit_file_id: result.fileId,
                                });
                                resolve(result);
                            } catch (err) {
                                reject(err);
                            }
                        } else {
                            reject(new Error('ImageKit upload failed'));
                        }
                    };
                    xhr.onerror = () => reject(new Error('Upload failed'));
                });

                xhr.send(formData);
                const result = await uploadPromise;

                setFiles(prev => prev.map(f =>
                    f.id === nextFile.id ? { ...f, status: 'success', progress: 100 } : f
                ));
                // Update quota optimism locally if possible, or trigger refetch
                if (onUpload) {
                    onUpload(result);
                }

            } catch (err) {
                console.error("Upload Error:", err);
                setFiles(prev => prev.map(f =>
                    f.id === nextFile.id ? { ...f, status: 'error', errorMsg: err?.response?.data?.detail || err.message || 'Upload failed' } : f
                ));
            }
        };

        processQueue();
    }, [files, quota, IMAGEKIT_PUBLIC_KEY, onUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxSize: 10 * 1024 * 1024, // 10 MB per file
        onDragEnter: startBorderPulse,
        onDragLeave: stopBorderPulse,
    });

    const isUploadingAny = files.some(f => f.status === 'uploading' || f.status === 'pending');

    return (
        <div className="upload-container">
            <div
                {...getRootProps()}
                ref={boxRef}
                className={`upload-box upload-box--idle${isDragActive ? ' upload-box--hovering' : ''}`}
                role="button"
                tabIndex={0}
                id="upload-dropzone"
                aria-label="Upload image by dragging and dropping or clicking"
            >
                <input {...getInputProps()} id="upload-file-input" />
                <div className="upload-box__icon">☁️</div>
                <p className="upload-box__title">Drag & drop files or click to upload</p>
                <p className="upload-box__hint">Supports JPG, PNG, GIF, WebP · Max 10 MB each</p>
            </div>

            {files.length > 0 && (
                <div className="upload-queue">
                    <h4 className="upload-queue__title">Upload Queue ({files.filter(f => f.status === 'success').length}/{files.length})</h4>
                    <div className="upload-queue__list">
                        {files.map(f => (
                            <div key={f.id} className={`upload-item upload-item--${f.status}`}>
                                <div className="upload-item__info">
                                    <span className="upload-item__name" title={f.file.name}>{f.file.name}</span>
                                    {f.status === 'uploading' && <span className="upload-item__status">{f.progress}%</span>}
                                    {f.status === 'success' && <span className="upload-item__status">✅ Done</span>}
                                    {f.status === 'error' && <span className="upload-item__status error" title={f.errorMsg}>❌ Failed</span>}
                                    {f.status === 'pending' && <span className="upload-item__status">⏳ Waiting</span>}
                                </div>
                                {(f.status === 'uploading' || f.status === 'pending') && (
                                    <div className="upload-progress">
                                        <div className="upload-progress__fill" style={{ width: `${f.progress}%` }} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {!isUploadingAny && files.length > 0 && (
                        <button className="btn btn-outline btn--small mt-3" onClick={() => setFiles([])}>
                            Clear Queue
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

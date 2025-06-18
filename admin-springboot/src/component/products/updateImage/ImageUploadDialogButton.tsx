import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import axios from 'axios';
import sha1 from 'crypto-js/sha1';
import { useState } from 'react';
import { useInput, useNotify, useRecordContext } from 'react-admin';
import Swal from 'sweetalert2';
import { CLOUDINARY_API_URL, CLOUDINARY_DESTROY_URL } from '../../../config/cloudinaryConfig';

export const ImageUploadDialogButton = () => {
    const notify = useNotify();
    const record = useRecordContext();
    const [open, setOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [aiDescription, setAiDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState(null); // Lưu file người dùng chọn
    const [imageUploadedUrl, setImageUploadedUrl] = useState(''); // Lưu url ảnh đã upload

    const {
        field: { value: imageValue, onChange: setImage }
    } = useInput({ source: 'imageProduct' });

    const {
        field: { value: descValue, onChange: setDesc }
    } = useInput({ source: 'description' });

    const handleAsk = () => {
        Swal.fire({
            title: 'Xác nhận thay ảnh?',
            text: 'Nếu bạn chọn ảnh mới, hệ thống AI sẽ tự động tạo chi tiết sản phẩm theo ảnh đó. Bạn có muốn tiếp tục?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Tiếp tục',
            cancelButtonText: 'Hủy',
            confirmButtonColor: '#ff6a00',
        }).then((result) => {
            if (result.isConfirmed) {
                setOpen(true);
            }
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file); // Chỉ lưu file, chưa upload
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            notify('Vui lòng chọn ảnh trước khi upload', { type: 'warning' });
            return;
        }

        setUploading(true);

        // Xoá ảnh cũ nếu có
        const oldImageUrl = record.imageProduct;
        if (oldImageUrl) {
            const publicId = oldImageUrl.split('/').pop().split('.')[0];
            const timestamp = Math.floor(Date.now() / 1000);
            const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${process.env.REACT_APP_CLOUDINARY_API_SECRET}`;
            const signature = sha1(stringToSign).toString();

            const destroyForm = new URLSearchParams();
            destroyForm.append('public_id', publicId);
            destroyForm.append('timestamp', timestamp);
            destroyForm.append('api_key', process.env.REACT_APP_CLOUDINARY_API_KEY || '');
            destroyForm.append('signature', signature);

            try {
                await axios.post(CLOUDINARY_DESTROY_URL, destroyForm);
                console.log('Ảnh cũ đã được xoá.');
            } catch (err) {
                console.warn('Không thể xoá ảnh cũ:', err.response?.data || err.message);
            }
        }

        // Upload ảnh mới
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || '');

        try {
            const res = await axios.post(CLOUDINARY_API_URL, formData);
            const data = res.data;

            if (data.secure_url) {
                setImageUploadedUrl(data.secure_url);
                setImageUrl(data.secure_url); // Để hiển thị preview
                setAiDescription(''); // Reset mô tả AI khi upload ảnh mới
                notify('Upload ảnh thành công. Hãy bấm "Sinh mô tả AI"', { type: 'info' });
            } else {
                throw new Error('Upload thất bại');
            }
        } catch (error) {
            notify('Lỗi upload ảnh', { type: 'error' });
        } finally {
            setUploading(false);
        }
    };

    // Gọi AI sinh mô tả, chỉ khi đã có imageUploadedUrl
    const handleGenerateAIDescription = async () => {
        if (!imageUploadedUrl) {
            notify('Bạn cần upload ảnh trước khi sinh mô tả AI', { type: 'warning' });
            return;
        }
        setUploading(true);
        try {
            const aiRes = await fetch('http://localhost:8080/api/admin/analyze-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('jwt-token')}`
                },
                body: JSON.stringify({ imageUrl: imageUploadedUrl })
            });

            const aiData = await aiRes.json();
            setAiDescription(aiData.description || '');
            notify('Đã sinh mô tả AI thành công', { type: 'info' });
        } catch (error) {
            notify('Lỗi gọi AI', { type: 'error' });
        } finally {
            setUploading(false);
        }
    };

    // Sửa lại handleConfirm: chỉ lưu lại ảnh và mô tả đã sinh ra, không gọi lại upload/AI nữa
    const handleConfirm = () => {
        if (imageUploadedUrl) {
            setImage(imageUploadedUrl);
            setDesc(aiDescription);
            setOpen(false);
            notify('Đã cập nhật ảnh và mô tả từ AI', { type: 'info' });
        } else {
            notify('Bạn cần upload ảnh trước khi xác nhận', { type: 'warning' });
        }
    };

    return (
        <>
            <Button variant="outlined" onClick={handleAsk}>
                Cập nhật ảnh mới!
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Tải ảnh và sinh mô tả AI</DialogTitle>
                <DialogContent>
                    <Button variant="contained" component="label" disabled={uploading}>
                        {uploading ? <CircularProgress size={24} /> : 'Chọn ảnh'}
                        <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                    </Button>
                    {/* Nút upload ảnh */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpload}
                        disabled={uploading || !selectedFile}
                        sx={{ ml: 2 }}
                    >
                        {uploading ? <CircularProgress size={24} /> : 'Upload ảnh'}
                    </Button>
                    {/* Nút sinh mô tả AI */}
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleGenerateAIDescription}
                        disabled={uploading || !imageUploadedUrl}
                        sx={{ ml: 2 }}
                    >
                        {uploading ? <CircularProgress size={24} /> : 'Sinh mô tả AI'}
                    </Button>

                    {selectedFile && (
                        <>
                            <Typography mt={2}>Ảnh đã chọn: {selectedFile.name}</Typography>
                        </>
                    )}

                    {imageUrl && (
                        <>
                            <img src={imageUrl} alt="Preview" style={{ maxWidth: '100%', marginTop: 16 }} />
                            <Typography variant="subtitle1" mt={2}>Mô tả AI:</Typography>
                            <Typography>{aiDescription}</Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Hủy</Button>
                    <Button onClick={handleConfirm} disabled={uploading || !imageUploadedUrl}>Xác nhận</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

import * as React from 'react';
import {
    Create,
    TabbedForm,
    TextInput,
    required,
    useCreateContext,
    useDefaultTitle,
    useNotify,
} from 'react-admin';
import { useFormContext } from 'react-hook-form';
import { ProductEditDetails } from './ProductEditDetails';
import { useState } from 'react';
import axios from 'axios';
import { CLOUDINARY_API_URL, CLOUDINARY_UPLOAD_PRESET } from '../../config/cloudinaryConfig';
import { ClipLoader } from 'react-spinners';
import ReactMarkdown from 'react-markdown';
const RichTextInput = React.lazy(() =>
    import('ra-input-rich-text').then(module => ({
        default: module.RichTextInput,
    }))
);

const ProductTitle = () => {
    const appTitle = useDefaultTitle();
    const { defaultTitle } = useCreateContext();

    return (
        <>
            <title>{`${appTitle} - ${defaultTitle}`}</title>
            <span>{defaultTitle}</span>
        </>
    );
};

const ProductCreate = () => {
    const [image, setImage] = useState(''); // State để lưu URL ảnh
    const [loading, setLoading] = useState(false); // State để quản lý trạng thái tải ảnh
    const notify = useNotify();

    console.log('URL ảnh:', image);
    return (
        <Create title={<ProductTitle />}>
            <TabbedForm defaultValues={{ sales: 0 }}>
                <TabbedForm.Tab
                    label="Images"
                    sx={{ maxWidth: '40em' }}
                >
                    <ImageUploadSection
                        image={image}
                        setImage={setImage}
                        loading={loading}
                        setLoading={setLoading}
                        notify={notify}
                    />
                </TabbedForm.Tab>
                <TabbedForm.Tab
                    label="details"
                    path="details"
                    sx={{ maxWidth: '40em' }}
                >
                    <ProductEditDetails />
                </TabbedForm.Tab>
                <TabbedForm.Tab label="Mô tả sản phẩm" path="description">
                    <ProductDescriptionTab image={image} />
                </TabbedForm.Tab>
            </TabbedForm>
        </Create>
    );
};
const ImageUploadSection = ({
    image,
    setImage,
    loading,
    setLoading,
    notify,
}: {
    image: string;
    setImage: React.Dispatch<React.SetStateAction<string>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    notify: any;
}) => {
    const { setValue } = useFormContext(); 

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        setLoading(true);
        try {
            const res = await axios.post(CLOUDINARY_API_URL, formData);
            const uploadedUrl = res.data.secure_url;
            setImage(uploadedUrl);
            setValue('imageProduct', uploadedUrl);
            notify('Ảnh đã được tải lên!');
        } catch (err) {
            console.error('Lỗi upload:', err);
            notify('Tải ảnh thất bại!', { type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {loading ? (
                <ClipLoader size={30} color="#123abc" />
            ) : (
                <>
                    <TextInput
                        source="imageProduct"
                        validate={required()}
                        onChange={(e) => {
                            const url = e.target.value;
                            setImage(url);
                            setValue('imageProduct', url);
                        }}
                        fullWidth
                    />
                    {image && (
                        <div style={{ marginTop: '10px' }}>
                            <img
                                src={image}
                                alt="Uploaded"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '200px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    padding: '5px',
                                }}
                            />
                        </div>
                    )}
                </>
            )}
        </>
    );
};
const ProductDescriptionTab = ({ image }: { image: string }) => {
    const { setValue } = useFormContext();
    const [markdownPreview, setMarkdownPreview] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const notify = useNotify();
    const description = (
        <div style={{ backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '6px' }}>
            <ReactMarkdown>{markdownPreview}</ReactMarkdown>
        </div>
    );
    const handleAnalyzeImage = async () => {
        if (!image) {
            alert('Vui lòng nhập URL ảnh trước!');
            return;
        }

        try {
            setIsAnalyzing(true);
            const res = await axios.post(
                'http://localhost:8080/api/admin/analyze-image',
                { imageUrl: image },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
                    },
                }
            );

            if (res.data?.description) {
                setMarkdownPreview(res.data.description);
                notify('Phân tích ảnh thành công!');
            } else {
                alert('Không có dữ liệu mô tả từ AI');
            }
        } catch (error) {
            console.error('Lỗi khi phân tích ảnh:', error);
            alert('Phân tích thất bại!');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleApplyDescription = () => {
        setValue('description', markdownPreview);
        notify('Đã áp dụng mô tả vào form');
    };

    return (
        <div>
            <React.Suspense fallback={<div>  <ClipLoader size={30} color="#123abc" /></div>}>
                <RichTextInput
                    source="description"
                    label="Mô tả sản phẩm"
                    validate={required()}
                    fullWidth
                />
            </React.Suspense>

            <button
                type="button"
                onClick={handleAnalyzeImage}
                disabled={isAnalyzing}
                style={{
                    marginTop: '10px',
                    padding: '8px 16px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
            >
                {isAnalyzing ? 'Đang phân tích...' : 'Sử dụng AI phân tích ảnh'}
            </button>

            {markdownPreview && (
                <div
                    style={{
                        marginTop: '20px',
                        padding: '16px',
                        backgroundColor: '#f9f9f9',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                    }}
                >
                    <h4>Xem trước kết quả:</h4>
                    <ReactMarkdown>{markdownPreview}</ReactMarkdown>
                    <button
                        type="button"
                        onClick={handleApplyDescription}
                        style={{
                            marginTop: '10px',
                            padding: '6px 12px',
                            backgroundColor: '#28a745',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        Áp dụng mô tả này
                    </button>
                </div>
            )}
        </div>
    );
};
export default ProductCreate;



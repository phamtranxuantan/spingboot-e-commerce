import * as React from 'react';
import {
    List,
    useRecordContext,
    Datagrid,
    TextField,
    NumberField,
    Create,
    Edit,
    SimpleForm,
    TextInput,
    NumberInput,
    ReferenceInput,
    SelectInput,
    EditButton,
    DeleteButton
} from 'react-admin';
import { Box } from '@mui/material';
import { ImageUploadDialogButton } from './updateImage/ImageUploadDialogButton';
// Custom Image Field Component
const CustomImageField = ({ source }: { source: string }) => {
    const record = useRecordContext();
    if (!record || !record[source]) {
        return <span>No Image</span>;
    }
    return (
        <img
            src={record[source]}
            alt="Product"
            style={{ width: '100px', height: 'auto', objectFit: 'cover' }}
        />
    );
};

// Filters for Product List
const postFilters = [
    <TextInput source="search" label="Search" alwaysOn />,
    <ReferenceInput source="categoryId" reference="categories" label="Category">
        <SelectInput optionText="categoryName" />
    </ReferenceInput>
];

// Product List Component
export const ProductList = () => (
    <List filters={postFilters}>
        <Datagrid rowClick={false}>
            <TextField source="productId" label="Product ID" />
            <TextField source="productName" label="Product Name" />
            <TextField source="categoryName" label="Category Name" />
            {/* <CustomImageField source="imageProduct" /> */}
           <CustomImageField source="imageProduct" label="Image" />
            <TextField source="description" label="Description" />
            <NumberField source="quantity" label="Quantity" />
            <NumberField source="price" label="Price" />
            <NumberField source="discount" label="Discount" />
            <NumberField source="specialPrice" label="Special Price" />
            <EditButton /> {/* Sử dụng EditButton để mở chế độ chỉnh sửa trong dialog */}
            <DeleteButton />
        </Datagrid>
    </List>
);

const RichTextInput = React.lazy(() =>
    import("ra-input-rich-text").then(module => ({
        default: module.RichTextInput,
    }))
);



const ImagePreview = () => {
    const record = useRecordContext();
    if (!record || !record.imageProduct) return null;

    return (
        <Box mb={2}>
            <img
                src={record.imageProduct}
                alt="Current"
                style={{ maxWidth: '200px', borderRadius: 8 }}
            />
        </Box>
    );
};
// Product Edit Component
export const ProductEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="productId" disabled />
            <ReferenceInput source="categoryId" reference="categories" label="Category">
                <SelectInput optionText="categoryName" />
            </ReferenceInput>
            <TextInput source="productName" />
            {/* <TextInput source="imageProduct" disabled /> */}
            <ImagePreview />
            <ImageUploadDialogButton/>
             <TextInput source="description" />
            <NumberInput source="quantity" />
            <NumberInput source="weight" label="Cân nặng(kg)" />
            <NumberInput source="price" />
            <NumberInput source="discount" />
            <NumberInput source="specialPrice" />
        </SimpleForm>
    </Edit>
);
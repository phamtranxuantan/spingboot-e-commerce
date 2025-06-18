import * as React from 'react';
import {
    NumberInput,
    ReferenceInput,
    required,
    SelectInput,
    TextInput,
} from 'react-admin';
import { InputAdornment, Grid } from '@mui/material';

export const ProductEditDetails = () => (
    <Grid container columnSpacing={2}>
        <Grid item xs={12} sm={8}>
            <TextInput source="productName" validate={req} />
        </Grid>
        <Grid item xs={12} sm={4}>
            <ReferenceInput source="categoryId" reference="categories">
                <SelectInput optionText="categoryName" validate={req} />
            </ReferenceInput>
        </Grid>
        <Grid item xs={12} sm={4}>
            <NumberInput
                source="weight"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">gam</InputAdornment>
                    ),
                }}
                validate={req}
            />
        </Grid>
        
        <Grid item xs={12} sm={4}>
            <NumberInput
                source="price"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                    ),
                }}
                validate={req}
            />
        </Grid>
        <Grid item xs={12} sm={4}>
            <NumberInput source="discount" validate={req} />
        </Grid>
        <Grid item xs={12} sm={4}>
            <NumberInput source="specialPrice" validate={req} />
        </Grid>
        <Grid item xs={12} sm={4}>
            <NumberInput source="quantity" validate={req} />
        </Grid>
        <Grid item xs={12} sm={4}>
            <NumberInput source="sales" validate={req} />
        </Grid>
    </Grid>
);

const req = [required()];
import { ArrayField, Datagrid, Identifier, ImageField, List, NumberField, Show, SimpleShowLayout, TextField, useNotify, useRecordContext, useRedirect, useRefresh } from "react-admin";
import PDFButton from '../../PDFButton';
const CustomPDFButton = () => {
    const record = useRecordContext();
    if (!record) {
        return (<span>Loading...</span>)
    }
    if (!record.id) {
        return (<span>No cart ID</span>)
    }
    return <PDFButton />
}

export const CartList = () => {
    const redirect = useRedirect();
    const handleRowClick = (id: Identifier | undefined, resource: string | undefined, record: { userEmail: string }) => {
        if (id) {
            localStorage.setItem("globalCartId", id.toString());
        }
        localStorage.setItem("globalEmailCart", record.userEmail);

        // In ra giá trị email
        console.log("giá trị email trong cart l:", record.userEmail);

        redirect('show', resource, id);
    };

    return (
        <List>
            <Datagrid rowClick={handleRowClick}>
                <TextField source="cartId" label="Cart ID" />
                <TextField source="totalPrice" label="Total Price" />
                <TextField source="userEmail" label="Email" />
            </Datagrid>
        </List>
    );
};
export const CartShow = () => {
    const notify = useNotify();
    const refresh = useRefresh();
    const redirect = useRedirect();
    const onError = (error:{message: any}) => {
        notify(`Could not load cart: ${error.message}`,{type:'error'});
        redirect('/carts');
        refresh();
    }
    if(!localStorage.getItem("globalEmailCart")){
        return <span>Error:Email is required</span>
    }

     return (
         <Show queryOptions={{
            meta:{email:localStorage.getItem("globalEmailCart")},
            onError,
         }}>
             <SimpleShowLayout>
                 <CustomPDFButton />
                 <TextField source="id" label="Cart ID" />
                 <NumberField source="totalPrice" label="Total Price" />
                 <ArrayField source="products" label="Products">
                     <Datagrid>
                         <TextField source="productName" label="Product Name" />
                         <ImageField source="imageProduct" label="Image" />
                         <TextField source="description" label="Description" />
                         <NumberField source="quantity" label="Quantity" />
                         <NumberField source="price" label="Price" />
                         <NumberField source="discount" label="Discount" />
                         <NumberField source="specialPrice" label="Special Price" />
                     </Datagrid>
                 </ArrayField>
             </SimpleShowLayout>
         </Show>
     )
 }
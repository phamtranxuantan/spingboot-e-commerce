import { Create, Datagrid, DeleteButton, Edit, EditButton, List, SimpleForm, TextField, TextInput } from "react-admin";

export const CategoryList = () => (
  <List>
    <Datagrid>
      <TextField source="categoryId" label="Category ID" />
      <TextField source="categoryName" label="Category Name" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const CategoryCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="categoryName" label="Category Name" />
    </SimpleForm>
  </Create>
);

export const CategoryEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="categoryId" label="Category ID" disabled />
      <TextInput source="categoryName" label="Category Name" />
    </SimpleForm>
  </Edit>
);
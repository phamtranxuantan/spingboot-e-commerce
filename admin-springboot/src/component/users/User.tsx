import { Datagrid, EmailField, ImageField, List, TextField } from "react-admin";

export const UserList = () => (
  <List>
    <Datagrid rowClick="edit">
      <ImageField source="imageUser" label="Avatar" /> {/* Hiển thị ảnh của users */}
      <TextField source="userId" label="ID" />
      <TextField source="mobileNumber" label="Mobile Number" />
      <EmailField source="email" label="Email" />
    </Datagrid>
  </List>
);

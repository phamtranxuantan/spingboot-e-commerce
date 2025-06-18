import CategoryIcon from '@mui/icons-material/Category';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Admin, CustomRoutes, Resource } from "react-admin";
import { Route } from "react-router-dom";
import { DashBoard } from "./Dashboard";
import { Layout } from "./Layout";
import { authProvider } from "./authProvider";
import { CartList, CartShow } from "./component/cart/Cart";
import { CategoryCreate, CategoryEdit, CategoryList } from "./component/category/Category";
import {  ProductEdit, ProductList } from "./component/products/Product";
import ProductCreate from './component/products/ProductCreate';
// import { UserSupport } from './component/support/UserSupport';
import { UserList } from "./component/users/User";
import { dataProvider } from "./dataProvider";
import SupportProfile from './component/support/SupportProfile';
export const App = () => (
  <Admin authProvider={authProvider} layout={Layout} dataProvider={dataProvider} dashboard={DashBoard}>
    <CustomRoutes>
      <Route path="/support-profile" element={<SupportProfile />} /> {/* Thêm route cho SupportProfile */}
    </CustomRoutes>
    <Resource name="categories" list={CategoryList} create={CategoryCreate} edit={CategoryEdit} icon={CategoryIcon} />
    <Resource name="products" create={ProductCreate} edit={ProductEdit} list={ProductList} icon={Inventory2Icon} />
    <Resource name="carts" list={CartList} show={CartShow} icon={ShoppingCartIcon} />
    <Resource name="users" list={UserList} />
    <Resource
      name="support"
      list={SupportProfile}
      options={{ label: "Support" }}
      recordRepresentation={(record) => record.supportName}
    />
  </Admin>
);
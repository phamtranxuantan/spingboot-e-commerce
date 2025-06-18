import axios from "axios";
import {
  CreateParams,
  CreateResult,
  DataProvider,
  DeleteManyParams,
  DeleteManyResult,
  DeleteParams,
  DeleteResult,
  GetManyParams,
  GetManyReferenceParams,
  GetManyReferenceResult,
  GetManyResult,
  GetOneParams,
  GetOneResult,
  QueryFunctionContext,
  RaRecord,
  UpdateManyParams,
  UpdateManyResult,
  UpdateParams,
  UpdateResult
} from 'react-admin';

const apiUrl = "http://localhost:8080/api";
const httpClient = {
  get: (url: string) => {
    const token = localStorage.getItem('jwt-token');
    return axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    }).then(response => ({ json: response.data }))
      .catch(error => {
        console.error('API request failed:', error);
        throw error;
      });
  },
  post: (url: string, data: any) => {
    const token = localStorage.getItem('jwt-token');
    return axios.post(url, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    }).then(response => ({ json: response.data }))
      .catch(error => {
        console.error('API request failed:', error);
        throw error;
      });
  },
  put: (url: string, data: any) => {
    const token = localStorage.getItem('jwt-token');

    return axios.put(url, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    }).then(response => ({ json: response.data }))
      .catch(error => {
        console.error('API request failed:', error);
        throw error;
      });
  },
  delete: (url: string, p0:{data:{ids:any[];};}) => {
    const token = localStorage.getItem('jwt-token');
    return axios.delete(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    }).then(response => ({ json: response.data }))
      .catch(error => {
        console.error('API request failed:', error);
        throw error;
      });
  },
};

export const dataProvider: DataProvider = {
  getList: (resource: string, { filter = {}, ...rest }) => {
    let url: string;
    if (resource === "adminChatMessages") {
      const {  admin,user  } = filter;
      url = `${apiUrl}/admin/chat/messages?sender=${encodeURIComponent(admin)}&receiver=${encodeURIComponent(user)}`;
    } else if (resource === "userChatMessages") {
      const { sender, receiver } = filter;
      url = `${apiUrl}/public/users/chat/messages?sender=${encodeURIComponent(sender)}&receiver=${encodeURIComponent(receiver)}`;
    } else if (resource === "adminChatUsers") {
      const adminEmail = localStorage.getItem("adminEmail");
      url = `${apiUrl}/admin/chat/users?adminEmail=${encodeURIComponent(adminEmail || '')}`;
    } else {
      const { pagination = { page: 0, perPage: 10 }, sort = { field: 'id', order: 'ASC' } } = rest;
      const { page = 0, perPage = 10 } = pagination;
      const { field, order } = sort;
      const sortField = resource === 'users' ? 'userId' : field;
      const idFieldMapping: { [key: string]: string } = {
          products: 'productId',
          categories: 'categoryId',
          carts: 'cartId',
      };
      const pageNumber = page - 1;
      const idField = idFieldMapping[resource] || 'id';

      const query = {
          pageNumber: pageNumber.toString(),
          pageSize: perPage.toString(),
          sortBy: sortField,
          sortOrder: order,
          ...filter,
      };
      // const username = localStorage.getItem('username');
      if (resource === "users") {
          url = `${apiUrl}/admin/users?${new URLSearchParams(query).toString()}`;
      } else if (filter.search) {
          const keyword = filter.search;
          delete query.search;
          url = `${apiUrl}/public/${resource}/keyword/${encodeURIComponent(keyword)}?${new URLSearchParams(query).toString()}`;
      } else if (filter.categoryId) {
          const categoryId = filter.categoryId;
          delete query.categoryId;
          url = `${apiUrl}/public/categories/${categoryId}/${resource}?${new URLSearchParams(query).toString()}`;
      } else {
          url = resource === "carts"
              ? `${apiUrl}/admin/${resource}`
              : `${apiUrl}/public/${resource}?${new URLSearchParams(query).toString()}`;
      }
    }

    console.log('[Request URL]:', url);

    return httpClient.get(url)
        .then(({ json }) => {
            if (resource === "adminChatMessages" || resource === "userChatMessages") {
                // Loại bỏ tin nhắn trùng lặp dựa trên `id` hoặc `timestamp`
                const uniqueMessages = json.filter(
                  (msg: any, index: number, self: any[]) =>
                    index === self.findIndex((m) => m.id === msg.id)
                );
                return { data: uniqueMessages, total: uniqueMessages.length };
            }
            if (resource === "adminChatUsers") {
                // API trả về danh sách email, chuyển đổi thành đối tượng
                const data = json.map((email: string) => ({ email }));
                return { data, total: data.length };
            }
            const userImageBaseUrl = 'http://localhost:8080/api/public/users/imageUser/';
            //const productImageBaseUrl = 'http://localhost:8080/api/public/products/imageProduct/';
            const idFieldMapping: { [key: string]: string } = {
                products: 'productId',
                categories: 'categoryId',
                carts: 'cartId',
                users: 'userId', // Mapping cho users
            };

            const idField = idFieldMapping[resource] || 'id';

            const data = json.content.map((item: { [key: string]: any }) => ({
                id: item[idField],
                ...item,
                imageUser: resource === "users" && item.imageUser ? `${userImageBaseUrl}${item.imageUser}` : null, // URL đầy đủ cho imageUser
                //imageProduct: resource === "products" && item.imageProduct ? `${productImageBaseUrl}${item.imageProduct}` : null, // URL đầy đủ cho imageProduct
            }));

            console.log('[Data list]:', data);

            return {
                data,
                total: json.totalElements,
            };
        })
        .catch(error => {
            console.error('[Error fetching data]:', error);
            throw error;
        });
  },

  delete: async <RecordType extends RaRecord = any>(resource: string, params: DeleteParams<RecordType>): Promise<DeleteResult<RecordType>> => {
    try {
      const url = `${apiUrl}/admin/${resource}/${params.id}`;
      await httpClient.delete(url, {
        data: {
          ids: [params.id],
        },
      });
      return {
        data: params.previousData as RecordType,
      };
    } catch (error) {
      console.error('API request failed:', error);
      throw new Error('Error deleting record');
    }
  },
  deleteMany: async <RecordType extends RaRecord>(
    resource: string,
    params: DeleteManyParams
  ): Promise<DeleteManyResult<RecordType>> => {
    const { ids } = params;
    try {
      const deletePromises = ids.map(id => {
        const url = `${apiUrl}/admin/${resource}/${id}`;
        return httpClient.delete(url, {
          data: {
            ids: [id],
          },
        });
      });
      await Promise.all(deletePromises);
      return {
        data: ids,
      };
    } catch (error) {
      console.error('API request failed:', error);
      throw new Error('Error deleting records');
    }
  },
  getManyReference: function <RecordType extends RaRecord = any>(resource: string, params: GetManyReferenceParams & QueryFunctionContext): Promise<GetManyReferenceResult<RecordType>> {
    throw new Error('Function not implemented.');
  },
  updateMany: function <RecordType extends RaRecord>(resource: string, params: UpdateManyParams): Promise<UpdateManyResult<RecordType>> {
    throw new Error('Function not implemented.');
  },
  create: async (resource: string, params: CreateParams): Promise<CreateResult> => {
    try {
      let url: string;
      if (resource === "adminChatMessages") {
        url = `${apiUrl}/admin/chat/messages`; // API gửi tin nhắn
      } else if (resource === "adminChatState") {
        const { admin, user } = params.data;
        if (!admin || !user) {
          throw new Error("Missing required parameters: admin or user");
        }
        // Truyền tham số `admin` và `user` qua query string
        url = `${apiUrl}/admin/chat/update-state?admin=${encodeURIComponent(admin)}&user=${encodeURIComponent(user)}`;
      } else if (resource === "products") {
        url = `${apiUrl}/admin/categories/${params.data.categoryId}/${resource}`;
        delete params.data.categoryId;
       // params.data.imageProduct = "default.png";
      } else {
        url = `${apiUrl}/admin/${resource}`;
      }
  
      const { data } = params;
      const response = await httpClient.post(url, data);
      return { data: { ...data, id: response.json.id } };
    } catch (error) {
      console.error("Error creating resource:", error);
      throw error;
    }
  },
  update: async (resource: string, params: UpdateParams): Promise<UpdateResult> => {
    const url = `${apiUrl}/admin/${resource}/${params.id}`;
    const { data } = params;
    const result = await httpClient.put(url, data);
    const updatedData = {
      id: params.id,
      ...result.json
    };
    return { data: updatedData };
  },

  getOne: async (
    resource: string,
    params: GetOneParams
  ): Promise<GetOneResult> => {
    console.log(
      "GetOne called for resource:",
      resource,
      "With params: ",
      params
    );
    let url: string;
    if (resource === "carts") {
      url = `${apiUrl}/public/users/${params.meta.email}/${resource}/${params.id}`;
    } else {
      url = `${apiUrl}/public/${resource}/${params.id}`;
    }
    const result = await httpClient.get(url);

    console.log("API Response: ", result.json);

    const idFieldMapping: { [key: string]: string } = {
      products: "productId",
      categories: "categoryId",
      carts: "cartId",
    };
    const idField = idFieldMapping[resource] || "id";
    let data;

    if (resource === "carts") {
      data = {
        id: result.json[idField],
        totalPrice: result.json.totalPrice,
        products: result.json.products.map((product: any) => ({
          id: product.productId,
          productName: product.productName,
          imageProduct: product.imageProduct,
          description: product.description,
          quantity: product.quantity,
          price: product.price,
          discount: product.discount,
          specialPrice: product.specialPrice,
          category: product.category ? {
            id: product.category.categoryId,
            name: product.category.categoryName,
          } : null,
        })),
      };
    } else {
      data = {
        id: result.json[idField],
        ...result.json,
      };
    }
    console.log("Data:", data);
    return { data };
  },
    
  getMany: async (resource: string, params: GetManyParams): Promise<GetManyResult> => {
    const idFieldMapping: { [key: string]: string } = {
      products: 'productId',
      categories: 'categoryId',
      // Add more mappings as needed
    };
    console.log('Request resource:', resource);
    console.log('Request params', params);
    const idField = idFieldMapping[resource] || 'id';
    const ids = params.ids.join(',');
    let url: string;
    if (resource === "products") {
      url = `${apiUrl}/public/categories/${ids}/${resource}`;
    } else {
      url = `${apiUrl}/public/${resource}`;
    }
    console.log('Request URL getMany:', url);
    const result = await httpClient.get(url);
    console.log('Request result:', result);
    console.log('Request result JSON:', result.json);
    const data = result.json.content.map((item: any) => ({ id: item[idField], ...item }));
    return { data };
  },
  
};
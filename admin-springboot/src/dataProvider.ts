import jsonServerProvider from "ra-data-json-server";
import axios from "axios";
import {
  CreateParams,
  CreateResult,
  DataProvider,
  DeleteManyParams,
  DeleteManyResult,
  DeleteParams,
  DeleteResult,
  GetListParams,
  GetListResult,
  GetManyParams,
  GetManyReferenceParams,
  GetManyReferenceResult,
  GetManyResult,
  GetOneParams,
  GetOneResult,
  Identifier,
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
  getList: (resource: string, { pagination = { page: 0, perPage: 10 }, sort = { field: 'id', order: 'ASC' }, filter = {} }) => {
    const { page = 0, perPage = 10 } = pagination;
    const { field, order } = sort;

    const idFieldMapping: { [key: string]: string } = {
        products: 'productId',
        categories: 'categoryId',
        carts: 'cartId',
    };

    const idField = idFieldMapping[resource] || 'id';

    const query = {
        pageNumber: page.toString(),
        pageSize: perPage.toString(),
        sortBy: field,
        sortOrder: order,
        ...filter,
    };

    const username = localStorage.getItem('username');
    console.log('[User email]:', username);
    console.log('[Filter]:', filter);

    let url: string;

    if (filter.search) {
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

    console.log('[Request URL]:', url);

    return httpClient.get(url)
        .then(({ json }) => {
            const baseUrl = 'http://localhost:8080/api/public/products/image/';
            const data = json.content.map((item: { [key: string]: any }) => ({
                id: item[idField],
                ...item,
                image: typeof item.image === 'string' ? `${baseUrl}${item.image}` : null,
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
      console.log("data", params);
      let url: string;
      if (resource === "products") {
        url = `${apiUrl}/admin/categories/${params.data.categoryId}/${resource}`;
        delete params.data.categoryId;
        params.data.image = 'default.png';
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
    const baseUrl = "http://localhost:8080/api/public/products/image/";
    let data;

    if (resource === "carts") {
      data = {
        id: result.json[idField],
        totalPrice: result.json.totalPrice,
        products: result.json.products.map((product: any) => ({
          id: product.productId,
          productName: product.productName,
          image: product.image ? `${baseUrl}${product.image}` : null,
          description: product.description,
          quantity: product.quantity,
          price: product.price,
          discount: product.discount,
          specialPrice: product.specialPrice,
          category: product.category
            ? {
              id: product.category.categoryId,
              name: product.category.categoryName,
            }
            : null,
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
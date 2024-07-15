import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";

const sleep = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

const BASE_URL =  "http://localhost:8080/api/v1/";

axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const responseBody = (response: AxiosResponse) => response.data;

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const handleError = (error: any) => {
  const { data, status } = error.response;
  switch (status) {
    case 400:
      if (data.errors) {
        const modelStateError: string[] = [];
        for (const key in data.errors) {
          if (data.errors[key]) {
            modelStateError.push(data.errors[key]);
          }
        }
        throw modelStateError.flat();
      }
      toast.error(data.title);
      break;
    case 401:
    case 404:
    case 500:
      toast.error(data.title);
      break;
    default:
      toast.error("Something unexpected went wrong");
      break;
  }
  return Promise.reject(error.response);
};

axiosInstance.interceptors.response.use(
  async (response) => {
    await sleep();
    return response;
  },
  handleError
);

const requests = {
  get: (url: string) => axiosInstance.get(url).then(responseBody),
  post: (url: string, body: {}) => axiosInstance.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axiosInstance.put(url, body).then(responseBody),
  delete: (url: string) => axiosInstance.delete(url).then(responseBody),
};

const createListEndpoint = (endpoint: string, defaultSortBy: string, defaultSortDir: string = "asc") => {
  return (pageNo: number, pageSize: number) => requests.get(`${endpoint}?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${defaultSortBy}&sortDir=${defaultSortDir}`);
};

interface Product {
  productId: number;
  name: string;
  // Add other product fields
}

interface Brand {
  brandId: number;
  name: string;
  // Add other brand fields
}

const Products = {
  list: createListEndpoint("product", "productId"),
  addMilk: (product: Product) => requests.post("product", product),
  updateMilk: (product: Product) => requests.put("product/update", product),
  delete: (productId: number) => requests.delete(`product/delete/${productId}`),
};

const Brand = {
  list: createListEndpoint("brand", "brandId"),
  updateBrand: (brand: Brand) => requests.put("brand/update", brand),
  addBrand: (brand: Brand) => requests.post("brand", brand),
  delete: (brandId: number) => requests.delete(`brand/delete/${brandId}`),
};

const Category = {
  list: createListEndpoint("categories", "categoryId"),
  updateCategory: (category: any) => requests.put("categories", category),
  addCategory: (category: any) => requests.post("categories", category),
  delete: (categoryId: number) => requests.delete(`categories/${categoryId}`),
};

const Blog = {
  list: createListEndpoint("blogs", "blogId"),
  updateBlog: (blog: any) => requests.put("blogs", blog),
  addBlog: (blog: any) => requests.post("blogs", blog),
  delete: (blogId: number) => requests.delete(`blogs/${blogId}`),
};

const Voucher = {
  list: createListEndpoint("vouchers", "voucherId"),
  manageVouchers: (pageNo: number, pageSize: number, sortBy: string = "voucherId", sortDir: string = "asc") => {
    return requests.get(`vouchers/manage?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`);
  },
  getMemberVouchers: (userId: number) => requests.get(`vouchers/member?userId=${userId}`),
  addVoucherForMember: (userId: number, voucherId: number) => requests.post(`vouchers/member?userId=${userId}&voucherId=${voucherId}`, {}),
  addVoucher: (voucher: any) => requests.post("vouchers", voucher),
  updateVoucher: (voucher: any) => requests.put("vouchers", voucher),
  deleteVoucher: (voucherId: number) => requests.delete(`vouchers/${voucherId}`),
};

const Address = {
  listByUserId: (userId: number, pageNo: number, pageSize: number) => {
    return requests.get(`address/user?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=addressId&sortDir=asc&userId=${userId}`);
  },
  updateDefaultAddress: (userId: number, addressOldId: number, addressNewId: number) => {
    return requests.put(`address/default?userId=${userId}&addressOldId=${addressOldId}&addressNewId=${addressNewId}`, {});
  },
  updateAddress: (_addressId: number, updatedAddress: any) => {
    return requests.put(`address`, updatedAddress);
  },
  addNewAddress: (newAddress: any) => requests.post(`address`, newAddress),
};

const Orders = {
  getOrders: (pageNo: number, pageSize: number, sortBy: string = "orderId", sortDir: string = "asc") => {
    return requests.get(`orders?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`);
  },
  getOrderById: async (orderId: number) => requests.get(`orders/order/${orderId}`),
  searchOrders: (pageNo: number, pageSize: number, sortBy: string = "orderId", sortDir: string = "asc", orderDateFrom: string, orderDateTo: string) => {
    return requests.get(`orders/search?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}&orderDateFrom=${orderDateFrom}&orderDateTo=${orderDateTo}`);
  },
};

const Users = {
  list: (pageNo: number, pageSize: number, sortBy: string = "userId", sortDir: string = "asc") => {
    return requests.get(`users?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`);
  },
};

const agent = {
  Products,
  Brand,
  Category,
  Address,
  Voucher,
  Blog,
  Orders,
  Users,
};

export default agent;

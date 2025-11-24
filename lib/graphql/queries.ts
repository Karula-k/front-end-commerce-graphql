import { gql } from "@apollo/client";
import { Product } from "@/lib/stores/cart-store";

// GraphQL Response Types
export interface GetProductsResponse {
  getProducts: Product[];
}

export interface GetProductResponse {
  getProduct: Product;
}

export interface GetOrderResponse {
  getOrder: {
    id: string;
    userId: string;
    orderNumber: string;
    orderStatus: string;
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
    items?: any[]; // Adjust type if you have a specific type for items
  };
}

// Product Queries
export const GET_PRODUCTS = gql`
  query GetProducts(
    $name: String
    $category: String
    $minPrice: Float
    $maxPrice: Float
  ) {
    getProducts(
      name: $name
      category: $category
      minPrice: $minPrice
      maxPrice: $maxPrice
    ) {
      id
      name
      price
      stock
      category
      createdAt
      updatedAt
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: String!) {
    getProduct(id: $id) {
      id
      name
      price
      stock
      category
      createdAt
      updatedAt
    }
  }
`;

// User Queries
export const GET_ALL_USERS = gql`
  query GetAllUsers {
    allUsers {
      id
      name
      orders {
        id
        orderNumber
        orderStatus
        totalAmount
        createdAt
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: String!) {
    getUser(id: $id) {
      id
      name
      orders {
        id
        orderNumber
        orderStatus
        totalAmount
        createdAt
        updatedAt
      }
    }
  }
`;

// Order Queries
export const GET_ORDERS = gql`
  query GetOrders {
    getOrders {
      id
      userId
      orderNumber
      orderStatus
      totalAmount
      createdAt
      updatedAt
    }
  }
`;

export const GET_ORDER = gql`
  query GetOrder($id: String!) {
    getOrder(id: $id) {
      id
      userId
      orderNumber
      orderStatus
      totalAmount
      createdAt
      updatedAt
    }
  }
`;

// Order Product Queries
export const GET_ORDER_PRODUCTS = gql`
  query GetOrderProducts {
    getOrderProducts {
      id
      orderId
      productId
      quantity
      price
      createdAt
      updatedAt
      product {
        id
        name
        price
        stock
        category
      }
      order {
        id
        orderNumber
        orderStatus
        totalAmount
      }
    }
  }
`;

export const GET_ORDER_PRODUCT = gql`
  query GetOrderProduct($id: String!) {
    getOrderProduct(id: $id) {
      id
      orderId
      productId
      quantity
      price
      createdAt
      updatedAt
      product {
        id
        name
        price
        stock
        category
      }
      order {
        id
        orderNumber
        orderStatus
        totalAmount
      }
    }
  }
`;

// Transaction Queries
export const GET_TRANSACTIONS = gql`
  query GetTransactions {
    transactions {
      id
      orderId
      paymentStatus
      amount
      createdAt
      updatedAt
      urlString
      urlExpiry
      order {
        id
        orderNumber
        orderStatus
        totalAmount
      }
    }
  }
`;

export const FIND_ONE_TRANSACTION = gql`
  query FindOneTransaction($id: String!) {
    findOne(id: $id) {
      id
      orderId
      paymentStatus
      amount
      createdAt
      updatedAt
      urlString
      urlExpiry
      order {
        id
        orderNumber
        orderStatus
        totalAmount
      }
    }
  }
`;

// Product Mutations
export const CREATE_PRODUCT = gql`
  mutation CreateProduct($data: CreateProductInput!) {
    createProduct(data: $data) {
      id
      name
      price
      stock
      category
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($data: UpdateProductInput!) {
    updateProduct(data: $data) {
      id
      name
      price
      stock
      category
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_PRODUCT = gql`
  mutation RemoveProduct($id: String!) {
    removeProduct(id: $id)
  }
`;

// User Mutations
export const REGISTER_USER = gql`
  mutation RegisterUser($data: CreateUserInput!) {
    registerUser(data: $data) {
      id
      name
      orders {
        id
        orderNumber
        orderStatus
        totalAmount
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($data: CreateUserInput!, $id: String!) {
    updateUser(data: $data, id: $id) {
      id
      name
      orders {
        id
        orderNumber
        orderStatus
        totalAmount
      }
    }
  }
`;

// Order Mutations
export const CREATE_ORDER = gql`
  mutation CreateOrder($data: CreateOrderInput!) {
    createOrder(data: $data) {
      id
      userId
      orderNumber
      orderStatus
      totalAmount
      createdAt
      updatedAt
    }
  }
`;

// Order Product Mutations
export const CREATE_ORDER_PRODUCT = gql`
  mutation CreateOrderProduct($data: CreateOrderProductInput!) {
    createOrderProduct(data: $data) {
      id
      orderId
      productId
      quantity
      price
      createdAt
      updatedAt
      product {
        id
        name
        price
      }
      order {
        id
        orderNumber
      }
    }
  }
`;

export const UPDATE_ORDER_PRODUCT = gql`
  mutation UpdateOrderProduct($data: UpdateOrderProductInput!) {
    updateOrderProduct(data: $data) {
      id
      orderId
      productId
      quantity
      price
      createdAt
      updatedAt
      product {
        id
        name
        price
      }
      order {
        id
        orderNumber
      }
    }
  }
`;

// Transaction Mutations
export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($createTransactionInput: CreateTransactionInput!) {
    createTransaction(createTransactionInput: $createTransactionInput) {
      id
      orderId
      paymentStatus
      amount
      createdAt
      updatedAt
      urlString
      urlExpiry
      order {
        id
        orderNumber
      }
    }
  }
`;

export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction(
    $id: String!
    $updateTransactionInput: UpdateTransactionInput!
  ) {
    updateTransaction(
      id: $id
      updateTransactionInput: $updateTransactionInput
    ) {
      id
      orderId
      paymentStatus
      amount
      createdAt
      updatedAt
      urlString
      urlExpiry
    }
  }
`;

export const REMOVE_TRANSACTION = gql`
  mutation RemoveTransaction($id: String!) {
    removeTransaction(id: $id)
  }
`;

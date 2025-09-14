// Common pagination interface
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Generic paginated response
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// Common error response
export interface ErrorResponse {
  message: string | string[];
  error?: string;
  statusCode: number;
}

// Item-specific types
export interface ItemResponse {
  id: number;
  code: string;
  name: string;
  description: string | null;
  unit: string;
  category: string | null;
  stockMin: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CodeExistsResponse {
  exists: boolean;
}

// Quote-specific types
export interface QuoteResponse {
  id: number;
  customerId?: number;
  customerName: string;
  customerEmail?: string;
  status: string;
  totalAmount: number;
  taxAmount: number;
  totalWithTax: number;
  validUntil: Date;
  lines: QuoteLineResponse[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface QuoteLineResponse {
  id: number;
  quoteId: number;
  itemId: number;
  itemCode: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

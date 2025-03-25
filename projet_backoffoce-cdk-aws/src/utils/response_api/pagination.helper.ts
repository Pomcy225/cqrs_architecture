import { HttpStatus } from '@nestjs/common';

export interface PaginationResult<T> {
  statusCode: number;
  data: any;
  total;
  page: number;
  limit: number;
  totalPages: number;
}
export function paginate<T>(
  firstData: any,
  page: number,
  limit: number,
): PaginationResult<T> {
  const total = firstData.length;

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + Number(limit);

  if (startIndex >= total) {
    const paginatedData = [];
  }

  const data = firstData.slice(startIndex, endIndex);

  return {
    statusCode: HttpStatus.OK,
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

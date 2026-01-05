type IOption = {
   page?: string | number;
   limit?: string | number;
   sortBy?: string;
   sortOrder?: string;
};

type IOptionResult = {
   page: number;
   limit: number;
   skip: number;
   sortBy: string;
   sortOrder: string;
};

const paginationSortingHelper = (options: IOption): IOptionResult => {
   // Pagination
   const page: number = Number(options.page) || 1;
   const limit: number = Number(options.limit) || 10;
   const skip = (page - 1) * limit;

   // Sorting
   const sortBy: string = options.sortBy || "createdAt";
   const sortOrder: string = options.sortOrder || "desc";

   return {
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
   };
};

export default paginationSortingHelper;

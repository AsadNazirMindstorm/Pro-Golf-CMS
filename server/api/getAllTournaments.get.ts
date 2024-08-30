import tournamentDAO from "~/DAO/tournamentDAO";
import { ServerResponse } from "~/schemas/responseSchema";
import { Tournament } from "~/schemas/tournamentSchema";

export default defineEventHandler(async (event) => {
  let serverResponse: ServerResponse;

  try {
    const query = getQuery(event);
    const itemsPerPage = parseInt(query.itemsPerPage as string, 10) || 10; // Default to 10 if not provided
    const page = parseInt(query.page as string, 10) || 1; // Default to 1 if not provided
    const search: string = query.search as string || "";

    //console.log(itemsPerPage, page);

    // Ensure itemsPerPage and page are positive integers
    if (itemsPerPage <= 0 || page <= 0) {
      throw new Error("Invalid pagination parameters");
    }

    // Calculate offset
    const offset = (page - 1) * itemsPerPage;

    // Fetch paginated data from DAO
    const paginatedData: Tournament[] = await tournamentDAO.getAll(itemsPerPage, offset, search);
    const totalItems = await tournamentDAO.getCount(search);
  
    return (serverResponse = {
      success: true,
      data: {
        items: paginatedData,
        totalCount:totalItems, // Total number of items
        itemsPerPage,
        currentPage: page,
        totalPages: Math.ceil(paginatedData.length / itemsPerPage) // Calculate total pages
      },
    });
  } catch (error:any) {
    return (serverResponse = {
      success: false,
      message: error.message,
    });
  }
});

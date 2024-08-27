import tournamentDAO from "~/DAO/tournamentDAO";
import { ServerResponse } from "~/schemas/responseSchema";

export default defineEventHandler(async (event) => {
  let serverResponse: ServerResponse;

  try {
    const query = getQuery(event);
    const itemsPerPage = parseInt(query.itemsPerPage as string, 10) || 10; // Default to 10 if not provided
    const page = parseInt(query.page as string, 10) || 1; // Default to 1 if not provided

    console.log(itemsPerPage, page);

    // Ensure page and itemsPerPage are positive integers
    if (itemsPerPage <= 0 || page <= 0) {
      throw new Error("Invalid pagination parameters");
    }

    // Fetch all data
    const allData = await tournamentDAO.getAll();

    // Calculate the pagination slice
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = allData.slice(startIndex, endIndex);

    return serverResponse = {
      success: true,
      data: {
        items: paginatedData,
        totalCount: allData.length,
        itemsPerPage,
        currentPage: page,
      },
    };
  } catch (error) {
    return (serverResponse = {
      success: false,
      message: error,
    });
  }
});

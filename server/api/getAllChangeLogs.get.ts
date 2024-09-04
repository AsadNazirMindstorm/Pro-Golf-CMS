import changlogDAO, { Changelog } from "~/DAO/changlogDAO";
import { ServerResponse } from "~/schemas/responseSchema";

export default defineEventHandler(async (event) => {
  let serverResponse: ServerResponse;
  try {
    const query = getQuery(event);
    const itemsPerPage = parseInt(query.itemsPerPage as string, 10) || 10; // Default to 10 if not provided
    const page = parseInt(query.page as string, 10) || 1; // Default to 1 if not provided
    const search: string = (query.search as string) || "";

    // console.log(page, itemsPerPage);

    const changelogs = await changlogDAO.getAll(itemsPerPage, page - 1, search);

    return (serverResponse = {
      success: true,
      data: {
        items: changelogs,
        itemCount: changelogs?.length,
      },
    });
  } catch (error: any) {
    return (serverResponse = {
      success: false,
      message: "Error Occured while fetching the records",
    });
  }
});

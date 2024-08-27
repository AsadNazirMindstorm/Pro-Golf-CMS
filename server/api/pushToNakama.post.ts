import { Client, RpcResponse, Session } from "@heroiclabs/nakama-js";
import {
  HOST,
  KEY,
  PORT,
  useSSL,
  PASSWORD,
  EMAIL,
  IStorageRequest,
  COLLECTION_NAME,
} from "~/constants/nakama";
import tournamentDAO from "~/DAO/tournamentDAO";
import { ServerResponse } from "~/schemas/responseSchema";
import { Tournament } from "~/schemas/tournamentSchema"; // Import UUID library for generating unique device ID

export default defineEventHandler(async (event) => {
  let serverResponse: ServerResponse;

  try {
    const body: Tournament[] = await readBody(event);

    // Filter out tournaments that haven't been pushed to Nakama
    const dataTobePushed: Tournament[] = body.filter(
      (ele) => !ele.pushedToNakama
    );

    // Initialize Nakama client
    const client = new Client(KEY, HOST, PORT, useSSL);

    // Authenticate using device ID
    let session: Session;
    try {
      session = await client.authenticateEmail(EMAIL, PASSWORD);
    } catch (authError: any) {
      // Handle authentication failure
      return (serverResponse = {
        success: false,
        message: authError,
      });
    }

    // Assuming you have a custom RPC called "push_tournaments" in Nakama
    const rpcId = "storagerpc";

    dataTobePushed.forEach(async (ele) => {
      let tmpObj: IStorageRequest = {
        collectionName: COLLECTION_NAME,
        key: ele.metaData.category,
        value: ele,
      };
      // Call the custom RPC function with the tournament data
      const rpcRes: RpcResponse = await client.rpc(session, rpcId, tmpObj);

      if (rpcRes.payload?.success) {
        await tournamentDAO.updateStatus(ele.metaData.category, true);
      } else {
        console.log(ele.metaData.category + " could not be pushed");
      }
    });

    // Return the result from the RPC call
    serverResponse = {
      success: true,
      data: false,
    };
  } catch (error: any) {
    serverResponse = {
      success: false,
      message: error.message || "An unexpected error occurred.",
    };
  }

  return serverResponse;
});

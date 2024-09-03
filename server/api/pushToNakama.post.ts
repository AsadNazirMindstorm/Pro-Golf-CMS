import { Client, RpcResponse, Session } from "@heroiclabs/nakama-js";
import { validate } from "@jsonforms/core";
import { useAjv } from "~/composable/Ajv";
import {
  HOST,
  KEY,
  PORT,
  useSSL,
  PASSWORD,
  EMAIL,
  IStorageRequest,
  COLLECTION_NAME,
  TOURNAMENT_STORAGE_RPC,
} from "~/constants/nakama";
import tournamentDAO from "~/DAO/tournamentDAO";
import { ServerResponse } from "~/schemas/responseSchema";
import { Tournament } from "~/schemas/tournamentSchema";


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

    // Authenticate using email password
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

    //validate tournament data
    dataTobePushed.forEach(async (ele) => {

      //tmp obj for storing tournament
      let tmpTournamentObj: Tournament = {
        availabiltyData: ele.availabiltyData,
        metaData: ele.metaData,
        holeData: ele.holeData,
      };

      if (!useAjv().validateTournament(tmpTournamentObj))
        throw new Error("JSON is not valid");

      //Time Conversion
      tmpTournamentObj.availabiltyData.endDateTime = new Date(
        ele.availabiltyData.endDateTime
      )
        .getTime()
        .toString(); // epoc times
      tmpTournamentObj.availabiltyData.startDateTime = new Date(
        ele.availabiltyData.startDateTime
      )
        .getTime()
        .toString(); //epoc times

      let storageReqObj: IStorageRequest = {
        collectionName: COLLECTION_NAME,
        key: tmpTournamentObj.metaData.category,
        value: tmpTournamentObj,
      };

      // Call the custom RPC function with the tournament data
      const rpcRes: RpcResponse = await client.rpc(
        session,
        TOURNAMENT_STORAGE_RPC,
        storageReqObj
      );

      if (
        !rpcRes.payload?.success ||
        rpcRes.payload === undefined ||
        rpcRes.payload?.success == undefined
      ) {
        throw new Error("An error occurred while pushing to nakama");
      } else {
        const id = await tournamentDAO.updateStatus(
          ele.metaData.category,
          true
        );
      }
    });

    // Return the result from the RPC call
    serverResponse = {
      success: true,
      data: false,
    };
  } catch (error: any) {
    return (serverResponse = {
      success: false,
      message: error.message || "An unexpected error occurred.",
    });
  }

  return serverResponse;
});

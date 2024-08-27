// var useSSL = false; // Enable if server is run with an SSL certificate.
//     var client = new Client("defaultkey", "13.60.75.218", "7350", useSSL);
//     const deviceId = "9158C14D-BAE4-52F9-8733-418481F701B9";
//     const session = await client.authenticateDevice(deviceId, true, "umairhassan");
export const HOST = "13.60.75.218";
export const KEY = "defaultkey";
export const PORT = "7350";
export const useSSL = false;
export const EMAIL = "asad@gmail.com";
export const PASSWORD = "12137628713xks";
export const COLLECTION_NAME="Tournaments";

export interface IStorageRequest{
    collectionName:string
    key:string
    value:any
}

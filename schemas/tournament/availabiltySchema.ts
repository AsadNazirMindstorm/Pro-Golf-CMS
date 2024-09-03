import { type JSONSchemaType } from 'ajv';

export interface Availability {
    startDateTime: string;
    endDateTime: string;
    totalTime: number;
    userPlayTime: number;
}

export const AvailabilitySchema: JSONSchemaType<Availability> = {
    type: 'object',
    properties: {
        startDateTime: {
            type: 'string',
            format: 'date-time', // ISO 8601 format for date-time strings         
        },
        endDateTime: {
            type: 'string',
            format: 'date-time', // ISO 8601 format for date-time strings
        },
        totalTime: {
            type: 'number',
            description: 'Total time in minutes or hours',
            minimum:0 // Adjust as needed
        },
        userPlayTime: {
            type: 'number',
            description: 'User play time in minutes or hours',
            minimum:0 // Adjust as needed
            
        },
    },

    required: ['startDateTime', 'endDateTime', 'totalTime', 'userPlayTime'],
    additionalProperties: false, // No additional properties allowed
};

import Ajv, {type JSONSchemaType} from "ajv"

export interface User {
    // username:string
    email:string
    password:string
}

export const userSchema:JSONSchemaType<User>={
    type:"object",
    properties:{
        // username:{
        //     type:"string",
        //     minLength:"5",

        // },
        email:{
            type:"string",
            minLength:3
        },
        password:{
            type:"string",
            minLength:5
        }
        ,
    }
    ,
    required:["email", "password"]
}
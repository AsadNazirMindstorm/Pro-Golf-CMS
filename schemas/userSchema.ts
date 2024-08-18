

export interface User {
    // username:string
    email:string
    password:string
}

export const userSchema ={
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
            // format: "password",
            minLength:5
        }
        ,
    }
    ,
    required:["email", "password"]
}
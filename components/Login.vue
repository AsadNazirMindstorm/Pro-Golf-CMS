<template>

    <div class="LoginBg h-[100vh] flex justify-center flex-col">
        <div class="w-[90vw] mx-auto md:max-w-[500px] justify-evenly flex mb-8">
            <img class="w-[20%]" src="../assets/logo.webp" alt="">
            <img class="w-[60%] object-contain" src="../assets/progolf-text.webp" alt="">
        </div>
        <form @submit.prevent="handleSubmit"
            class="w-[90vw] mx-auto md:max-w-[500px] border-2 shadow-lg h-[400px] bg-gray-200 rounded">
            <div class="h-full w-full flex flex-col justify-center">
                <h1 class="text-2xl text-center font-semibold"> Login</h1>
                <json-forms class="my-4" :data="data" :renderers="renderers" :schema="schema" :uischema="uischema"
                    @change="onChange" />
                <!-- hoi hoi  -->
                <div class="w-[94%] mx-auto">
                    <button type="submit" class="bg-green py-3 w-full rounded-sm"> Submit</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script lang="ts">

import type { JsonSchema } from "@jsonforms/core";
import { JsonForms, type JsonFormsChangeEvent } from "@jsonforms/vue";
import { defaultStyles, mergeStyles, vuetifyRenderers } from '@jsonforms/vue-vuetify'
import { userSchema, type User } from "~/schemas/userSchema";


// mergeStyles combines all classes from both styles definitions into one
const myStyles = mergeStyles(defaultStyles, { control: { label: "mylabel" } });

const renderers = [
    ...vuetifyRenderers,
    // here you can add custom renderers
];

const schema = userSchema;
let userLoginData: User = {
    email: "",
    password: ""
}
const uischema = {
    type: "VerticalLayout",
    elements: [
        {
            type: "Control",
            scope: "#/properties/email",
        },
        {
            type: "Control",
            scope: "#/properties/password",
        },
    ]
}

export default defineComponent({
    name: "Login",
    components: {
        JsonForms,
    },
    data() {
        return {
            // freeze renderers for performance gains
            renderers: Object.freeze(renderers),
            data: userLoginData,
            schema,
            uischema,
        };
    },
    methods: {
        onChange(event: JsonFormsChangeEvent) {
            this.data = event.data;
            userLoginData = event.data;
        },
        async handleSubmit() {
            try {
                const response = await $fetch('/api/login', {
                    method: 'POST',
                    body: JSON.stringify(userLoginData),
                    headers: { 'Content-Type': 'application/json' },
                });

                alert("Succesfully enetered "+ response.status);
            } catch (error: any) {
                alert(error);
            }
            console.log(userLoginData);
        }
    },
})



</script>

<style>
.LoginBg {
    background-image: linear-gradient(#0000005c, #000000c4), url('../assets/banner-bg.webp');
    background-size: cover;
}
</style>
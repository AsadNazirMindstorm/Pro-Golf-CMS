<template>
    <div class="flex">
        <div class="w-[60%]">
            <json-forms :data="data" :renderers="renderers" :schema="schema" :uischema="uischema" @change="onChange" />
        </div>

        <div class="w-[40%]">
            <edit-icon />
            <div class="p-10">
                <v-img cover sizes="small" src="../assets/pngwing.com.png"></v-img>
            </div>
        </div>
    </div>
</template>


<script lang="ts">

import type { JsonSchema } from "@jsonforms/core";
import { JsonForms, type JsonFormsChangeEvent } from "@jsonforms/vue";
import { defaultStyles, mergeStyles, vuetifyRenderers } from '@jsonforms/vue-vuetify'
import metaSchema from "~/schemas/tournament/metaSchema";
import { type Meta } from "~/schemas/tournament/metaSchema";

let renderers = [
    ...vuetifyRenderers
]

let schema = metaSchema;


const uischema = {

    type: "VertcialLayout",
    elements: [
        {
            type: "Control",
            scope: "#/properties/category",
        },
        {
            type: "Control",
            scope: "#/properties/title",
        },
        {
            type: "Control",
            scope: "#/properties/league",
        },
    ]
}

// mergeStyles combines all classes from both styles definitions into one
const myStyles = mergeStyles(defaultStyles, { control: { label: "mylabel" } });
let metaFormData: any;

export default defineComponent({
    name: "Login",
    components: {
        JsonForms,
    },
    data() {
        return {
            // freeze renderers for performance gains
            renderers: Object.freeze(renderers),
            data: metaFormData,
            schema,
            uischema,
        };
    },
    methods: {
        onChange(event: JsonFormsChangeEvent) {
            this.data = event.data;
            metaFormData = event.data;
        },
    },
})

</script>
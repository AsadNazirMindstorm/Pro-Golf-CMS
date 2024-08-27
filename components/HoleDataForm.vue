<template>
    <v-dialog max-width="500" :close-on-content-click="false">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" color="blue" :disabled="isCreatedDisabled"
                prepend-icon="mdi-plus">Create</v-btn>
        </template>
        <template v-slot:default="{ isActive }">
            <v-card title="Dialog">
                <v-card-text>
                    <v-form>
                        <json-forms :data="data" :renderers="renderers" :schema="schema" :uischema="uischema"
                            @change="onChange" />
                    </v-form>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn :disabled="isSaveDisabled" color="green" @click="handleHoleDataSubmit(isActive)">Save</v-btn>
                    <v-btn text="Close Dialog"
                        @click="() => { data = defaultHoleData; isActive.value = false }"></v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { JsonForms, type JsonFormsChangeEvent } from '@jsonforms/vue';
import { defaultStyles, mergeStyles, vuetifyRenderers } from '@jsonforms/vue-vuetify';
import { holeDataSchema } from '~/schemas/tournament/holesSchema';
import { type HoleData } from '~/schemas/tournament/holesSchema';
import { defaultHoleData } from '~/constants/FormConstants';
import { useAjv } from '~/composable/Ajv';

// Define the renderers and schema
const renderers = Object.freeze([...vuetifyRenderers]);
const schema = holeDataSchema;


const emit = defineEmits(['holeDataEmit']);

let holeDataFormData = ref<HoleData>(defaultHoleData)

// UI schema for the JSON form
const uischema = {
    type: 'VerticalLayout',
    elements: [
        {
            type: 'Control',
            scope: '#/properties/courseId',
        },
        {
            type: 'Control',
            scope: '#/properties/holeId',
        },
        {
            type: 'Control',
            scope: '#/properties/windSpeed',
        },
        {
            type: 'Control',
            scope: '#/properties/teePosition',
        },
        {
            type: "Group",
            label: "Wind Direction",
            elements: [
                {
                    type: 'Control',

                    scope: '#/properties/windDirection',
                }
            ]
        },
    ]
};

const isSaveDisabled = ref(true);


const onChange = (event: JsonFormsChangeEvent) => {
    holeDataFormData.value = event.data;
    const isValid = useAjv().validate(holeDataSchema, holeDataFormData.value);

    if (isValid) isSaveDisabled.value = false;

}

const handleHoleDataSubmit = (closeDialougue: globalThis.Ref<boolean>) => {

    const isValid = useAjv().validate(holeDataSchema, holeDataFormData.value);
    if (!isValid) {
        alert("Please Enter the correct data !");
        return;
    };


    //Emmitting the Data to the Parent
    emit("holeDataEmit", holeDataFormData.value);
    closeDialougue.value = false;


}

//defining props
defineProps({
    isCreatedDisabled: Boolean
})


</script>
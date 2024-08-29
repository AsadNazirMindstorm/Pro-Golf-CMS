<template>
    <v-btn color="blue" @click="handleOpening" :disabled="isCreatedDisabled" prepend-icon="mdi-plus">Create</v-btn>
    <v-dialog max-width="500" v-model="isOpen" :close-on-content-click="false">
        <template v-slot:default="{ isActive }">

            <v-card title="Dialog">
                {{ holeFormDataState }}
                <v-card-text>
                    <v-form>
                        <json-forms :data="holeFormDataState" :renderers="renderers" :schema="schema"
                            :uischema="uischema" @change="onChange" />
                    </v-form>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn v-if="holeFormDataState!==defaultHoleData" color="purple" @click="handleEdit">Update</v-btn>
                    <v-btn v-else :disabled="isSaveDisabled" color="green" @click="handleHoleDataSubmit(isActive)">Save</v-btn>
                    <v-btn text="Close Dialog"
                        @click="() => { holeFormDataState = defaultHoleData; isOpen = false }"></v-btn>
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

const isOpen = useState<boolean>('isOpen');

const holeFormDataState = useState<HoleData>('holeData');

const emit = defineEmits(['holeDataEmit']);


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
const handleEdit = () =>
{

}
const onChange = (event: JsonFormsChangeEvent) => {
    holeFormDataState.value = event.data;
    console.log()
    const isValid = useAjv().validate(holeDataSchema, holeFormDataState.value);

    if (isValid) isSaveDisabled.value = false;

}

const handleHoleDataSubmit = (closeDialougue: globalThis.Ref<boolean>) => {

    const isValid = useAjv().validate(holeDataSchema, holeFormDataState.value);
    //console.log(holeDataFormData.value);

    if (!isValid) {
        alert("Please Enter the correct data !");
        return;
    };


    //Emmitting the Data to the Parent
    emit("holeDataEmit", holeFormDataState.value);
    isOpen.value = false;

    //reseting
    holeFormDataState.value = defaultHoleData;

}

const handleOpening = () => {
    // console.log("This is the value you are looking for", holeDataFormData.value);
    holeFormDataState.value = defaultHoleData;
    isOpen.value = true;
}

//defining props
const props = defineProps({
    isCreatedDisabled: Boolean,
})


</script>
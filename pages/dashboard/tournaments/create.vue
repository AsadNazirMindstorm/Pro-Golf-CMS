<template>
    <div class="flex justify-between mb-8 mt-4">
        <div>
            <h1 class="lg:text-3xl font-semibold">Create Tournament</h1>
            <h1 class="lg:text-lg mt-4">Tournament Title # {{ metaFormData.title }}</h1>
        </div>
        <paste-tournament />
    </div>
    <div>
        <v-stepper v-model="e1">
            <template v-slot:default="{ prev, next }">
                <v-stepper-header>
                    <template v-for="n in steps" :key="`${n}-step`">
                        <v-stepper-item :complete="e1 > n" :step="`Step {{ n }}`" :value="n" editable>{{ items[n - 1]
                            }}</v-stepper-item>

                        <v-divider v-if="n !== steps" :key="n"></v-divider>
                    </template>
                </v-stepper-header>

                <v-stepper-window>
                    <!-- This is Meta Form -->
                    <v-stepper-window-item :value="1">
                        <MetaForm @meta-form-data-emit="handleMetaDataForm" />
                    </v-stepper-window-item>
                    <!-- This is Availaibility -->
                    <v-stepper-window-item :value="2">
                        <AvailabilityForm @-availabilty-form-data-emit="handleAvailabilityForm" />
                    </v-stepper-window-item>
                    <!-- This is Holes Form -->
                    <v-stepper-window-item :value="3">
                        <HolesForm @hole-form-emit="handleHoleForm"/>
                    </v-stepper-window-item>
                    <!-- This is Final Step to save the Data Save Form -->
                    <v-stepper-window-item :value="4">

                        <div class="min-h-[300px] flex justify-center items-center flex-col">
                            <div class="text-xl text-center max-w-[700px] w-[90%] mb-20">
                                Please check and ensure that you have entered all the data and press confirm and save !
                            </div>
                            <v-btn @click="" color="green" prepend-icon="mdi-content-save-check-outline">Confirm and
                                Save</v-btn>
                        </div>
                    </v-stepper-window-item>
                </v-stepper-window>

                <v-stepper-actions :disabled="disabled" @click:next="() => {
                    nextClick(next);
                }" @click:prev="prev">
                </v-stepper-actions>
            </template>
        </v-stepper>
    </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import AvailabilityForm from '~/components/AvailabilityForm.vue';
import { useAjv } from '~/composable/Ajv';
import { defaultAvailabiltyFormData, defaultHoleData, defaultMetaFormData, defualtHoleFormData } from '~/constants/FormConstants';
import { AvailabilitySchema, type Availability } from '~/schemas/tournament/availabiltySchema';
import { holeDataSchema, testingHoleScehma, type Holes } from '~/schemas/tournament/holesSchema';
import type { Meta } from '~/schemas/tournament/metaSchema';
import metaSchema from '~/schemas/tournament/metaSchema';

// Reactive state
const e1 = ref(1);
const steps = ref(4);
const items = ref([
    'Meta',
    'Availability',
    'Holes',
    'Submit',
]);


//assigning default data will be put inside a the load data fucntion
let metaFormData = ref<Meta>(defaultMetaFormData);
let availabiltyFormData = ref<Availability>(defaultAvailabiltyFormData);
let holeFormData = ref<Holes>(defualtHoleFormData);

// Methods
const nextClick = (callback: () => void) => {
    let isValid = false;
    //Meta form data validation
    if (e1.value == 1) {
        isValid = useAjv().validate(metaSchema, metaFormData.value);

    }
    else if (e1.value == 2) {
        console.log(availabiltyFormData.value);
        isValid = useAjv().validate(AvailabilitySchema, availabiltyFormData.value);
    }
    else if (e1.value == 3) {
        isValid = useAjv().validate(testingHoleScehma, holeFormData.value);
    }

    if (!isValid) {
        alert("Please Enter Correct data");
        return;
    }

    callback();
};

//This is Final Submit at last stage
const handleSubmit = () => {
    // Add your submit logic here
};

//Handling Meta Data form over here
const handleMetaDataForm = (newMetaFormData: Meta) => {
    metaFormData.value = newMetaFormData;
}

//Handle Availabilty Form Data over here
const handleAvailabilityForm = (newAvailableFormData: Availability) => {
    availabiltyFormData.value = newAvailableFormData;
}

//Handle Hole Form Data over here
const handleHoleForm = (newHoleFormData: Holes) => {
    holeFormData.value = newHoleFormData;
    console.log(holeFormData.value);
}

// Computed properties
const disabled = computed(() => {
    return e1.value === 1 ? 'prev' : e1.value === steps.value ? 'next' : undefined;
});
</script>
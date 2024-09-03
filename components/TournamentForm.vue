<template>
    <div v-if="!isFormLoading">
        <div class="flex justify-between mb-8 mt-4">
            <div>
                <h1 class="lg:text-3xl font-semibold">Create Tournament</h1>
                <h1 class="lg:text-lg mt-4">Tournament Title # {{ metaFormData?.title || 'Loading...' }} </h1>
            </div>
            <paste-tournament />
        </div>

        <div>
            <v-stepper v-model="e1">
                <template v-slot:default="{ prev, next }">
                    <v-stepper-header>
                        <template v-for="n in steps" :key="`${n}-step`">
                            <v-stepper-item :complete="e1 > n" :step="`Step {{ n }}`" :value="n">{{ items[n -
                                1]
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
                            <HolesForm @hole-form-emit="handleHoleForm" />
                        </v-stepper-window-item>
                        <!-- This is Final Step to save the Data Save Form -->
                        <v-stepper-window-item :value="4">

                            <div class="min-h-[300px] flex justify-center items-center flex-col">
                                <div class="text-xl text-center max-w-[700px] w-[90%] mb-20">
                                    Please check and ensure that you have entered all the data and press confirm and
                                    save !
                                </div>

                                <v-btn v-if="!isEditing" @click="handleSubmit" :loading="isLoading" size="large"
                                    color="green" prepend-icon="mdi-content-save-check-outline">Confirm and
                                    Save</v-btn>
                                <v-btn v-else @click="handleEdit" :loading="isLoading" size="large" color="purple"
                                    prepend-icon="mdi-content-save-check-outline">Confirm Edit
                                </v-btn>
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
    </div>
    <div v-else>
        <h1 class="text-xl text-center">Loading ...</h1>
    </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import AvailabilityForm from '~/components/AvailabilityForm.vue';
import HoleDataForm from '~/components/HoleDataForm.vue';
import { useAjv } from '~/composable/Ajv';
import { defaultAvailabiltyFormData, defaultHoleData, defaultMetaFormData, defualtHoleFormData } from '~/constants/FormConstants';
import Id from '~/pages/dashboard/tournaments/edit/[id].vue';
import type { ServerResponse } from '~/schemas/responseSchema';
import { AvailabilitySchema, type Availability } from '~/schemas/tournament/availabiltySchema';
import { holeDataSchema, testingHoleScehma, type Holes } from '~/schemas/tournament/holesSchema';
import type { Meta } from '~/schemas/tournament/metaSchema';
import metaSchema from '~/schemas/tournament/metaSchema';
import type { Tournament } from '~/schemas/tournamentSchema';

// Reactive state
const e1 = ref(1);
const steps = ref(4);
const items = ref([
    'Meta',
    'Availability',
    'Holes',
    'Submit',
]);

//generating random UUID to uniquley identify it
const category = crypto.randomUUID();

//assigning default data will be put inside a the load data fucntion
let metaFormData = ref<Meta>(defaultMetaFormData);
let availabiltyFormData = ref<Availability>(defaultAvailabiltyFormData);
let holeFormData = ref<Holes>(defualtHoleFormData);
let isSaveAndConfirmDisabled = ref(false);
let isLoading = ref<boolean>(false);
const isFormLoading = ref<boolean>(true);
const router = useRouter();

// Define useState for global state
const tournamentData = useState<Tournament | null>('tournamentData', () => null);


metaFormData.value.category = category;
// Methods
const nextClick = (callback: () => void) => {
    let isValid = false;
    //Meta form data validation
    if (e1.value == 1) {
        isValid = useAjv().validate(metaSchema, metaFormData.value);

    }
    else if (e1.value == 2) {
        // console.log(availabiltyFormData.value);
        isValid = useAjv().validateAvailabiltyFormData(availabiltyFormData.value);
    }
    else if (e1.value == 3) {
        isValid = useAjv().validateHoleForm(holeFormData.value);
    }

    if (!isValid) {
        alert("Please Enter Correct data");
        return;
    }

    callback();
};

//This is Final Submit at last stage
const handleSubmit = async () => {
    isLoading.value = true;

    if (!useAjv().validate(metaSchema, metaFormData.value)) {
        alert("Meta Data is not correct");
        return;
    }
    else if (!useAjv().validate(AvailabilitySchema, availabiltyFormData.value)) {
        alert("Availabilty Data is not correct");
        return;
    }
    else if (!useAjv().validate(testingHoleScehma, holeFormData.value)) {
        alert("Hole Data is not Correct");
        return;
    }
    // Add your submit logic here

    //New Object Having All tournament properties
    let tournament: Tournament = {
        metaData: metaFormData.value,
        holeData: holeFormData.value,
        availabiltyData: availabiltyFormData.value,
        pushedToNakama: false
    };

    //Final Object
    // console.log(tournament);

    //Backend fetch Call to save the data
    const res: ServerResponse = await $fetch('/api/insertTournament', {
        method: 'POST',
        body: JSON.stringify(tournament)
    })



    if (res.success) {
        alert("Inserted successfully");
        resetData();
        router.push('/dashboard/tournaments')
    }

    else {
        alert("Error occured");
        // console.log(res.message);
    }

    isLoading.value = false;
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
    // console.log(holeFormData.value);
}

const handleEdit = async () => {
    try {
        //New Object Having All tournament properties
        let tournament: Tournament = {
            metaData: metaFormData.value,
            holeData: holeFormData.value,
            availabiltyData: availabiltyFormData.value,
            pushedToNakama: false,
            createdAt: tournamentData.value?.createdAt
        };

        const res = await $fetch('/api/editTournament',
            {
                method: "PUT",
                body: JSON.stringify(tournament)
            }
        )

        if (res.success) {
            alert("Edited succesfully");
            resetData();
            router.push('/dashboard/tournaments');
        }
        else {
            alert("Error Occurred");
        }
    }
    catch (err: any) {

    }
}

//reseting the data
const resetData = () => {
    metaFormData.value = defaultMetaFormData;
    availabiltyFormData.value = defaultAvailabiltyFormData;
    holeFormData.value = defualtHoleFormData;

    tournamentData.value = null;
}

// Computed properties
const disabled = computed(() => {
    return e1.value === 1 ? 'prev' : e1.value === steps.value ? 'next' : undefined;
});

//create an on mounted over here
onMounted(async () => {
    try {
        const route = useRoute().params.id;
        if (props.isEditing) {
            // fetch call to get the route
            const response: ServerResponse = await $fetch('/api/getTournament', {
                query: {
                    'id': route
                }
            })

            //parse the data
            let data: Tournament[] = response.data;
            // console.log(data);

            if (!response.success) {
                throw new Error("Error Occurred");
            }
            //storing the data in useState hook
            tournamentData.value = data[0];

            //assign this data to the forms meta, avaialabilty and holes
            metaFormData.value = tournamentData.value.metaData;
            availabiltyFormData.value = tournamentData.value.availabiltyData;
            holeFormData.value = tournamentData.value.holeData;

        }
        else {
            metaFormData.value = defaultMetaFormData;
            availabiltyFormData.value = defaultAvailabiltyFormData;
            holeFormData.value = defualtHoleFormData;
        }
    }
    catch (error) {
        alert("Error Occurred Please try again");
    }
    finally {
        isFormLoading.value = false;
    }
})

onUnmounted(() => {

    //reseting the data
    resetData();
})

const props = defineProps({
    isEditing: Boolean
})

</script>
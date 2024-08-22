<template>
    <div class="flex justify-between mb-8 mt-4">
        <h1 class="lg:text-3xl font-semibold">Create Tournament</h1>
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
                        <MetaForm />
                    </v-stepper-window-item>
                    <!-- This is Holes Form -->
                    <v-stepper-window-item :value="2">
                        <HolesForm />
                    </v-stepper-window-item>
                    <!-- This is Availaibility -->
                    <v-stepper-window-item :value="3">
                        <div>
                            This is Availabilty
                        </div>
                    </v-stepper-window-item>
                    <!-- This is Final Step to save the Data Save Form -->
                    <v-stepper-window-item :value="3">
                        <div>
                            This is Availabilty
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

<script>
export default {
    data() {
        return {
            e1: 1,
            steps: 4,
            items: [
                'Meta',
                'Holes',
                'Availabitlity',
                'Submit',
            ],
        }
    },
    methods: {
        nextClick: function (callback) {
            callback();
        }
    }
    ,
    computed: {
        disabled() {
            return this.e1 === 1 ? 'prev' : this.e1 === this.steps ? 'next' : undefined
        },
    },
}
</script>

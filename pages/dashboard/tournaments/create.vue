<template>
    <div class="flex justify-between mb-8 mt-4">
        <h1 class="lg:text-3xl font-semibold">Create Tournament</h1>
        <paste-tournament/>
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
                    <v-stepper-window-item :value="1">
                        <div>
                            This is Meta
                        </div>
                    </v-stepper-window-item>
                    <v-stepper-window-item :value="2">
                        <div>
                            This is Holes data
                        </div>
                    </v-stepper-window-item>
                    <v-stepper-window-item :value="3">
                        <div>
                            This is Holes Final
                        </div>
                    </v-stepper-window-item>
                </v-stepper-window>

                <v-stepper-actions :disabled="disabled" @click:next="next" @click:prev="prev"></v-stepper-actions>
            </template>
        </v-stepper>
    </div>
</template>

<script>
export default {
    data() {
        return {
            e1: 1,
            steps: 3,
            items: [
                'Meta',
                'Holes',
                'Submit',
            ],
        }
    },

    computed: {
        disabled() {
            return this.e1 === 1 ? 'prev' : this.e1 === this.steps ? 'next' : undefined
        },
    },
}
</script>

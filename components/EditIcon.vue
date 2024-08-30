<template>
    <v-dialog max-width="700" :close-on-content-click="false">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" color="blue" prepend-icon="mdi-clipboard">Edit</v-btn>
        </template>
        <template v-slot:default="{ isActive }">
            <v-card title="Dialog">
                <v-card-text>
                    <v-form>
                        <v-item-group selected-class="bg-primary">
                            <v-container>
                                <v-row>
                                    <v-col v-for="n in tournamentIconsArrays.length" :key="n" cols="12" md="4">
                                        <v-item v-slot="{ isSelected, selectedClass, toggle }">
                                            <v-card :class="['d-flex align-center', selectedClass || n == Number(icon)]"
                                                height="200" dark @click="() => onIconSelect(toggle, n.toString())">
                                                <div  class="text-h3 flex-grow-1 text-center">
                                                    <v-img :src="tournamentIconsArrays[n-1].img"></v-img>
                                                </div>
                                            </v-card>
                                        </v-item>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-item-group>
                    </v-form>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text="Close Dialog" @click="isActive.value = false"></v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script setup lang="ts">
import { tournamentIconsArrays } from '~/constants/FormConstants';



const emit = defineEmits(['icon']);
defineProps({ icon: String });


const onIconSelect = (callback: (() => void) | undefined, n: string) => {

    // Emitting this value to the parent component
    emit('icon', n);

    // Calling the built-in callback for this component (toggle)
    if (callback !== undefined) callback();


};
</script>
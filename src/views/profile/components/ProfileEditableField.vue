<script setup lang="ts">
import { defineProps, defineEmits, reactive, ref } from "vue";
import { SquarePen, Save, SaveOff } from "lucide-vue-next";
const emit = defineEmits(["update", "close"]);

const props = defineProps<{
  index: number;
  field: {
    name: string;
    value: string;
    placeholder: string;
    type: string;
    error: string;
    isEditing: boolean;
    edited: boolean;
    options?: Array<{ label: string; value: string }>;
  };
}>();

const formField = reactive({
  name: props.field.name,
  value: props.field.value,
  placeholder: props.field.placeholder,
  type: props.field.type,
  error: props.field.error,
  isEditing: props.field.isEditing,
  edited: props.field.edited,
  options: props.field?.options,
});

function updateField() {
  const currentValue = formField.value;
  formField.value = props.field.value;
  emit("update", props.index, { name: formField.name, value: currentValue });
}
</script>
<template>
  <div>
    <p class="text-gray-500 text-sm">{{ formField.placeholder }}</p>

    <div
      v-if="!formField.isEditing"
      class="flex items-center justify-between font-medium text-lg"
    >
      <span>{{ props.field.value }}</span>
      <SquarePen
        class="text-blue-500 cursor-pointer"
        @click="formField.isEditing = true"
      />
    </div>

    <div v-else class="flex items-center gap-2">
      <input
        v-if="formField.type !== 'select'"
        :type="formField.type"
        class="border rounded p-2 w-full"
        v-model="formField.value"
      />
      <select
        v-if="formField.type === 'select'"
        v-model="formField.value"
        :name="formField.name"
        class="border rounded p-2 w-full"
      >
        <option
          v-for="option in formField.options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <Save
        class="text-green-500 cursor-pointer"
        @click="
          () => {
            formField.isEditing = false;
            updateField();
          }
        "
      />
      <SaveOff
        class="text-red-500 cursor-pointer"
        @click="formField.isEditing = false"
      />
    </div>
  </div>
</template>

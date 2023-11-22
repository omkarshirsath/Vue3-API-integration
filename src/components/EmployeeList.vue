<template>
  <div class="flex justify-center">
    <div class="w-full sm:w-2/3 md:w-7/8">
      <h1 class="bg-blue-200 p-3 text-lg flex justify-between items-center">
        Employee List
        <form
          @submit.prevent="submitForm"
          class="flex justify-end items-center"
        >
          <input
            v-model="recordCount"
            type="number"
            class="rounded-lg w-[30%] pl-5 h-8 bg-gray-100"
          />
          <button
            type="submit"
            class="bg-blue-300 p-2 rounded-full ml-2 hover:bg-blue-100 text-sm cursor-pointer"
          >
            Submit
          </button>
        </form>
      </h1>

      <!-- showing loader when data is being fetched -->
      <div v-if="loading" class="flex justify-center items-center h-32">
        <div role="status">
          <svg
            aria-hidden="true"
            class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Picture
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Phone
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in paginatedUsers" :key="user.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <img
                  :src="user.picture.medium"
                  :alt="user.name.first"
                  class="h-8 w-8 rounded-full"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ user.name.first }} {{ user.name.last }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ user.phone }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="error" class="text-red-500 mt-2">
        Failed to load data. Please try again.
      </div>
    </div>
  </div>

  <!-- Paginatio starts hrere -->

  <div class="pagination flex justify-center mt-4">
    <button
      @click="prevPage"
      :disabled="currentPage === 1"
      class="p-1 bg-blue-300 border-none rounded-full cursor-pointer hover:bg-blue-200"
    >
      Previous
    </button>

    <span class="mx-4">{{ currentPage }} / {{ totalPages }}</span>
    <button
      @click="nextPage"
      :disabled="currentPage === totalPages"
      class="p-1 bg-blue-300 border-none rounded-full cursor-pointer hover:bg-blue-200"
    >
      Next
    </button>

    <div class="fex items-center ml-4">
      <span> Show : </span>
      <input
        v-model.number="entriesPerPage"
        type="number"
        class="rounded-lg bg-gray-200 w-16 mx-2 text-center"
        min="1"
      />
      <span> entries</span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { defineComponent } from "vue";
import axios from "axios";
import { User } from "@/Types/User";

const DEFAULT_ENTRIES_PER_PAGE = 5;

export default defineComponent({
  setup() {
    const users = ref<User[]>([]);
    const error = ref(false);
    const recordCount = ref(5);
    const currentPage = ref(1);
    const entriesPerPage = ref(DEFAULT_ENTRIES_PER_PAGE);
    const loading = ref(true);

    const submitForm = async () => {
      try {
        const response = await axios.get(
          `https://randomuser.me/api/?results=${recordCount.value}`
        );
        users.value = response.data.results;

        entriesPerPage.value = DEFAULT_ENTRIES_PER_PAGE;

        // Reset currentPage to 1 whenever the form is submitted
        currentPage.value = 1;
      } catch (error) {
        console.error(error);
        error.value = true;
      } finally {
        loading.value = false;
      }
    };

    // Calculate the total number of pages
    const totalPages = computed(() =>
      Math.ceil(users.value.length / entriesPerPage.value)
    );

    // Calculate the starting index of the current page
    const startIndex = computed(
      () => (currentPage.value - 1) * entriesPerPage.value
    );

    // Slice the users array to show only employees for the current page
    const paginatedUsers = computed(() =>
      users.value.slice(
        startIndex.value,
        startIndex.value + entriesPerPage.value
      )
    );

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value -= 1;
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value += 1;
      }
    };

    // Watch for changes in entriesPerPage
    watch(entriesPerPage, (newVal) => {
      // Ensure the current page stays within the valid range
      if (newVal > 0) {
        currentPage.value = Math.min(
          Math.ceil(users.value.length / newVal),
          Math.max(currentPage.value, 1)
        );
      }
    });

    onMounted(submitForm);

    return {
      users,
      error,
      recordCount,
      submitForm,
      entriesPerPage,
      currentPage,
      totalPages,
      paginatedUsers,
      prevPage,
      nextPage,
      loading,
    };
  },
});
</script>

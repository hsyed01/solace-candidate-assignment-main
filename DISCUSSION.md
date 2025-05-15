# Solace Coding Assignment – Submission by [Your Name]

## 1. Fixes & Improvements

### 🔧 Bug Fixes

- **Missing `key` in list items**
  - Added `key` props to all list-rendered elements to avoid React reconciliation issues.
- **Missing `key` in `<tr>` elements**
  - Provided stable, unique keys for table rows, preferably using advocate IDs.
- **Incorrect use of `<th>` outside of `<tr>`**
  - Restructured table header to place all `<th>` tags inside a `<tr>`.
- **Direct DOM manipulation**
  - Removed `document.getElementById` usage in favor of controlled React state.
- **Calling `.includes()` on non-strings**
  - Ensured that `.includes()` is called on strings using `.toString()` where needed.
- **Unsafe access of nested properties**
  - Applied optional chaining (`?.`) to safely access potentially undefined nested properties.
- **Error handling**
  - Added try/catch blocks and user feedback for failed `fetch` requests.

---

## 2. Design & UX Improvements

### ✨ Visual/UX Enhancements

- **TailwindCSS Enhancements**
  - Used responsive layout utilities like `max-w-7xl`, `overflow-auto`.
  - Applied styled inputs with `focus:ring`, `rounded`, and `border`.
  - Tables styled with `hover:bg-gray-50`, `text-sm`, and `font-semibold`.
  - Ensured semantic and accessible HTML using `label`, `ul`, and `thead`.

### 🎛️ Filters & Controls

- **City & Specialty Filters**
  - Introduced two dropdowns to filter advocates by city and specialty.
  - `applyFilters` function updates filtered list based on selected values.

- **Search Input with Debounce**
  - Integrated `lodash.debounce` to delay search queries by 500ms for better performance.
  - Search input is controlled via state and triggers data fetch after debounce delay.

### 💡 Skeleton Loaders

- Implemented skeleton components during API loading to give a smooth, polished experience.
- Enhances perceived performance while data is being fetched.

---

## 3. Performance Improvements

### ⚙️ Backend Optimization

- **Server-Side Filtering, Search, and Pagination**
  - Updated the `/api/advocates` GET endpoint to support:
    - `searchTerm`, `city`, and `specialty` query params.
    - `page` and `limit` for server-side pagination.
  - Avoids fetching the entire advocate dataset into the client.

### ⚛️ Frontend Optimization

- **Query Param Integration**
  - The frontend now builds fetch URLs using selected filters and search terms.
- **Pagination from Server**
  - Removed `useMemo` pagination logic in favor of server-provided paginated results.
- **Debounced Search (Retained)**
  - Continued use of debounced search input to minimize request frequency.

---

## ✅ How to Test

1. Run the backend and frontend.
2. Use dropdowns and search input to filter results.
3. Observe skeleton loader during initial fetch.
4. Confirm paginated results are fetched from the server with updated filters.

---

## 🔗 Submission Links

- **GitHub Repo:** 

    https://github.com/hsyed01/solace-candidate-assignment-main/commits/master/

- **Pull Requests:** 

    https://github.com/hsyed01/solace-candidate-assignment-main/pull/1

    https://github.com/hsyed01/solace-candidate-assignment-main/pull/2

    https://github.com/hsyed01/solace-candidate-assignment-main/pull/3

- **Collaborators Added:** `alyant`, `thomasmarren`

---

Thanks for reviewing!

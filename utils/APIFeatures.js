class APIFeatures {
  constructor(collection, queryString, baseFilter = {}) {
    this.collection = collection;
    this.queryString = queryString;
    this.baseFilter = baseFilter;
    this.cursor = null;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    const urlFilters = JSON.parse(queryStr);

    const finalFilter = { ...urlFilters, ...this.baseFilter };

    // 3. Create the cursor with the merged, secure filter
    this.cursor = this.collection.find(finalFilter);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      // Convert string "price,-createdAt" to object { price: 1, createdAt: -1 }
      const sortBy = {};
      const sortFields = this.queryString.sort.split(',');

      sortFields.forEach((field) => {
        if (field.startsWith('-')) {
          sortBy[field.substring(1)] = -1; // Descending
        } else {
          sortBy[field] = 1; // Ascending
        }
      });

      this.cursor = this.cursor.sort(sortBy);
    }

    return this;
  }

  limitFields() {
    // Field Limiting
    if (this.queryString.fields) {
      // Convert string "name,price" to object { name: 1, price: 1 }
      const projection = {};
      const fields = this.queryString.fields.split(',');

      fields.forEach((field) => {
        if (field.startsWith('-')) {
          projection[field.substring(1)] = 0; // Exclude
        } else {
          projection[field] = 1; // Include
        }
      });

      this.cursor = this.cursor.project(projection);
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.cursor = this.cursor.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;

import debounce from "lodash.debounce";

export const formatLoadOptions = (mutation, entityObj = {}) => {
  const delayedFetch = debounce(async (inputValue, callback) => {
    const { data = [] } = await mutation({ limit: 50, keyword: inputValue, ...entityObj });
    callback(data);
  }, 500);

  return (inputValue) =>
    new Promise((resolve) => {
      delayedFetch(inputValue, resolve);
    });
};

export const convertToFormData = (data) => {
  const formData = new FormData();

  for (const key in data) {
    const value = data[key];

    if (value === null || value === undefined) {
      continue;
    }

    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value) && value.every(v => v instanceof File)) {
      value.forEach(file => formData.append(key, file));
    } else if (Array.isArray(value)) {
      value.forEach((obj, index) => {
        if (typeof obj === 'object' && obj !== null) {
          for (const prop in obj) {
            const propValue = obj[prop];
            if (propValue !== null && propValue !== undefined) {
              formData.append(`${key}[${index}].${prop}`, propValue);
            }
          }
        } else {
          if (obj !== null && obj !== undefined) {
            formData.append(`${key}[${index}]`, obj);
          }
        }
      });
    } else if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  }

  return formData;
};

export const buildSelectPairs = (keys = [], data = {}) => {
  const result = {};

  keys.forEach(key => {
    const labelKey = key.replace(/Id$/, "Name");

    try {
      if (data && key in data && labelKey in data && data?.[key]) {
        result[key] = {
          value: data[key],
          label: data[labelKey]
        };
      } else {
        result[key] = null;
      }
    } catch (error) {
      console.error(`Error building select pair for key ${key}`, error);
    }
  });

  return result;
};

export const flattenSelectPairs = (keys = [], data = {}) => {
  const result = {};

  keys.forEach(key => {
    const labelKey = key.replace(/Id$/, "Name");

    try {
      if (data[key] && data[key].value !== undefined && data[key].label !== undefined) {
        result[key] = data[key].value;
        result[labelKey] = data[key].label;
      } else {
        result[key] = 0;
        result[labelKey] = '';
      }
    } catch (error) {
      console.error(`Error flattening select pair for key ${key}`, error);
    }
  });

  return result;
};

export const defaultImgError = (e, defaultImage = '') => {
  if (e.target.src !== defaultImage) {
    e.target.src = defaultImage;
  }
};

export const createPageStateUpdater = (state, updateState) => {
  const actionHandlers = {
    search: (value) => ({
      pageDetails: {
        ...state.pageDetails,
        keyword: value,
        page: 1,
      },
    }),
    pageChange: (value) => ({
      pageDetails: {
        ...state.pageDetails,
        page: value,
      },
    }),
    sortChange: ({ sortField, sortOrder }) => ({
      pageDetails: {
        ...state.pageDetails,
        sortField,
        sortOrder,
        page: 1,
      },
    }),
    advanceSearch: ({ advanceSearch }) => ({
      pageDetails: {
        ...state.pageDetails,
        page: 1,
        advanceSearch
      },
    }),
    pageSizeChange: (value) => ({
      pageDetails: {
        ...state.pageDetails,
        pageSize: value,
        page: 1,
      },
    }),
  };

  return (action, value) => {
    const handler = actionHandlers[action];
    if (!handler) {
      console.warn(`Unknown action passed to updatePageState: ${action}`);
      return;
    }
    updateState(handler(value));
  };
};

export const buildPayload = (defaultValues, formData) => {
  return Object.keys(defaultValues).reduce((acc, key) => {
    acc[key] = formData?.[key] ?? defaultValues[key];
    return acc;
  }, {});
}

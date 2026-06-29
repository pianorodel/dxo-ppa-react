import { useMemo, useState } from 'react';

/**
 * @author Geraldjek and Ian 
 * June 1, 2025
 * This custom hook handles the states of the
 * list state and CRUD state.
 */

export const initialState = {
  rowData: [],
  totalRecords: 0,
  pageDetails: {
    page: 1,
    pageSize: 10,
    sortField: "",
    sortOrder: "",
    keyword: "",
  },
  data: {},
  toggle: {}
};

const useCustomHook = (customInitialState) => {
  const [state, setState] = useState({ ...initialState, ...customInitialState });

  const updateState = (objState) => {
    setState(prevState => ({ ...prevState, ...objState }));
  };

  const updateToggle = (toggleName = "isLoadingOverlay", trxValue) => {
    setState(prevState => {
      const prevToggle = prevState?.toggle || {};
      return {
        ...prevState,
        toggle: {
          ...prevToggle,
          [toggleName]: !prevToggle[toggleName],
        },
        trxValue: trxValue,
      };
    });
  };

  const resetState = () => {
    setState({
      rowData: [],
      isLoadingOverlay: true,
      isLoadingSkeleton: true,
      isSaving: false,
      totalRecords: 0,
      pageDetails: {
        page: 1,
        pageSize: 5,
        sortField: "",
        sortOrder: "",
        keyword: ""
      },
      data: {},
      changed: {},
      formError: {},
      error: { title: '', body: '' },
      toggle: {},
      ...customInitialState
    });
  };

  const customFunction = useMemo(() => ({
    resetState,
    updateState,
    updateToggle,
  }), [resetState, updateState, updateToggle]);

  return {
    state,
    customFunction
  };
};

export default useCustomHook;

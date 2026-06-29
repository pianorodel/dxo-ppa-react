import { useCallback, useRef, useState } from "react";

export function useCreateOption({
  createFn,
  mapResponse,
  onSuccess,
  onError,
  lookupFn,
  getOptionValue = (opt) => opt.value,
  getOptionLabel = (opt) => opt.label,
} = {}) {
  const [modalState, setModalState] = useState({ isOpen: false, inputValue: "" });
  const [refreshKey, setRefreshKey] = useState(0);
  const resolveRef = useRef(null);
  const beforeMatchIdRef = useRef(undefined);

  const map = useCallback((raw) => (typeof mapResponse === "function" ? mapResponse(raw) : raw), [mapResponse]);

  const withAliases = useCallback(
    (obj) => {
      if (obj === null || typeof obj !== "object" || Array.isArray(obj)) return obj;
      return {
        ...obj,
        value: getOptionValue(obj),
        label: getOptionLabel(obj),
      };
    },
    [getOptionValue, getOptionLabel],
  );

  const findExactMatch = useCallback(
    (options, inputValue) => {
      const target = String(inputValue ?? "")
        .trim()
        .toLowerCase();
      if (!target) return undefined;
      return (options ?? []).find(
        (opt) =>
          String(getOptionLabel(opt) ?? "")
            .trim()
            .toLowerCase() === target,
      );
    },
    [getOptionLabel],
  );

  const closeModal = useCallback(() => {
    setModalState({ isOpen: false, inputValue: "" });
    resolveRef.current = null;
  }, []);

  const resolve = useCallback(
    (raw) => {
      let mapped;
      try {
        mapped = withAliases(map(raw));
        onSuccess?.(mapped, raw);
      } catch (err) {
        onError?.(err);
        mapped = undefined;
      }
      resolveRef.current?.(mapped);
      closeModal();
    },
    [map, withAliases, onSuccess, onError, closeModal],
  );

  const cancel = useCallback(async () => {
    if (!modalState.isOpen) return;

    const { inputValue } = modalState;
    const resolveFn = resolveRef.current;
    closeModal();
    setRefreshKey((k) => k + 1);

    if (typeof lookupFn === "function" && inputValue) {
      try {
        const after = await lookupFn(inputValue);
        const match = findExactMatch(after, inputValue);
        const matchId = match ? getOptionValue(match) : undefined;

        if (match && matchId !== beforeMatchIdRef.current) {
          const mapped = withAliases(map(match));
          onSuccess?.(mapped, match);
          resolveFn?.(mapped);
          return;
        }
      } catch (err) {
        onError?.(err);
      }
    }

    resolveFn?.(undefined);
  }, [modalState, closeModal, lookupFn, findExactMatch, getOptionValue, map, withAliases, onSuccess, onError]);

  const onCreateOption = useCallback(
    async (inputValue) => {
      if (typeof createFn === "function") {
        try {
          const raw = await createFn(inputValue);
          const mapped = withAliases(map(raw));
          onSuccess?.(mapped, raw);
          return mapped;
        } catch (err) {
          onError?.(err);
          return undefined;
        }
      }

      beforeMatchIdRef.current = undefined;
      if (typeof lookupFn === "function") {
        try {
          const before = await lookupFn(inputValue);
          const match = findExactMatch(before, inputValue);
          beforeMatchIdRef.current = match ? getOptionValue(match) : undefined;
        } catch (err) {
          onError?.(err);
        }
      }

      return new Promise((res) => {
        resolveRef.current = res;
        setModalState({ isOpen: true, inputValue });
      });
    },
    [createFn, map, withAliases, onSuccess, onError, lookupFn, findExactMatch, getOptionValue],
  );

  return {
    onCreateOption,
    modal: {
      isOpen: modalState.isOpen,
      inputValue: modalState.inputValue,
      resolve,
      cancel,
      refreshKey,
    },
  };
}

export default useCreateOption;

import { useLocation, useNavigate } from "react-router-dom";
import { useCallback } from "react";

// usage:
// const params = getParams();

// setParams({ id: 123, name: "Ian", role: "admin" }, "/dashboard");

export function useQueryParams() {
    const location = useLocation();
    const navigate = useNavigate();

    const getParams = useCallback(() => {
        const searchParams = new URLSearchParams(location.search);
        const encoded = searchParams.get("data");
        if (!encoded) return null;

        try {
            const decoded = atob(encoded);
            return JSON.parse(decoded);
        } catch (err) {
            console.error("Failed to decode query params:", err);
            return null;
        }
    }, [location.search]);

    const setParams = useCallback(
        (obj, pathname = location.pathname) => {
            try {
                const encoded = btoa(JSON.stringify(obj));
                navigate({
                    pathname,
                    search: `?data=${encodeURIComponent(encoded)}`,
                });
            } catch (err) {
                console.error("Failed to encode query params:", err);
            }
        },
        [navigate, location.pathname]
    );

    return { getParams, setParams };
}

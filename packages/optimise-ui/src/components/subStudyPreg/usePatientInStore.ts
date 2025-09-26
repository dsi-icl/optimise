import { useRef, useEffect } from "react";
import { getPatientProfileById } from "../../redux/actions/searchPatient";
import store from "../../redux/store";

export const usePatientInStore = (patientNumber: string, setPatientId: (id: number) => void) => {
    const subscriptionRef = useRef<ReturnType<typeof store.subscribe> | null>(null);
    const callback = useRef(setPatientId);

    useEffect(() => {
        callback.current = setPatientId;
    }, [setPatientId]);

    useEffect(() => {
        const externalState = store.getState();
        if (externalState?.patientProfile?.data?.id) {
            callback.current?.(externalState.patientProfile.data.id);
            return;
        }
        if (subscriptionRef.current === null) {
            subscriptionRef.current = store.subscribe(() => {
                const state = store.getState();
                if (state?.patientProfile?.currentPatient === patientNumber && typeof state?.patientProfile?.data?.id === 'number') {
                    subscriptionRef.current?.();
                    callback.current?.(state.patientProfile.data.id);
                }
            })
            store.dispatch(getPatientProfileById(patientNumber));
        }
    }, [patientNumber])
}

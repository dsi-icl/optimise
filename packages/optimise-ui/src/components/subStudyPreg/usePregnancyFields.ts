import { useRef, useEffect } from "react";
import { getPatientProfileById } from "../../redux/actions/searchPatient";
import store from "../../redux/store";
import { PregnancyFieldShape } from "./formFieldsTypeMapper";

export const usePregnancyFields = (patientNumber: string, setPregnancyFields: ([fields, fieldsMap]: [Array<PregnancyFieldShape>, Record<string | number, PregnancyFieldShape>]) => void) => {
    const subscriptionRef = useRef<ReturnType<typeof store.subscribe> | null>(null);
    const callback = useRef(setPregnancyFields);

    useEffect(() => {
        callback.current = setPregnancyFields;
    }, [setPregnancyFields]);

    useEffect(() => {
        const externalState = store.getState();
        const { pregnancyEntryFields, pregnancyEntryFields_Hash } = externalState?.availableFields ?? {};
        if (pregnancyEntryFields && pregnancyEntryFields_Hash) {
            callback.current?.([pregnancyEntryFields, pregnancyEntryFields_Hash]);
            return;
        }
        if (subscriptionRef.current === null) {
            subscriptionRef.current = store.subscribe(() => {
                const state = store.getState();
                const { pregnancyEntryFields, pregnancyEntryFields_Hash } = state?.availableFields ?? {};
                if (pregnancyEntryFields && pregnancyEntryFields_Hash) {
                    subscriptionRef.current?.();
                    callback.current?.([pregnancyEntryFields, pregnancyEntryFields_Hash]);
                }
            })
            store.dispatch(getPatientProfileById(patientNumber));
        }
    }, [patientNumber])
}

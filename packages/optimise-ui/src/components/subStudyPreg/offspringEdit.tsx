import { FC, ReactNode, useEffect, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { useMutation, useQuery } from '@tanstack/react-query'
import { BackButton } from '../medicalData/utils';
import { apiHelper } from "../../redux/fetchHelper";
import { type AnyFieldApi, useForm } from "@tanstack/react-form";
import { usePatientInStore } from "./usePatientInStore";
import style from '../editMedicalElements/editMedicalElements.module.css';
import levelStyle from '../medicalData/dataPage.module.css';

function FieldInfo({ field }: { field: AnyFieldApi }) {
    return (
        <>
            {field.state.meta.isTouched && !field.state.meta.isValid ? (
                <em>{field.state.meta.errors.join(',')}</em>
            ) : null}
            {field.state.meta.isValidating ? 'Validating...' : null}
        </>
    )
}

export const OffspringDataEdit: FC<RouteComponentProps<{
    patientNumber: string;
    pregnancyId: string;
    offspringId?: string;
}>> = ({ match }) => {
    const isAdd = match.path.endsWith('/add');
    const { patientNumber, pregnancyId, offspringId } = match.params;
    const { push } = useHistory();
    const [, setPatientId] = useState<number | null>(null);
    usePatientInStore(patientNumber, setPatientId)

    const { data: offspring, isLoading, refetch } = useQuery({
        queryKey: ['data'],
        queryFn: async () => {
            if (!offspringId) return null;
            const result = await apiHelper(`/subStudyPreg/offspring/${encodeURIComponent(offspringId)}`);
            return result;
        },
        enabled: !isAdd && typeof offspringId === 'string',
        refetchOnWindowFocus: false,
    })

    const createOffspring = useMutation({
        mutationFn: async (value: any) => {
            return await apiHelper('/subStudyPreg/offsprings', {
                method: 'POST',
                body: JSON.stringify(value)
            })
        },
        onSuccess: (...args) => {
            const newOffspringId = args[0]?.state;
            if (typeof newOffspringId === 'number')
                push(`/subStudyPreg/${patientNumber}/${pregnancyId}/${newOffspringId}/edit`);
            args[3].client.invalidateQueries({ queryKey: ["offsprings", pregnancyId] });
        }
    })
    const updateOffspring = useMutation({
        mutationFn: async (value: any) => {
            if (!offspringId) return;
            await apiHelper(`/subStudyPreg/offspring/${encodeURIComponent(offspringId)}`, {
                method: 'PUT',
                body: JSON.stringify(value)
            })
        },
        onSuccess: (...args) => {
            args[3].client.invalidateQueries({ queryKey: ["offsprings", pregnancyId] });
        }
    })

    const offspringData = offspring?.data ? JSON.parse(offspring.data) : null;

    console.log('offspringData', offspringData, `oe-${patientNumber}:${pregnancyId}:${offspringId ?? 'new'}`);
    const form = useForm({
        formId: `oe-${patientNumber}:${pregnancyId}:${offspringId ?? 'new'}`,
        defaultValues: {
            hospitalID: '',
            sex: undefined,
            ageAtDelivery: '',
            weightAtDelivery: '',
            agparScore1min: '',
            agparScore5min: '',
            isBreastfed: false,
            isMixedFed: false,
            isFormulaFed: false,
            durationOfBreastfeeding: '',
            ...(offspringData ?? {})
        },
        onSubmit: async ({ formApi, value }) => {
            // Do something with form data
            const body = {
                pregnancyId,
                data: JSON.stringify(value)
            }
            if (isAdd)
                await createOffspring.mutateAsync(body)
            else
                await updateOffspring.mutateAsync(body)

            await refetch()
            formApi.reset()
        }
    })

    useEffect(() => {
        if (isAdd) return;
        if (!offspringId) return;
        form.reset();
        refetch();
    }, [isAdd, offspringId, refetch]);

    const wrapHeader = (child: ReactNode) => <>
        <div className={style.ariane}>
            <h2>{isAdd ? 'Add Offspring' : 'Edit Offspring'}</h2>
            <BackButton to={`/subStudyPreg/${patientNumber}/${pregnancyId}`} />
        </div>
        <div className={style.panel}>
            {child}
        </div>
    </>

    if (isLoading) return wrapHeader(<div>Loading...</div>);

    return wrapHeader(<>
        <form
            onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
            }}
            key={`${patientNumber}:${pregnancyId}:${offspringId ?? 'new'}`}
            className="flex flex-col gap-4"
        >
            <div>
                <form.Field
                    name="hospitalID"
                    validators={{
                        onChange: ({ value }) =>
                            value && value.length < 3
                                ? 'Name must be at least 3 characters'
                                : undefined
                    }}
                    children={(field) => {
                        console.log('render hospitalID', JSON.stringify(field.state));
                        return (
                            <>
                                <label htmlFor={field.name}>Hospital ID:</label>
                                <input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                                <FieldInfo field={field} />
                            </>
                        )
                    }}
                />
            </div>
            <div>
                <form.Field
                    name="sex"
                    validators={{
                        onChange: ({ value }) => {
                            return value === undefined
                                ? 'Please select a sex'
                                : undefined
                        }
                    }}
                    children={(field) => {
                        // Avoid hasty abstractions. Render props are great!
                        return (
                            <>
                                <label htmlFor={field.name}>Sex:</label>
                                <select
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                >
                                    <option value=""></option>
                                    <option value="undetermined">Undetermined</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                <FieldInfo field={field} />
                            </>
                        )
                    }}
                />
            </div>
            <div className={levelStyle.levelBody} style={{ padding: 0 }}>
                <div>
                    <div className={`mt-4 ${levelStyle.levelHeader}`}>Birth information</div>
                    <div className={`flex flex-col gap-2 ${levelStyle.levelBody}`} style={{ padding: '1rem' }}>
                        <div>
                            <form.Field
                                name="ageAtDelivery"
                                children={(field) => {
                                    return (
                                        <>
                                            <label htmlFor={field.name}>Gestational age at delivery <em>(days)</em>:</label>
                                            <input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                            />
                                            <FieldInfo field={field} />
                                        </>
                                    )
                                }}
                            />
                        </div>
                        <div>
                            <form.Field
                                name="weightAtDelivery"
                                children={(field) => {
                                    return (
                                        <>
                                            <label htmlFor={field.name}>Weight at delivery <em>(kg)</em>:</label>
                                            <input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                            />
                                            <FieldInfo field={field} />
                                        </>
                                    )
                                }}
                            />
                        </div>
                        <div>
                            <form.Field
                                name="agparScore1min"
                                children={(field) => {
                                    return (
                                        <>
                                            <label htmlFor={field.name}>Apgar score at 1 minute:</label>
                                            <input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                            />
                                            <FieldInfo field={field} />
                                        </>
                                    )
                                }}
                            />
                        </div>
                        <div>
                            <form.Field
                                name="agparScore5min"
                                children={(field) => {
                                    return (
                                        <>
                                            <label htmlFor={field.name}>Apgar score at 5 minutes:</label>
                                            <input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                            />
                                            <FieldInfo field={field} />
                                        </>
                                    )
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <div className={`mt-4 ${levelStyle.levelHeader}`}>Follow-up information</div>
                    <div className={`flex flex-col gap-2 ${levelStyle.levelBody}`} style={{ padding: '1rem' }}>
                        <div>
                            <span className="block font-bold pb-2">Mode of infant feeding:</span>
                            <form.Field
                                name="isBreastfed"
                                children={(field) => {
                                    return (
                                        <>
                                            <input
                                                type="checkbox"
                                                style={{ display: 'none' }}
                                                id={field.name}
                                                name={field.name}
                                                disabled
                                                defaultChecked={field.state.value}
                                            />
                                            <button
                                                type="button"
                                                className={`mb-2 ${!field.state.value ? levelStyle.noActive : ''}`}
                                                onBlur={field.handleBlur}
                                                onClick={() => field.handleChange(!field.state.value)}
                                            >
                                                Breastfed
                                            </button>
                                            <FieldInfo field={field} />
                                        </>
                                    )
                                }}
                            />
                            <form.Field
                                name="isMixedFed"
                                children={(field) => {
                                    return (
                                        <>
                                            <input
                                                type="checkbox"
                                                style={{ display: 'none' }}
                                                id={field.name}
                                                name={field.name}
                                                disabled
                                                defaultChecked={field.state.value}
                                            />
                                            <button
                                                type="button"
                                                className={`mb-2 ${!field.state.value ? levelStyle.noActive : ''}`}
                                                onBlur={field.handleBlur}
                                                onClick={() => field.handleChange(!field.state.value)}
                                            >
                                                Mixed-fed
                                            </button>
                                            <FieldInfo field={field} />
                                        </>
                                    )
                                }}
                            />
                            <form.Field
                                name="isFormulaFed"
                                children={(field) => {
                                    return (
                                        <>
                                            <input
                                                type="checkbox"
                                                style={{ display: 'none' }}
                                                id={field.name}
                                                name={field.name}
                                                disabled
                                                defaultChecked={field.state.value}
                                            />
                                            <button
                                                type="button"
                                                className={`mb-2 ${!field.state.value ? levelStyle.noActive : ''}`}
                                                onBlur={field.handleBlur}
                                                onClick={() => field.handleChange(!field.state.value)}
                                            >
                                                Formula-fed
                                            </button>
                                            <FieldInfo field={field} />
                                        </>
                                    )
                                }}
                            />
                        </div>
                        <div>
                            <form.Field
                                name="durationOfBreastfeeding"
                                children={(field) => {
                                    return (
                                        <>
                                            <label htmlFor={field.name}>Duration of breastfeeding:</label>
                                            <input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                            />
                                            <FieldInfo field={field} />
                                        </>
                                    )
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting, state.isDirty]}
                children={([canSubmit, isSubmitting, isDirty]) => (
                    <div className="flex gap-2 mt-4">
                        <button type="submit" disabled={!canSubmit} className="w-2/3">
                            {isSubmitting ? 'Submitting...' : (isAdd ? 'Add Offspring' : 'Update Offspring')}
                        </button>
                        <button type="reset" onClick={() => isDirty ? form.reset() : push(`/subStudyPreg/${patientNumber}${pregnancyId ? `/${pregnancyId}` : ''}`)}>
                            {isDirty ? 'Cancel' : 'Close'}
                        </button>
                    </div>
                )}
            />
        </form>
    </>)
}
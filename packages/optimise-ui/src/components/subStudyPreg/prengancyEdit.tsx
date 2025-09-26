import { FC, ReactNode, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { useMutation, useQuery } from '@tanstack/react-query'
import { BackButton } from '../medicalData/utils';
import { apiHelper } from "../../redux/fetchHelper";
import { useForm } from "@tanstack/react-form";
import DatePicker from "react-datepicker";
import { usePatientInStore } from "./usePatientInStore";
import { usePregnancyFields } from "./usePregnancyFields";
import { FieldInfo, formFieldsTypeMapper, PregnancyFieldShape } from "./formFieldsTypeMapper";
import style from '../editMedicalElements/editMedicalElements.module.css';
import levelStyle from '../medicalData/dataPage.module.css';

export const PregnancyDataEdit: FC<RouteComponentProps<{
    patientNumber: string;
    pregnancyId?: string;
}>> = ({ match }) => {
    const isAdd = match.path.endsWith('/add');
    const { patientNumber, pregnancyId } = match.params;
    const { push } = useHistory();
    const [fields, setFields] = useState<Array<PregnancyFieldShape>>();
    usePregnancyFields(patientNumber, ([fields]) => setFields(fields));
    const [patientId, setPatientId] = useState<number | null>(null);
    usePatientInStore(patientNumber, setPatientId)

    const { data: pregnancy, isLoading, refetch } = useQuery({
        queryKey: ['data'],
        queryFn: async () => {
            if (!pregnancyId) return null;
            const result = await apiHelper(`/subStudyPreg/pregnancy/${encodeURIComponent(pregnancyId)}`);
            return result;
        },
        enabled: !isAdd && typeof pregnancyId === 'string',
        refetchOnWindowFocus: false,
    })

    const createPregnancy = useMutation({
        mutationFn: async (value: any) => {
            return await apiHelper('/subStudyPreg/pregnancies', {
                method: 'POST',
                body: JSON.stringify(value)
            });
        },
        onSuccess: (...args) => {
            const newpregnancyId = args[0]?.state;
            if (typeof newpregnancyId === 'number')
                push(`/subStudyPreg/${patientNumber}/${newpregnancyId}/edit`);
            args[3].client.invalidateQueries({ queryKey: ["pregnancies", patientId] });
        }
    })

    const updatePregnancy = useMutation({
        mutationFn: async (value: any) => {
            if (!pregnancyId) return;
            // const body = {
            //     ...(pregnancy ?? {}),
            //     data: JSON.stringify(value)
            // }
            await apiHelper(`/subStudyPreg/pregnancy/${encodeURIComponent(pregnancyId)}`, {
                method: 'PUT',
                body: JSON.stringify(value)
            });
        },
        onSuccess: (...args) => {
            args[3].client.invalidateQueries({ queryKey: ["pregnancies", patientId] });
        }
    })

    const pregnancyData = pregnancy?.data ? JSON.parse(pregnancy.data) : null;

    const form = useForm({
        defaultValues: {
            startDate: pregnancyData ? pregnancyData.startDate ?? undefined : undefined,
            ...(fields?.reduce((acc: Record<string, unknown>, curr: PregnancyFieldShape) => {
                if (curr.referenceType === 1)
                    acc[`baseline___${curr.idname}`] = pregnancyData ? pregnancyData[`baseline___${curr.idname}`] ?? undefined : undefined;
                if (curr.referenceType === 2)
                    acc[`followup___${curr.idname}`] = pregnancyData ? pregnancyData[`followup___${curr.idname}`] ?? undefined : undefined;
                if (curr.referenceType === 3)
                    acc[`term___${curr.idname}`] = pregnancyData ? pregnancyData[`term___${curr.idname}`] ?? undefined : undefined;
                return acc
            }, {} as Record<string, unknown>) as any),
        },
        onSubmit: async ({ formApi, value }) => {
            // Do something with form data
            const body = {
                patientId,
                data: JSON.stringify(value)
            }
            if (isAdd)
                await createPregnancy.mutateAsync(body)
            else
                await updatePregnancy.mutateAsync(body)
            await refetch()
            formApi.reset()
        }
    })

    const wrapHeader = (child: ReactNode) => <>
        <div className={style.ariane}>
            <h2>{isAdd ? 'Add Pregnancy' : 'Edit Pregnancy'}</h2>
            <BackButton to={`/subStudyPreg/${patientNumber}${pregnancyId ? `/${pregnancyId}` : ''}`} />
        </div>
        <div className={style.panel}>
            {child}
        </div>
    </>

    if (isLoading) return wrapHeader(<div>Loading...</div>);

    return wrapHeader(<form
        onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
        }}
        onChange={() => console.log('form change', form.state.values)}
        className="flex flex-col gap-4"
    >
        <div>
            <form.Field
                name="startDate"
                validators={{
                    onChange: ({ value }) => !value ? 'Please select a start date' : undefined
                }}
                children={(field) => <>
                    <label htmlFor={field.name}>Start Date:</label>
                    <DatePicker
                        id={field.name}
                        name={field.name}
                        selected={field.state.value}
                        dateFormat="dd/MM/yyyy"
                        autoComplete="off"
                        onBlur={field.handleBlur}
                        onChange={(date) => field.handleChange(date?.toISOString())}
                    />
                    <FieldInfo field={field} />
                </>}
            />
        </div>
        {isAdd
            ? null
            : <div className={levelStyle.levelBody} style={{ padding: 0 }}>
                <div>
                    <div>
                        <div className={`mt-4 ${levelStyle.levelHeader}`}>Baseline Information:</div>
                        <div className={`flex flex-col gap-2 ${levelStyle.levelBody}`} style={{ padding: '1rem' }}>
                            {fields?.filter((field) => field.referenceType === 1).map((pregnancyFieldRaw: any) => {
                                const pregnancyField = {
                                    ...pregnancyFieldRaw,
                                    idname_orig: pregnancyFieldRaw.idname,
                                    idname: `baseline___${pregnancyFieldRaw.idname}`
                                };
                                return <form.Field key={pregnancyField.idname} name={pregnancyField.idname} children={(formField) => <>{formFieldsTypeMapper(pregnancyField, formField)}</>} />
                            })}
                        </div>
                    </div>
                    <div>
                        <div className={`mt-4 ${levelStyle.levelHeader}`}>Follow-up Visit Information:</div>
                        <div className={`flex flex-col gap-2 ${levelStyle.levelBody}`} style={{ padding: '1rem' }}>
                            {fields?.filter((field) => field.referenceType === 2).map((pregnancyFieldRaw: any) => {
                                const pregnancyField = {
                                    ...pregnancyFieldRaw,
                                    idname_orig: pregnancyFieldRaw.idname,
                                    idname: `followup___${pregnancyFieldRaw.idname}`
                                };
                                return <form.Field key={pregnancyField.idname} name={pregnancyField.idname} children={(formField) => <>{formFieldsTypeMapper(pregnancyField, formField)}</>} />
                            })}
                        </div>
                    </div>
                    <div>
                        <div className={`mt-4 ${levelStyle.levelHeader}`}>Term Visit Information:</div>
                        <div className={`flex flex-col gap-2 ${levelStyle.levelBody}`} style={{ padding: '1rem' }}>
                            <form.Field
                                name="endDate"
                                children={(field) => <>
                                    <label htmlFor={field.name}>Delivery Date:</label>
                                    <DatePicker
                                        id={field.name}
                                        name={field.name}
                                        selected={field.state.value}
                                        dateFormat="dd/MM/yyyy"
                                        autoComplete="off"
                                        onBlur={field.handleBlur}
                                        onChange={(date) => field.handleChange(date?.toISOString())}
                                    />
                                    <FieldInfo field={field} />
                                </>}
                            />
                            {fields?.filter((field) => field.referenceType === 3).map((pregnancyFieldRaw: any) => {
                                const pregnancyField = {
                                    ...pregnancyFieldRaw,
                                    idname_orig: pregnancyFieldRaw.idname,
                                    idname: `term___${pregnancyFieldRaw.idname}`
                                };
                                return <form.Field key={pregnancyField.idname} name={pregnancyField.idname} children={(formField) => <>{formFieldsTypeMapper(pregnancyField, formField)}</>} />
                            })}
                        </div>
                    </div>
                </div>
            </div >}
        <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting, state.isDirty]}
            children={([canSubmit, isSubmitting, isDirty]) => (
                <div className="flex gap-2 mt-4">
                    <button type="submit" disabled={!canSubmit} className="w-2/3">
                        {isSubmitting ? 'Submitting...' : (isAdd ? 'Add Pregnancy' : 'Update Pregnancy')}
                    </button>
                    <button type="reset" onClick={() => isDirty ? form.reset() : push(`/subStudyPreg/${patientNumber}${pregnancyId ? `/${pregnancyId}` : ''}`)}>
                        {isDirty ? 'Cancel' : 'Close'}
                    </button>
                </div>
            )}
        />
    </form >)
}
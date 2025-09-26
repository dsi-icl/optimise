import { FC, ReactNode, useCallback, useEffect, useState } from "react";
import { Link, RouteComponentProps, useHistory } from "react-router-dom";
import { Tabs } from "radix-ui";
import { useQuery, useMutation } from "@tanstack/react-query";
import { BackButton } from '../medicalData/utils';
import style from '../editMedicalElements/editMedicalElements.module.css';
import { apiHelper } from "../../redux/fetchHelper";
import store from "../../redux/store";
import moment from "moment";
import { DeleteButton } from "../patientProfile/sharedComponents";
import { addAlert } from "../../redux/actions/alert";
import { Icon } from "../icon";
import OffspringList from "./OffspringList";
import { usePatientInStore } from "./usePatientInStore";
import { renderPregnancyDataTable } from "./renderPregnancyDataTable";

async function fetchPregnancies(patientId: number) {
    return await apiHelper(`/subStudyPreg/pregnancies?patientId=${encodeURIComponent(patientId)}`);
}

function usePregnancies(patientId: number | null) {
    return useQuery<Array<unknown>>({
        queryKey: ["pregnancies", patientId],
        queryFn: () => typeof patientId === 'number' ? fetchPregnancies(patientId) : Promise.resolve([]),
        enabled: typeof patientId === 'number',
        refetchOnWindowFocus: false,
    });
}

export const PregnancySubStudyIndex: FC<RouteComponentProps<{
    patientNumber: string;
    pregnancyId?: string;
}>> = ({ match }) => {
    const { patientNumber, pregnancyId } = match.params;
    const { push } = useHistory();
    const [patientId, setPatientId] = useState<number | null>(null);
    const [selectedPregnancyTab, setSelectedPregnancyTab] = useState<string | undefined>(pregnancyId ? `pregnancy-${pregnancyId}` : 'fallback');
    usePatientInStore(patientNumber, setPatientId)
    const { data: pregnanciesRaw, isLoading, isEnabled, isError, error } = usePregnancies(patientId);

    useEffect(() => {
        if (pregnancyId)
            setSelectedPregnancyTab(`pregnancy-${pregnancyId}`);
        else
            setSelectedPregnancyTab('fallback');
    }, [pregnancyId])

    const deletePregnancy = useMutation({
        mutationFn: async (targetPregnancyId: number) => {
            await apiHelper(`/subStudyPreg/pregnancy/${encodeURIComponent(targetPregnancyId)}`, {
                method: 'DELETE'
            });
        },
        onSuccess: (...args) => {
            args[3].client.invalidateQueries({ queryKey: ["pregnancies", patientId] });
        }
    })

    const triggerDelete = useCallback((pregnancyId: number) => {
        store.dispatch(addAlert({
            alert: 'Do you want to delete this pregnancy?', handler: () => {
                deletePregnancy.mutate(pregnancyId)
            }
        }));
    }, []);

    const wrapHeader = (child: ReactNode) => <>
        <div className={style.ariane}>
            <h2>Pregnancy Sub-Study (Patient {patientNumber})</h2>
            <BackButton to={`/patientProfile/${patientNumber}`} />
        </div>
        <div className={style.panel}>
            {child}
        </div>
    </>

    if (!patientNumber)
        return wrapHeader(<div className="text-red-600">No patient ID provided in URL.</div>);

    if (!patientId)
        return wrapHeader(<div className="text-red-600">Loading patient...</div>);

    if (isError)
        return wrapHeader(<div className="text-red-600">Error: {String(error)}</div>);

    if ((isLoading || !isEnabled) && pregnanciesRaw !== undefined)
        return wrapHeader(<div>Loading pregnancies...</div>)

    const pregnancies = pregnanciesRaw?.map((pregnancy: any) => {
        try {
            const data = pregnancy.data ? JSON.parse(pregnancy.data) : {};
            return {
                ...data,
                id: pregnancy.id
            }
        }
        catch (e) {
            return undefined;
        }
    })
        .filter(p => p !== undefined)
        .sort((a, b) => (Date.parse(a.startDate) < Date.parse(b.startDate) ? -1 : 1)) ?? [];

    return wrapHeader(<Tabs.Root defaultValue="fallback" orientation="vertical" value={selectedPregnancyTab} onValueChange={(tab) => {
        push(`/subStudyPreg/${patientNumber}/${tab.replace('pregnancy-', '')}`)
    }}>
        <Tabs.List aria-label="Pregnancies" className="flex flex-row gap-2 pb-1 mb-4 overflow-auto">
            {pregnancies.map((pregnancy, index) => <Tabs.Trigger title={`Pregnancy ${index + 1} (ID:${pregnancy.id})`} key={pregnancy.id} value={`pregnancy-${pregnancy.id}`} className={`flex-none text-start`} data-active={selectedPregnancyTab === pregnancy.id} style={{ width: 'auto', height: '3.3rem', padding: '0 1rem' }}>
                <div>
                    <span>Pregnancy {index + 1} (ID:{pregnancy.id})</span><br />
                    <span className="text-xs">{moment(pregnancy.startDate).format('MMMM YYYY')}</span>
                </div>
            </Tabs.Trigger>)}
            <Tabs.Trigger title="Add Pregnancy" key="new" value={`pregnancy-add`} className="flex-none" style={{ width: 'auto', height: 'auto' }}>{pregnancies.length === 0 ? 'Add Pregnancy' : '+'}</Tabs.Trigger>
        </Tabs.List>
        {pregnancies.map((pregnancy: any) => {
            return <Tabs.Content key={pregnancy.id} value={`pregnancy-${pregnancy.id}`}>
                <div className="flex flex-col gap-6">
                    <div className="flex gap-4 items-center">
                        <i>Pregnancy started on the {moment(pregnancy.startDate).format('MMMM Do YYYY')}</i>
                        <DeleteButton clickhandler={() => triggerDelete(pregnancy.id)} className="inline-block w-4 h-4" style={{ height: 'auto' }} />
                        <Link title="Edit Pregnancy" to={`/subStudyPreg/${patientNumber}/${pregnancy.id}/edit`} className="inline-block w-4 h-5 opacity-30 hover:opacity-100"><Icon symbol="edit" /></Link>
                    </div>
                    <div>
                        <h4 className="mb-2">
                            {/* <Icon symbol="communication" className="w-4 h-4" /> */}
                            &nbsp;PREGNANCY DATA
                        </h4>
                        {renderPregnancyDataTable(pregnancy)}
                        <Link to={`/subStudyPreg/${patientNumber}/${pregnancy.id}/edit`} style={{
                            display: 'inline-block',
                            color: 'white',
                        }} className=" bg-slate-400 hover:bg-slate-300 mt-4 px-4 py-1">Edit Pregnancy Data</Link>
                    </div>
                    <div>
                        <h4 className="mb-2">
                            {/* <Icon symbol="communication" className="w-4 h-4" /> */}
                            &nbsp;OFFSPRINGS
                        </h4>
                        <OffspringList key={pregnancy.id} />
                    </div>
                </div>
            </Tabs.Content>
        })}
        <Tabs.Content key="fallback" value="fallback">
            <div className="flex flex-col gap-6 w-2/3">
                <div className="flex gap-4 items-center">
                    <i>Select a pregnancy in the list above to view details.</i>
                </div>
            </div>
        </Tabs.Content>
        <Tabs.Content key="new" value="pregnancy-add">
            <div className="flex flex-col gap-6 w-2/3">
                <div className="flex gap-4 items-center">
                    <i>Fill out the start date in the panel on the right to start entering information about a new pregnancy.</i>
                </div>
            </div>
        </Tabs.Content>
    </Tabs.Root >)

}
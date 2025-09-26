import { FC, ReactNode, useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiHelper } from "../../redux/fetchHelper";
import { Link, useParams } from "react-router-dom";
import { DeleteButton } from "../patientProfile/sharedComponents";
import { addAlert } from "../../redux/actions/alert";
import store from "../../redux/store";
import { Icon } from "../icon";

async function fetchOffsprings(pregnancyId: string) {
    return await apiHelper(`/subStudyPreg/offsprings?pregnancyId=${encodeURIComponent(pregnancyId)}`);
}

function useOffsprings(pregnancyId?: string) {
    return useQuery<Array<unknown>>({
        queryKey: ["offsprings", pregnancyId],
        queryFn: () => typeof pregnancyId === 'string' ? fetchOffsprings(pregnancyId) : Promise.resolve([]),
        enabled: typeof pregnancyId === 'string',
        refetchOnWindowFocus: false,
    });
}


export const OffspringList: FC = () => {
    const { patientNumber, pregnancyId, offspringId } = useParams<{ patientNumber?: string; pregnancyId?: string; offspringId?: string; }>();
    const { data: offspringsRaw, isLoading, isError, error } = useOffsprings(pregnancyId);

    const deleteOffspring = useMutation({
        mutationFn: async (targetOffspringId: number) => {
            await apiHelper(`/subStudyPreg/offspring/${encodeURIComponent(targetOffspringId)}`, {
                method: 'DELETE'
            });
        },
        onSuccess: (...args) => {
            args[3].client.invalidateQueries({ queryKey: ["offsprings", pregnancyId] });
        }
    })

    const triggerDelete = useCallback((offspringId: number) => {
        store.dispatch(addAlert({
            alert: 'Do you want to delete this offspring?', handler: () => {
                deleteOffspring.mutate(offspringId)
            }
        }));
    }, []);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {String(error)}</div>;

    const offsprings = offspringsRaw?.map((offspring: any) => {
        try {
            const data = offspring.data ? JSON.parse(offspring.data) : {};
            return {
                id: offspring.id,
                ...data
            }
        }
        catch (e) {
            return undefined;
        }
    }).filter(o => o !== undefined) ?? [];

    const wrapLayout = (child: ReactNode) => <div>
        <div>
            {child}
        </div>
        <Link to={`/subStudyPreg/${patientNumber}/${pregnancyId}/add`} style={{
            display: 'inline-block',
            color: 'white',
        }} className=" bg-slate-400 hover:bg-slate-300  mt-4 px-4 py-1">Add Offspring</Link>
    </div>

    if (offsprings.length === 0)
        return wrapLayout(<i>No offsprings data for this pregnancy.</i>);

    return wrapLayout(
        <ul className="flex flex-col gap-2">
            {offsprings?.map(offspring => (
                <li key={offspring.id} className={`flex gap-4 bg-slate-100 hover:bg-slate-200 p-2 border-2 ${offspringId === String(offspring.id) ? 'border-pink-600' : 'border-transparent'}`}>
                    <div className="grow">
                        <b>Hospital ID:</b> <i className="opacity-40">{patientNumber}</i> -{offspring.hospitalID ?? offspring.id}<br />
                        <b>Sex:</b> {offspring.sex}<br />
                    </div>
                    <div className="flex gap-4 items-center hover:cursor-pointer">
                        <DeleteButton clickhandler={() => triggerDelete(offspring.id)} className="inline-block w-4 h-4" style={{ height: 'auto' }} />
                        <Link title="Edit" to={`/subStudyPreg/${patientNumber}/${pregnancyId}/${offspring.id}/edit`} className="inline-block w-4 h-5 opacity-30 hover:opacity-100"><Icon symbol="edit" /></Link>
                    </div>
                </li>
            ))}
        </ul>
    );
}

export default OffspringList;
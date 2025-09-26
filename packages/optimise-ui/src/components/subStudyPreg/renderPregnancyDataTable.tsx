import moment from "moment";
import store from "../../redux/store";

const buildTable = (entries: Array<[string, any]>) => {
    const externalState = store.getState();
    const { pregnancyEntryFields_Hash, inputTypes_Hash } = externalState?.availableFields ?? {};
    return <table className="table-auto border-collapse border border-slate-300">
        <thead className="bg-slate-200">
            <tr className="text-left">
                <th className="px-1">Field</th>
                <th className="px-1">Value</th>
            </tr>
        </thead>
        <tbody className="">
            {entries.map(([key, value]) => {
                let { type, definition } = (pregnancyEntryFields_Hash[0][key] as any) ?? {};
                // Special case for startDate which is not in the fields list
                if (key === 'startDate') {
                    type = 6; // Date
                    definition = 'Start Date';
                }
                let formattedValue = value;
                switch (inputTypes_Hash[0][type]) {
                    case 'B': // Boolean
                        formattedValue = value ? 'Yes' : 'No';
                        break;
                    case 'D': // Date
                        try {
                            formattedValue = moment(value).format('DD/MM/YYYY');
                        } catch (e) {
                            formattedValue = value;
                        }
                }

                return <tr key={key} className="hover:bg-slate-100 border-b-slate-300">
                    <td className="px-1"><b>{definition ?? key}</b></td>
                    <td className="px-1 w-2/5">{String(formattedValue)}</td>
                </tr>
            })}
        </tbody>
    </table>;
}

export const renderPregnancyDataTable = (pregnancy: any) => {
    const { id, ...rest } = pregnancy ?? {};
    const dataEntries = Object.entries(rest);
    const mainEntries: Array<[string, any]> = []
    const baselineEntries: Array<[string, any]> = []
    const followupEntries: Array<[string, any]> = []
    const termEntries: Array<[string, any]> = []
    for (const [key, value] of dataEntries) {
        const [prefix, realKey] = key.split('___');
        if (!realKey)
            mainEntries.push([key, value]);
        else
            switch (prefix) {
                case 'baseline':
                    baselineEntries.push([realKey, value]);
                    break;
                case 'followup':
                    followupEntries.push([realKey, value]);
                    break;
                case 'term':
                    termEntries.push([realKey, value]);
                    break;
                default:
                    mainEntries.push([key, value]);
            }
    }
    return <div className="flex flex-col gap-4">
        {buildTable(mainEntries)}
        {baselineEntries.length
            ? <>
                <i>Baseline Information</i>
                {buildTable(baselineEntries)}
            </>
            : null}
        {followupEntries.length
            ? <>
                <i>Follow-up Information</i>
                {buildTable(followupEntries)}
            </>
            : null}
        {termEntries.length
            ? <>
                <i>Term Information</i>
                {buildTable(termEntries)}
            </>
            : null}
    </div>
};
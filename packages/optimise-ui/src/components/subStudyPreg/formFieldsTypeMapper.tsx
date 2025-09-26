import { AnyFieldApi } from "@tanstack/react-form";
import store from "../../redux/store";
import DatePicker from "react-datepicker";
import { createRef, ReactNode } from "react";

export type PregnancyFieldShape = {
    id: number;
    definition: string;
    idname: string;
    section: string | null;
    subsection: string | null;
    type: number | null;
    unit: string | null;
    module: string | null;
    permittedValues: string | null;
    labels: string | null;
    referenceType: number | null;
    laterality: string | null;
    cdiscName: string | null;
}

export function FieldInfo({ field }: { field: AnyFieldApi }) {
    return (
        <>
            {field.state.meta.isTouched && !field.state.meta.isValid ? (
                <em>{field.state.meta.errors.join(',')}</em>
            ) : null}
            {field.state.meta.isValidating ? 'Validating...' : null}
        </>
    )
}

// See `mappingFields` in packages\optimise-ui\src\components\medicalData\utils.jsx
// FAB types and field type overrides are not implemented
export const formFieldsTypeMapper = (pregnancyField: PregnancyFieldShape, formField: AnyFieldApi) => {
    const fieldElementRef = createRef<HTMLInputElement>()
    const state = store.getState();
    const { inputTypes_Hash } = state?.availableFields ?? {};

    if (!pregnancyField?.type) return null;

    const wrapLabel = (child: ReactNode) => <div>
        <label htmlFor={formField.name}>{pregnancyField.definition}</label>
        {child}
        <FieldInfo field={formField} />
    </div>

    const inputField = () => {
        return <input
            id={formField.name}
            name={formField.name}
            // type="number"
            // min="0"
            // step="1"
            value={formField.state.value}
            onBlur={formField.handleBlur}
            onChange={(e) => {
                // For text and number only we consider that empty is undefined
                const finalValue = e.target.value === '' ? undefined : e.target.value;
                formField.handleChange(finalValue)
            }}
        />
    }

    const commutator = (inputTypes_Hash as Record<number, string>)[0][pregnancyField.type];
    switch (commutator) {
        case 'B': // 5
            return wrapLabel(<>
                <input ref={fieldElementRef} id={formField.name} type="checkbox" style={{ display: 'none' }} checked={formField.state.value} onChange={() => null} />
                <button
                    className={formField.state.value ? "bg-amber-700" : "bg-amber-300"}
                    onBlur={formField.handleBlur}
                    onClick={() => formField.handleChange(!fieldElementRef.current?.checked)}
                >
                    {formField.name}
                </button>
            </>);
        case 'C': { // 3
            if (pregnancyField.permittedValues) {
                const options = pregnancyField.permittedValues.split(',')
                return wrapLabel(<select
                    id={formField.name}
                    name={formField.name}
                    value={formField.state.value}
                    onBlur={formField.handleBlur}
                    onChange={(e) => formField.handleChange(e.target.value)}
                >
                    <option key="unset" value=""></option>
                    {options.map((option, index) => <option key={index} value={option}>{option}</option>)}
                </select>)
            } else
                return wrapLabel(inputField())
        }
        case 'D': // 6
            return wrapLabel(<DatePicker
                id={formField.name}
                name={formField.name}
                selected={formField.state.value}
                dateFormat="dd/MM/yyyy"
                onBlur={formField.handleBlur}
                onChange={(date) => formField.handleChange(date?.toISOString())}
            />)
        default: // 3
            return wrapLabel(inputField())
    }
}
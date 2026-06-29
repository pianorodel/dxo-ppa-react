import { Controller } from 'react-hook-form';
import { Input, Label } from 'reactstrap';


// sample usage: 
// <SwitchController
//   name="isActive"
//   control={control}
//   label="Active"
// />


const SwitchButton = ({
    name,
    control,
    label,
    defaultValue = false,
    ...props
}) => (
    <div className="form-check form-switch form-switch-lg form-switch-success mb-3">
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({ field }) => (
                <Input
                    {...field}
                    {...props}
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={field.value}
                />
            )}
        />
        {name &&
            <Label className="form-check-label" for={name}>
                {label}
            </Label>}
    </div>
);

export default SwitchButton;

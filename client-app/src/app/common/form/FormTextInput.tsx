import { useField } from 'formik';
import React from 'react';
import { Form, Label } from 'semantic-ui-react';

interface Props {
    placeholder: string;
    name: string;
    label?: string;
    type?: string;
}

export default function FormTextInput(props: Props) {
    const [field, meta] = useField(props.name);
    return (
        <Form.Field error={meta.touched && !!meta.error}>
            {props.label && (
                <Label>{props.label}</Label>
            )}
            <input {...field} {...props} />
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
        </Form.Field>
    )
}
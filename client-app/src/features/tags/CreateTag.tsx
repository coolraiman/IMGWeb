import { ErrorMessage, Formik } from "formik";
import { Button, Form, Label, Table, TableCell } from "semantic-ui-react";
import FormTextInput from "../../app/common/form/FormTextInput";
import { useStore } from "../../app/stores/store";


export default function CreateTag()
{
    const {tagStore} = useStore();
    return(
        <Formik initialValues={{id: 0,name: '', description: '', references: 0, error: null}}
                onSubmit={(values, {setErrors}) => tagStore.createTag(values).catch(error =>
                    setErrors({error: 'Invalid or Duplicate name'}))}>
            {({handleSubmit, isSubmitting, errors}) => (
            <Form className="ui form" onSubmit={handleSubmit} autoComplete='off'>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell colSpan="3">
                            <ErrorMessage name='error'
                                render={() =>
                                    <Label style={{marginBottom: 10}} basic color='red' content={errors.error}/>
                                }
                            />
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell><FormTextInput placeholder="Name" name="name"/></Table.Cell>
                            <Table.Cell><FormTextInput placeholder="Description" name="description"/></Table.Cell>
                            <TableCell><Button loading={isSubmitting} positive content="Create" type="submit"/></TableCell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </Form>
            )}
         </Formik>
    )
}
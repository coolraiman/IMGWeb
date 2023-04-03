import { ErrorMessage, Formik } from "formik";
import { values } from "mobx";
import { observer } from "mobx-react-lite";
import { Button, Form, Icon, Label, Table } from "semantic-ui-react";
import FormTextInput from "../../app/common/form/FormTextInput";
import { Tag } from "../../app/models/tag";
import { useStore } from "../../app/stores/store";

export default observer(function CreateTag()
{
    const {tagStore} = useStore();
    const {selectedTag, setSelectedTag} = tagStore;

    return(
        <Formik initialValues={{id: selectedTag!.id,name: selectedTag!.name, description: selectedTag!.description, references: selectedTag!.references, error: null}}
                onSubmit={(values, {setErrors}) => tagStore.editTag(values).catch(error =>
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
                            <Table.Cell>
                                <Button loading={isSubmitting} positive content="Update" type="submit"/>
                                <Button loading={isSubmitting} onClick={() => (setSelectedTag(null))} positive content="Cancel"/>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </Form>
            )}
         </Formik>
    )
})
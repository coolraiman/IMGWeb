import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button, Header } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import * as Yup from 'yup';
import ValidationError from "../errors/ValidationError";
import FormTextInput from "../../app/common/form/FormTextInput";

export default observer(function RegisterForm(){
    const {userStore} = useStore();
    return (
        <Formik
            initialValues={{displayName: '',username: '', email: '', password: '', confirmPassword: '' , error: null}}
            onSubmit={(values, {setErrors}) =>
                userStore.register(values).catch(error =>
                    setErrors({error}))}
                    validationSchema={Yup.object({
                        displayName: Yup.string().required(),
                        username: Yup.string().required(),
                        email: Yup.string().required(),
                        password: Yup.string().required(),
                        confirmPassword: Yup.string().required(),
                    })}
            >
            {({handleSubmit, isSubmitting, errors, isValid, dirty}) => (
                <Form className="ui form error" onSubmit={handleSubmit} autoComplete='off'>
                    <Header as='h2' content='Sign up to Reactivities' color='teal' textAlign="center"/>
                    <FormTextInput placeholder="Display Name" name="displayName"/>
                    <FormTextInput placeholder="Username" name="username"/>
                    <FormTextInput placeholder="Email" name="email"/>
                    <FormTextInput placeholder="Password" name='password' type='password'/>
                    <FormTextInput placeholder="Confirm Password" name='confirmPassword' type='password'/>
                    <ErrorMessage name='error' render={() =>
                            <ValidationError errors={errors.error} />
                        }
                    />
                    <Button
                    disabled={!isValid || !dirty || isSubmitting}
                        loading={isSubmitting}
                        positive content="Register"
                        type="submit" fluid/>
                </Form>
            )}
        </Formik>
    )
})
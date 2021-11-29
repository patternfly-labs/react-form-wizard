import { ActionGroup, ActionList, ActionListGroup, ActionListItem, Button, Form, Stack } from '@patternfly/react-core'
import { ReactNode } from 'react'

export function FormWizard(props: { children: ReactNode }) {
    return (
        <Form>
            {props.children}
            <ActionGroup>
                <Stack hasGutter style={{ width: '100%' }}>
                    {/* <Alert isInline variant="danger" title="Error">
                                                    Details
                                                </Alert> */}
                    <ActionList>
                        <ActionListGroup>
                            <ActionListItem>
                                <Button
                                    id="next"
                                    // onClick={() => {
                                    //     setShowFormErrors(true)
                                    //     if (!formHasErrors(formData)) {
                                    //         try {
                                    //             const result = formData.submit()
                                    //             if ((result as unknown) instanceof Promise) {
                                    //                 setSubmitText(formData.submittingText)
                                    //                 ;(result as unknown as Promise<void>).catch(
                                    //                     (err) => {
                                    //                         setSubmitError(err.message)
                                    //                         setSubmitText(formData.submitText)
                                    //                     }
                                    //                 )
                                    //             }
                                    //         } catch (err) {
                                    //             setSubmitError(err.message)
                                    //         }
                                    //     }
                                    // }}
                                    variant="primary"
                                    // isDisabled={
                                    //     (showFormErrors && formHasErrors(formData)) ||
                                    //     isSubmitting
                                    // }
                                    // isLoading={isSubmitting}
                                >
                                    Submit
                                </Button>
                            </ActionListItem>
                            <ActionListItem>
                                <Button
                                    id="cancel"
                                    variant="secondary"
                                    // onClick={formData.cancel}
                                    // isDisabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                            </ActionListItem>
                        </ActionListGroup>
                        {/* <ActionListGroup>
                                                        <ActionListItem>
                                                            <Button variant="primary">Edit YAML before submitting</Button>
                                                        </ActionListItem>
                                                    </ActionListGroup> */}
                    </ActionList>
                </Stack>
            </ActionGroup>
        </Form>
    )
}

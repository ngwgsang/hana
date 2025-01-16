import type { EditMessageById, UpdateMessageInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  CheckboxField,
  Submit,
} from '@redwoodjs/forms'

type FormMessage = NonNullable<EditMessageById['message']>

interface MessageFormProps {
  message?: EditMessageById['message']
  onSave: (data: UpdateMessageInput, id?: FormMessage['id']) => void
  error: RWGqlError
  loading: boolean
}

const MessageForm = (props: MessageFormProps) => {
  const onSubmit = (data: FormMessage) => {
    props.onSave(data, props?.message?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormMessage> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="sender"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Sender
        </Label>

        <TextField
          name="sender"
          defaultValue={props.message?.sender}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="sender" className="rw-field-error" />

        <Label
          name="content"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Content
        </Label>

        <TextField
          name="content"
          defaultValue={props.message?.content}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="content" className="rw-field-error" />

        <Label
          name="isAct"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Is act
        </Label>

        <CheckboxField
          name="isAct"
          defaultChecked={props.message?.isAct}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="isAct" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default MessageForm

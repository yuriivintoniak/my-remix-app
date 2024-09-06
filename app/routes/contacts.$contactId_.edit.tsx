import type { 
  ActionFunctionArgs, 
  LoaderFunctionArgs,
} from "@remix-run/node";

import {
  Form,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";

import {json, redirect} from "@remix-run/node";
import invariant from "tiny-invariant";
import {getContact, updateContact} from "../data";

export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ contact });
};

export const action = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
};

export default function EditContact() {
  const { contact } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Form key={contact.id} id="contact-form" method="post">
      <p>
        <span>Name</span>
        <input
          type="text"
          name="first"
          aria-label="First name"
          placeholder="First"
          defaultValue={contact.first}
        />
        <input
          type="text"
          name="last"
          aria-label="Last name"
          placeholder="Last"
          defaultValue={contact.last}
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          type="text"
          name="twitter"
          placeholder="@jack"
          defaultValue={contact.twitter}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          type="text"
          name="avatar"
          aria-label="Avatar URL"
          placeholder="https://example.com/avatar.jpg"
          defaultValue={contact.avatar}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea
          name="notes"
          rows={6}
          defaultValue={contact.notes}
        />
      </label>
      <p>
        <button type="submit">Save</button>
        <button type="button" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </p>
    </Form>
  );
}

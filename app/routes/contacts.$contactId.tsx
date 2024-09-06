import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import type { FunctionComponent } from "react";
import type { ContactRecord } from "../data";

import type { LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getContact } from "../data";

export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const task = await getContact(params.contactId);
  if (!task) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ task });
};

export default function Contact() {
  const { task } = useLoaderData<typeof loader>();

  return (
    <div id="contact">
      <div>
        <img
          key={task.image} 
          src={task.image} 
          alt={`${task.title} image`} 
        />
      </div>

      <div>
        <h1>
          {task.title ? (
            <>
              {task.title}
            </>
          ) : (
            <i>No Title</i>
          )}{" "}
          <Favorite task={task} />
        </h1>

        <p style={{ marginTop: "10px" }}>
          {task.level}
        </p>

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              const response = confirm(
                "Please confirm you want to delete this record."
              );
              if (!response) {
                event.preventDefault();
              }
            }} 
          >
            <button type="submit">Delete</button>
          </Form>
        </div>

      </div>
    </div>
  );
}

const Favorite: FunctionComponent<{
  task: Pick<ContactRecord, "favorite">;
}> = ({ task }) => {
  const favorite = task.favorite;

  return (
    <Form method="post">
      <button
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </Form>
  );
}

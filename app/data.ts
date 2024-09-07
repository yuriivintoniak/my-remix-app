import { matchSorter } from "match-sorter";
// @ts-expect-error - no types, but it's a tiny function
import sortBy from "sort-by";
import invariant from "tiny-invariant";

type ContactMutation = {
  id?: string;
  title?: string;
  level?: string;
  image?: string;
  favorite?: boolean;
};

export type ContactRecord = ContactMutation & {
  id: string;
  createdAt: string;
};

const fakeContacts = {
  records: {} as Record<string, ContactRecord>,

  // async getAll(): Promise<ContactRecord[]> {
  //   return Object.keys(fakeContacts.records)
  //     .map((key) => fakeContacts.records[key])
  //     .sort(sortBy("-createdAt", "last"));
  // },

  async getAll(): Promise<ContactRecord[]> {
    return Object.keys(fakeContacts.records)
      .map((key) => fakeContacts.records[key])
      .sort(sortBy("-createdAt", "level"));
  },

  async get(id: string): Promise<ContactRecord | null> {
    return fakeContacts.records[id] || null;
  },

  async create(values: ContactMutation): Promise<ContactRecord> {
    const id = values.id || Math.random().toString(36).substring(2, 9);
    const createdAt = new Date().toISOString();
    const newContact = { id, createdAt, ...values };
    fakeContacts.records[id] = newContact;
    return newContact;
  },

  async set(id: string, values: ContactMutation): Promise<ContactRecord> {
    const contact = await fakeContacts.get(id);
    invariant(contact, `No contact found for ${id}`);
    const updatedContact = { ...contact, ...values };
    fakeContacts.records[id] = updatedContact;
    return updatedContact;
  },

  destroy(id: string): null {
    delete fakeContacts.records[id];
    return null;
  },
};

////////////////////////////////////////////////////////////////////////////////
// Handful of helper functions to be called from route loaders and actions
// export async function getContacts(query?: string | null) {
//   await new Promise((resolve) => setTimeout(resolve, 500));
//   let contacts = await fakeContacts.getAll();
//   if (query) {
//     contacts = matchSorter(contacts, query, {
//       keys: ["first", "last"],
//     });
//   }
//   return contacts.sort(sortBy("last", "createdAt"));
// }

export async function getContacts(query?: string | null) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  let contacts = await fakeContacts.getAll();
  if (query) {
    contacts = matchSorter(contacts, query, {
      keys: ["title", "level"],
    });
  }
  return contacts.sort(sortBy("level", "createdAt"));
}

export async function createEmptyContact() {
  const contact = await fakeContacts.create({});
  return contact;
}

export async function getContact(id: string) {
  return fakeContacts.get(id);
}

export async function updateContact(id: string, updates: ContactMutation) {
  const contact = await fakeContacts.get(id);
  if (!contact) {
    throw new Error(`No contact found for ${id}`);
  }
  await fakeContacts.set(id, { ...contact, ...updates });
  return contact;
}

export async function deleteContact(id: string) {
  fakeContacts.destroy(id);
}

[
  {
    title: "11111",
    level: "High",
    favorite: false,
    image: "https://glstatic.rg.ru/uploads/images/2018/03/30/e57458240ecfff1.jpg"
  },
  {
    title: "22222",
    level: "High",
    favorite: false,
    image: "https://i.pinimg.com/736x/dd/3a/a8/dd3aa8afb163d4039c04c864a7c8642b.jpg"
  },
  {
    title: "33333",
    level: "Lower",
    favorite: true,
    image: "https://dic.academic.ru/pictures/wiki/files/70/Federico_da_Montefeltro.jpg"
  },
  {
    title: "44444",
    level: "Lower",
    favorite: true,
    image: "https://kulturologia.ru/files/u23606/236060323.jpg"
  },
  {
    title: "55555",
    level: "Medium",
    favorite: true,
    image: "https://wl-adme.cf.tsp.li/resize/728x/jpg/b13/851/0c56af5410bd53ec271242070e.jpg"
  }
].forEach((task) => {
  fakeContacts.create({
    ...task,
    id: `${task.title.toLowerCase()}-${task.level.toLocaleLowerCase()}`,
  });
});

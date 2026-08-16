const customMessage = {
  created: (entity) => `${entity} created successfully.`,

  updated: (entity, id) =>
    id
      ? `${entity} with ID ${id} updated successfully.`
      : `${entity} updated successfully.`,

  deleted: (entity, id) =>
    id
      ? `${entity} with ID ${id} deleted successfully.`
      : `${entity} deleted successfully.`,

  found: (entity, id) =>
    id
      ? `${entity} with ID ${id} fetched successfully.`
      : `${entity} fetched successfully.`,

  notFound: (entity, id) =>
    id ? `${entity} with ID ${id} not found.` : `${entity} not found.`,

  invalidId: (entity, id) => `Invalid ${entity} ID ${id}.`,

  alreadyExists: (entity) => `${entity} already exists.`,

  unauthorized: () => `You are not authorized to perform this action.`,

  serverError: () =>
    `Something went wrong. Internal server error. Please try again later.`,
};

export { customMessage };

export const DETAIL_API = {
  get: (teamId: string | number, id: string | number) =>
    `/${teamId}/gatherings/${id}`,
};

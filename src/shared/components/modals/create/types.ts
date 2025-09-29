export type ServiceType = "OFFICE_STRETCHING" | "MINDFULNESS" | "WORKATION";

export type CreateGatheringForm = {
  service: ServiceType | null;
  name: string;
  location: string;
  imageFile: File | null;
  imagePreviewUrl: string | null;
  date: Date | null;
  registrationEnd: Date | null;
  capacity: number | "";
};

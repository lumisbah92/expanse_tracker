export const handleImageUpload = (file: File | null, field: any) => {
  if (file) {
    field.onChange(file);
  } else {
    field.onChange(null);
  }
};

export const convertToBase64 = async (file: File[]) => {
  
  const base64 = await Promise.all(
    file.map(async (file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
      });
    })
  );

  return base64;

}